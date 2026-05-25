"use client";
import { useState, useMemo } from "react";
import { SearchBar } from "../components/searchBar";
import { ComboboxCon } from "../components/comboboxCon";
import { sortBy, category } from "../constants";
import { getTransactionColumns } from "../app/transactions/columns";
import { DataTable } from "../components/data-table";
import { SpinnerButton } from "../components/spinnerButton";
import { type Transaction as TransactionItem } from "@/hooks/use-finance-data";
import { useLocalFinanceData } from "@/hooks/use-local-finance-data";
import { PaginationComponent } from "../components/pagination";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import {
  TransactionForm,
  type TransactionFormValues,
} from "../components/transaction-form";
import { DeleteConfirmationDialog } from "../components/delete-confirmation-dialog";

const Transaction = () => {
  const { isPending, error, data, upsertTransaction, deleteTransaction } =
    useLocalFinanceData();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSortAction, setSelectedSortAction] = useState("");
  const [query, setQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionItem | null>(null);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactionPendingDelete, setTransactionPendingDelete] =
    useState<TransactionItem | null>(null);

  const transactions = useMemo(() => {
    return data?.transactions ?? [];
  }, [data]);

  const columns = useMemo(
    () =>
      getTransactionColumns({
        onEdit: (transaction) => {
          setSelectedTransaction(transaction);
          setIsTransactionDialogOpen(true);
        },
        onDelete: (transaction) => {
          setTransactionPendingDelete(transaction);
        },
      }),
    [],
  );

  const actionedTransactions = useMemo(() => {
    let results = [...transactions];

    if (query.trim()) {
      results = results.filter((item: TransactionItem) =>
        item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      );
    }

    if (selectedCategory && selectedCategory !== "All transactions") {
      results = results.filter(
        (item: TransactionItem) => item.category === selectedCategory,
      );
    }

    switch (selectedSortAction) {
      case "Latest":
        results = results.sort(
          (a: TransactionItem, b: TransactionItem) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "Oldest":
        results = results.sort(
          (a: TransactionItem, b: TransactionItem) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        break;
      case "A to Z":
        results = results.sort((a: TransactionItem, b: TransactionItem) =>
          a.name.localeCompare(b.name),
        );
        break;
      case "Z to A":
        results = results.sort((a: TransactionItem, b: TransactionItem) =>
          b.name.localeCompare(a.name),
        );
        break;
      case "Highest":
        results = results.sort(
          (a: TransactionItem, b: TransactionItem) => b.amount - a.amount,
        );
        break;
      case "Lowest":
        results = results.sort(
          (a: TransactionItem, b: TransactionItem) => a.amount - b.amount,
        );
        break;

      default:
        break;
    }

    return results;
  }, [query, selectedCategory, transactions, selectedSortAction]);

  const totalPages = Math.max(
    1,
    Math.ceil(actionedTransactions.length / itemsPerPage),
  );
  const effectiveCurrentPage = Math.min(currentPage, totalPages);
  const lastItemIndex = effectiveCurrentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = actionedTransactions.slice(
    firstItemIndex,
    lastItemIndex,
  );

  const categoryFil = (items: string) => {
    setCurrentPage(1);
    setSelectedCategory(items);
  };

  const sortByFil = (items: string) => {
    setCurrentPage(1);
    setSelectedSortAction(items);
  };

  const initialValues = useMemo<TransactionFormValues | undefined>(
    () =>
      selectedTransaction
        ? {
            name: selectedTransaction.name,
            category: selectedTransaction.category,
            amount: String(Math.abs(selectedTransaction.amount)),
            date: selectedTransaction.date.slice(0, 10),
            type: selectedTransaction.amount >= 0 ? "income" : "expense",
          }
        : undefined,
    [selectedTransaction],
  );

  const handleTransactionSubmit = (formData: TransactionFormValues) => {
    if (!selectedTransaction) {
      return;
    }

    const numericAmount = Number(formData.amount);

    upsertTransaction({
      id: selectedTransaction.id,
      avatar: selectedTransaction.avatar,
      name: formData.name,
      category: formData.category,
      amount: formData.type === "income" ? numericAmount : -numericAmount,
      date: new Date(`${formData.date}T12:00:00Z`).toISOString(),
      recurring: selectedTransaction.recurring,
      dueDate: selectedTransaction.dueDate ?? null,
      status: selectedTransaction.status ?? null,
      paidDate: selectedTransaction.paidDate ?? null,
    });
  };

  if (isPending) return <SpinnerButton />;

  if (error) return "An error has occured: " + error.message;
  if (!data) return null;
  return (
    <div className="bg-beige-100 pl-8 pr-8">
      <header className="text-3xl font-semibold pt-6 mb-8">Transactions</header>
      <Dialog
        open={isTransactionDialogOpen}
        onOpenChange={(open) => {
          setIsTransactionDialogOpen(open);
          if (!open) {
            setSelectedTransaction(null);
          }
        }}
      >
        <DialogContent className="w-full border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Edit Transaction</DialogTitle>
          <TransactionForm
            initialValues={initialValues}
            onSubmit={handleTransactionSubmit}
            onClose={() => setIsTransactionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        open={!!transactionPendingDelete}
        onOpenChange={(open) => {
          if (!open) {
            setTransactionPendingDelete(null);
          }
        }}
        itemName={transactionPendingDelete?.name ?? ""}
        itemType="transaction"
        onConfirm={() => {
          if (transactionPendingDelete?.id) {
            deleteTransaction(transactionPendingDelete.id);
          }
          setTransactionPendingDelete(null);
        }}
      />
      <section className="bg-white p-8 flex flex-col gap-7 h-185 rounded-2xl">
        <div className="flex justify-between">
          <div className="w-sm">
            <SearchBar
              setQuery={(value: string) => {
                setCurrentPage(1);
                setQuery(value);
              }}
              query={query}
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
        <div className="h-auto overflow-scroll no-scrollbar">
          <DataTable columns={columns} data={currentItems} />
        </div>
        <div className="mt-auto">
          <PaginationComponent
            totalItems={actionedTransactions.length}
            itemsPerPage={itemsPerPage}
            currentPage={effectiveCurrentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
};

export default Transaction;
