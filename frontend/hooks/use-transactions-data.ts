"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "./use-finance-data";
import { apiBaseUrl } from "./api";

type UpdateTransactionInput = {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
};

const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(`${apiBaseUrl}/transactions`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.status}`);
  }

  return response.json() as Promise<Transaction[]>;
};

export const useTransactionsData = () =>
  useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    retry: false,
  });

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: UpdateTransactionInput): Promise<Transaction> => {
      const response = await fetch(`${apiBaseUrl}/transactions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update transaction: ${response.status}`);
      }

      return response.json() as Promise<Transaction>;
    },
    onSuccess: async (updatedTransaction) => {
      queryClient.setQueryData<Transaction[]>(
        ["transactions"],
        (currentTransactions) =>
          currentTransactions?.map((transaction) =>
            transaction.id === updatedTransaction.id
              ? updatedTransaction
              : transaction,
          ) ?? [updatedTransaction],
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["overviewData"] }),
      ]);
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${apiBaseUrl}/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete transaction: ${response.status}`);
      }

      return response.json() as Promise<{ success: true }>;
    },
    onSuccess: async (_result, deletedId) => {
      queryClient.setQueryData<Transaction[]>(
        ["transactions"],
        (currentTransactions) =>
          currentTransactions?.filter(
            (transaction) => transaction.id !== deletedId,
          ) ?? [],
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["overviewData"] }),
      ]);
    },
  });
};
