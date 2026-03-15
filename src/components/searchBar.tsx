"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";

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
      {/* <CommandList>
        {query.trim() ? (
          actionedTransactions.length ? (
            <CommandGroup heading="Transactions">
              {actionedTransactions.map((item: any, index: number) => (
                <CommandItem key={index}>
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )
        ) : null}
      </CommandList> */}
    </Command>
  );
}
