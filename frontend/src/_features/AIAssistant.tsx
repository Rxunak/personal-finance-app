"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { Bot, MessageSquare, Send, Trash2, User2 } from "lucide-react";

import { useFinancialAi } from "@/hooks/use-financial-ai";
import { buildAssistantAnswer } from "@/lib/financial-ai";
import {
  AiErrorState,
  AiLoadingState,
  AiPageContainer,
  AiPageHeader,
} from "@/src/components/ai/ai-states";
import { MetricCard, SectionCard } from "@/src/components/ai/ai-primitives";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";

type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "ai-assistant-history";

const defaultPrompts = [
  "What should I focus on this month?",
  "Which budget category needs attention?",
  "How healthy are my finances right now?",
  "Which subscriptions look non-essential?",
];

const AIAssistant = () => {
  const { report, isPending, error, refetch } = useFinancialAi();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as AssistantMessage[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const suggestionChips = useMemo(() => {
    if (!report) {
      return defaultPrompts;
    }

    const dynamic = report.insights.slice(0, 2).map((insight) => insight.title);
    return [...defaultPrompts, ...dynamic].slice(0, 6);
  }, [report]);

  const sendMessage = (rawQuestion?: string) => {
    const question = (rawQuestion ?? input).trim();

    if (!question || !report || isSending) {
      return;
    }

    const baseId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const userMessage: AssistantMessage = {
      id: `${baseId}-user`,
      role: "user",
      content: question,
      createdAt,
    };

    setIsSending(true);
    setInput("");

    startTransition(() => {
      setMessages((current) => [...current, userMessage]);
      const response = buildAssistantAnswer(question, report);

      const assistantMessage: AssistantMessage = {
        id: `${baseId}-assistant`,
        role: "assistant",
        content: response.answer,
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, assistantMessage]);
      setIsSending(false);
    });
  };

  if (isPending) {
    return (
      <AiPageContainer>
        <AiPageHeader
          title="AI Assistant"
          description="A locally powered financial Q&A workspace with private conversation persistence on this device."
        />
        <AiLoadingState />
      </AiPageContainer>
    );
  }

  if (error || !report) {
    return (
      <AiPageContainer>
        <AiPageHeader
          title="AI Assistant"
          description="A locally powered financial Q&A workspace with private conversation persistence on this device."
        />
        <AiErrorState
          message={error?.message ?? "No assistant context is available yet."}
          onRetry={() => void refetch()}
        />
      </AiPageContainer>
    );
  }

  return (
    <AiPageContainer>
      <AiPageHeader
        title="AI Assistant"
        description="Ask questions about spending, budgets, subscriptions, and financial health. Answers are generated from local transaction data already available in the app."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Conversation history"
          value={String(messages.filter((message) => message.role === "user").length)}
          detail="Stored locally on this device for quick follow-up questions."
        />
        <MetricCard
          label="Current health score"
          value={`${report.health.score}/100`}
          detail="Available to the assistant as context for recommendations."
        />
        <MetricCard
          label="Subscriptions detected"
          value={String(report.subscriptions.items.length)}
          detail="Recurring merchants the assistant can explain and review."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <SectionCard className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Suggested questions</h2>
              <p className="text-sm text-muted-foreground">
                Use one of these prompts or write your own.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl text-muted-foreground"
              onClick={() => setMessages([])}
            >
              <Trash2 className="size-4" />
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestionChips.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="rounded-full bg-beige-100 px-4 py-2 text-sm font-semibold text-grey-900 transition hover:bg-beige-100/80 dark:bg-secondary dark:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-green/15 bg-green/5 p-4 text-sm text-muted-foreground">
            This assistant uses the same local transaction, budget, pot, and recurring bill data visible elsewhere in the app. No server-side AI call is required for these answers.
          </div>
        </SectionCard>

        <SectionCard className="flex min-h-[38rem] flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-grey-900 text-white dark:bg-white dark:text-grey-900">
              <Bot className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Private financial advisor workspace
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl bg-beige-100 p-8 text-center dark:bg-secondary">
                <MessageSquare className="size-10 text-green" />
                <p className="pt-4 font-semibold text-foreground">No messages yet</p>
                <p className="pt-2 text-sm text-muted-foreground">
                  Start with a suggested question to open a local financial conversation.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-grey-900 text-white dark:bg-white dark:text-grey-900">
                      <Bot className="size-4" />
                    </div>
                  ) : null}
                  <div
                    className={`max-w-2xl rounded-3xl px-5 py-4 text-sm ${
                      message.role === "user"
                        ? "bg-grey-900 text-white dark:bg-white dark:text-grey-900"
                        : "bg-beige-100 text-foreground dark:bg-secondary"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] opacity-70">
                      {message.role === "user" ? (
                        <>
                          <User2 className="size-3.5" />
                          You
                        </>
                      ) : (
                        <>
                          <Bot className="size-3.5" />
                          Assistant
                        </>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap leading-6">{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about spending, subscriptions, budgets, or savings goals"
              className="min-h-28 rounded-2xl border-border bg-background"
            />
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Conversation history persists locally on this device only.
              </p>
              <Button
                type="button"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isSending}
                className="rounded-xl bg-grey-900 text-white hover:bg-grey-900/90 dark:bg-white dark:text-grey-900"
              >
                <Send className="size-4" />
                {isSending ? "Thinking..." : "Send"}
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </AiPageContainer>
  );
};

export default AIAssistant;
