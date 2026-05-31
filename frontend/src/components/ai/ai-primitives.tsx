"use client";

import { ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { compactCurrency, getInsightGroupLabel, type FinanceAiInsight } from "@/lib/financial-ai";
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";

export function SectionCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border/60 bg-card p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  emphasis = false,
}: {
  label: string;
  value: string;
  detail?: string;
  emphasis?: boolean;
}) {
  return (
    <SectionCard
      className={cn(
        "space-y-2",
        emphasis && "border-grey-900 bg-grey-900 text-white dark:border-white dark:bg-white dark:text-grey-900",
      )}
    >
      <p className={cn("text-sm", emphasis ? "text-white/70 dark:text-grey-500" : "text-muted-foreground")}>
        {label}
      </p>
      <p className="text-3xl font-bold">{value}</p>
      {detail ? (
        <p className={cn("text-sm", emphasis ? "text-white/80 dark:text-grey-500" : "text-muted-foreground")}>
          {detail}
        </p>
      ) : null}
    </SectionCard>
  );
}

export function InsightCard({ insight }: { insight: FinanceAiInsight }) {
  return (
    <SectionCard className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
              insight.tone === "warning"
                ? "bg-red/10 text-red"
                : insight.tone === "success"
                  ? "bg-green/10 text-green"
                  : "bg-beige-100 text-grey-900 dark:bg-secondary dark:text-foreground",
            )}
          >
            {getInsightGroupLabel(insight.group)}
          </span>
          <h2 className="text-lg font-bold text-foreground">{insight.title}</h2>
        </div>
        <div className="rounded-2xl bg-beige-100 px-3 py-2 text-right dark:bg-secondary">
          <p className="text-xs text-muted-foreground">{insight.metricLabel}</p>
          <p className="font-semibold text-foreground">{insight.metricValue}</p>
        </div>
      </div>
      <p className="text-sm text-foreground">{insight.summary}</p>
      <p className="mt-auto text-sm text-muted-foreground">{insight.detail}</p>
    </SectionCard>
  );
}

export function AiPreviewCard({ insights }: { insights: FinanceAiInsight[] }) {
  return (
    <SectionCard className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">AI Insights Preview</p>
          <h2 className="mt-1 text-xl font-bold text-foreground">Key signals from your local data</h2>
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-xl border-border bg-transparent"
        >
          <Link href="/ai-coach">
            Open AI Coach
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-2xl bg-beige-100 p-4 dark:bg-secondary"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {getInsightGroupLabel(insight.group)}
            </p>
            <p className="pt-2 font-semibold text-foreground">{insight.title}</p>
            <p className="pt-2 text-sm text-muted-foreground">{insight.summary}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function AreaTrendCard({
  title,
  description,
  data,
  dataKey,
  stroke = "#277C78",
  fill = "#277C78",
  formatter,
}: {
  title: string;
  description: string;
  data: Array<Record<string, number | string>>;
  dataKey: string;
  stroke?: string;
  fill?: string;
  formatter?: (value: number) => string;
}) {
  return (
    <SectionCard className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`${dataKey}-gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fill} stopOpacity={0.3} />
                <stop offset="95%" stopColor={fill} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={(value: number) => compactCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => formatter?.(value) ?? compactCurrency(value)}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid var(--border)",
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              fill={`url(#${dataKey}-gradient)`}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

export function RecommendationList({
  items,
  emptyText,
}: {
  items: Array<{ title: string; detail: string; amount?: string }>;
  emptyText: string;
}) {
  if (!items.length) {
    return (
      <SectionCard>
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="space-y-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex items-start justify-between gap-4 rounded-2xl bg-beige-100 p-4 dark:bg-secondary"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-green" />
              <p className="font-semibold text-foreground">{item.title}</p>
            </div>
            <p className="text-sm text-muted-foreground">{item.detail}</p>
          </div>
          {item.amount ? (
            <p className="shrink-0 text-sm font-semibold text-foreground">{item.amount}</p>
          ) : null}
        </div>
      ))}
    </SectionCard>
  );
}
