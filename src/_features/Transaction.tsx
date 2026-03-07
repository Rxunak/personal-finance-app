"use client";
import React from "react";
import { SearchBar } from "../components/searchBar";
import { Combobox } from "../components/ui/combobox";
import { ComboboxCon } from "../components/comboboxCon";
import { sortBy, category, payments } from "../constants";
import { columns, Payment } from "../app/transactions/columns";
import { DataTable } from "../app/transactions/data-table";
import { SpinnerButton } from "../components/spinnerButton";
import { useFinanceData } from "../../hooks/use-finance-data";

const Transaction = () => {
  const { isPending, error, data } = useFinanceData();

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;
  return (
    <div className="bg-beige-100 pl-8 pr-8 outline">
      <header className="text-3xl font-semibold pt-6 mb-8">Transactions</header>
      <section className="bg-white p-8 flex flex-col gap-7 h-185 rounded-2xl">
        <div className="flex justify-between">
          <div className="w-sm">
            <SearchBar />
          </div>
          <div className="flex justify-end gap-10 w-xl ">
            <div className="flex items-center gap-1.5">
              <p className="text-base text-grey-500">Sort by</p>{" "}
              <ComboboxCon options={sortBy} width="100px" />
            </div>

            <div className="flex items-center gap-1.5">
              <p className="text-base text-grey-500">Category</p>{" "}
              <ComboboxCon options={category} width="160px" />
            </div>
          </div>
        </div>
        <div className="h-auto overflow-scroll">
          <DataTable columns={columns} data={data.transactions} />
        </div>
        <div className="outline">An</div>
      </section>
    </div>
  );
};

export default Transaction;
