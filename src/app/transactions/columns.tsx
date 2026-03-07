"use client";

import { category } from "@/src/constants";
import { ColumnDef } from "@tanstack/react-table";
import { format, addDays, isAfter } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  avatar: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  recurring: boolean;
};

export const columns: ColumnDef<Payment>[] = [
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
          {Math.sign(row.original.amount) === 1
            ? `+${row.original.amount.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}`
            : row.original.amount.toLocaleString("en-GB", {
                style: "currency",
                currency: "GBP",
              })}
        </p>
      );
    },
    header: () => <div className="text-right">Amount</div>,
  },
];
