"use client";
import React from "react";
import IconCaret from "../icons/icon-caret-right.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChartPieDonut } from "../components/pieChart";

const Overview = () => {
  const router = useRouter();
  return (
    <div className="p-8 flex flex-col gap-7 bg-beige-100">
      <div className="text-3xl font-semibold">Overview</div>
      <div className="flex gap-4 justify-between">
        <div className="w-1/2 h-30 rounded-2xl bg-grey-900 flex flex-col justify-center p-7 gap-3 text-white">
          <p className="text-sm">Current Balance</p>
          <p className="text-3xl font-bold">$4,836.00</p>
        </div>
        <div className="w-1/2 h-30 rounded-2xl bg-white flex flex-col justify-center p-7 gap-3">
          <p className="text-sm">Current Balance</p>
          <p className="text-3xl font-bold">$3,814.00</p>
        </div>
        <div className="w-1/2 h-30 rounded-2xl bg-white flex flex-col justify-center p-7 gap-3">
          <p className="text-sm">Current Balance</p>
          <p className="text-3xl font-bold">$1,700.00</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <section className="rounded-2xl bg-white p-8">
            <div className="flex justify-between mb-5">
              <h1 className="text-xl font-bold">Pots</h1>
              <span
                className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
                onClick={() => router.push("/pots")}
              >
                See Details <IconCaret />
              </span>
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
                  Total Saved{" "}
                  <p className="text-black font-bold text-3xl">$850</p>
                </span>
              </div>
              <div className="grid grid-cols-2 auto-rows-fr gap-4 h-full grow-3">
                <span className="flex h-full">
                  <span className="border-l-4 border-green rounded-xs w-1 self-stretch"></span>
                  <div className="flex flex-col gap-1">
                    <p className="text-grey-500 text-sm  pl-4">Savings</p>
                    <p className="text-black font-bold pl-4">$159</p>
                  </div>
                </span>
                <span className="flex h-full">
                  <span className="border-l-4 border-cyan rounded-xs w-1 self-stretch"></span>
                  <div className="flex flex-col gap-1">
                    <p className="text-grey-500 text-sm  pl-4">Gifts</p>
                    <p className="text-black font-bold pl-4">$40</p>
                  </div>
                </span>
                <span className="flex h-full">
                  <span className="border-l-4 border-grey-500 rounded-xs w-1 self-stretch"></span>
                  <div className="flex flex-col gap-1">
                    <p className="text-grey-500 text-sm  pl-4">
                      Concert Ticket
                    </p>
                    <p className="text-black font-bold pl-4">$55</p>
                  </div>
                </span>
                <span className="flex h-full">
                  <span className="border-l-4 border-yellow rounded-xs w-1 self-stretch"></span>
                  <div className="flex flex-col gap-1">
                    <p className="text-grey-500 text-sm  pl-4">New Laptop</p>
                    <p className="text-black font-bold pl-4">$170</p>
                  </div>
                </span>
              </div>
            </div>
          </section>
          <section className="rounded-2xl bg-white">
            <div className="flex justify-between p-6">
              <h1 className="text-xl font-bold">Transactions</h1>
              <span
                className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
                onClick={() => router.push("/transactions")}
              >
                View all <IconCaret />
              </span>
            </div>
            <div className="pl-6 pr-6 pb-6 overflow-auto h-70">
              <div className="border-b mb-5 pb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/avatars/emma-richardson.jpg"
                    width={40}
                    height={40}
                    alt="ProfileImage"
                    className="rounded-full"
                  />
                  <p className="text-sm font-bold">Emma Richardson</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <p className="text-sm font-bold">+$75.50</p>
                  <p className="text-xs">19 Aug 2024</p>
                </div>
              </div>
              <div className="border-b mb-5 pb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/avatars/emma-richardson.jpg"
                    width={40}
                    height={40}
                    alt="ProfileImage"
                    className="rounded-full"
                  />
                  <p className="text-sm font-bold">Emma Richardson</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <p className="text-sm font-bold">+$75.50</p>
                  <p className="text-xs">19 Aug 2024</p>
                </div>
              </div>
              <div className="border-b mb-5 pb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/avatars/emma-richardson.jpg"
                    width={40}
                    height={40}
                    alt="ProfileImage"
                    className="rounded-full"
                  />
                  <p className="text-sm font-bold">Emma Richardson</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <p className="text-sm font-bold">+$75.50</p>
                  <p className="text-xs">19 Aug 2024</p>
                </div>
              </div>
              <div className="border-b mb-5 pb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/avatars/emma-richardson.jpg"
                    width={40}
                    height={40}
                    alt="ProfileImage"
                    className="rounded-full"
                  />
                  <p className="text-sm font-bold">Emma Richardson</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <p className="text-sm font-bold">+$75.50</p>
                  <p className="text-xs">19 Aug 2024</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="space-y-4 lg:col-span-5">
          <section className="rounded-2xl bg-white p-8 h-90">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold">Budgets</h1>
              <span
                className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
                onClick={() => router.push("/budget")}
              >
                See Details <IconCaret />
              </span>
            </div>
            <div className="flex justify-between h-full">
              <div className="w-full max-w-80">
                <ChartPieDonut />
              </div>
              <div>
                <div className="flex flex-col gap-5 h-full justify-center">
                  <span className="flex h-auto">
                    <span className="border-l-4 border-green rounded-xs w-1 h-13 self-stretch"></span>
                    <div className="flex flex-col gap-1 justify-center">
                      <p className="text-grey-500 text-xs  pl-4">
                        Entertainment
                      </p>
                      <p className="text-black font-bold pl-4">$50.00</p>
                    </div>
                  </span>
                  <span className="flex h-auto">
                    <span className="border-l-4 border-cyan rounded-xs w-1 self-stretch"></span>
                    <div className="flex flex-col gap-1 justify-center">
                      <p className="text-grey-500 text-xs  pl-4">Bills</p>
                      <p className="text-black font-bold pl-4">$750.00</p>
                    </div>
                  </span>
                  <span className="flex h-auto">
                    <span className="border-l-4 border-grey-500 rounded-xs w-1 self-stretch"></span>
                    <div className="flex flex-col gap-1 justify-center">
                      <p className="text-grey-500 text-xs  pl-4">Dining Out</p>
                      <p className="text-black font-bold pl-4">$75.00</p>
                    </div>
                  </span>
                  <span className="flex h-auto">
                    <span className="border-l-4 border-yellow rounded-xs w-1 self-stretch"></span>
                    <div className="flex flex-col gap-1 justify-center">
                      <p className="text-grey-500 text-xs  pl-4">
                        Personal Care
                      </p>
                      <p className="text-black font-bold pl-4">$100.00</p>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section className="rounded-2xl bg-white">
            <div className="flex justify-between mb-5 p-6">
              <h1 className="text-xl font-bold">Budgets</h1>
              <span
                className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer"
                onClick={() => router.push("/budget")}
              >
                See Details <IconCaret />
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Overview;
