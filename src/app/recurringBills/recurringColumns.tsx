"use client";

import { type Transaction } from "@/hooks/use-finance-data";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CircleCheck } from "lucide-react";
import { CircleAlert } from "lucide-react";

function getOrdinalSuffix(num: number) {
  if (num === 0) return "";

  if (num % 100 === 11 || num % 100 === 12 || num % 100 === 13) {
    return "th";
  }

  const lastDigit = num % 10;
  if (lastDigit === 1) return "st";
  if (lastDigit === 2) return "nd";
  if (lastDigit === 3) return "rd";

  return "th";
}

function appendSuffix(num: number) {
  return `${num}${getOrdinalSuffix(num)}`;
}

export const recurringColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4 font-bold">
          <img
            src={row.original.avatar}
            alt=""
            className="size-10 rounded-2xl"
          />
          {row.original.name}
        </div>
      );
    },
    header: "Bill Title",
  },

  {
    accessorKey: "date",
    cell: ({ row }) => {
      console.log(row.original.status);
      const dayOfMonth = Number(format(new Date(row.original.date), "d"));

      return (
        <div
          className={`pl-2 ${row.original.status === "paid" ? "text-green" : row.original.status === "overdue" ? "text-red" : "text-grey-500"} flex gap-1.5 items-center`}
        >
          {`Monthly-${appendSuffix(dayOfMonth)}`}
          {row.original.status === "paid" ? (
            <CircleCheck className="size-4" />
          ) : row.original.status === "overdue" ? (
            <CircleAlert className="size-4 text-red" />
          ) : (
            ""
          )}
        </div>
      );
    },
    header: () => <div className="pl-2">Due Date</div>,
  },
  {
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <p
          className={`text-sm font-bold ${row.original.status === "overdue" ? "text-red" : "text-black"}`}
        >
          {Math.abs(row.original.amount).toLocaleString("en-GB", {
            style: "currency",
            currency: "GBP",
          })}
        </p>
      );
    },
    header: () => <div className="text-right">Amount</div>,
  },
];
