import prisma from "../lib/prisma.js";
import { DEMO_USER } from "../constants/demo-user.js";

export type OverviewResponse = {
  balance: {
    current: number;
    income: number;
    expenses: number;
  };
  transactions: Array<{
    id: string;
    avatar: string;
    name: string;
    category: string;
    date: string;
    amount: number;
    recurring: boolean;
    dueDate: string | null;
    status: "paid" | "unpaid" | "overdue" | null;
    paidDate: string | null;
  }>;
  budgets: Array<{
    id: string;
    category: string;
    maximum: number;
    theme: string;
  }>;
  pots: Array<{
    id: string;
    name: string;
    target: number;
    total: number;
    theme: string;
  }>;
};

const toNullableIsoString = (value: Date | null) => value?.toISOString() ?? null;

export const getOverviewData = async (): Promise<OverviewResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      email: DEMO_USER.email,
    },
    include: {
      transactions: {
        orderBy: {
          date: "desc",
        },
      },
      budgets: true,
      pots: true,
    },
  });

  if (!user) {
    return {
      balance: {
        current: 0,
        income: 0,
        expenses: 0,
      },
      transactions: [],
      budgets: [],
      pots: [],
    };
  }

  const balance = user.transactions.reduce(
    (totals:any, transaction:any) => {
      totals.current += transaction.amount;

      if (transaction.amount > 0) {
        totals.income += transaction.amount;
      } else {
        totals.expenses += Math.abs(transaction.amount);
      }

      return totals;
    },
    {
      current: 0,
      income: 0,
      expenses: 0,
    },
  );

  return {
    balance,
    transactions: user.transactions.map((transaction:any) => ({
      id: String(transaction.id),
      avatar: transaction.avatar,
      name: transaction.name,
      category: transaction.category,
      date: transaction.date.toISOString(),
      amount: transaction.amount,
      recurring: transaction.recurring,
      dueDate: toNullableIsoString(transaction.dueDate),
      status:
        transaction.status === "paid" ||
        transaction.status === "unpaid" ||
        transaction.status === "overdue"
          ? transaction.status
          : null,
      paidDate: toNullableIsoString(transaction.paidDate),
    })),
    budgets: user.budgets.map((budget:any) => ({
      id: String(budget.id),
      category: budget.category,
      maximum: budget.maximum,
      theme: budget.theme,
    })),
    pots: user.pots.map((pot:any) => ({
      id: String(pot.id),
      name: pot.name,
      target: pot.target,
      total: pot.total,
      theme: pot.theme,
    })),
  };
};
