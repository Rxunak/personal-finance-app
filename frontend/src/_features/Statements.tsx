"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, FileText, Sparkles, Trash2, Upload } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  type StatementAnalysis,
  parseStatementPdf,
} from "@/lib/statement-analysis";

const STORAGE_KEY = "statement-analysis";
const PREFERENCE_KEY = "statement-analysis-preference";
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

type StoredStatementAnalysis = {
  analysis: StatementAnalysis;
  expiresAt: number;
};

const Statements = () => {
  const [statementAnalysis, setStatementAnalysis] =
    useState<StatementAnalysis | null>(null);
  const [statementError, setStatementError] = useState("");
  const [isAnalyzingStatement, setIsAnalyzingStatement] = useState(false);
  const [rememberSummary, setRememberSummary] = useState(false);
  const statementInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedPreference = window.localStorage.getItem(PREFERENCE_KEY);
    setRememberSummary(savedPreference === "true");

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as StoredStatementAnalysis;

      if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }

      setStatementAnalysis(parsed.analysis);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PREFERENCE_KEY, String(rememberSummary));

    if (!rememberSummary || !statementAnalysis) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const payload: StoredStatementAnalysis = {
      analysis: statementAnalysis,
      expiresAt: Date.now() + STORAGE_TTL_MS,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [rememberSummary, statementAnalysis]);

  const handleStatementUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setStatementError("");
    setIsAnalyzingStatement(true);

    try {
      const analysis = await parseStatementPdf(file);
      setStatementAnalysis(analysis);
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "The statement could not be analyzed.";
      setStatementAnalysis(null);
      setStatementError(message);
    } finally {
      setIsAnalyzingStatement(false);
      event.target.value = "";
    }
  };

  const handleRemoveStatement = () => {
    setStatementAnalysis(null);
    setStatementError("");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="flex min-h-lvh flex-col gap-7 bg-beige-100 px-8 pb-8 text-foreground dark:bg-background">
      <div className="pt-6 text-3xl font-semibold">Summarise Statements</div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-2xl bg-card p-8 text-card-foreground">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-beige-100 text-green dark:bg-secondary">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Statements</h1>
                  <p className="text-sm text-muted-foreground">
                    Upload a bank statement PDF and get AI-style spending
                    highlights.
                  </p>
                </div>
              </div>
            </div>
            <span className="rounded-full bg-beige-100 px-3 py-1 text-xs font-semibold text-foreground dark:bg-secondary">
              AI
            </span>
          </div>

          <div className="mb-5 rounded-2xl border border-green/15 bg-green/5 p-4 text-sm text-muted-foreground">
            Your statement is processed locally in your browser and is not
            uploaded to our servers. If you choose to remember the summary, only
            the generated summary is stored on this device for 7 days.
          </div>

          <input
            ref={statementInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleStatementUpload}
          />

          <div className="rounded-2xl border border-dashed border-border bg-beige-100 p-5 dark:bg-secondary">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-card text-foreground">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {statementAnalysis?.fileName ?? "Add statement PDF"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Text-based PDFs work best for merchant and category
                    detection.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                className="rounded-xl bg-grey-900 px-4 text-white hover:bg-grey-900/90 dark:bg-white dark:text-grey-900"
                onClick={() => statementInputRef.current?.click()}
                disabled={isAnalyzingStatement}
              >
                <Upload className="size-4" />
                {statementAnalysis ? "Replace PDF" : "Upload PDF"}
              </Button>
            </div>
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border-border accent-green"
                  checked={rememberSummary}
                  onChange={(event) =>
                    setRememberSummary(event.target.checked)
                  }
                />
                <span>
                  Remember this summary on this device for 7 days
                </span>
              </label>
              <span className="text-xs text-muted-foreground">
                {rememberSummary ? "Persistence enabled" : "Not saved after you leave"}
              </span>
            </div>
            {statementAnalysis ? (
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl text-muted-foreground hover:text-red"
                  onClick={handleRemoveStatement}
                >
                  <Trash2 className="size-4" />
                  Remove statement
                </Button>
              </div>
            ) : null}
          </div>

          {isAnalyzingStatement ? (
            <div className="mt-5 rounded-2xl bg-beige-100 p-5 dark:bg-secondary">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Sparkles className="size-4 text-green" />
                Analyzing your statement and building spending insights...
              </div>
            </div>
          ) : null}

          {statementError ? (
            <div className="mt-5 rounded-2xl border border-red/20 bg-red/5 p-5 text-sm text-red">
              {statementError}
            </div>
          ) : null}

          {statementAnalysis ? (
            <div className="mt-5 space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                {statementAnalysis.insights.map((insight) => (
                  <div
                    key={insight.title}
                    className="rounded-2xl bg-beige-100 p-4 dark:bg-secondary"
                  >
                    <p className="text-sm text-muted-foreground">{insight.title}</p>
                    <p className="pt-2 text-xl font-bold text-foreground">
                      {insight.value}
                    </p>
                    <p
                      className={`pt-2 text-sm ${
                        insight.tone === "warning"
                          ? "text-red"
                          : insight.tone === "success"
                            ? "text-green"
                            : "text-muted-foreground"
                      }`}
                    >
                      {insight.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {statementAnalysis.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="pt-2 text-xl font-bold text-foreground">
                      {metric.value}
                    </p>
                    <p className="pt-2 text-sm text-muted-foreground">
                      {metric.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl bg-beige-100 p-5 dark:bg-secondary">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-foreground">
                      Top spending categories
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {statementAnalysis.statementPeriod}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {statementAnalysis.topCategories.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center justify-between rounded-xl bg-card px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {category.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(category.share * 100).toFixed(0)}% of spend
                          </p>
                        </div>
                        <p className="font-bold text-foreground">
                          {category.displayAmount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-beige-100 p-5 dark:bg-secondary">
                  <h3 className="text-lg font-bold text-foreground">
                    Top merchants
                  </h3>
                  <div className="mt-4 space-y-3">
                    {statementAnalysis.topMerchants.map((merchant, index) => (
                      <div
                        key={merchant.name}
                        className="flex items-center justify-between rounded-xl bg-card px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {index + 1}. {merchant.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Highest merchant outflow
                          </p>
                        </div>
                        <p className="font-bold text-foreground">
                          {merchant.displayAmount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-grey-900 p-5 text-white">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Sparkles className="size-4 text-yellow" />
                  AI summary
                </div>
                <div className="mt-4 space-y-3">
                  {statementAnalysis.recommendations.map((item) => (
                    <p key={item} className="text-sm leading-6 text-white/90">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            !isAnalyzingStatement && (
              <div className="mt-5 rounded-2xl bg-card">
                <div className="flex justify-between border-b border-border py-4 text-sm">
                  <span className="text-muted-foreground">What you will get</span>
                  <span className="font-semibold text-foreground">
                    Summary cards
                  </span>
                </div>
                <div className="flex justify-between border-b border-border py-4 text-sm">
                  <span className="text-muted-foreground">Focus areas</span>
                  <span className="font-semibold text-foreground">
                    High-spend categories
                  </span>
                </div>
                <div className="flex justify-between py-4 text-sm">
                  <span className="text-muted-foreground">Recommendations</span>
                  <span className="font-semibold text-foreground">
                    Where to cut back
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-grey-900 p-8 text-white">
            <p className="text-sm text-white/70">What this looks for</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-white/90">
              <p>High-spend categories across your statement.</p>
              <p>Merchants that appear to be the largest drain on cash.</p>
              <p>Recurring-looking charges and possible bank fees.</p>
              <p>Simple cutback suggestions based on repeat discretionary spend.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-8 text-card-foreground">
            <h2 className="text-2xl font-bold">Privacy and storage</h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between border-b border-border pb-4 text-sm">
                <span className="text-muted-foreground">Best format</span>
                <span className="font-semibold text-foreground">
                  Text-based bank PDF
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-4 text-sm">
                <span className="text-muted-foreground">Works less well with</span>
                <span className="font-semibold text-foreground">
                  Scanned image PDFs
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-4 text-sm">
                <span className="text-muted-foreground">Server upload</span>
                <span className="font-semibold text-foreground">
                  No
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-4 text-sm">
                <span className="text-muted-foreground">Saved file</span>
                <span className="font-semibold text-foreground">
                  Summary only
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Retention</span>
                <span className="font-semibold text-foreground">
                  7 days or until removed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statements;
