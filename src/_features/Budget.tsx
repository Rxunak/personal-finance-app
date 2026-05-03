"use client";
import React, { useState } from "react";
import { useFinanceData } from "@/hooks/use-finance-data";
import { SpinnerButton } from "../components/spinnerButton";
import BudgetSummaryCard from "../components/budget-summary-card";
import { Ellipsis } from "lucide-react";
import { ProgressWithLabel } from "../components/progressBar";
import { useRouter } from "next/navigation";
import TransactionsCard from "../components/transactionsCard";
import { BudgetForm } from "../components/form";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";

const Budget = () => {
  const router = useRouter();

  const { isPending, error, data } = useFinanceData();
  const [addNewBudget, setAddNewBudget] = useState(false);

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;
  return (
    <div className="bg-beige-100 pl-8 pr-8 pb-8 h-lvh">
      <div className="flex flex-row justify-between pt-6 mb-8">
        <header className="text-3xl font-semibold flex items-center">
          Budgets
        </header>
        <button
          className="flex h-12 w-40 items-center justify-center rounded-md bg-black text-white text-sm cursor-pointer"
          onClick={() => setAddNewBudget(!addNewBudget)}
        >
          + Add New Budget
        </button>
      </div>
      <Dialog open={addNewBudget} onOpenChange={setAddNewBudget}>
        <DialogContent className="w-full bg-transparent p-0 shadow-none border-none">
          <DialogTitle className="sr-only">Add New Budget</DialogTitle>
          <BudgetForm />
        </DialogContent>
      </Dialog>
      <main className="flex gap-5  h-9/10">
        <div className="w-2/5 h-full">
          <BudgetSummaryCard budgets={data.budgets} flexCol={"flex-col"} />
        </div>

        <div className="w-3/5 h-full overflow-auto">
          {data.budgets.map((budget: any, index: number) => {
            const total: any = [];
            let remainingAmount: any;

            data.transactions.filter((item: any) => {
              if (item.category === budget.category) {
                total.push(item.amount);
              }
            });

            const sum = total
              .slice(0, 3)
              .reduce(
                (previousValue: any, currentValue: any, index: any) =>
                  previousValue + currentValue,
                0,
              );

            if (Math.abs(sum) < budget.maximum) {
              console.log(total.slice(0, 3));
            }

            return (
              <div
                key={index}
                className="h-auto bg-white rounded-2xl p-5 flex flex-col gap-5 mb-5"
              >
                <div className="flex gap-3 items-center">
                  <span
                    className="w-5 h-5 border rounded-2xl"
                    style={{ background: budget.theme }}
                  ></span>
                  <p className="font-bold text-xl">{budget.category}</p>
                  <p className="ml-auto">
                    <Ellipsis />
                  </p>
                </div>
                <div>
                  <ProgressWithLabel
                    barColor={budget.theme}
                    maximumAmount={budget.maximum}
                    barValue={Math.abs(sum)}
                  />
                </div>
                <div className="flex">
                  <div className="w-1/2 h-15 flex gap-4">
                    <span
                      className="rounded-2xl w-1.5 h-full"
                      style={{ background: budget.theme }}
                    />
                    <div className="flex flex-col justify-between">
                      <p className="text-gray-500">Spent</p>
                      <p className="font-bold text-xl">
                        {Math.abs(sum).toLocaleString("en-GB", {
                          style: "currency",
                          currency: "GBP",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="w-1/2 h-15 flex gap-4">
                    <span className="bg-grey-100 rounded-2xl w-1.5 h-full" />
                    <div className="flex flex-col justify-between">
                      <p className="text-gray-500">Remaining</p>
                      <p className="font-bold text-xl">
                        {Math.abs(sum) > budget.maximum
                          ? "£0"
                          : (budget.maximum - Math.abs(sum)).toLocaleString(
                              "en-GB",
                              {
                                style: "currency",
                                currency: "GBP",
                              },
                            )}
                      </p>
                    </div>
                  </div>
                </div>
                <TransactionsCard
                  title={"Latest Spending"}
                  transactionData={data.transactions.filter(
                    (item: any) => item.category === budget.category,
                  )}
                  backgroundColor={"beige-100"}
                  sliceAmount={3}
                  budgetCard={true}
                />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Budget;
