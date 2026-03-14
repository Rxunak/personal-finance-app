"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../components/ui/command";
import { Calculator, Calendar, Smile } from "lucide-react";
import { useFinanceData } from "../../hooks/use-finance-data";
import { useEffect, useState } from "react";

type SearchBarProps = {
  setQuery: any;
  query: string;
};

export function SearchBar({ setQuery, query }: SearchBarProps) {
  //   const { data } = useFinanceData();
  //   const [query, setQuery] = useState("");
  //   const [searchData, setSearchData] = useState<any[]>([]);

  //   useEffect(() => {
  //     setSearchData(data?.transactions ?? []);
  //   }, [data?.transactions]);

  //   const filtered = searchData.filter((item: any) =>
  //     item.name.toLowerCase().includes(query.toLocaleLowerCase()),
  //   );

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
          filtered.length ? (
            <CommandGroup heading="Transactions">
              {filtered.map((item: any, index: number) => (
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
