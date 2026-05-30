"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "./api";
import type { Pot } from "./use-finance-data";

type PotPayload = {
  name: string;
  target: number;
  total?: number;
  theme: string;
};

const fetchPots = async (): Promise<Pot[]> => {
  const response = await fetch(`${apiBaseUrl}/pots`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pots: ${response.status}`);
  }

  return response.json() as Promise<Pot[]>;
};

const invalidatePotQueries = async (queryClient: ReturnType<typeof useQueryClient>) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["pots"] }),
    queryClient.invalidateQueries({ queryKey: ["overviewData"] }),
  ]);

export const usePotsData = () =>
  useQuery<Pot[]>({
    queryKey: ["pots"],
    queryFn: fetchPots,
    retry: false,
  });

export const useCreatePot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PotPayload): Promise<Pot> => {
      const response = await fetch(`${apiBaseUrl}/pots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create pot: ${response.status}`);
      }

      return response.json() as Promise<Pot>;
    },
    onSuccess: async () => {
      await invalidatePotQueries(queryClient);
    },
  });
};

export const useUpdatePot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: PotPayload & { id: string }): Promise<Pot> => {
      const response = await fetch(`${apiBaseUrl}/pots/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update pot: ${response.status}`);
      }

      return response.json() as Promise<Pot>;
    },
    onSuccess: async () => {
      await invalidatePotQueries(queryClient);
    },
  });
};

export const useUpdatePotBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      amountDelta,
    }: {
      id: string;
      amountDelta: number;
    }): Promise<Pot> => {
      const response = await fetch(`${apiBaseUrl}/pots/${id}/balance`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amountDelta }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update pot balance: ${response.status}`);
      }

      return response.json() as Promise<Pot>;
    },
    onSuccess: async () => {
      await invalidatePotQueries(queryClient);
    },
  });
};

export const useDeletePot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${apiBaseUrl}/pots/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete pot: ${response.status}`);
      }

      return response.json() as Promise<{ success: true }>;
    },
    onSuccess: async () => {
      await invalidatePotQueries(queryClient);
    },
  });
};
