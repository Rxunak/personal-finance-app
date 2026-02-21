"use client";
import React from "react";
import IconCaret from "../icons/icon-caret-right.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChartPieDonut } from "../components/pieChart";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const Overview = () => {
  const router = useRouter();

  const { isPending, error, data } = useQuery({
    queryKey: ["overviewData"],
    queryFn: () => fetch("/data.json").then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occured: " + error.message;

  //Data Extraction for Pots
  const savingPot = data.pots.find((item: any) => item.name === "Savings");

  data.transactions.slice(0, 5).map((item) => {
    if (Math.sign(item.amount) === 1) {
      console.log(`+${item.amount}`);
    } else if (Math.sign(item.amount) === -1) {
      console.log(item.amount);
    }
  });

  return (
    <div className="pl-8 pr-8 flex flex-col gap-7 bg-beige-100">
      <div className="text-3xl font-semibold pt-6">Overview</div>
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
        <div className="h-25 rounded-2xl bg-white flex flex-col justify-center p-7 gap-3">
          <p className="text-sm">Income</p>
          <p className="text-3xl font-bold">
            {" "}
            {data.balance.income.toLocaleString("en-US", {
              style: "currency",
              currency: "GBP",
            })}
          </p>
        </div>
        <div className="h-25 rounded-2xl bg-white flex flex-col justify-center p-7 gap-3">
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <section className="rounded-2xl bg-white p-8">
            <div className="flex justify-between mb-5">
              <h1 className="text-xl font-bold">Pots</h1>
              <button
                type="button"
                className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
                onClick={() => router.push("/pots")}
              >
                See Details <IconCaret />
              </button>
            </div>
            <div className="flex justify-start gap-10 h-30">
              <div className="bg-beige-100 min-w-70 h-full rounded-xl flex gap-5 items-center pl-5 grow-5">
                <Image
                  src="/images/icon-pot.svg"
                  width={25}
                  height={25}
                  alt="PotIcon"
                />
                <span className="text-sm text-grey-500 flex flex-col gap-2.5">
                  {savingPot.name}{" "}
                  <p className="text-black font-bold text-3xl">
                    {savingPot.total.toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </p>
                </span>
              </div>
              <div className="grid grid-cols-2 auto-rows-fr gap-4 h-full grow-3">
                {data.pots.slice(0, 4).map((pot: any, index: number) => (
                  <span key={index} className="flex h-full">
                    <span
                      className="border-l-4 rounded-xs w-1 self-stretch"
                      style={{ borderLeftColor: pot.theme }}
                    ></span>
                    <div className="flex flex-col gap-1">
                      <p className="text-grey-500 text-sm  pl-4">{pot.name}</p>
                      <p className="text-black font-bold pl-4">
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
          <section className="rounded-2xl bg-white">
            {/* h-95 overflow-auto */}
            <div className="flex justify-between p-6">
              <h1 className="text-xl font-bold">Transactions</h1>
              <button
                type="button"
                className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
                onClick={() => router.push("/transactions")}
              >
                View all <IconCaret />
              </button>
            </div>
            <div className="pl-6 pr-6 pb-6 overflow-auto h-76">
              {data.transactions
                .slice(0, 5)
                .map((transaction: any, index: number) => (
                  <div
                    key={index}
                    className="border-b mb-5 pb-5 flex items-center justify-between"
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
        </div>
        <div className="space-y-4 lg:col-span-5">
          <section className="rounded-2xl bg-white p-8">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold">Budgets</h1>
              <button
                type="button"
                className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
                onClick={() => router.push("/budget")}
              >
                See Details <IconCaret />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-evenly">
              <div className="w-full max-w-60 mx-auto lg:mx-0">
                <ChartPieDonut />
              </div>
              <div>
                <div className="flex flex-col gap-5 h-full justify-center">
                  {data.budgets.map((budget: any, index: number) => (
                    <span key={index} className="flex h-auto">
                      <span
                        className="border-l-4 rounded-xs w-1 h-13 self-stretch"
                        style={{ borderLeftColor: budget.theme }}
                      ></span>
                      <div className="flex flex-col gap-1 justify-center">
                        <p className="text-grey-500 text-xs  pl-4">
                          {budget.category}
                        </p>
                        <p className="text-black font-bold pl-4">
                          {budget.maximum.toLocaleString("en-GB", {
                            style: "currency",
                            currency: "GBP",
                          })}
                        </p>
                      </div>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="rounded-2xl bg-white h-59">
            {/* h-46 overflow-auto */}
            <div className="flex justify-between p-6">
              <h1 className="text-xl font-bold">Recurring Bills</h1>
              <button
                type="button"
                className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
                onClick={() => router.push("/recurringBills")}
              >
                See Details <IconCaret />
              </button>
            </div>
            <div className="px-6 pb-6 flex flex-col gap-2.5 h-40 overflow-y-auto">
              <div className="shrink-0 bg-beige-100 flex justify-between px-6 h-15 rounded-xl items-center text-sm text-gray-500 border-l-[5px] border-green">
                <p>Paid Bills</p>
                <p className="font-bold text-black">$190.00</p>
              </div>

              <div className="shrink-0 bg-beige-100 flex justify-between px-6 h-15 rounded-xl items-center text-sm text-gray-500 border-l-[5px] border-yellow">
                <p>Total Upcoming</p>
                <p className="font-bold text-black">$190.00</p>
              </div>

              <div className="shrink-0 bg-beige-100 flex justify-between px-6 h-15 rounded-xl items-center text-sm text-gray-500 border-l-[5px] border-cyan">
                <p>Due Soon</p>
                <p className="font-bold text-black">$190.00</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Overview;
