import React from "react";
import IconCaret from "../icons/icon-caret-right.svg";
import PotIcon from "../icons/icon-pot.svg";
import Image from "next/image";

const Overview = () => {
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
      <div className="grid grid-cols-20 gap-4">
        <div className="col-span-11 rounded-2xl bg-white p-8 ">
          <div className="flex justify-between mb-5">
            <h1 className="text-xl font-bold">Pots</h1>
            <span className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer">
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
                  <p className="text-grey-500 text-sm  pl-4">Concert Ticket</p>
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
        </div>
        <div className="col-span-9 rounded-2xl bg-white">B</div>
        <div className="col-span-11 rounded-2xl bg-white">C</div>
        <div className="col-span-9 rounded-2xl bg-white">D</div>
      </div>
    </div>
  );
};

export default Overview;
