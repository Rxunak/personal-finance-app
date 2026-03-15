import React from "react";

const Budget = () => {
  return (
    <div className="bg-beige-100 pl-8 pr-8">
      <div className="flex flex-row justify-between pt-6">
        <header className="text-3xl font-semibold flex items-center">
          Budgets
        </header>
        <button className="flex border h-12 w-40 items-center justify-center rounded-md bg-black text-white text-sm cursor-pointer">
          + Add New Budget
        </button>
      </div>
    </div>
  );
};

export default Budget;
