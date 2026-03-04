"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";

type ComboboxConProps = {
  options: string[];
  width: string;
};

export function ComboboxCon({ options, width }: ComboboxConProps) {
  return (
    <Combobox items={options}>
      <ComboboxInput
        placeholder={options[0]}
        className={`h-12 w-[${width}] border border-beige-500 `}
      />
      <ComboboxContent className="text-beige-500">
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item} className="text-beige-500">
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
