"use client";
import { useMemo, useState } from "react";
import {
  type Budget as BudgetItem,
  type Transaction,
} from "@/hooks/use-finance-data";
import { SpinnerButton } from "../components/spinnerButton";
import BudgetSummaryCard from "../components/budget-summary-card";
import { ProgressWithLabel } from "../components/progressBar";
import TransactionsCard from "../components/transactionsCard";
import { BudgetForm, type BudgetFormValues } from "../components/form";
import { DeleteConfirmationDialog } from "../components/delete-confirmation-dialog";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { ActionMenu } from "../components/action-menu";
import { useOverviewData } from "@/hooks/use-overview-data";
import {
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
} from "@/hooks/use-budgets-data";
import { toast } from "sonner";

const Budget = () => {
  const { isPending, error, data } = useOverviewData();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetItem | null>(null);
  const [budgetPendingDelete, setBudgetPendingDelete] =
    useState<BudgetItem | null>(null);

  const openCreateDialog = () => {
    setDialogMode("create");
    setSelectedBudget(null);
    setIsBudgetDialogOpen(true);
  };

  const openEditDialog = (budget: BudgetItem) => {
    setDialogMode("edit");
    setSelectedBudget(budget);
    setIsBudgetDialogOpen(true);
  };

  const openDeleteDialog = (budget: BudgetItem) => {
    setBudgetPendingDelete(budget);
  };

  const handleDialogChange = (open: boolean) => {
    setIsBudgetDialogOpen(open);
    if (!open) {
      setSelectedBudget(null);
      setDialogMode("create");
    }
  };

  const handleBudgetSubmit = async (formData: BudgetFormValues) => {
    const payload = {
      category: formData.title,
      maximum: Number(formData.maximumSpend),
      theme: formData.theme,
    };

    if (dialogMode === "edit" && selectedBudget?.id) {
      await updateBudget.mutateAsync({
        id: selectedBudget.id,
        ...payload,
      });
      return;
    }

    await createBudget.mutateAsync(payload);
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
  if (!data) return null;

  const budgetsToRender = data.budgets;
  return (
    <div className="h-lvh bg-beige-100 pl-8 pr-8 pb-8 text-foreground dark:bg-background">
      <div className="flex flex-row justify-between pt-6 mb-8">
        <header className="text-3xl font-semibold flex items-center">
          Budgets
        </header>
        <button
          className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-md bg-grey-900 text-sm text-white dark:bg-white dark:text-grey-900"
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
            usedThemeColors={budgetsToRender.map((budget) => budget.theme)}
            initialValues={initialValues}
            onSubmit={handleBudgetSubmit}
            onClose={() => handleDialogChange(false)}
          />
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        open={!!budgetPendingDelete}
        onOpenChange={(open) => {
          if (!open) {
            setBudgetPendingDelete(null);
          }
        }}
        itemName={budgetPendingDelete?.category ?? ""}
        itemType="budget"
        onConfirm={async () => {
          if (budgetPendingDelete?.id) {
            try {
              await deleteBudget.mutateAsync(budgetPendingDelete.id);
              setBudgetPendingDelete(null);
            } catch (error) {
              toast("Failed to delete budget.", {
                description:
                  error instanceof Error ? error.message : "Please try again.",
                position: "bottom-right",
              });
              throw error;
            }
          }
        }}
      />
      <main className="flex gap-5  h-9/10">
        <div className="w-2/5 h-full">
          <BudgetSummaryCard budgets={budgetsToRender} flexCol={"flex-col"} />
        </div>

        <div className="w-3/5 h-full overflow-auto no-scrollbar">
          {budgetsToRender.map((budget: BudgetItem) => {
            const budgetTransactions = data.transactions.filter(
              (item: Transaction) => item.category === budget.category,
            );
            const sum = budgetTransactions
              .slice(0, 3)
              .reduce(
                (previousValue: number, currentValue: Transaction) =>
                  previousValue + currentValue.amount,
                0,
              );

            return (
              <div
                key={budget.id ?? `${budget.category}-${budget.theme}`}
                className="mb-5 flex h-auto flex-col gap-5 rounded-2xl bg-card p-5 text-card-foreground"
              >
                <div className="flex gap-3 items-center">
                  <span
                    className="w-5 h-5 border rounded-2xl"
                    style={{ background: budget.theme }}
                  ></span>
                  <p className="font-bold text-xl">{budget.category}</p>
                  <ActionMenu
                    ariaLabel={`Open actions for ${budget.category}`}
                    items={[
                      {
                        label: "Edit Budget",
                        onClick: () => openEditDialog(budget),
                      },
                      {
                        label: "Delete Budget",
                        onClick: () => openDeleteDialog(budget),
                        variant: "destructive",
                      },
                    ]}
                  />
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
                      <p className="text-muted-foreground">Spent</p>
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
                      <p className="text-muted-foreground">Remaining</p>
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
                  transactionData={budgetTransactions}
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
