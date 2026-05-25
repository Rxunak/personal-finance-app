"use client";

import { useEffect, useId, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "sonner";
import * as z from "zod";
import { category } from "../constants";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { InputGroup } from "./ui/input-group";
import { ComboboxCon } from "./comboboxCon";

const transactionFormSchema = z.object({
  name: z.string().min(1, "Recipient / sender is required."),
  category: z.string().min(1, "Category is required."),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .regex(/^\d+(\.\d+)?$/, "Amount must be a valid number."),
  date: z.string().min(1, "Date is required."),
  type: z.enum(["income", "expense"]),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

type TransactionFormProps = {
  initialValues?: TransactionFormValues;
  onSubmit?: (data: TransactionFormValues) => void;
  onClose?: () => void;
};

const transactionCategories = category.filter(
  (item) => item !== "All transactions",
);

const emptyValues: TransactionFormValues = {
  name: "",
  category: "",
  amount: "",
  date: format(new Date(), "yyyy-MM-dd"),
  type: "expense",
};

export function TransactionForm({
  initialValues,
  onSubmit,
  onClose,
}: TransactionFormProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formId = useId();
  const resolvedInitialValues = initialValues ?? emptyValues;
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: resolvedInitialValues,
  });

  useEffect(() => {
    form.reset(resolvedInitialValues);
  }, [form, resolvedInitialValues]);

  const handleSubmit = (data: TransactionFormValues) => {
    onSubmit?.(data);
    toast("Transaction updated with the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    });
    onClose?.();
  };

  return (
    <Card
      ref={cardRef}
      className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 sm:max-w-md"
    >
      <CardHeader className="p-0">
        <CardTitle className="text-3xl font-bold">Edit Transaction</CardTitle>
        <CardDescription className="text-xs">
          Update the transaction details and keep the ledger consistent.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form id={formId} onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={`${formId}-name`}>
                    Recipient / Sender
                  </FieldLabel>
                  <InputGroup className="h-full w-full">
                    <Input
                      id={`${formId}-name`}
                      aria-invalid={fieldState.invalid}
                      className="h-12 border-beige-500"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={`${formId}-category`}>Category</FieldLabel>
                  <ComboboxCon
                    options={transactionCategories}
                    value={field.value}
                    onSelect={field.onChange}
                    portalContainer={cardRef.current}
                    width="100%"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={`${formId}-date`}>Date</FieldLabel>
                  <InputGroup className="h-full w-full">
                    <Input
                      id={`${formId}-date`}
                      type="date"
                      aria-invalid={fieldState.invalid}
                      className="h-12 border-beige-500"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={`${formId}-amount`}>Amount</FieldLabel>
                  <InputGroup className="h-full w-full">
                    <Input
                      id={`${formId}-amount`}
                      inputMode="decimal"
                      aria-invalid={fieldState.invalid}
                      className="h-12 border-beige-500"
                      value={field.value}
                      onChange={(event) => {
                        const sanitizedValue = event.target.value
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*)\./g, "$1");

                        field.onChange(sanitizedValue);
                      }}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={`${formId}-type`}>Type</FieldLabel>
                  <ComboboxCon
                    options={[
                      { label: "Expense", value: "expense" },
                      { label: "Income", value: "income" },
                    ]}
                    value={field.value}
                    onSelect={(value) => field.onChange(value)}
                    portalContainer={cardRef.current}
                    width="100%"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="p-0">
        <Button type="submit" form={formId} className="h-12 w-full cursor-pointer">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
