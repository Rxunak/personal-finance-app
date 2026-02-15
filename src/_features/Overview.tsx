import React from "react";

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
          <p className="text-3xl font-bold">$4,836.00</p>
        </div>
        <div className="w-1/2 h-30 rounded-2xl bg-white flex flex-col justify-center p-7 gap-3">
          <p className="text-sm">Current Balance</p>
          <p className="text-3xl font-bold">$4,836.00</p>
        </div>
      </div>
      <div>
        <div>A</div>
        <div>B</div>
        <div>C</div>
        <div>D</div>
      </div>
    </div>
  );
};

export default Overview;
