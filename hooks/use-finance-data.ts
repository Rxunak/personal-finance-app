"use client";

import { useQuery } from "@tanstack/react-query";

export type Balance = {
  current: number;
  income: number;
  expenses: number;
};

export type Transaction = {
  id?: string;
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
  dueDate?: string | null;
  status?: "paid" | "unpaid" | "overdue" | null;
  paidDate?: string | null;
};

export type Budget = {
  id?: string;
  category: string;
  maximum: number;
  theme: string;
};

export type Pot = {
  id?: string;
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
