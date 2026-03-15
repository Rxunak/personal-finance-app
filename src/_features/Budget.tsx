"use client";

import React from "react";
import { useFinanceData } from "@/hooks/use-finance-data";
import { SpinnerButton } from "../components/spinnerButton";
import BudgetSummaryCard from "../components/budget-summary-card";

const Budget = () => {
  const { isPending, error, data } = useFinanceData();

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;
  return (
    <div className="bg-beige-100 pl-8 pr-8">
      <div className="flex flex-row justify-between pt-6 mb-8">
        <header className="text-3xl font-semibold flex items-center">
          Budgets
        </header>
        <button className="flex border h-12 w-40 items-center justify-center rounded-md bg-black text-white text-sm cursor-pointer">
          + Add New Budget
        </button>
      </div>
      <main className="flex gap-5">
        <div className="w-2/5">
          <BudgetSummaryCard budgets={data.budgets} flexCol={"flex-col"} />
        </div>
        <div className="border w-3/5">Raunak</div>
      </main>
    </div>
  );
};

export default Budget;
