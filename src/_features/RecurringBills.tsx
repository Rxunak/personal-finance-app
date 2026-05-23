import React from "react";
import { ReceiptPoundSterling } from "lucide-react";

const RecurringBills = () => {
  return (
    <div className="pl-8 pr-8 flex flex-col gap-7 bg-beige-100 h-lvh">
      <div className="text-3xl font-semibold pt-6">Recurring Biils</div>

      <div className="flex gap-5">
        <div className="h-full w-2/5">
          <div className="bg-black rounded-xl p-8 flex flex-col gap-12">
            <ReceiptPoundSterling className="text-white size-12" />
            <div>
              <h1 className="text-white mb-4">Total Bills</h1>
              <span className="text-white font-bold text-5xl">£384.98</span>
            </div>
          </div>
          <div></div>
        </div>
        <div className="border border-black h-full w-3/5">Search Biils</div>
      </div>
    </div>
  );
};

export default RecurringBills;
