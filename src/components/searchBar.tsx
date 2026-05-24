"use client";

import { Command, CommandInput } from "../components/ui/command";

type SearchBarProps = {
  setQuery: (value: string) => void;
  query: string;
};

export function SearchBar({ setQuery, query }: SearchBarProps) {
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
