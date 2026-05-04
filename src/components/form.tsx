"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { budgetCategory, budgetThemes } from "../constants";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field";

import { InputGroup } from "../components/ui/input-group";
import { Input } from "./ui/input";
import { ComboboxCon, type ComboboxOption } from "./comboboxCon";

const createFormSchema = (usedThemeColors: string[]) =>
  z.object({
    title: z
      .string()
      .min(1, "Budget is required.")
      .max(32, "Budget must be at most 32 characters."),
    theme: z
      .string()
      .min(1, "Theme is required.")
      .max(32, "Theme must be at most 32 characters.")
      .refine(
        (value) => !usedThemeColors.includes(value),
        "This theme has already been used.",
      ),
    maximumSpend: z
      .string()
      .min(1, "Maximum spend is required.")
      .max(32, "Maximum spend must be at most 32 characters.")
      .regex(/^\d+(\.\d+)?$/, "Maximum spend must be a valid number."),
  });

type BudgetFormProps = {
  usedThemeColors: string[];
};

export function BudgetForm({ usedThemeColors }: BudgetFormProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formSchema = createFormSchema(usedThemeColors);
  const themeOptions: ComboboxOption[] = budgetThemes.map((theme) => ({
    ...theme,
    disabled: usedThemeColors.includes(theme.value),
  }));
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      theme: "",
      maximumSpend: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }

  return (
    <Card
      ref={cardRef}
      className="w-full sm:max-w-md bg-white p-6 rounded-2xl flex flex-col gap-5"
    >
      <CardHeader className="p-0">
        <CardTitle className="text-3xl font-bold">Add New Budget</CardTitle>
        <CardDescription className="text-xs">
          Choose a category to set a spending budget. These categories can help
          you monitor spending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Budget Category
                  </FieldLabel>
                  <ComboboxCon
                    options={budgetCategory}
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
              name="maximumSpend"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-maximum-spend">
                    Maximum Spend
                  </FieldLabel>
                  <InputGroup className="w-full h-full">
                    <Input
                      id="form-rhf-demo-maximum-spend"
                      placeholder="£ e.g. 2000"
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
              name="theme"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="form-rhf-demo-theme">Theme</FieldLabel>
                  <ComboboxCon
                    options={themeOptions}
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="p-0">
        <Field orientation="horizontal" className="w-full">
          <Button type="submit" form="form-rhf-demo" className="h-12 w-full">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
