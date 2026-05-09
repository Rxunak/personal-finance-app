"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

type PotBalanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "withdraw";
  pot: {
    name: string;
    total: number;
    target: number;
    theme: string;
  } | null;
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}

export function PotBalanceDialog({
  open,
  onOpenChange,
  mode,
  pot,
}: PotBalanceDialogProps) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) {
      setAmount("");
    }
  }, [open]);

  const numericAmount = Number(amount || 0);
  const currentTotal = pot?.total ?? 0;
  const targetAmount = pot?.target ?? 1;
  const nextTotal =
    mode === "add"
      ? currentTotal + numericAmount
      : Math.max(currentTotal - numericAmount, 0);
  const percentageSaved = Math.min((nextTotal / targetAmount) * 100, 100);
  const progressTextColor = mode === "add" ? "text-green" : "text-red";
  const confirmLabel =
    mode === "add" ? "Confirm Addition" : "Confirm Withdrawal";
  const amountLabel = mode === "add" ? "Amount to Add" : "Amount to Withdraw";
  const title =
    mode === "add"
      ? `Add to '${pot?.name ?? ""}'`
      : `Withdraw from '${pot?.name ?? ""}'`;
  const description =
    mode === "add"
      ? "Add money to this pot to keep building toward your savings goal."
      : "Withdraw money from this pot if you need it now. You can always add more later.";

  const placeholder = mode === "add" ? "400" : "20";

  const handleConfirm = () => {
    toast(
      mode === "add"
        ? "Pot updated with the following addition:"
        : "Pot updated with the following withdrawal:",
      {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
            <code>
              {JSON.stringify(
                {
                  pot: pot?.name ?? "",
                  amount,
                  newTotal: nextTotal,
                },
                null,
                2,
              )}
            </code>
          </pre>
        ),
        position: "bottom-right",
      },
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] rounded-2xl border-none bg-white p-7 shadow-none sm:max-w-[46rem]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <DialogTitle className="pr-12 text-3xl font-bold text-neutral-900">
              {title}
            </DialogTitle>
            <DialogDescription className="max-w-[37rem] text-base leading-7 text-grey-500">
              {description}
            </DialogDescription>
          </div>

          <div className="flex items-end justify-between">
            <span className="text-xl text-grey-500">New Amount</span>
            <span className="text-5xl font-bold text-neutral-900">
              {formatCurrency(nextTotal)}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Progress
              value={nextTotal}
              maximumAmount={targetAmount}
              barColor={pot?.theme ?? "#277C78"}
              className="h-2 rounded-full bg-beige-100 p-0"
            />
            <div className="flex items-center justify-between text-sm">
              <span className={`font-bold ${progressTextColor}`}>
                {percentageSaved.toFixed(2)}%
              </span>
              <span className="text-grey-500">
                Target of {formatCurrency(targetAmount)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-grey-500">
              {amountLabel}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg text-grey-500">
                $
              </span>
              <Input
                value={amount}
                placeholder={placeholder}
                inputMode="decimal"
                className="h-12 border-beige-500 pl-10 text-base"
                onChange={(event) => {
                  const sanitizedValue = event.target.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");

                  setAmount(sanitizedValue);
                }}
              />
            </div>
          </div>

          <Button
            type="button"
            className="h-12 w-full cursor-pointer rounded-xl bg-grey-900 text-base font-bold text-white hover:bg-grey-900/90"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
