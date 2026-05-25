import React from "react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="flex flex-col bg-grey-900 rounded-r-2xl min-h-screen">
      <Link href="/">Overview</Link>
      <Link href="/transactions">Transactions</Link>
      <Link href="/budget">Budgets</Link>
      <Link href="/pots">Pots</Link>
      <Link href="/recurringBills">Recurring Bills</Link>
    </div>
  );
};

export default Sidebar;
