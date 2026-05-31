"use client";

import { format } from "date-fns";

import type { Budget, FinanceData, Pot, Transaction } from "@/hooks/use-finance-data";

export type InsightGroup =
  | "trends"
  | "warnings"
  | "savings"
  | "habits"
  | "observations"
  | "achievements"
  | "actions";

export type InsightTone = "default" | "success" | "warning";

export type FinanceAiInsight = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  group: InsightGroup;
  tone: InsightTone;
  priority: number;
  sortValue: number;
  metricLabel: string;
  metricValue: string;
};

export type MonthlyCashflowPoint = {
  month: string;
  label: string;
  income: number;
  expenses: number;
  net: number;
  recurringSpend: number;
};

export type ScoreBreakdownItem = {
  label: string;
  score: number;
  maxScore: number;
  detail: string;
};

export type HealthTrendPoint = {
  month: string;
  label: string;
  score: number;
};

export type SubscriptionRecommendation = {
  title: string;
  detail: string;
  potentialSavings: number;
};

export type SubscriptionItem = {
  id: string;
  name: string;
  category: string;
  amount: number;
  monthlyCost: number;
  annualCost: number;
  occurrences: number;
  lastChargedAt: string;
  status: "active" | "watch" | "cancel";
  trendDirection: "up" | "stable";
  recommendation: string;
  potentialSavings: number;
};

export type FinancialHealthReport = {
  score: number;
  previousScore: number | null;
  delta: number | null;
  breakdown: ScoreBreakdownItem[];
  trend: HealthTrendPoint[];
  recommendations: string[];
};

export type FinanceAiReport = {
  generatedAt: string;
  isLocalOnly: boolean;
  previewInsights: FinanceAiInsight[];
  insights: FinanceAiInsight[];
  monthlyCashflow: MonthlyCashflowPoint[];
  topSavingsOpportunities: Array<{
    label: string;
    amount: number;
    detail: string;
  }>;
  health: FinancialHealthReport;
  subscriptions: {
    items: SubscriptionItem[];
    totalMonthly: number;
    totalAnnual: number;
    trend: Array<{ month: string; label: string; total: number }>;
    recommendations: SubscriptionRecommendation[];
    potentialYearlySavings: number;
  };
};

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  notation: "compact",
  maximumFractionDigits: 1,
});

const groupLabels: Record<InsightGroup, string> = {
  trends: "Spending Trends",
  warnings: "Budget Warnings",
  savings: "Savings Opportunities",
  habits: "Spending Habits",
  observations: "Monthly Observations",
  achievements: "Positive Wins",
  actions: "Recommended Actions",
};

type MonthComputation = {
  income: number;
  expenses: number;
  recurringSpend: number;
  budgetSpent: Record<string, number>;
};

const toMonthKey = (value: string) => format(new Date(value), "yyyy-MM");

const toMonthLabel = (month: string) => format(new Date(`${month}-01`), "MMM yyyy");

const roundScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const currency = (value: number) => currencyFormatter.format(value);

export const compactCurrency = (value: number) => compactCurrencyFormatter.format(value);

export const getInsightGroupLabel = (group: InsightGroup) => groupLabels[group];

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const percent = (value: number) => `${Math.round(value)}%`;

const buildMonthlyComputations = (data: FinanceData) => {
  const monthly = new Map<string, MonthComputation>();

  for (const transaction of data.transactions) {
    const month = toMonthKey(transaction.date);
    const current = monthly.get(month) ?? {
      income: 0,
      expenses: 0,
      recurringSpend: 0,
      budgetSpent: {},
    };

    if (transaction.amount > 0) {
      current.income += transaction.amount;
    } else {
      const spend = Math.abs(transaction.amount);
      current.expenses += spend;
      current.budgetSpent[transaction.category] =
        (current.budgetSpent[transaction.category] ?? 0) + spend;

      if (transaction.recurring) {
        current.recurringSpend += spend;
      }
    }

    monthly.set(month, current);
  }

  const sortedMonths = [...monthly.keys()].sort();

  return {
    monthly,
    sortedMonths,
  };
};

