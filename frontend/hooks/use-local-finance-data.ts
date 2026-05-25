"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type Budget,
  type FinanceData,
  type Pot,
  type Transaction,
  useFinanceData,
} from "./use-finance-data";

const STORAGE_KEY = "finance-data";

const createTransactionId = (transaction: Transaction) =>
  transaction.id ??
  `${transaction.name}-${transaction.date}-${transaction.amount}-${transaction.category}`;

const createBudgetId = (budget: Budget) =>
  budget.id ?? `${budget.category}-${budget.theme}`;

const createPotId = (pot: Pot) => pot.id ?? `${pot.name}-${pot.theme}`;

const ensureUniqueIds = <T extends { id?: string }>(
  items: T[],
  createId: (item: T) => string,
) => {
  const seenIds = new Map<string, number>();

  return items.map((item) => {
    const baseId = item.id ?? createId(item);
    const duplicateCount = seenIds.get(baseId) ?? 0;
    seenIds.set(baseId, duplicateCount + 1);

    return {
      ...item,
      id: duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`,
    };
  });
};

const normalizeTransaction = (transaction: Transaction): Transaction => ({
  ...transaction,
  id: transaction.id ?? createTransactionId(transaction),
});

const normalizeBudget = (budget: Budget): Budget => ({
  ...budget,
  id: budget.id ?? createBudgetId(budget),
});

const normalizePot = (pot: Pot): Pot => ({
  ...pot,
  id: pot.id ?? createPotId(pot),
});

const normalizeFinanceData = (data: FinanceData): FinanceData => ({
  ...data,
  transactions: ensureUniqueIds(data.transactions, createTransactionId),
  budgets: ensureUniqueIds(data.budgets, createBudgetId),
  pots: ensureUniqueIds(data.pots, createPotId),
});

export const useLocalFinanceData = () => {
  const financeQuery = useFinanceData();
  const [localData, setLocalData] = useState<FinanceData | null>(null);
  const storedData = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const rawStoredData = window.localStorage.getItem(STORAGE_KEY);

    if (!rawStoredData) {
      return null;
    }

    try {
      return normalizeFinanceData(JSON.parse(rawStoredData) as FinanceData);
    } catch (error) {
      console.error("Invalid finance data in localStorage", error);
      return null;
    }
  }, []);

  const baseData = useMemo(
    () => storedData ?? (financeQuery.data ? normalizeFinanceData(financeQuery.data) : null),
    [financeQuery.data, storedData],
  );

  const persistData = useCallback(
    (updater: (currentData: FinanceData) => FinanceData) => {
      setLocalData((currentData) => {
        const sourceData = currentData ?? baseData;

        if (!sourceData) {
          return currentData;
        }

        const nextData = normalizeFinanceData(updater(sourceData));
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));

        return nextData;
      });
    },
    [baseData],
  );

  const upsertBudget = useCallback((budget: Budget) => {
    const normalizedBudget = normalizeBudget(budget);

    persistData((currentData) => {
      const existingIndex = currentData.budgets.findIndex(
        (item) => item.id === normalizedBudget.id,
      );

      if (existingIndex === -1) {
        return {
          ...currentData,
          budgets: [...currentData.budgets, normalizedBudget],
        };
      }

      const budgets = [...currentData.budgets];
      budgets[existingIndex] = normalizedBudget;

      return { ...currentData, budgets };
    });
  }, [persistData]);

  const deleteBudget = useCallback((budgetId: string) => {
    persistData((currentData) => ({
      ...currentData,
      budgets: currentData.budgets.filter((budget) => budget.id !== budgetId),
    }));
  }, [persistData]);

  const upsertPot = useCallback((pot: Pot) => {
    const normalizedPot = normalizePot(pot);

    persistData((currentData) => {
      const existingIndex = currentData.pots.findIndex(
        (item) => item.id === normalizedPot.id,
      );

      if (existingIndex === -1) {
        return {
          ...currentData,
          pots: [...currentData.pots, normalizedPot],
        };
      }

      const pots = [...currentData.pots];
      pots[existingIndex] = normalizedPot;

      return { ...currentData, pots };
    });
  }, [persistData]);

  const deletePot = useCallback((potId: string) => {
    persistData((currentData) => ({
      ...currentData,
      pots: currentData.pots.filter((pot) => pot.id !== potId),
    }));
  }, [persistData]);

  const updatePotTotal = useCallback((potId: string, amountDelta: number) => {
    persistData((currentData) => ({
      ...currentData,
      pots: currentData.pots.map((pot) =>
        pot.id === potId
          ? {
              ...pot,
              total: Math.max(0, Math.min(pot.target, pot.total + amountDelta)),
            }
          : pot,
      ),
    }));
  }, [persistData]);

  const upsertTransaction = useCallback((transaction: Transaction) => {
    const normalizedTransaction = normalizeTransaction(transaction);

    persistData((currentData) => {
      const existingIndex = currentData.transactions.findIndex(
        (item) => item.id === normalizedTransaction.id,
      );

      if (existingIndex === -1) {
        return {
          ...currentData,
          transactions: [normalizedTransaction, ...currentData.transactions],
        };
      }

      const transactions = [...currentData.transactions];
      transactions[existingIndex] = normalizedTransaction;

      return { ...currentData, transactions };
    });
  }, [persistData]);

  const deleteTransaction = useCallback((transactionId: string) => {
    persistData((currentData) => ({
      ...currentData,
      transactions: currentData.transactions.filter(
        (transaction) => transaction.id !== transactionId,
      ),
    }));
  }, [persistData]);

  return useMemo(
    () => ({
      ...financeQuery,
      data: localData ?? baseData,
      isPending: financeQuery.isPending || !(localData ?? baseData),
      upsertBudget,
      deleteBudget,
      upsertPot,
      deletePot,
      updatePotTotal,
      upsertTransaction,
      deleteTransaction,
    }),
    [
      deleteBudget,
      deletePot,
      deleteTransaction,
      financeQuery,
      localData,
      baseData,
      updatePotTotal,
      upsertBudget,
      upsertPot,
      upsertTransaction,
    ],
  );
};
