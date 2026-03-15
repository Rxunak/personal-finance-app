"use client";

import React from "react";
import { useFinanceData } from "@/hooks/use-finance-data";
import { SpinnerButton } from "../components/spinnerButton";
import BudgetSummaryCard from "../components/budget-summary-card";
import { Ellipsis } from "lucide-react";
import { ProgressWithLabel } from "../components/progressBar";

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
        <div className="border w-3/5">
          <div className="h-auto bg-white rounded-md p-5 flex flex-col gap-5">
            <div className="flex gap-3 items-center">
              <span className="w-5 h-5 border rounded-2xl bg-green"></span>
              <p className="font-bold text-xl">Entertainment</p>
              <p className="ml-auto">
                <Ellipsis />
              </p>
            </div>
            <div>
              <ProgressWithLabel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Budget;
