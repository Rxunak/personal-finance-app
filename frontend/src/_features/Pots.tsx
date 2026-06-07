"use client";

import { useMemo, useState } from "react";
import { type Pot } from "@/hooks/use-finance-data";
import { PotBalanceDialog } from "../components/pot-balance-dialog";
import { DeleteConfirmationDialog } from "../components/delete-confirmation-dialog";
import { PotForm, type PotFormValues } from "../components/pot-form";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import { SpinnerButton } from "../components/spinnerButton";
import { ActionMenu } from "../components/action-menu";
import { useOverviewData } from "@/hooks/use-overview-data";
import {
  useCreatePot,
  useDeletePot,
  useUpdatePot,
  useUpdatePotBalance,
} from "@/hooks/use-pots-data";
import { toast } from "sonner";

const Pots = () => {
  const { isPending, error, data } = useOverviewData();
  const createPot = useCreatePot();
  const updatePot = useUpdatePot();
  const deletePot = useDeletePot();
  const updatePotBalance = useUpdatePotBalance();
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [isPotDialogOpen, setIsPotDialogOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
  const [potBalanceMode, setPotBalanceMode] = useState<"add" | "withdraw">(
    "add",
  );
  const [potBalanceTarget, setPotBalanceTarget] = useState<Pot | null>(null);
  const [potPendingDelete, setPotPendingDelete] = useState<Pot | null>(null);

  const openCreateDialog = () => {
    setDialogMode("create");
    setSelectedPot(null);
    setIsPotDialogOpen(true);
  };

  const openEditDialog = (pot: Pot) => {
    setDialogMode("edit");
    setSelectedPot(pot);
    setIsPotDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsPotDialogOpen(open);
    if (!open) {
      setSelectedPot(null);
      setDialogMode("create");
    }
  };

  const initialValues = useMemo<PotFormValues | undefined>(
    () =>
      selectedPot
        ? {
            name: selectedPot.name,
            theme: selectedPot.theme,
            target: String(selectedPot.target),
          }
        : undefined,
    [selectedPot],
  );

  const handlePotSubmit = async (formData: PotFormValues) => {
    const payload = {
      name: formData.name,
      target: Number(formData.target),
      total: selectedPot?.total ?? 0,
      theme: formData.theme,
    };

    if (dialogMode === "edit" && selectedPot?.id) {
      await updatePot.mutateAsync({
        id: selectedPot.id,
        ...payload,
      });
      return;
    }

    await createPot.mutateAsync(payload);
  };

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;
  if (!data) return null;

  return (
    <div className="flex min-h-lvh flex-col bg-beige-100 px-8 pb-8 text-foreground dark:bg-background">
      <div className="mb-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <header className="flex items-center text-3xl font-semibold">
          Pots
        </header>
        <button
          className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-md bg-grey-900 text-sm text-white dark:bg-white dark:text-grey-900"
          onClick={openCreateDialog}
        >
          + Add New Pot
        </button>
      </div>
      <Dialog open={isPotDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="w-full border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {dialogMode === "edit" ? "Edit Pot" : "Add New Pot"}
          </DialogTitle>
          <PotForm
            mode={dialogMode}
            usedThemeColors={data.pots.map((pot) => pot.theme)}
            initialValues={initialValues}
            onSubmit={handlePotSubmit}
            onClose={() => handleDialogChange(false)}
          />
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        open={!!potPendingDelete}
        onOpenChange={(open) => {
          if (!open) {
            setPotPendingDelete(null);
          }
        }}
        itemName={potPendingDelete?.name ?? ""}
        itemType="pot"
        onConfirm={async () => {
          if (potPendingDelete?.id) {
            try {
              await deletePot.mutateAsync(potPendingDelete.id);
              setPotPendingDelete(null);
            } catch (error) {
              toast("Failed to delete pot.", {
                description:
                  error instanceof Error ? error.message : "Please try again.",
                position: "bottom-right",
              });
              throw error;
            }
          }
        }}
      />
      <PotBalanceDialog
        open={!!potBalanceTarget}
        onOpenChange={(open) => {
          if (!open) {
            setPotBalanceTarget(null);
          }
        }}
        mode={potBalanceMode}
        pot={potBalanceTarget}
        onConfirmAmount={async (amountDelta) => {
          if (potBalanceTarget?.id) {
            await updatePotBalance.mutateAsync({
              id: potBalanceTarget.id,
              amountDelta,
            });
          }
        }}
      />
      <div>
        <main className="grid gap-5 pb-2 md:grid-cols-2">
          {data.pots.map((pot: Pot) => {
            const percentageSaved = Math.min(
              (pot.total / pot.target) * 100,
              100,
            );

            return (
              <section
                key={pot.id ?? `${pot.name}-${pot.theme}`}
                className="rounded-2xl bg-card p-6 text-card-foreground"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="h-5 w-5 rounded-2xl border"
                    style={{ background: pot.theme }}
                  />
                  <h2 className="text-xl font-bold">{pot.name}</h2>
                  <ActionMenu
                    ariaLabel={`Open actions for ${pot.name}`}
                    items={[
                      {
                        label: "Edit Pot",
                        onClick: () => openEditDialog(pot),
                      },
                      {
                        label: "Delete Pot",
                        onClick: () => setPotPendingDelete(pot),
                        variant: "destructive",
                      },
                    ]}
                  />
                </div>

                <div className="mb-4 flex items-end justify-between">
                  <p className="text-muted-foreground">Total Saved</p>
                  <p className="text-3xl font-bold">
                    {pot.total.toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </p>
                </div>

                <Progress
                  value={pot.total}
                  maximumAmount={pot.target}
                  barColor={pot.theme}
                  className="mb-3 h-2 rounded-full bg-beige-100 p-0 dark:bg-secondary"
                />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{percentageSaved.toFixed(0)}%</span>
                  <span>
                    Target of{" "}
                    {pot.target.toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </span>
                </div>

                <div className="flex justify-around mt-4 gap-5 h-12">
                  <button
                    type="button"
                    className="flex h-full w-1/2 cursor-pointer items-center justify-center rounded-md bg-beige-100 font-bold dark:bg-secondary hover:bg-white hover:border"
                    onClick={() => {
                      setPotBalanceMode("add");
                      setPotBalanceTarget(pot);
                    }}
                  >
                    + Add Money
                  </button>
                  <button
                    type="button"
                    className="flex h-full w-1/2 cursor-pointer items-center justify-center rounded-md bg-beige-100 font-bold dark:bg-secondary hover:bg-white hover:border"
                    onClick={() => {
                      setPotBalanceMode("withdraw");
                      setPotBalanceTarget(pot);
                    }}
                  >
                    Withdraw
                  </button>
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
};

export default Pots;
