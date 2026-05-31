"use client";

import { useFinancialAi } from "@/hooks/use-financial-ai";
import { compactCurrency } from "@/lib/financial-ai";
import {
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

const FinancialHealth = () => {
  const { report, isPending, error, refetch } = useFinancialAi();

  if (isPending) {
    return (
      <AiPageContainer>
        <AiPageHeader
          title="Financial Health"
          description="Track the overall health score, what contributes to it, and how that picture changes over time."
        />
        <AiLoadingState />
      </AiPageContainer>
    );
  }

  if (error || !report) {
    return (
      <AiPageContainer>
        <AiPageHeader
          title="Financial Health"
          description="Track the overall health score, what contributes to it, and how that picture changes over time."
        />
        <AiErrorState
          message={error?.message ?? "No health data is available yet."}
          onRetry={() => void refetch()}
        />
      </AiPageContainer>
    );
  }

  return (
    <AiPageContainer>
      <AiPageHeader
        title="Financial Health"
        description="A single score helps summarize local budget discipline, savings analysis, goal progress, recurring commitments, and month-to-month resilience."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Overall score"
          value={`${report.health.score}/100`}
          detail="Composite local score from current transaction, budget, and pot data."
          emphasis
        />
        <MetricCard
          label="Monthly change"
          value={
            report.health.delta === null
              ? "New"
              : `${report.health.delta > 0 ? "+" : ""}${report.health.delta}`
          }
          detail={
            report.health.delta === null
              ? "No previous month is available for comparison."
              : "Difference versus the previous month in the local dataset."
          }
        />
        <MetricCard
          label="Subscription load"
          value={compactCurrency(report.subscriptions.totalMonthly)}
          detail="Current monthly recurring cost included in the score model."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <AreaTrendCard
          title="Health score trend"
          description="Historical score trend built from the months present in your local transaction data."
          data={report.health.trend}
          dataKey="score"
          stroke="#626070"
          fill="#626070"
          formatter={(value) => `${Math.round(value)}/100`}
        />

        <RecommendationList
          items={report.health.recommendations.map((item, index) => ({
            title: `Recommendation ${index + 1}`,
            detail: item,
          }))}
          emptyText="No additional health recommendations are currently available."
        />
      </div>

      <SectionCard className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Score breakdown</h2>
          <p className="text-sm text-muted-foreground">
            These components explain how the current score is assembled.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {report.health.breakdown.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-beige-100 p-5 dark:bg-secondary"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="pt-2 text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <div className="rounded-2xl bg-card px-3 py-2 text-right">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="font-bold text-foreground">
                    {item.score}/{item.maxScore}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </AiPageContainer>
  );
};

export default FinancialHealth;
