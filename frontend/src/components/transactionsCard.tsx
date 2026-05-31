"use client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";

import IconCaret from "../icons/icon-caret-right.svg";

type TransactionSummaryItem = {
  id?: string;
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

const backgroundClassNameMap: Record<string, string> = {
  white: "bg-card text-card-foreground",
  "beige-100": "bg-beige-100 dark:bg-secondary text-card-foreground",
};

export default function TransactionsCard({
  transactionData,
  backgroundColor,
  sliceAmount,
  title,
}: TransactionSummaryCardProps) {
  const router = useRouter();
  const backgroundClassName = backgroundColor
    ? backgroundClassNameMap[backgroundColor] ?? "bg-card text-card-foreground"
    : "bg-card text-card-foreground";

  return (
    <section className={`rounded-2xl ${backgroundClassName}`}>
      <div className="flex justify-between p-6 pb-0">
        <h1 className="text-xl font-bold">{title}</h1>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-4 text-sm text-muted-foreground"
          onClick={() => router.push("/transactions")}
        >
          View all <IconCaret />
        </button>
      </div>
      <div className="pl-6 pr-6 pb-6 overflow-auto h-auto">
        {transactionData
          .slice(0, sliceAmount)
          .map((transaction) => (
            <div
              key={
                transaction.id ??
                `${transaction.name}-${transaction.date}-${transaction.amount}`
              }
              className="flex items-center justify-between border-b border-border pb-5 pt-6 last:border-none last:pb-0"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={transaction.avatar}
                  width={40}
                  height={40}
                  alt="ProfileImage"
                  className="rounded-full"
                />
                <p className="text-sm font-bold text-foreground">{transaction.name}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <p
                  className={`text-sm font-bold ${Math.sign(transaction.amount) === 1 ? "text-green" : "text-foreground"}`}
                >
                  {Math.sign(transaction.amount) === 1
                    ? `+${transaction.amount.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}`
                    : transaction.amount.toLocaleString("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.date), "d MMM yyy")}
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
