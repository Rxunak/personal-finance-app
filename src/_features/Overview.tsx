import React from "react";
import IconCaret from "../icons/icon-caret-right.svg";

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
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 rounded-2xl bg-white p-8 ">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">Pots</h1>
            <span className="flex items-center gap-4 text-sm text-grey-500 cursor-pointer">
              See Details <IconCaret />
            </span>
          </div>
          <div></div>
        </div>
        <div className="col-span-2 rounded-2xl bg-white">B</div>
        <div className="col-span-3 rounded-2xl bg-white">C</div>
        <div className="col-span-2 rounded-2xl bg-white">D</div>
      </div>
    </div>
  );
};

export default Overview;
