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
  onSelect: (item: string) => void;
};

export function ComboboxCon({ options, width, onSelect }: ComboboxConProps) {
  return (
    <div style={{ width }}>
      <Combobox items={options}>
        <ComboboxInput
          placeholder={options[0]}
          className="h-12 border border-beige-500"
        />
        <ComboboxContent className="text-beige-500">
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem
                key={item}
                value={item}
                className="text-beige-500"
                onClick={() => onSelect(item)}
              >
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
