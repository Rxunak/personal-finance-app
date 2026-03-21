"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  barColor,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-10 w-full overflow-hidden rounded-sm bg-primary/10 p-1.5",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full origin-left transition-all rounded-sm"
        style={{
          transform: `scaleX(${Math.max(0, Math.min((value || 0) / 100, 1))})`,
          background: barColor,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
