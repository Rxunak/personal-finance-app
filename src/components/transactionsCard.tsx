"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";

import IconCaret from "../icons/icon-caret-right.svg";

type TransactionSummaryItem = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
};

type TransactionSummaryCardProps = {
  transactionData: TransactionSummaryItem[];
  backgroundColor?: string;
  sliceAmount?: number;
  title?: string;
  budgetCard?: boolean;
};

export default function TransactionsCard({
  transactionData,
  backgroundColor,
  sliceAmount,
  title,
  budgetCard,
}: TransactionSummaryCardProps) {
  const router = useRouter();

  return (
    <section className={`rounded-2xl bg-${backgroundColor}`}>
      <div className="flex justify-between p-6 pb-0">
        <h1 className="text-xl font-bold">{title}</h1>
        <button
          type="button"
          className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
          onClick={() => router.push("/transactions")}
        >
          View all <IconCaret />
        </button>
      </div>
      <div className="pl-6 pr-6 pb-6 overflow-auto h-auto">
        {transactionData
          .slice(0, sliceAmount)
          .map((transaction: any, index: number) => (
            <div
              key={index}
              className="border-b last:border-none pb-5 last:pb-0 pt-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={transaction.avatar}
                  width={40}
                  height={40}
                  alt="ProfileImage"
                  className="rounded-full"
                />
                <p className="text-sm font-bold">{transaction.name}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <p
                  className={`text-sm font-bold ${Math.sign(transaction.amount) === 1 ? "text-green" : "text-black"}`}
                >
                  {Math.sign(transaction.amount) === 1
                    ? `+${transaction.amount.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}`
                    : transaction.amount.toLocaleString("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      })}
                </p>
                <p className="text-xs">
                  {format(new Date(transaction.date), "d MMM yyy")}
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
