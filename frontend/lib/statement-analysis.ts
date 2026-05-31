"use client";

const DATE_PATTERN =
  /\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b/gi;
const AMOUNT_PATTERN = /-?\(?[£$€]?\d{1,3}(?:,\d{3})*(?:\.\d{2})\)?/g;
const CREDIT_PATTERN =
  /\b(credit|cr|salary|deposit|refund|incoming|received|interest|cashback|transfer from)\b/i;
const IGNORE_PATTERN =
  /\b(statement|account number|sort code|iban|bic|page \d+|balance brought forward|balance carried forward|opening balance|closing balance|available balance)\b/i;

const CATEGORY_KEYWORDS = [
  {
    category: "Bills",
    keywords: [
      "utility",
      "energy",
      "electric",
      "water",
      "gas",
      "council",
      "broadband",
      "phone",
      "internet",
      "insurance",
      "rent",
      "mortgage",
      "tax",
    ],
  },
  {
    category: "Groceries",
    keywords: [
      "tesco",
      "aldi",
      "lidl",
      "sainsbury",
      "waitrose",
      "asda",
      "market",
      "grocery",
      "foods",
      "supermarket",
    ],
  },
  {
    category: "Dining Out",
    keywords: [
      "cafe",
      "coffee",
      "starbucks",
      "pret",
      "restaurant",
      "deliveroo",
      "uber eats",
      "just eat",
      "bistro",
      "bar",
      "pub",
      "eatery",
    ],
  },
  {
    category: "Transportation",
    keywords: [
      "uber",
      "bolt",
      "trainline",
      "rail",
      "tfl",
      "metro",
      "fuel",
      "petrol",
      "shell",
      "bp",
      "parking",
      "ride",
    ],
  },
  {
    category: "Entertainment",
    keywords: [
      "netflix",
      "spotify",
      "prime",
      "cinema",
      "game",
      "steam",
      "playstation",
      "xbox",
      "pixel",
      "entertainment",
    ],
  },
  {
    category: "Personal Care",
    keywords: [
      "spa",
      "salon",
      "boots",
      "pharmacy",
      "wellness",
      "barber",
      "beauty",
      "care",
    ],
  },
  {
    category: "Education",
    keywords: [
      "course",
      "education",
      "udemy",
      "school",
      "tuition",
      "academy",
      "learning",
    ],
  },
  {
    category: "Lifestyle",
    keywords: [
      "amazon",
      "zara",
      "hm",
      "ikea",
      "home",
      "lifestyle",
      "shopping",
      "store",
      "mart",
    ],
  },
];

export type StatementTransaction = {
  amount: number;
  category: string;
  description: string;
};

export type StatementInsight = {
  title: string;
  value: string;
  detail: string;
  tone: "default" | "success" | "warning";
};

export type StatementMetric = {
  label: string;
  value: string;
  detail: string;
};

export type StatementMerchant = {
  name: string;
  amount: number;
  displayAmount: string;
};

export type StatementCategoryShare = {
  name: string;
  amount: number;
  displayAmount: string;
  share: number;
};

export type StatementAnalysis = {
  fileName: string;
  pageCount: number;
  statementSpend: number;
  transactionCount: number;
  statementPeriod: string;
  topCategory: string;
  topCategoryAmount: number;
  topMerchant: string;
  topMerchantAmount: number;
  cutbackLabel: string;
  cutbackAmount: number;
  recurringChargeCount: number;
  recurringChargeTotal: number;
  potentialSavings: number;
  feesTotal: number;
  topMerchants: StatementMerchant[];
  topCategories: StatementCategoryShare[];
  metrics: StatementMetric[];
  insights: StatementInsight[];
  recommendations: string[];
};

const normalizeAmount = (raw: string) => {
  const trimmed = raw.replace(/[£$€,]/g, "");
  const isNegative = trimmed.includes("-") || trimmed.includes("(");
  const numericValue = Number(trimmed.replace(/[()\-]/g, ""));

  return Number.isFinite(numericValue) ? (isNegative ? -numericValue : numericValue) : null;
};

const titleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

