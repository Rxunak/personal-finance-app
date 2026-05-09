"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFinanceData, type Pot } from "@/hooks/use-finance-data";
import { Ellipsis } from "lucide-react";
import { PotBalanceDialog } from "../components/pot-balance-dialog";
import { DeleteConfirmationDialog } from "../components/delete-confirmation-dialog";
import { PotForm, type PotFormValues } from "../components/pot-form";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import { SpinnerButton } from "../components/spinnerButton";

const Pots = () => {
  const { isPending, error, data } = useFinanceData();
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [isPotDialogOpen, setIsPotDialogOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
  const [potBalanceMode, setPotBalanceMode] = useState<"add" | "withdraw">(
    "add",
  );
  const [potBalanceTarget, setPotBalanceTarget] = useState<Pot | null>(null);
  const [potPendingDelete, setPotPendingDelete] = useState<Pot | null>(null);
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
    setSelectedPot(null);
    setIsPotDialogOpen(true);
  };

  const openEditDialog = (pot: Pot) => {
    setDialogMode("edit");
    setSelectedPot(pot);
    setOpenMenuIndex(null);
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

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;

  return (
    <div className="flex h-lvh flex-col bg-beige-100 px-8 pb-8">
      <div className="mb-8 flex flex-row justify-between pt-6">
        <header className="flex items-center text-3xl font-semibold">
          Pots
        </header>
        <button
          className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-md bg-black text-sm text-white"
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
        onConfirm={() => setPotPendingDelete(null)}
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
      />

      <div className="flex-1 overflow-y-auto">
        <main className="grid grid-cols-2 gap-5 pb-2">
          {data.pots.map((pot: Pot, index: number) => {
            const percentageSaved = Math.min(
              (pot.total / pot.target) * 100,
              100,
            );

            return (
              <section
                key={`${pot.name}-${index}`}
                className="rounded-2xl bg-white p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="h-5 w-5 rounded-2xl border"
                    style={{ background: pot.theme }}
                  />
                  <h2 className="text-xl font-bold">{pot.name}</h2>
                  <div
                    className="relative ml-auto"
                    ref={openMenuIndex === index ? menuRef : null}
                  >
                    <button
                      type="button"
                      className="flex cursor-pointer items-center justify-center rounded-full p-1 text-grey-500 transition-colors hover:bg-beige-100"
                      aria-label={`Open actions for ${pot.name}`}
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
                          onClick={() => openEditDialog(pot)}
                        >
                          Edit Pot
                        </button>
                        <div className="mx-4 h-px bg-grey-100" />
                        <button
                          type="button"
                          className="flex w-full cursor-pointer items-center px-5 py-4 text-left text-lg text-red transition-colors hover:bg-red/5"
                          onClick={() => {
                            setPotPendingDelete(pot);
                            setOpenMenuIndex(null);
                          }}
                        >
                          Delete Pot
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4 flex items-end justify-between">
                  <p className="text-grey-500">Total Saved</p>
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
                  className="mb-3 h-2 rounded-full bg-beige-100 p-0"
                />

                <div className="flex justify-between text-sm text-grey-500">
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
                    className="flex h-full w-1/2 cursor-pointer items-center justify-center rounded-md bg-beige-100 font-bold"
                    onClick={() => {
                      setPotBalanceMode("add");
                      setPotBalanceTarget(pot);
                    }}
                  >
                    + Add Money
                  </button>
                  <button
                    type="button"
                    className="flex h-full w-1/2 cursor-pointer items-center justify-center rounded-md bg-beige-100 font-bold"
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
