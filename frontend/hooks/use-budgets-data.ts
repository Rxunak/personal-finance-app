"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "./api";
import type { Budget } from "./use-finance-data";

type BudgetPayload = {
  category: string;
  maximum: number;
  theme: string;
};

const fetchBudgets = async (): Promise<Budget[]> => {
  const response = await fetch(`${apiBaseUrl}/budgets`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch budgets: ${response.status}`);
  }

  return response.json() as Promise<Budget[]>;
};

const invalidateBudgetQueries = async (queryClient: ReturnType<typeof useQueryClient>) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["budgets"] }),
    queryClient.invalidateQueries({ queryKey: ["overviewData"] }),
  ]);

export const useBudgetsData = () =>
  useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
    retry: false,
  });

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BudgetPayload): Promise<Budget> => {
      const response = await fetch(`${apiBaseUrl}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create budget: ${response.status}`);
      }

      return response.json() as Promise<Budget>;
    },
    onSuccess: async () => {
      await invalidateBudgetQueries(queryClient);
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: BudgetPayload & { id: string }): Promise<Budget> => {
      const response = await fetch(`${apiBaseUrl}/budgets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update budget: ${response.status}`);
      }

      return response.json() as Promise<Budget>;
    },
    onSuccess: async () => {
      await invalidateBudgetQueries(queryClient);
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${apiBaseUrl}/budgets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete budget: ${response.status}`);
      }

      return response.json() as Promise<{ success: true }>;
    },
    onSuccess: async () => {
      await invalidateBudgetQueries(queryClient);
    },
  });
};
