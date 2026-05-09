"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFinanceData } from "@/hooks/use-finance-data";
import { SpinnerButton } from "../components/spinnerButton";
import BudgetSummaryCard from "../components/budget-summary-card";
import { Ellipsis } from "lucide-react";
import { ProgressWithLabel } from "../components/progressBar";
import TransactionsCard from "../components/transactionsCard";
import { BudgetForm, type BudgetFormValues } from "../components/form";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";

type BudgetItem = {
  category: string;
  maximum: number;
  theme: string;
};

const Budget = () => {
  const { isPending, error, data } = useFinanceData();
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetItem | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openCreateDialog = () => {
    setDialogMode("create");
    setSelectedBudget(null);
    setIsBudgetDialogOpen(true);
  };

  const openEditDialog = (budget: BudgetItem) => {
    setDialogMode("edit");
    setSelectedBudget(budget);
    setOpenMenuIndex(null);
    setIsBudgetDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsBudgetDialogOpen(open);
    if (!open) {
      setSelectedBudget(null);
      setDialogMode("create");
    }
  };

  const initialValues = useMemo<BudgetFormValues | undefined>(
    () =>
      selectedBudget
        ? {
            title: selectedBudget.category,
            theme: selectedBudget.theme,
            maximumSpend: String(selectedBudget.maximum),
          }
        : undefined,
    [selectedBudget],
  );

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
          onClick={openCreateDialog}
        >
          + Add New Budget
        </button>
      </div>
      <Dialog open={isBudgetDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="w-full bg-transparent p-0 shadow-none border-none">
          <DialogTitle className="sr-only">
            {dialogMode === "edit" ? "Edit Budget" : "Add New Budget"}
          </DialogTitle>
          <BudgetForm
            mode={dialogMode}
            usedThemeColors={data.budgets.map((budget) => budget.theme)}
            initialValues={initialValues}
            onClose={() => handleDialogChange(false)}
          />
        </DialogContent>
      </Dialog>
      <main className="flex gap-5  h-9/10">
        <div className="w-2/5 h-full">
          <BudgetSummaryCard budgets={data.budgets} flexCol={"flex-col"} />
        </div>

        <div className="w-3/5 h-full overflow-auto">
          {data.budgets.map((budget: BudgetItem, index: number) => {
            const total: any = [];

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
                  <div
                    className="relative ml-auto"
                    ref={openMenuIndex === index ? menuRef : null}
                  >
                    <button
                      type="button"
                      className="flex cursor-pointer items-center justify-center rounded-full p-1 text-grey-500 transition-colors hover:bg-beige-100"
                      aria-label={`Open actions for ${budget.category}`}
                      aria-expanded={openMenuIndex === index}
                      onClick={() =>
                        setOpenMenuIndex(openMenuIndex === index ? null : index)
                      }
                    >
                      <Ellipsis />
                    </button>
                    {openMenuIndex === index && (
                      <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                        <button
                          type="button"
                          className="flex w-full cursor-pointer items-center px-5 py-4 text-left text-lg text-beige-500 transition-colors hover:bg-beige-100"
                          onClick={() => openEditDialog(budget)}
                        >
                          Edit Budget
                        </button>
                        <div className="mx-4 h-px bg-grey-100" />
                        <button
                          type="button"
                          className="flex w-full cursor-pointer items-center px-5 py-4 text-left text-lg text-red transition-colors hover:bg-red/5"
                          onClick={() => setOpenMenuIndex(null)}
                        >
                          Delete Budget
                        </button>
                      </div>
                    )}
                  </div>
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
