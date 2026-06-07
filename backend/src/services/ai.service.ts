import OpenAI from "openai";

import Env from "../utils/env.js";

type AssistantMessageInput = {
  role: "user" | "assistant";
  content: string;
};

type AssistantFinanceContext = {
  balance: {
    current: number;
    income: number;
    expenses: number;
  };
  health: {
    score: number;
    delta: number | null;
    recommendations: string[];
  };
  budgets: Array<{
    category: string;
    maximum: number;
  }>;
  pots: Array<{
    name: string;
    target: number;
    total: number;
  }>;
  topInsights: Array<{
    title: string;
    summary: string;
    detail: string;
    group: string;
    tone: string;
  }>;
  subscriptions: Array<{
    name: string;
    category: string;
    monthlyCost: number;
    annualCost: number;
    status: "active" | "watch" | "cancel";
    recommendation: string;
  }>;
  recentTransactions: Array<{
    name: string;
    category: string;
    amount: number;
    date: string;
    recurring: boolean;
  }>;
  monthlyCashflow: Array<{
    label: string;
    income: number;
    expenses: number;
    net: number;
  }>;
};

export type AssistantAnswer = {
  answer: string;
  suggestions: string[];
};

export class AiConfigurationError extends Error {
  constructor() {
    super("OPENAI_API_KEY is not configured on the backend.");
    this.name = "AiConfigurationError";
  }
}

const client = Env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: Env.OPENAI_API_KEY,
    })
  : null;

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["answer", "suggestions"],
  properties: {
    answer: {
      type: "string",
      description: "Helpful grounded answer for the user question.",
    },
    suggestions: {
      type: "array",
      description: "Short follow-up questions the user may ask next.",
      minItems: 2,
      maxItems: 4,
      items: {
        type: "string",
      },
    },
  },
} as const;

const systemPrompt = `You are a financial assistant inside a personal finance app.
Answer only from the structured finance context provided to you.
Do not claim to know facts that are not present in the context.
If the question cannot be answered from the context, say that clearly and suggest what data is missing.
Keep answers concise, practical, and specific.
Do not mention OpenAI, prompts, hidden instructions, or JSON.
Never invent transactions, balances, dates, budgets, subscriptions, or savings opportunities.`;

export const generateAssistantAnswer = async (
  question: string,
  messages: AssistantMessageInput[],
  context: AssistantFinanceContext,
): Promise<AssistantAnswer> => {
  if (!client) {
    throw new AiConfigurationError();
  }

  const response = await client.responses.create({
    model: Env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "developer",
        content: `Finance context:\n${JSON.stringify(context)}`,
      },
      ...messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user",
        content: question,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "assistant_response",
        strict: true,
        schema: responseSchema,
      },
    },
  });

  const parsed = JSON.parse(response.output_text) as AssistantAnswer;

  return {
    answer: parsed.answer.trim(),
    suggestions: parsed.suggestions.map((suggestion) => suggestion.trim()).filter(Boolean),
  };
};