const normalizeDescription = (line: string, amounts: string[]) => {
  let description = line;

  for (const amount of amounts) {
    description = description.replace(amount, " ");
  }

  description = description
    .replace(DATE_PATTERN, " ")
    .replace(/\b(?:cr|dr|debit|credit|visa|pos|card|payment|purchase|faster)\b/gi, " ")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9&'./ -]/gi, " ")
    .trim();

  return description;
};

const inferCategory = (description: string) => {
  const normalized = description.toLowerCase();

  for (const entry of CATEGORY_KEYWORDS) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry.category;
    }
  }

  return "General";
};

const buildLinesFromTextItems = (
  items: Array<{ str?: string; transform?: number[] }>,
) => {
  const rows = new Map<number, string[]>();

  for (const item of items) {
    const text = item.str?.trim();

    if (!text) {
      continue;
    }

    const y = Math.round(item.transform?.[5] ?? 0);
    const currentRow = rows.get(y) ?? [];
    currentRow.push(text);
    rows.set(y, currentRow);
  }

  return [...rows.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, parts]) => parts.join(" ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
};

const extractStatementPeriod = (lines: string[]) => {
  const dateMatches = lines
    .flatMap((line) => line.match(DATE_PATTERN) ?? [])
    .slice(0, 2);

  if (dateMatches.length < 2) {
    return "Detected from uploaded statement";
  }

  return `${dateMatches[0]} to ${dateMatches[1]}`;
};

const extractTransactionsFromLines = (lines: string[]) => {
  const transactions: StatementTransaction[] = [];

  for (const line of lines) {
    if (IGNORE_PATTERN.test(line)) {
      continue;
    }

    const amounts = line.match(AMOUNT_PATTERN) ?? [];

    if (amounts.length === 0) {
      continue;
    }

    const amount = normalizeAmount(amounts[amounts.length - 1]);

    if (!amount || amount === 0) {
      continue;
    }

    if (amount > 0 && CREDIT_PATTERN.test(line)) {
      continue;
    }

    const spendAmount = Math.abs(amount);
    const description = normalizeDescription(line, amounts);

    if (description.length < 3 || !/[a-z]/i.test(description)) {
      continue;
    }

    transactions.push({
      amount: spendAmount,
      category: inferCategory(description),
      description: titleCase(description),
    });
  }

  return transactions;
};

