"use client";

import { useState } from "react";

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
  onSelect?: (item: string) => void;
  value?: string;
  portalContainer?: HTMLElement | null;
};

export function ComboboxCon({
  options,
  width,
  onSelect,
  value,
  portalContainer,
}: ComboboxConProps) {
  const [internalValue, setInternalValue] = useState<string | null>(
    value ?? null,
  );
  const selectedValue = value ?? internalValue;

  const handleSelect = (item: string) => {
    if (value === undefined) {
      setInternalValue(item);
    }
    onSelect?.(item);
  };

  return (
    <div style={{ width }}>
      <Combobox
        items={options}
        value={selectedValue}
        onValueChange={(value) => {
          if (value) {
            handleSelect(value);
          }
        }}
      >
        <ComboboxInput
          placeholder={options[0]}
          readOnly
          className="h-12 cursor-pointer border border-beige-500"
        />
        <ComboboxContent
          container={portalContainer ?? undefined}
          className="text-beige-500"
        >
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem
                key={item}
                value={item}
                className="text-beige-500 cursor-pointer"
                onClick={() => handleSelect(item)}
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