const calculateHealthBreakdown = (
  budgets: Budget[],
  pots: Pot[],
  currentMonth: MonthComputation,
  income: number,
  expenses: number,
  recurringSpend: number,
) => {
  const budgetChecks = budgets.length
    ? budgets.map((budget) => {
        const spent = currentMonth.budgetSpent[budget.category] ?? 0;
        return {
          spent,
          limit: budget.maximum,
          ratio: budget.maximum > 0 ? spent / budget.maximum : 0,
        };
      })
    : [];

  const onTrackBudgetRatio = budgetChecks.length
    ? budgetChecks.filter((item) => item.ratio <= 1).length / budgetChecks.length
    : 1;
  const overspendPenalty = budgetChecks.reduce(
    (sum, item) => sum + Math.max(0, item.ratio - 1),
    0,
  );
  const budgetScore = Math.max(
    0,
    Math.round(onTrackBudgetRatio * 22 + Math.max(0, 8 - overspendPenalty * 12)),
  );

  const totalTarget = pots.reduce((sum, pot) => sum + pot.target, 0);
  const totalSaved = pots.reduce((sum, pot) => sum + pot.total, 0);
  const savingsRatio = totalTarget > 0 ? totalSaved / totalTarget : 0;
  const monthlySavings = Math.max(0, income - expenses);
  const savingsScore = Math.max(
    0,
    Math.min(
      30,
      Math.round(Math.min(1, savingsRatio) * 14 + Math.min(1, monthlySavings / Math.max(income, 1)) * 16),
    ),
  );

  const recurringRatio = income > 0 ? recurringSpend / income : 1;
  const recurringScore = Math.max(0, Math.round(20 - Math.min(20, recurringRatio * 30)));

  const cashflowRatio = income > 0 ? (income - expenses) / income : -1;
  const cashflowScore = Math.max(0, Math.min(20, Math.round((cashflowRatio + 0.2) * 40)));

  return {
    budgetScore,
    savingsScore,
    recurringScore,
    cashflowScore,
    breakdown: [
      {
        label: "Budget discipline",
        score: budgetScore,
        maxScore: 30,
        detail: `${budgetChecks.filter((item) => item.ratio <= 1).length}/${budgetChecks.length || 0} budgets are inside their monthly limits.`,
      },
      {
        label: "Savings momentum",
        score: savingsScore,
        maxScore: 30,
        detail: `${currency(totalSaved)} saved across pots, covering ${percent(savingsRatio * 100)} of your current targets.`,
      },
      {
        label: "Recurring commitments",
        score: recurringScore,
        maxScore: 20,
        detail: `Recurring outgoings absorb ${percent(recurringRatio * 100)} of this month's income.`,
      },
      {
        label: "Cashflow resilience",
        score: cashflowScore,
        maxScore: 20,
        detail: `This month is tracking ${currency(Math.abs(income - expenses))} ${income >= expenses ? "ahead" : "behind"} after income versus spending.`,
      },
    ] satisfies ScoreBreakdownItem[],
  };
};

const buildAssistantRecommendations = (
  insights: FinanceAiInsight[],
  health: FinancialHealthReport,
  subscriptions: SubscriptionItem[],
) => {
  const recommendations = [
    ...insights
      .filter((insight) => insight.group === "actions" || insight.group === "warnings")
      .slice(0, 2)
      .map((insight) => insight.summary),
  ];

  if (health.score < 70) {
    recommendations.push("Prioritise one overspent budget category and one subscription review this week.");
  }

  const cancellable = subscriptions.filter((item) => item.status === "cancel");
  if (cancellable.length) {
    recommendations.push(
      `Review ${cancellable[0].name} first; it accounts for ${currency(cancellable[0].annualCost)} per year.`,
    );
  }

  return recommendations.slice(0, 4);
};

