"use client";

import React, { useMemo, useState } from "react";
import { ReceiptPoundSterling } from "lucide-react";
import { DataTable } from "../components/data-table";
import { recurringColumns } from "../app/recurringBills/recurringColumns";
import { type Transaction } from "@/hooks/use-finance-data";
import { SpinnerButton } from "../components/spinnerButton";
import { ComboboxCon } from "../components/comboboxCon";
import { sortBy } from "../constants";
import { SearchBar } from "../components/searchBar";
import { useOverviewData } from "@/hooks/use-overview-data";

const RecurringBills = () => {
  const [selectedSortAction, setSelectedSortAction] = useState("");
  const [query, setQuery] = useState("");
  const { isPending, error, data } = useOverviewData();

  const transactions = useMemo(() => {
    return data?.transactions ?? [];
  }, [data]);

  const filteredRecurring = useMemo(() => {
    let newResults = [...transactions];

    newResults = newResults.filter(
      (item: Transaction) => item.recurring === true,
    );

    if (query.trim()) {
      newResults = newResults.filter((item: Transaction) =>
        item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      );
    }

    switch (selectedSortAction) {
      case "Latest":
        newResults = [...newResults].sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "Oldest":
        newResults = [...newResults].sort(
          (a: Transaction, b: Transaction) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        break;
      case "A to Z":
        newResults = [...newResults].sort((a: Transaction, b: Transaction) =>
          a.name.localeCompare(b.name),
        );
        break;
      case "Z to A":
        newResults = [...newResults].sort((a: Transaction, b: Transaction) =>
          b.name.localeCompare(a.name),
        );
        break;
      case "Highest":
        newResults = [...newResults].sort(
          (a: Transaction, b: Transaction) => b.amount - a.amount,
        );
        break;
      case "Lowest":
        newResults = [...newResults].sort(
          (a: Transaction, b: Transaction) => a.amount - b.amount,
        );
        break;
      default:
        break;
    }

    return newResults;
  }, [query, selectedSortAction, transactions]);

  const recurringSummary = useMemo(() => {
    const recurringTransactions = transactions.filter(
      (item) => item.recurring === true,
    );

    const paid = recurringTransactions.filter((item) => item.status === "paid");

    const upcoming = recurringTransactions.filter(
      (item) => item.status === "unpaid" || item.status === "overdue",
    );

    const dueSoon = recurringTransactions.filter(
      (item) => item.status === "overdue",
    );

    const sumAmounts = (items: Transaction[]) =>
      items.reduce((sum, item) => {
        const amount = Number(item.amount);
        return sum + Math.abs(Number(amount));
      }, 0);

    return {
      totalBills: sumAmounts(recurringTransactions),
      paidCount: paid.length,
      paidTotal: sumAmounts(paid),
      upcomingCount: upcoming.length,
      upcomingTotal: sumAmounts(upcoming),
      dueSoonCount: dueSoon.length,
      dueSoonTotal: sumAmounts(dueSoon),
    };
  }, [transactions]);

  const sortByFil = (items: string) => {
    setSelectedSortAction(items);
  };

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;

  return (
    <div className="flex min-h-lvh flex-col gap-7 bg-beige-100 px-8 pb-8 text-foreground dark:bg-background">
      <div className="pt-6 text-3xl font-semibold">Recurring Bills</div>

      <div className="flex gap-5">
        <div className="h-full w-2/5 flex flex-col gap-10">
          <div className="bg-grey-900 rounded-xl p-8 flex flex-col gap-12 text-white dark:bg-white dark:text-grey-900">
            <ReceiptPoundSterling className="size-12" />
            <div>
              <h1 className="mb-4">Total Bills</h1>
              <span className="font-bold text-5xl">
                {recurringSummary.totalBills.toLocaleString("en-GB", {
                  style: "currency",
                  currency: "GBP",
                })}
              </span>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-8 text-card-foreground">
            <h1 className="text-2xl font-bold">Summary</h1>
            <div className="flex justify-between border-b border-border pt-6 pb-6">
              <h1 className="text-muted-foreground">Paid Biils</h1>
              <h1 className="font-bold">
                {recurringSummary.paidCount} (
                {recurringSummary.paidTotal.toLocaleString("en-GB", {
                  style: "currency",
                  currency: "GBP",
                })}
                )
              </h1>
            </div>
            <div className="flex justify-between border-b border-border pt-6 pb-6">
              <h1 className="text-muted-foreground ">Total Upcoming</h1>
              <h1 className="font-bold">
                {recurringSummary.upcomingCount} (
                {recurringSummary.upcomingTotal.toLocaleString("en-GB", {
                  style: "currency",
                  currency: "GBP",
                })}
                )
              </h1>
            </div>
            <div className="flex justify-between pt-6">
              <h1 className="text-red">Due Soon</h1>
              <h1 className="text-red font-bold">
                {recurringSummary.dueSoonCount} (
                {recurringSummary.dueSoonTotal.toLocaleString("en-GB", {
                  style: "currency",
                  currency: "GBP",
                })}
                )
              </h1>
            </div>
          </div>
        </div>
        <div className="bg-card text-card-foreground h-180 w-3/5 overflow-auto rounded-2xl p-8 no-scrollbar">
          <div className="flex justify-between mb-10">
            <SearchBar setQuery={setQuery} query={query} />
            <ComboboxCon options={sortBy} onSelect={sortByFil} width="100px" />
          </div>

          <div>
            <DataTable columns={recurringColumns} data={filteredRecurring} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringBills;