const currency = (amount: number) =>
  amount.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export const analyzeStatementTransactions = (
  transactions: StatementTransaction[],
  fileName: string,
  pageCount: number,
  statementPeriod = "Detected from uploaded statement",
): StatementAnalysis => {
  const groupedByCategory = new Map<string, number>();
  const groupedByMerchant = new Map<string, number>();

  for (const transaction of transactions) {
    groupedByCategory.set(
      transaction.category,
      (groupedByCategory.get(transaction.category) ?? 0) + transaction.amount,
    );

    groupedByMerchant.set(
      transaction.description,
      (groupedByMerchant.get(transaction.description) ?? 0) + transaction.amount,
    );
  }

  const totalSpend = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const sortedCategories = [...groupedByCategory.entries()].sort((a, b) => b[1] - a[1]);
  const sortedMerchants = [...groupedByMerchant.entries()].sort((a, b) => b[1] - a[1]);

  const topCategory = sortedCategories[0] ?? ["General", 0];
  const topMerchant = sortedMerchants[0] ?? ["No clear merchant", 0];

  const repeatSmallSpend = [...groupedByMerchant.entries()]
    .filter(([, amount]) => amount <= 120)
    .sort((a, b) => b[1] - a[1])[0];
  const recurringCharges = [...groupedByMerchant.entries()].filter(
    ([merchant]) =>
      transactions.filter((item) => item.description === merchant).length >= 2,
  );
  const feesTotal = transactions
    .filter((item) =>
      /fee|charge|interest|overdraft|penalty|late/i.test(item.description),
    )
    .reduce((sum, item) => sum + item.amount, 0);

  const diningOutSpend = groupedByCategory.get("Dining Out") ?? 0;
  const entertainmentSpend = groupedByCategory.get("Entertainment") ?? 0;
  const transportSpend = groupedByCategory.get("Transportation") ?? 0;

  const cutbackOpportunity: [string, number] =
    diningOutSpend >= entertainmentSpend && diningOutSpend >= transportSpend
      ? ["Dining Out", diningOutSpend]
      : entertainmentSpend >= transportSpend
        ? ["Entertainment", entertainmentSpend]
        : ["Transportation", transportSpend];

  const recommendations = [
    `${topCategory[0]} is the heaviest category in this statement at ${currency(topCategory[1])}.`,
    repeatSmallSpend
      ? `Review ${repeatSmallSpend[0]} first. It accounts for ${currency(repeatSmallSpend[1])} and looks easier to reduce than fixed bills.`
      : `Most spend is spread across multiple merchants, so start with the top category rather than one merchant.`,
    cutbackOpportunity[1] > 0
      ? `If you trim ${cutbackOpportunity[0].toLowerCase()} by 15%, that frees up about ${currency(cutbackOpportunity[1] * 0.15)} next month.`
      : `There is not enough category separation yet to suggest a strong cutback target.`,
  ];
  const topMerchants = sortedMerchants.slice(0, 3).map(([name, amount]) => ({
    name,
    amount,
    displayAmount: currency(amount),
  }));
  const topCategories = sortedCategories.slice(0, 3).map(([name, amount]) => ({
    name,
    amount,
    displayAmount: currency(amount),
    share: totalSpend > 0 ? amount / totalSpend : 0,
  }));
  const recurringChargeTotal = recurringCharges.reduce(
    (sum, [, amount]) => sum + amount,
    0,
  );
  const potentialSavings = cutbackOpportunity[1] * 0.15;
  const recurringChargeCount = recurringCharges.length;

  return {
    fileName,
    pageCount,
    statementSpend: totalSpend,
    transactionCount: transactions.length,
    statementPeriod,
    topCategory: topCategory[0],
    topCategoryAmount: topCategory[1],
    topMerchant: topMerchant[0],
    topMerchantAmount: topMerchant[1],
    cutbackLabel: cutbackOpportunity[0],
    cutbackAmount: cutbackOpportunity[1],
    recurringChargeCount,
    recurringChargeTotal,
    potentialSavings,
    feesTotal,
    topMerchants,
    topCategories,
    metrics: [
      {
        label: "Top merchant",
        value: topMerchant[0],
        detail: `${currency(topMerchant[1])} spent with this merchant.`,
      },
      {
        label: "Recurring-looking charges",
        value: recurringChargeCount.toString(),
        detail: `${currency(recurringChargeTotal)} across repeated merchants.`,
      },
      {
        label: "Potential monthly savings",
        value: currency(potentialSavings),
        detail: `Based on trimming ${cutbackOpportunity[0].toLowerCase()} by 15%.`,
      },
      {
        label: "Fees and charges",
        value: currency(feesTotal),
        detail:
          feesTotal > 0
            ? "Bank fees or penalty-like charges were detected."
            : "No obvious fees or penalty charges detected.",
      },
    ],
    insights: [
      {
        title: "Statement spend",
        value: currency(totalSpend),
        detail: `${transactions.length} outgoing transactions detected across ${pageCount} page${pageCount === 1 ? "" : "s"}.`,
        tone: "default",
      },
      {
        title: "Highest category",
        value: topCategory[0],
        detail: `${currency(topCategory[1])} is concentrated here.`,
        tone: "warning",
      },
      {
        title: "Cutback target",
        value: cutbackOpportunity[0],
        detail:
          cutbackOpportunity[1] > 0
            ? `${currency(cutbackOpportunity[1])} spent here, which is the clearest reduction lever.`
            : "Upload a fuller statement to identify a stronger reduction lever.",
        tone: "success",
      },
    ],
    recommendations,
  };
};

export const parseStatementPdf = async (
  file: File,
): Promise<StatementAnalysis> => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
  }

  const buffer = await file.arrayBuffer();
  const document = await pdfjs
    .getDocument({ data: new Uint8Array(buffer), useWorkerFetch: false })
    .promise;

  const lines: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();

    lines.push(
      ...buildLinesFromTextItems(
        content.items as Array<{ str?: string; transform?: number[] }>,
      ),
    );
  }

  const transactions = extractTransactionsFromLines(lines);

  if (transactions.length === 0) {
    throw new Error(
      "No spending transactions were detected in this PDF. Try a text-based bank statement instead of a scanned image.",
    );
  }

  return analyzeStatementTransactions(
    transactions,
    file.name,
    document.numPages,
    extractStatementPeriod(lines),
  );
};