const buildSubscriptionData = (
  transactions: Transaction[],
  monthlyPoints: MonthlyCashflowPoint[],
) => {
  const recurringOutgoings = transactions.filter(
    (transaction) => transaction.recurring && transaction.amount < 0,
  );
  const grouped = new Map<string, Transaction[]>();

  for (const transaction of recurringOutgoings) {
    const key = transaction.name.toLowerCase();
    const current = grouped.get(key) ?? [];
    current.push(transaction);
    grouped.set(key, current);
  }

  const items = [...grouped.entries()]
    .map(([key, entries]) => {
      const latest = [...entries].sort(
        (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
      )[0];
      const amounts = entries.map((entry) => Math.abs(entry.amount));
      const monthlyCost = average(amounts);
      const annualCost = monthlyCost * 12;
      const trendDirection =
        Math.max(...amounts) - Math.min(...amounts) > 1 ? "up" : "stable";
      const status: SubscriptionItem["status"] =
        latest.category === "Lifestyle" || latest.category === "Entertainment"
          ? annualCost >= 100
            ? "cancel"
            : "watch"
          : annualCost >= 500
            ? "watch"
            : "active";
      const potentialSavings =
        status === "cancel" ? annualCost : status === "watch" ? annualCost * 0.5 : 0;

      return {
        id: key,
        name: latest.name,
        category: latest.category,
        amount: Math.abs(latest.amount),
        monthlyCost,
        annualCost,
        occurrences: entries.length,
        lastChargedAt: latest.date,
        status,
        trendDirection,
        recommendation:
          status === "cancel"
            ? "Low-essential recurring spend. Review usage and consider cancelling."
            : status === "watch"
              ? "Keep active only if it still supports a clear routine or goal."
              : "Core recurring cost with a relatively contained annual impact.",
        potentialSavings,
      } satisfies SubscriptionItem;
    })
    .sort((left, right) => right.annualCost - left.annualCost);

  const trend = monthlyPoints.map((point) => {
    const total = recurringOutgoings
      .filter((transaction) => toMonthKey(transaction.date) === point.month)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    return {
      month: point.month,
      label: point.label,
      total,
    };
  });

  const recommendations = items
    .filter((item) => item.status !== "active")
    .slice(0, 3)
    .map((item) => ({
      title: `Review ${item.name}`,
      detail: item.recommendation,
      potentialSavings: item.potentialSavings,
    }));

  return {
    items,
    totalMonthly: items.reduce((sum, item) => sum + item.monthlyCost, 0),
    totalAnnual: items.reduce((sum, item) => sum + item.annualCost, 0),
    trend,
    recommendations,
    potentialYearlySavings: items.reduce((sum, item) => sum + item.potentialSavings, 0),
  };
};

export const buildFinanceAiReport = (data: FinanceData): FinanceAiReport => {
  const { monthly, sortedMonths } = buildMonthlyComputations(data);
  const latestMonth = sortedMonths.at(-1) ?? format(new Date(), "yyyy-MM");
  const previousMonth = sortedMonths.at(-2) ?? null;

  const monthlyCashflow = sortedMonths.map((month) => {
    const stats = monthly.get(month);
    return {
      month,
      label: toMonthLabel(month),
      income: stats?.income ?? 0,
      expenses: stats?.expenses ?? 0,
      net: (stats?.income ?? 0) - (stats?.expenses ?? 0),
      recurringSpend: stats?.recurringSpend ?? 0,
    };
  });

  const currentMonth = monthly.get(latestMonth) ?? {
    income: 0,
    expenses: 0,
    recurringSpend: 0,
    budgetSpent: {},
  };
  const previousMonthStats = previousMonth ? monthly.get(previousMonth) : null;

  const spendingTransactions = data.transactions.filter((transaction) => transaction.amount < 0);
  const currentMonthSpending = spendingTransactions.filter(
    (transaction) => toMonthKey(transaction.date) === latestMonth,
  );

  const categorySpend = new Map<string, number>();
  const merchantSpend = new Map<string, number>();

  for (const transaction of currentMonthSpending) {
    const spend = Math.abs(transaction.amount);
    categorySpend.set(transaction.category, (categorySpend.get(transaction.category) ?? 0) + spend);
    merchantSpend.set(transaction.name, (merchantSpend.get(transaction.name) ?? 0) + spend);
  }

  const topCategory = [...categorySpend.entries()].sort((left, right) => right[1] - left[1])[0];
  const topMerchant = [...merchantSpend.entries()].sort((left, right) => right[1] - left[1])[0];

  const overspentBudgets = data.budgets
    .map((budget) => {
      const spent = currentMonth.budgetSpent[budget.category] ?? 0;
      return {
        category: budget.category,
        maximum: budget.maximum,
        spent,
        remaining: budget.maximum - spent,
        overspendAmount: Math.max(0, spent - budget.maximum),
      };
    })
    .filter((budget) => budget.spent > 0)
    .sort((left, right) => right.overspendAmount - left.overspendAmount);

  const totalTargets = data.pots.reduce((sum, pot) => sum + pot.target, 0);
  const totalSaved = data.pots.reduce((sum, pot) => sum + pot.total, 0);
  const savingsCoverage = totalTargets > 0 ? totalSaved / totalTargets : 0;

  const monthlyNet = currentMonth.income - currentMonth.expenses;
  const previousNet = previousMonthStats
    ? previousMonthStats.income - previousMonthStats.expenses
    : null;

  const subscriptions = buildSubscriptionData(data.transactions, monthlyCashflow);

  const initialHealth = calculateHealthBreakdown(
    data.budgets,
    data.pots,
    currentMonth,
    currentMonth.income,
    currentMonth.expenses,
    currentMonth.recurringSpend,
  );
  const score = roundScore(
    initialHealth.budgetScore +
      initialHealth.savingsScore +
      initialHealth.recurringScore +
      initialHealth.cashflowScore,
  );

  const trend = monthlyCashflow.map((point) => {
    const monthStats = monthly.get(point.month) ?? currentMonth;
    const monthHealth = calculateHealthBreakdown(
      data.budgets,
      data.pots,
      monthStats,
      monthStats.income,
      monthStats.expenses,
      monthStats.recurringSpend,
    );

    return {
      month: point.month,
      label: point.label,
      score: roundScore(
        monthHealth.budgetScore +
          monthHealth.savingsScore +
          monthHealth.recurringScore +
          monthHealth.cashflowScore,
      ),
    };
  });

  const previousScore = trend.at(-2)?.score ?? null;
  const delta = previousScore === null ? null : score - previousScore;

  const insights: FinanceAiInsight[] = [];

  if (topCategory) {
    insights.push({
      id: "top-category",
      title: `${topCategory[0]} is leading this month's spend`,
      summary: `${currency(topCategory[1])} has gone into ${topCategory[0].toLowerCase()} so far in ${toMonthLabel(latestMonth)}.`,
      detail: "Use this category as the first checkpoint when you want to reduce near-term outgoings.",
      group: "trends",
      tone: "default",
      priority: 92,
      sortValue: topCategory[1],
      metricLabel: "Category spend",
      metricValue: currency(topCategory[1]),
    });
  }

  if (overspentBudgets[0]?.overspendAmount > 0) {
    const budget = overspentBudgets[0];
    insights.push({
      id: `budget-warning-${budget.category}`,
      title: `${budget.category} is over budget`,
      summary: `${budget.category} is ${currency(budget.overspendAmount)} above its ${currency(budget.maximum)} target this month.`,
      detail: "A short-term spending freeze in this category will have the fastest impact on monthly discipline.",
      group: "warnings",
      tone: "warning",
      priority: 99,
      sortValue: budget.overspendAmount,
      metricLabel: "Overspend",
      metricValue: currency(budget.overspendAmount),
    });
  }

  if (subscriptions.potentialYearlySavings > 0) {
    insights.push({
      id: "subscription-savings",
      title: "Subscription review could unlock savings",
      summary: `${currency(subscriptions.potentialYearlySavings)} in potential yearly savings is tied to non-essential recurring charges.`,
      detail: "Start with entertainment and lifestyle services before cutting fixed household bills.",
      group: "savings",
      tone: "default",
      priority: 88,
      sortValue: subscriptions.potentialYearlySavings,
      metricLabel: "Potential yearly savings",
      metricValue: currency(subscriptions.potentialYearlySavings),
    });
  }

  if (topMerchant) {
    insights.push({
      id: "merchant-habit",
      title: `${topMerchant[0]} is your biggest merchant this month`,
      summary: `${currency(topMerchant[1])} has already gone to ${topMerchant[0]}.`,
      detail: "Repeated merchant concentration is useful for habit tracking because a single change can move the total quickly.",
      group: "habits",
      tone: "default",
      priority: 76,
      sortValue: topMerchant[1],
      metricLabel: "Merchant spend",
      metricValue: currency(topMerchant[1]),
    });
  }

  insights.push({
    id: "monthly-observation",
    title: "Monthly cashflow snapshot",
    summary:
      previousNet === null
        ? `${toMonthLabel(latestMonth)} is currently ${monthlyNet >= 0 ? "net positive" : "net negative"} by ${currency(Math.abs(monthlyNet))}.`
        : `${toMonthLabel(latestMonth)} is ${currency(Math.abs(monthlyNet - previousNet))} ${monthlyNet >= previousNet ? "ahead of" : "behind"} last month.`,
    detail: "This combines all income and spend currently present in the local transaction dataset.",
    group: "observations",
    tone: monthlyNet >= 0 ? "success" : "warning",
    priority: 82,
    sortValue: Math.abs(monthlyNet),
    metricLabel: "Net cashflow",
    metricValue: currency(monthlyNet),
  });

  if (monthlyNet > 0 || savingsCoverage >= 0.35) {
    insights.push({
      id: "achievement",
      title: "Savings progress is moving in the right direction",
      summary: `${currency(totalSaved)} is already allocated to savings pots, covering ${percent(savingsCoverage * 100)} of current targets.`,
      detail: "Keeping a positive monthly net position protects that progress and raises the health score faster than small budget tweaks alone.",
      group: "achievements",
      tone: "success",
      priority: 74,
      sortValue: totalSaved,
      metricLabel: "Saved in pots",
      metricValue: currency(totalSaved),
    });
  }

  if (overspentBudgets.length || subscriptions.items.length) {
    const firstAction = overspentBudgets[0]?.overspendAmount
      ? `Reduce ${overspentBudgets[0].category.toLowerCase()} spend by ${currency(overspentBudgets[0].overspendAmount)} to return inside budget.`
      : `Review ${subscriptions.items[0]?.name} and decide whether it still earns its monthly cost.`;

    insights.push({
      id: "recommended-action",
      title: "Best next action",
      summary: firstAction,
      detail: "A single targeted change is easier to sustain than multiple broad restrictions.",
      group: "actions",
      tone: "default",
      priority: 97,
      sortValue: overspentBudgets[0]?.overspendAmount ?? subscriptions.items[0]?.annualCost ?? 0,
      metricLabel: "Action impact",
      metricValue: currency(
        overspentBudgets[0]?.overspendAmount ?? subscriptions.items[0]?.annualCost ?? 0,
      ),
    });
  }

  const sortedInsights = [...insights].sort((left, right) => right.priority - left.priority);

  const health: FinancialHealthReport = {
    score,
    previousScore,
    delta,
    breakdown: initialHealth.breakdown,
    trend,
    recommendations: buildAssistantRecommendations(
      sortedInsights,
      {
        score,
        previousScore,
        delta,
        breakdown: initialHealth.breakdown,
        trend,
        recommendations: [],
      },
      subscriptions.items,
    ),
  };

  const topSavingsOpportunities = [
    ...(subscriptions.recommendations.map((recommendation) => ({
      label: recommendation.title,
      amount: recommendation.potentialSavings,
      detail: recommendation.detail,
    })) ?? []),
    ...overspentBudgets
      .filter((budget) => budget.overspendAmount > 0)
      .slice(0, 2)
      .map((budget) => ({
        label: `Bring ${budget.category} back inside budget`,
        amount: budget.overspendAmount,
        detail: `${currency(budget.overspendAmount)} would bring this category back to target.`,
      })),
  ]
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 4);

  return {
    generatedAt: new Date().toISOString(),
    isLocalOnly: true,
    previewInsights: sortedInsights.slice(0, 3),
    insights: sortedInsights,
    monthlyCashflow,
    topSavingsOpportunities,
    health,
    subscriptions,
  };
};

