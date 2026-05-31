"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useFinancialAi } from "@/hooks/use-financial-ai";
import { compactCurrency, getInsightGroupLabel, type FinanceAiInsight, type InsightGroup } from "@/lib/financial-ai";
import {
  AiEmptyState,
  AiErrorState,
  AiLoadingState,
  AiPageContainer,
  AiPageHeader,
} from "@/src/components/ai/ai-states";
import {
  AreaTrendCard,
  InsightCard,
  MetricCard,
  RecommendationList,
  SectionCard,
} from "@/src/components/ai/ai-primitives";
import { Input } from "@/src/components/ui/input";

const groupOptions: Array<{ label: string; value: InsightGroup | "all" }> = [
  { label: "All", value: "all" },
  { label: "Trends", value: "trends" },
  { label: "Warnings", value: "warnings" },
  { label: "Savings", value: "savings" },
  { label: "Habits", value: "habits" },
  { label: "Observations", value: "observations" },
  { label: "Achievements", value: "achievements" },
  { label: "Actions", value: "actions" },
];

type SortOption = "priority" | "impact" | "title";

const sortInsights = (items: FinanceAiInsight[], sortBy: SortOption) => {
  const nextItems = [...items];

  switch (sortBy) {
    case "impact":
      return nextItems.sort((left, right) => right.sortValue - left.sortValue);
    case "title":
      return nextItems.sort((left, right) => left.title.localeCompare(right.title));
    case "priority":
    default:
      return nextItems.sort((left, right) => right.priority - left.priority);
  }
};

const AICoach = () => {
  const { report, isPending, error, refetch } = useFinancialAi();
  const [selectedGroup, setSelectedGroup] = useState<InsightGroup | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredInsights = useMemo(() => {
    if (!report) {
      return [];
    }

    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const baseItems =
      selectedGroup === "all"
        ? report.insights
        : report.insights.filter((insight) => insight.group === selectedGroup);

    const searchedItems = normalizedQuery
      ? baseItems.filter((insight) => {
          const combined = `${insight.title} ${insight.summary} ${insight.detail}`.toLowerCase();
          return combined.includes(normalizedQuery);
        })
      : baseItems;

    return sortInsights(searchedItems, sortBy);
  }, [deferredQuery, report, selectedGroup, sortBy]);

  const groupedInsights = useMemo(() => {
    const groups = new Map<InsightGroup, FinanceAiInsight[]>();

    for (const insight of filteredInsights) {
      const current = groups.get(insight.group) ?? [];
      current.push(insight);
      groups.set(insight.group, current);
    }

    return groups;
  }, [filteredInsights]);

  if (isPending) {
    return (
      <AiPageContainer>
        <AiPageHeader
          title="AI Coach"
          description="Local, privacy-first coaching generated from your transaction, budget, and savings data."
        />
        <AiLoadingState />
      </AiPageContainer>
    );
  }

  if (error || !report) {
    return (
      <AiPageContainer>
        <AiPageHeader
          title="AI Coach"
          description="Local, privacy-first coaching generated from your transaction, budget, and savings data."
        />
        <AiErrorState
          message={error?.message ?? "No analysis is available yet."}
          onRetry={() => void refetch()}
        />
      </AiPageContainer>
    );
  }

  return (
    <AiPageContainer>
      <AiPageHeader
        title="AI Coach"
        description="Review grouped spending trends, warnings, savings opportunities, and concrete next actions without crowding the main dashboard."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Current health score"
          value={`${report.health.score}/100`}
          detail="Blended from budget discipline, savings momentum, recurring commitments, and current cashflow."
          emphasis
        />
        <MetricCard
          label="Insight cards"
          value={String(report.insights.length)}
          detail="Prioritised signals generated from local financial activity."
        />
        <MetricCard
          label="Savings opportunities"
          value={compactCurrency(
            report.topSavingsOpportunities.reduce((sum, item) => sum + item.amount, 0),
          )}
          detail="Largest opportunities currently surfaced by the AI analysis layer."
        />
      </div>

      <SectionCard className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Insights Explorer</h2>
            <p className="text-sm text-muted-foreground">
              Filter by coaching category, search specific concerns, and sort by urgency or impact.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search insights"
              className="h-11 rounded-xl border-border bg-background"
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground"
            >
              <option value="priority">Sort by priority</option>
              <option value="impact">Sort by impact</option>
              <option value="title">Sort by title</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {groupOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedGroup(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedGroup === option.value
                  ? "bg-grey-900 text-white dark:bg-white dark:text-grey-900"
                  : "bg-beige-100 text-grey-900 dark:bg-secondary dark:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </SectionCard>

      {filteredInsights.length === 0 ? (
        <AiEmptyState
          title="No insights match the current filters"
          description="Try broadening the search or switching to a different coaching group."
        />
      ) : (
        <div className="space-y-6">
          {[...groupedInsights.entries()].map(([group, items]) => (
            <div key={group} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{getInsightGroupLabel(group)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {items.length} insight{items.length === 1 ? "" : "s"} in this group
                  </p>
                </div>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {items.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <AreaTrendCard
          title="Monthly cashflow observations"
          description="Income, expenses, and net position are summarized from local transactions only."
          data={report.monthlyCashflow}
          dataKey="net"
          formatter={(value) => compactCurrency(value)}
        />
        <RecommendationList
          items={report.topSavingsOpportunities.map((item) => ({
            title: item.label,
            detail: item.detail,
            amount: compactCurrency(item.amount),
          }))}
          emptyText="No immediate savings opportunities are being highlighted right now."
        />
      </div>
    </AiPageContainer>
  );
};

export default AICoach;
