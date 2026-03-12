"use client";
import React, { useEffect, useState, useMemo } from "react";
import { SearchBar } from "../components/searchBar";
import { ComboboxCon } from "../components/comboboxCon";
import { sortBy, category, TransactionArray } from "../constants";
import { columns } from "../app/transactions/columns";
import { DataTable } from "../app/transactions/data-table";
import { SpinnerButton } from "../components/spinnerButton";
import { useFinanceData } from "../../hooks/use-finance-data";
import { PaginationComponent } from "../components/pagination";

const Transaction = () => {
  const { isPending, error, data } = useFinanceData();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState("");

  const transactions = useMemo(() => {
    return data?.transactions ?? [];
  }, [data]);

  const filterdTransaction = useMemo(() => {
    if (
      selectedCategory.length === 0 ||
      selectedCategory === "All transactions"
    ) {
      return transactions;
    }

    return transactions.filter(
      (item: { category: string }) => item.category === selectedCategory,
    );
  }, [transactions, selectedCategory]);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filterdTransaction.slice(firstItemIndex, lastItemIndex);

  const categoryFil = (items: string) => {
    setSelectedCategory(items);
  };

  const sortByFil = () => {
    console.log("h");
  };

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
              <ComboboxCon
                options={sortBy}
                onSelect={sortByFil}
                width="100px"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <p className="text-base text-grey-500">Category</p>{" "}
              <ComboboxCon
                options={category}
                onSelect={categoryFil}
                width="160px"
              />
            </div>
          </div>
        </div>
        <div className="h-auto overflow-scroll">
          <DataTable columns={columns} data={currentItems} />
        </div>
        <div className="mt-auto">
          <PaginationComponent
            totalItems={data.transactions.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
};

export default Transaction;
