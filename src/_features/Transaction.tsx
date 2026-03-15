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
  const [selectedSortAction, setSelectedSortAction] = useState("");
  const [query, setQuery] = useState("");

  const transactions = useMemo(() => {
    return data?.transactions ?? [];
  }, [data]);

  const actionedTransactions = useMemo(() => {
    let results = [...transactions];

    if (query.trim()) {
      results = results.filter((item: { name: string }) =>
        item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      );
    }

    if (selectedCategory && selectedCategory !== "All transactions") {
      results = results.filter(
        (item: { category: string }) => item.category === selectedCategory,
      );
    }

    switch (selectedSortAction) {
      case "Latest":
        results = results.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "Oldest":
        results = results.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        break;
      case "A to Z":
        results = results.sort((a: any, b: any) =>
          a.name.localeCompare(b.name),
        );
        break;
      case "Z to A":
        results = results.sort((a: any, b: any) =>
          b.name.localeCompare(a.name),
        );
        break;
      case "Highest":
        results = results.sort((a: any, b: any) => b.amount - a.amount);
        break;
      case "Lowest":
        results = results.sort((a: any, b: any) => a.amount - b.amount);
        break;

      default:
        break;
    }

    return results;
  }, [query, selectedCategory, transactions, selectedSortAction]);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = actionedTransactions.slice(
    firstItemIndex,
    lastItemIndex,
  );

  const categoryFil = (items: string) => {
    setSelectedCategory(items);
  };

  const sortByFil = (items: string) => {
    setSelectedSortAction(items);
  };

  const setQueryValue = (value: string) => {
    setQuery(value);
  };

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;
  return (
    <div className="bg-beige-100 pl-8 pr-8">
      <header className="text-3xl font-semibold pt-6 mb-8">Transactions</header>
      <section className="bg-white p-8 flex flex-col gap-7 h-185 rounded-2xl">
        <div className="flex justify-between">
          <div className="w-sm">
            <SearchBar
              setQuery={setQuery}
              query={query}
              actionedTransactions={actionedTransactions}
            />
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
