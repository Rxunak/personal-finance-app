import { Progress } from "./ui/progress";
import { Field } from "@base-ui/react";

type BudgetProps = {
  barColor: string;
  maximumAmount: number;
  barValue: number;
};

export function ProgressWithLabel({
  barColor,
  maximumAmount,
  barValue,
}: BudgetProps) {
  return (
    <Field.Root className="w-full flex flex-col gap-5">
      <Field.Label htmlFor="progress-upload" className="flex">
        <span className="text-grey-500">
          {`Maximum of ${maximumAmount.toLocaleString("en-GB", {
            style: "currency",
            currency: "GBP",
          })}`}
        </span>
      </Field.Label>
      <Progress
        value={barValue}
        id="progress-upload"
        className="bg-beige-100"
        barColor={barColor}
      />
    </Field.Root>
  );
}