export const buildAssistantAnswer = (
  question: string,
  report: FinanceAiReport,
) => {
  const normalized = question.toLowerCase();
  const bestInsight = report.insights[0];
  const topSubscription = report.subscriptions.items[0];
  const topSavings = report.topSavingsOpportunities[0];

  if (normalized.includes("health")) {
    return {
      answer: `Your financial health score is ${report.health.score}/100. ${report.health.breakdown[0]?.detail} ${report.health.recommendations[0] ?? ""}`.trim(),
      suggestions: [
        "Why is my score not higher?",
        "Which category should I fix first?",
      ],
    };
  }

  if (
    normalized.includes("budget") ||
    normalized.includes("overspend") ||
    normalized.includes("spending too much")
  ) {
    const warning = report.insights.find((insight) => insight.group === "warnings");
    return {
      answer: warning
        ? `${warning.summary} ${warning.detail}`
        : "No budget category in the current local dataset is showing an overspend warning right now.",
      suggestions: [
        "Show me savings opportunities",
        "What should I do this week?",
      ],
    };
  }

  if (
    normalized.includes("subscription") ||
    normalized.includes("cancel") ||
    normalized.includes("recurring")
  ) {
    return {
      answer: topSubscription
        ? `${topSubscription.name} is the largest recurring cost in the current dataset at about ${currency(topSubscription.monthlyCost)} per month and ${currency(topSubscription.annualCost)} per year. ${topSubscription.recommendation}`
        : "I could not detect recurring subscription-style charges in the current local dataset.",
      suggestions: [
        "How much could I save yearly?",
        "Which subscriptions are non-essential?",
      ],
    };
  }

  if (normalized.includes("save") || normalized.includes("saving")) {
    return {
      answer: topSavings
        ? `${topSavings.label} is the biggest immediate opportunity, worth about ${currency(topSavings.amount)}. ${topSavings.detail}`
        : "The current dataset does not surface a strong short-term savings opportunity yet.",
      suggestions: [
        "What is my strongest action item?",
        "How are my pots progressing?",
      ],
    };
  }

  return {
    answer: bestInsight
      ? `${bestInsight.summary} ${bestInsight.detail} All analysis is generated locally from your transaction, budget, and pot data.`
      : "I do not have enough local data to answer that yet.",
    suggestions: [
      "What should I focus on this month?",
      "How healthy are my finances?",
    ],
  };
};
