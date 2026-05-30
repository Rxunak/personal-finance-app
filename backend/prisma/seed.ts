import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { DEMO_USER } from "../src/constants/demo-user.js";

type SampleFinanceData = {
  transactions: Array<{
    avatar: string;
    name: string;
    category: string;
    date: string;
    amount: number;
    recurring: boolean;
    dueDate?: string | null;
    status?: "paid" | "unpaid" | "overdue" | null;
    paidDate?: string | null;
  }>;
  budgets: Array<{
    category: string;
    maximum: number;
    theme: string;
  }>;
  pots: Array<{
    name: string;
    target: number;
    total: number;
    theme: string;
  }>;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
});
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
const sampleDataPath = path.resolve(
  currentDirectoryPath,
  "../../frontend/public/data.json",
);

const loadSampleFinanceData = async (): Promise<SampleFinanceData> => {
  const fileContents = await readFile(sampleDataPath, "utf8");
  return JSON.parse(fileContents) as SampleFinanceData;
};

const seed = async () => {
  const sampleData = await loadSampleFinanceData();

  const demoUser = await prisma.user.upsert({
    where: {
      email: DEMO_USER.email,
    },
    update: {
      name: DEMO_USER.name,
      password: DEMO_USER.password,
    },
    create: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      password: DEMO_USER.password,
    },
  });

  await prisma.$transaction([
    prisma.transaction.deleteMany({
      where: {
        userId: demoUser.id,
      },
    }),
    prisma.budget.deleteMany({
      where: {
        userId: demoUser.id,
      },
    }),
    prisma.pot.deleteMany({
      where: {
        userId: demoUser.id,
      },
    }),
  ]);

  await prisma.transaction.createMany({
    data: sampleData.transactions.map((transaction) => ({
      userId: demoUser.id,
      avatar: transaction.avatar,
      name: transaction.name,
      category: transaction.category,
      amount: transaction.amount,
      date: new Date(transaction.date),
      recurring: transaction.recurring,
      dueDate: transaction.dueDate ? new Date(transaction.dueDate) : null,
      status: transaction.status ?? null,
      paidDate: transaction.paidDate ? new Date(transaction.paidDate) : null,
    })),
  });

  await prisma.budget.createMany({
    data: sampleData.budgets.map((budget) => ({
      userId: demoUser.id,
      category: budget.category,
      maximum: budget.maximum,
      theme: budget.theme,
    })),
  });

  await prisma.pot.createMany({
    data: sampleData.pots.map((pot) => ({
      userId: demoUser.id,
      name: pot.name,
      target: pot.target,
      total: pot.total,
      theme: pot.theme,
    })),
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed demo finance data", error);
    await prisma.$disconnect();
    process.exit(1);
  });
