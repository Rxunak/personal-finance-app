"use client";

import { Command, CommandInput } from "../components/ui/command";

type SearchBarProps = {
  setQuery: any;
  query: string;
  actionedTransactions: any[];
};

export function SearchBar({
  setQuery,
  query,
  actionedTransactions,
}: SearchBarProps) {
  return (
    <Command className="max-w-sm rounded-md">
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder={"Search transactions"}
        className="text-black text-base"
      />
    </Command>
  );
}
