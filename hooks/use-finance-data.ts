"use client";

import { useQuery } from "@tanstack/react-query";

export type Balance = {
  current: number;
  income: number;
  expenses: number;
};

export type Transaction = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
  dueDate?: string;
  status?: "paid" | "unpaid" | "overdue";
  paidDate?: string | null;
};

export type Budget = {
  category: string;
  maximum: number;
  theme: string;
};

export type Pot = {
  name: string;
  target: number;
  total: number;
  theme: string;
};

export type FinanceData = {
  balance: Balance;
  transactions: Transaction[];
  budgets: Budget[];
  pots: Pot[];
};

export const useFinanceData = () =>
  useQuery<FinanceData>({
    queryKey: ["overviewData"],
    queryFn: () => fetch("/data.json").then((res) => res.json() as Promise<FinanceData>),
  });
