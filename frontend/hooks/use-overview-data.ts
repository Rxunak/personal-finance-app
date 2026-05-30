"use client";

import { useQuery } from "@tanstack/react-query";
import type { FinanceData } from "./use-finance-data";
import { apiBaseUrl } from "./api";

export const useOverviewData = () =>
  useQuery<FinanceData>({
    queryKey: ["overviewData"],
    queryFn: async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/overview`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch overview data: ${response.status}`);
        }

        return response.json() as Promise<FinanceData>;
      } catch {
        const fallbackResponse = await fetch("/data.json", {
          cache: "no-store",
        });

        if (!fallbackResponse.ok) {
          throw new Error(
            `Failed to fetch overview fallback data: ${fallbackResponse.status}`,
          );
        }

        return fallbackResponse.json() as Promise<FinanceData>;
      }
    },
    retry: false,
  });
