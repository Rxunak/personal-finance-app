"use client";
import IconCaret from "../icons/icon-caret-right.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addDays, isAfter } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { SpinnerButton } from "../components/spinnerButton";
import { type Pot, type Transaction } from "@/hooks/use-finance-data";
import { useOverviewData } from "@/hooks/use-overview-data";
import BudgetSummaryCard from "../components/budget-summary-card";
import TransactionsCard from "../components/transactionsCard";
import { buildFinanceAiReport } from "@/lib/financial-ai";
import { AiPreviewCard } from "../components/ai/ai-primitives";

const Overview = () => {
  const [recurringArray, setRecurringArray] = useState<Transaction[]>([]);
  const router = useRouter();

  const { isPending, error, data } = useOverviewData();

  const filteredTransactions = useMemo(
    () => data?.transactions?.filter((item) => item.recurring) ?? [],
    [data?.transactions],
  );
  const aiPreview = useMemo(
    () => (data ? buildFinanceAiReport(data).previewInsights : []),
    [data],
  );

  useEffect(() => {
    setRecurringArray(filteredTransactions);
  }, [filteredTransactions]);

  const paidBills = recurringArray
    .filter((item) => item.status === "paid")
    .reduce((sum: number, item) => sum + Math.abs(Number(item.amount)), 0);

  const upcomingBills = recurringArray
    .filter(
      (item) =>
        item.status !== "paid" &&
        item.dueDate &&
        isAfter(new Date(item.dueDate), new Date()),
    )
    .reduce((sum: number, item) => sum + Math.abs(Number(item.amount)), 0);

  const dueSoonBiils = recurringArray
    .filter(
      (item) =>
        item.status !== "paid" &&
        item.dueDate &&
        isAfter(new Date(item.dueDate), addDays(new Date(), 7)),
    )
    .reduce((sum: number, item) => sum + Math.abs(Number(item.amount)), 0);

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;

  //Data Extraction for Pots
  const savingPot =
    data.pots.find((item) => item.name === "Savings") ?? data.pots[0];

  return (
    <div className="flex min-h-lvh flex-col gap-7 bg-beige-100 px-8 pb-8 text-foreground dark:bg-background">
      <div className="pt-6 text-3xl font-semibold">Dashboard</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-25 rounded-2xl bg-grey-900 flex flex-col justify-center p-7 gap-3 text-white">
          <p className="text-sm">Current Balance</p>
          <p className="text-3xl font-bold">
            {data.balance.current.toLocaleString("en-US", {
              style: "currency",
              currency: "GBP",
            })}
          </p>
        </div>
        <div className="h-25 rounded-2xl bg-card flex flex-col justify-center gap-3 p-7 text-card-foreground">
          <p className="text-sm">Income</p>
          <p className="text-3xl font-bold">
            {" "}
            {data.balance.income.toLocaleString("en-US", {
              style: "currency",
              currency: "GBP",
            })}
          </p>
        </div>
        <div className="h-25 rounded-2xl bg-card flex flex-col justify-center gap-3 p-7 text-card-foreground">
          <p className="text-sm">Expenses</p>
          <p className="text-3xl font-bold">
            {" "}
            {data.balance.expenses.toLocaleString("en-US", {
              style: "currency",
              currency: "GBP",
            })}
          </p>
        </div>
      </div>
      {aiPreview.length ? <AiPreviewCard insights={aiPreview} /> : null}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <section className="rounded-2xl bg-card p-8 text-card-foreground">
            <div className="flex justify-between mb-5">
              <h1 className="text-xl font-bold">Pots</h1>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-4 text-sm text-muted-foreground"
                onClick={() => router.push("/pots")}
              >
                See Details <IconCaret />
              </button>
            </div>
            <div className="flex flex-col justify-start gap-6 lg:flex-row lg:gap-10">
              <div className="bg-beige-100 dark:bg-secondary flex min-h-30 min-w-70 grow-5 items-center gap-5 rounded-xl pl-5">
                <Image
                  src="/images/icon-pot.svg"
                  width={25}
                  height={25}
                  alt="PotIcon"
                />
                <span className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                  <h1>Total Saved</h1>
                  <p className="text-3xl font-bold text-foreground">
                    {savingPot.total.toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </p>
                </span>
              </div>
              <div className="grid grow-3 grid-cols-1 gap-4 sm:grid-cols-2 auto-rows-fr">
                {data.pots.slice(0, 4).map((pot: Pot, index: number) => (
                  <span key={index} className="flex h-full">
                    <span
                      className="border-l-4 rounded-xs w-1 self-stretch"
                      style={{ borderLeftColor: pot.theme }}
                    ></span>
                    <div className="flex flex-col gap-1">
                      <p className="pl-4 text-sm text-muted-foreground">{pot.name}</p>
                      <p className="pl-4 font-bold text-foreground">
                        {pot.total.toLocaleString("en-GB", {
                          style: "currency",
                          currency: "GBP",
                        })}
                      </p>
                    </div>
                  </span>
                ))}
              </div>
            </div>
          </section>
          <TransactionsCard
            title={"Transactions"}
            transactionData={data.transactions}
            backgroundColor={"white"}
            sliceAmount={5}
          />
        </div>
        <div className="space-y-4 lg:col-span-5">
          <BudgetSummaryCard
            budgets={data.budgets}
            onAction={() => router.push("/budgets")}
          />
          <section className="rounded-2xl bg-card text-card-foreground">
            {/* h-46 overflow-auto */}
            <div className="flex justify-between p-6">
              <h1 className="text-xl font-bold">Recurring Bills</h1>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-4 text-sm text-muted-foreground"
                onClick={() => router.push("/recurringBills")}
              >
                See Details <IconCaret />
              </button>
            </div>
            <div className="flex flex-col gap-2.5 px-6 pb-6">
              <div className="shrink-0 bg-beige-100 dark:bg-secondary flex h-15 items-center justify-between rounded-xl border-l-[5px] border-green px-6 text-sm text-muted-foreground">
                <p>Paid Bills</p>
                <p className="font-bold text-foreground">
                  {paidBills.toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                </p>
              </div>

              <div className="shrink-0 bg-beige-100 dark:bg-secondary flex h-15 items-center justify-between rounded-xl border-l-[5px] border-yellow px-6 text-sm text-muted-foreground">
                <p>Total Upcoming</p>
                <p className="font-bold text-foreground">
                  {upcomingBills.toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                </p>
              </div>

              <div className="shrink-0 bg-beige-100 dark:bg-secondary flex h-15 items-center justify-between rounded-xl border-l-[5px] border-cyan px-6 text-sm text-muted-foreground">
                <p>Due Soon</p>
                <p className="font-bold text-foreground">
                  {dueSoonBiils.toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Overview;
