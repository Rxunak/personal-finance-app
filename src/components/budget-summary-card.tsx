"use client";

import IconCaret from "../icons/icon-caret-right.svg";
import { ChartPieDonut, type PieChartBudgetItem } from "./pieChart";

type BudgetSummaryItem = {
  category: string;
  maximum: number;
  theme: string;
};

type BudgetSummaryCardProps = {
  budgets: BudgetSummaryItem[];
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  flexCol?: string;
};

export default function BudgetSummaryCard({
  budgets,
  title = "Budgets",
  actionLabel = "See Details",
  onAction,
  flexCol,
}: BudgetSummaryCardProps) {
  const totalBudget = budgets.reduce(
    (sum, budget) => sum + Number(budget.maximum),
    0,
  );

  const chartData: PieChartBudgetItem[] = budgets.map((budget) => ({
    budget: budget.category,
    allocatedMoney: Number(budget.maximum),
    fill: budget.theme,
  }));

  return (
    <section className="rounded-2xl bg-white p-8">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">{flexCol ? "" : title}</h1>
        {onAction ? (
          <button
            type="button"
            className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
            onClick={onAction}
          >
            {actionLabel} <IconCaret />
          </button>
        ) : null}
      </div>
      <div
        className={`mt-4 flex ${!flexCol ? "flex-row" : "flex-col"} gap-6 lg:items-center lg:justify-evenly`}
      >
        <div className="w-full max-w-60 mx-auto lg:mx-0">
          <ChartPieDonut data={chartData} total={totalBudget} />
        </div>
        {flexCol && <span className="text-xl font-bold">Spending Summary</span>}
        <div
          className={`${flexCol ? "w-full" : ""} ${flexCol ? "h-full" : ""}`}
        >
          <div className="flex flex-col gap-5 h-full justify-center">
            {!flexCol
              ? budgets.map((budget: any, index: any) => (
                  <span
                    key={`${budget.category}-${index}`}
                    className="flex h-auto"
                  >
                    <span
                      className="border-l-4 rounded-xs w-1 h-13 self-stretch"
                      style={{ borderLeftColor: budget.theme }}
                    ></span>
                    <div className="flex flex-col gap-1 justify-center">
                      <p className="text-grey-500 text-xs  pl-4">
                        {budget.category}
                      </p>
                      <p className="text-black font-bold pl-4">
                        {budget.maximum.toLocaleString("en-GB", {
                          style: "currency",
                          currency: "GBP",
                        })}
                      </p>
                    </div>
                  </span>
                ))
              : budgets.map((budget: any, index: any) => (
                  <span
                    key={`${budget.category}-${index}`}
                    className="flex h-auto"
                  >
                    <span
                      className="border-l-4 rounded-xs w-1 h-6 self-stretch"
                      style={{ borderLeftColor: budget.theme }}
                    ></span>
                    <div className="flex flex-row gap-1 items-center w-full justify-between">
                      <p className="text-grey-500 text-sm pl-4">
                        {budget.category}
                      </p>
                      <p className="text-black font-bold pl-4">
                        {budget.maximum.toLocaleString("en-GB", {
                          style: "currency",
                          currency: "GBP",
                        })}{" "}
                      </p>
                    </div>
                  </span>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
