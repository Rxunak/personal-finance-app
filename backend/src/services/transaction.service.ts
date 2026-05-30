import prisma from "../lib/prisma.js";
import { DEMO_USER } from "../constants/demo-user.js";

export type TransactionResponse = {
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
};

export type UpdateTransactionInput = {
  name: string;
  category: string;
  amount: number;
  date: string;
};

export class TransactionNotFoundError extends Error {
  constructor(transactionId: number) {
    super(`Transaction ${transactionId} not found.`);
    this.name = "TransactionNotFoundError";
  }
}

const toNullableIsoString = (value: Date | null) => value?.toISOString() ?? null;

const toTransactionResponse = (transaction: {
  id: number;
  avatar: string;
  name: string;
  category: string;
  date: Date;
  amount: number;
  recurring: boolean;
  dueDate: Date | null;
  status: string | null;
  paidDate: Date | null;
}): TransactionResponse => ({
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
});

const getDemoUser = async () =>
  prisma.user.findUnique({
    where: {
      email: DEMO_USER.email,
    },
  });

const getOwnedTransaction = async (transactionId: number) => {
  const user = await getDemoUser();

  if (!user) {
    throw new TransactionNotFoundError(transactionId);
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: user.id,
    },
  });

  if (!transaction) {
    throw new TransactionNotFoundError(transactionId);
  }

  return transaction;
};

export const listTransactions = async (): Promise<TransactionResponse[]> => {
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
    },
  });

  if (!user) {
    return [];
  }

  return user.transactions.map(toTransactionResponse);
};

export const updateTransaction = async (
  transactionId: number,
  input: UpdateTransactionInput,
): Promise<TransactionResponse> => {
  await getOwnedTransaction(transactionId);

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      name: input.name,
      category: input.category,
      amount: input.amount,
      date: new Date(input.date),
    },
  });

  return toTransactionResponse(updatedTransaction);
};

export const deleteTransaction = async (
  transactionId: number,
): Promise<{ success: true }> => {
  await getOwnedTransaction(transactionId);

  await prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });

  return { success: true };
};
