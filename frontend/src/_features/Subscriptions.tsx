"use client";

import { format } from "date-fns";

import { useFinancialAi } from "@/hooks/use-financial-ai";
import { compactCurrency } from "@/lib/financial-ai";
import {
  AiEmptyState,
  AiErrorState,
  AiLoadingState,
  AiPageContainer,
  AiPageHeader,
} from "@/src/components/ai/ai-states";
import {
  AreaTrendCard,
  MetricCard,
  RecommendationList,
  SectionCard,
} from "@/src/components/ai/ai-primitives";

const statusStyles = {
  active: "bg-green/10 text-green",
  watch: "bg-yellow/30 text-grey-900 dark:text-foreground",
  cancel: "bg-red/10 text-red",
} as const;

const Subscriptions = () => {
  const { report, isPending, error, refetch } = useFinancialAi();

  if (isPending) {
    return (
      <AiPageContainer>
        <AiPageHeader
          title="Subscriptions"
          description="Detect recurring subscription-style spending, review its impact, and identify likely cancellation opportunities."
        />
        <AiLoadingState />
      </AiPageContainer>
    );
  }

  if (error || !report) {
    return (
      <AiPageContainer>
        <AiPageHeader
          title="Subscriptions"
          description="Detect recurring subscription-style spending, review its impact, and identify likely cancellation opportunities."
        />
        <AiErrorState
          message={error?.message ?? "No subscription analysis is available yet."}
          onRetry={() => void refetch()}
        />
      </AiPageContainer>
    );
  }

  const items = report.subscriptions.items;

  return (
    <AiPageContainer>
      <AiPageHeader
        title="Subscriptions"
        description="Recurring charges are detected locally from transaction history and grouped here as a focused cost-management tool."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Monthly subscription cost"
          value={compactCurrency(report.subscriptions.totalMonthly)}
          detail="Average recurring monthly outgoings detected locally."
          emphasis
        />
        <MetricCard
          label="Annual subscription cost"
          value={compactCurrency(report.subscriptions.totalAnnual)}
          detail="Estimated yearly impact if the current recurring pattern continues."
        />
        <MetricCard
          label="Potential yearly savings"
          value={compactCurrency(report.subscriptions.potentialYearlySavings)}
          detail="Likely savings if the most optional recurring costs are cancelled or reduced."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <AreaTrendCard
          title="Recurring spend trend"
          description="Monthly recurring spend detected across the local dataset."
          data={report.subscriptions.trend}
          dataKey="total"
          stroke="#277C78"
          fill="#277C78"
        />
        <RecommendationList
          items={report.subscriptions.recommendations.map((item) => ({
            title: item.title,
            detail: item.detail,
            amount: compactCurrency(item.potentialSavings),
          }))}
          emptyText="No cancellation recommendations are currently being highlighted."
        />
      </div>

      {items.length === 0 ? (
        <AiEmptyState
          title="No subscription-style recurring payments detected"
          description="As recurring transactions appear in the local data, this page will estimate monthly cost, annual impact, and possible savings."
        />
      ) : (
        <SectionCard className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Active subscriptions</h2>
            <p className="text-sm text-muted-foreground">
              Automatically grouped recurring charges with trend and cancellation guidance.
            </p>
          </div>
          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-2xl bg-beige-100 p-5 dark:bg-secondary lg:grid-cols-[1.4fr_repeat(4,minmax(0,0.7fr))]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                    >
                      {item.status === "cancel"
                        ? "Consider cancelling"
                        : item.status === "watch"
                          ? "Review"
                          : "Active"}
                    </span>
                  </div>
                  <p className="pt-2 text-sm text-muted-foreground">{item.recommendation}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly</p>
                  <p className="pt-1 font-semibold text-foreground">
                    {compactCurrency(item.monthlyCost)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Annual</p>
                  <p className="pt-1 font-semibold text-foreground">
                    {compactCurrency(item.annualCost)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last charged</p>
                  <p className="pt-1 font-semibold text-foreground">
                    {format(new Date(item.lastChargedAt), "d MMM yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Potential savings</p>
                  <p className="pt-1 font-semibold text-foreground">
                    {compactCurrency(item.potentialSavings)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </AiPageContainer>
  );
};

export default Subscriptions;
