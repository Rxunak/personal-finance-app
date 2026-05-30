import prisma from "../lib/prisma.js";
import { DEMO_USER } from "../constants/demo-user.js";

export type BudgetResponse = {
  id: string;
  category: string;
  maximum: number;
  theme: string;
};

export type UpsertBudgetInput = {
  category: string;
  maximum: number;
  theme: string;
};

export class BudgetNotFoundError extends Error {
  constructor(budgetId: number) {
    super(`Budget ${budgetId} not found.`);
    this.name = "BudgetNotFoundError";
  }
}

const toBudgetResponse = (budget: {
  id: number;
  category: string;
  maximum: number;
  theme: string;
}): BudgetResponse => ({
  id: String(budget.id),
  category: budget.category,
  maximum: budget.maximum,
  theme: budget.theme,
});

const getDemoUser = async () =>
  prisma.user.findUnique({
    where: {
      email: DEMO_USER.email,
    },
  });

const getOwnedBudget = async (budgetId: number) => {
  const user = await getDemoUser();

  if (!user) {
    throw new BudgetNotFoundError(budgetId);
  }

  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      userId: user.id,
    },
  });

  if (!budget) {
    throw new BudgetNotFoundError(budgetId);
  }

  return { budget, user };
};

export const listBudgets = async (): Promise<BudgetResponse[]> => {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER.email },
    include: { budgets: true },
  });

  if (!user) {
    return [];
  }

  return user.budgets.map(toBudgetResponse);
};

export const createBudget = async (
  input: UpsertBudgetInput,
): Promise<BudgetResponse> => {
  const user = await getDemoUser();

  if (!user) {
    throw new Error("Demo user not found.");
  }

  const budget = await prisma.budget.create({
    data: {
      userId: user.id,
      category: input.category,
      maximum: input.maximum,
      theme: input.theme,
    },
  });

  return toBudgetResponse(budget);
};

export const updateBudget = async (
  budgetId: number,
  input: UpsertBudgetInput,
): Promise<BudgetResponse> => {
  await getOwnedBudget(budgetId);

  const budget = await prisma.budget.update({
    where: { id: budgetId },
    data: {
      category: input.category,
      maximum: input.maximum,
      theme: input.theme,
    },
  });

  return toBudgetResponse(budget);
};

export const deleteBudget = async (
  budgetId: number,
): Promise<{ success: true }> => {
  await getOwnedBudget(budgetId);

  await prisma.budget.delete({
    where: { id: budgetId },
  });

  return { success: true };
};
