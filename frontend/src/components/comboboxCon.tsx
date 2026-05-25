"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import { InputGroupAddon } from "./ui/input-group";

export type ComboboxOption = {
  label: string;
  value: string;
  color?: string;
  disabled?: boolean;
};

type ComboboxConProps = {
  options: Array<string | ComboboxOption>;
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
  const [open, setOpen] = useState(false);
  const normalizedOptions: ComboboxOption[] = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );

  const [internalValue, setInternalValue] = useState<string | null>(
    value ?? null,
  );
  const selectedValue = value ?? internalValue;
  const selectedOption = normalizedOptions.find(
    (option) => option.value === selectedValue,
  );

  const handleSelect = (item: string) => {
    if (value === undefined) {
      setInternalValue(item);
    }
    onSelect?.(item);
  };

  return (
    <div style={{ width }}>
      <Combobox
        items={normalizedOptions}
        open={open}
        value={selectedValue}
        inputValue={open ? "" : (selectedOption?.label ?? "")}
        onOpenChange={setOpen}
        onInputValueChange={() => {}}
        onValueChange={(value) => {
          if (value) {
            handleSelect(value);
          }
        }}
      >
        <ComboboxInput
          placeholder={
            selectedOption?.label ??
            normalizedOptions[0]?.label ??
            "Select an option"
          }
          readOnly
          className="h-12 cursor-pointer border border-beige-500"
        >
          {selectedOption?.color && (
            <InputGroupAddon align="inline-start">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: selectedOption.color }}
              />
            </InputGroupAddon>
          )}
        </ComboboxInput>
        <ComboboxContent
          container={portalContainer ?? undefined}
          className="text-beige-500"
        >
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem
                key={item.value}
                value={item.value}
                className="text-beige-500 cursor-pointer"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    handleSelect(item.value);
                  }
                }}
              >
                <OptionContent item={item} />
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

function OptionContent({ item }: { item: ComboboxOption }) {
  const content: ReactNode = (
    <>
      {item.color && (
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: item.color }}
        />
      )}
      <span>{item.label}</span>
      {item.disabled && (
        <span className="ml-auto text-xs text-grey-500">Already used</span>
      )}
    </>
  );

  return <span className="flex w-full items-center gap-3">{content}</span>;
}
