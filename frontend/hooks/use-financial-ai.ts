"use client";

import { useMemo } from "react";

import { useOverviewData } from "@/hooks/use-overview-data";
import { buildFinanceAiReport } from "@/lib/financial-ai";

export const useFinancialAi = () => {
  const query = useOverviewData();

  const report = useMemo(() => {
    if (!query.data) {
      return null;
    }

    return buildFinanceAiReport(query.data);
  }, [query.data]);

  return {
    ...query,
    report,
  };
};
