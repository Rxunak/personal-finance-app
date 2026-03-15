"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-10 w-full overflow-hidden rounded-sm bg-primary/20 p-1.5",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full origin-left bg-primary transition-all rounded-sm"
        style={{ transform: `scaleX(${Math.max(0, Math.min((value || 0) / 100, 1))})` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
