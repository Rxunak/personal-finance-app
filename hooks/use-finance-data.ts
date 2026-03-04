"use client";

import { useQuery } from "@tanstack/react-query";

export const useFinanceData = () =>
  useQuery({
    queryKey: ["overviewData"],
    queryFn: () => fetch("/data.json").then((res) => res.json()),
  });

