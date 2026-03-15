import { Progress } from "./ui/progress";
import { Field, FieldLabel } from "@base-ui/react";

export function ProgressWithLabel() {
  return (
    <Field.Root className="w-full flex flex-col gap-5">
      <Field.Label htmlFor="progress-upload" className="flex">
        <span className="text-grey-500">Maximum of $50.00</span>
      </Field.Label>
      <Progress value={50} id="progress-upload" />
    </Field.Root>
  );
}
