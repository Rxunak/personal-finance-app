"use client";

import { useEffect, useId, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { budgetThemes } from "../constants";

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
import { ComboboxCon, type ComboboxOption } from "./comboboxCon";
import { InputGroup } from "./ui/input-group";
import { Input } from "./ui/input";

const createFormSchema = (usedThemeColors: string[], currentTheme?: string) =>
  z.object({
    name: z
      .string()
      .min(1, "Pot name is required.")
      .max(32, "Pot name must be at most 32 characters."),
    target: z
      .string()
      .min(1, "Target is required.")
      .max(32, "Target must be at most 32 characters.")
      .regex(/^\d+(\.\d+)?$/, "Target must be a valid number."),
    theme: z
      .string()
      .min(1, "Theme is required.")
      .max(32, "Theme must be at most 32 characters.")
      .refine(
        (value) => value === currentTheme || !usedThemeColors.includes(value),
        "This theme has already been used.",
      ),
  });

export type PotFormValues = {
  name: string;
  target: string;
  theme: string;
};

type PotFormProps = {
  mode: "create" | "edit";
  usedThemeColors: string[];
  initialValues?: PotFormValues;
  onSubmit?: (data: PotFormValues) => void;
  onClose?: () => void;
};

const emptyValues: PotFormValues = {
  name: "",
  target: "",
  theme: "",
};

export function PotForm({
  mode,
  usedThemeColors,
  initialValues,
  onSubmit,
  onClose,
}: PotFormProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formId = useId();
  const resolvedInitialValues = initialValues ?? emptyValues;
  const formSchema = createFormSchema(
    usedThemeColors,
    mode === "edit" ? resolvedInitialValues.theme : undefined,
  );
  const themeOptions: ComboboxOption[] = budgetThemes.map((theme) => ({
    ...theme,
    disabled:
      usedThemeColors.includes(theme.value) &&
      theme.value !== resolvedInitialValues.theme,
  }));

  const form = useForm<PotFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: resolvedInitialValues,
  });

  useEffect(() => {
    form.reset(resolvedInitialValues);
  }, [form, resolvedInitialValues]);

  function handleSubmit(data: PotFormValues) {
    onSubmit?.(data);
    toast(
      mode === "edit"
        ? "Pot updated with the following values:"
        : "You submitted the following values:",
      {
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
      },
    );
    onClose?.();
  }

  return (
    <Card
      ref={cardRef}
      className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 sm:max-w-md"
    >
      <CardHeader className="p-0">
        <CardTitle className="text-3xl font-bold">
          {mode === "edit" ? "Edit Pot" : "Add New Pot"}
        </CardTitle>
        <CardDescription className="text-xs">
          {mode === "edit"
            ? "If your saving targets change, feel free to update your pot details."
            : "Create a pot to set savings aside for a specific goal."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id={formId} onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={`${formId}-name`}>Pot Name</FieldLabel>
                  <InputGroup className="h-full w-full">
                    <Input
                      id={`${formId}-name`}
                      placeholder="e.g Rainy Days"
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
              name="target"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={`${formId}-target`}>Target</FieldLabel>
                  <InputGroup className="h-full w-full">
                    <Input
                      id={`${formId}-target`}
                      placeholder="e.g. 2000"
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
                  <FieldLabel htmlFor={`${formId}-theme`}>Theme</FieldLabel>
                  <ComboboxCon
                    options={themeOptions}
                    value={field.value}
                    onSelect={field.onChange}
                    portalContainer={cardRef.current}
                    width="100%"
                    align="center"
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
          <Button
            type="submit"
            form={formId}
            className="h-12 w-full cursor-pointer"
          >
            {mode === "edit" ? "Save Changes" : "Add Pot"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
