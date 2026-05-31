"use client";

import { AlertTriangle, DatabaseZap, Sparkles } from "lucide-react";

import { Button } from "@/src/components/ui/button";

export function AiPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/10 px-3 py-2 text-xs font-semibold text-green">
        <DatabaseZap className="size-4" />
        Local analysis only
      </div>
    </div>
  );
}

export function AiPageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-lvh bg-beige-100 px-4 pb-8 pt-6 text-foreground md:px-8 dark:bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
    </div>
  );
}

export function AiLoadingState() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-border/60 bg-card p-8">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Sparkles className="size-4 animate-pulse text-green" />
        Building local financial analysis...
      </div>
    </div>
  );
}

export function AiErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-red/20 bg-red/5 p-8">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 text-red" />
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-foreground">Unable to load AI analysis</h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          {onRetry ? (
            <Button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-grey-900 text-white hover:bg-grey-900/90 dark:bg-white dark:text-grey-900"
            >
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AiEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
      <h2 className="font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
