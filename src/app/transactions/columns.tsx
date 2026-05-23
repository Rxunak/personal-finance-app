"use client";

import { type Transaction } from "@/hooks/use-finance-data";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<Transaction>[] = [
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
    header: "Recipient / Sender",
  },
  {
    accessorKey: "category",
    header: () => <div className="pl-2">Category</div>,
    cell: ({ row }) => {
      return <div className="text-grey-500">{row.original.category}</div>;
    },
  },
  {
    accessorKey: "date",
    cell: ({ row }) => {
      return (
        <div className="text-grey-500">
          {format(new Date(row.original.date), "d MMM yyy")}
        </div>
      );
    },
    header: () => <div className="pl-2">Tranction Date</div>,
  },
  {
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <p
          className={`text-sm font-bold ${Math.sign(row.original.amount) === 1 ? "text-green" : "text-black"}`}
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
