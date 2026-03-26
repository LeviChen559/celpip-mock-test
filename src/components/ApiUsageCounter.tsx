"use client";

import { useEffect, useState } from "react";
import { Zap, Coins } from "lucide-react";

interface UsageData {
  current: number;
  limit: number | null;
  remaining: number | null;
}

const CREDIT_COSTS = {
  quiz: [
    { label: "Reading", cost: 1 },
    { label: "Listening", cost: 2 },
    { label: "Speaking", cost: 2 },
    { label: "Writing", cost: 3 },
  ],
  section: [
    { label: "Reading", cost: 4 },
    { label: "Listening", cost: 10 },
    { label: "Speaking", cost: 15 },
    { label: "Writing", cost: 5 },
  ],
  full: 30,
};

export default function ApiUsageCounter() {
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUsage(data);
      })
      .catch(() => {});
  }, []);

  if (!usage) return null;

  // Unlimited — don't show the counter
  if (usage.limit === null) return null;

  const pct = Math.min(100, (usage.current / usage.limit) * 100);
  const isLow = usage.remaining !== null && usage.remaining <= 3;
  const isExhausted = usage.remaining === 0;

  const barColor = isExhausted
    ? "#c75050"
    : isLow
      ? "#d4a03c"
      : "var(--hp-accent)";

  return (
    <div
      className="hp-glass rounded-xl px-4 py-3 flex flex-col gap-3 min-w-0"
      style={{ border: "1px solid var(--hp-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{ background: `${barColor}18` }}
        >
          <Zap className="w-4 h-4" style={{ color: barColor }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: "var(--hp-text)" }}
            >
              <Coins className="w-3.5 h-3.5" style={{ color: barColor }} />
              Credits
            </span>
            <span
              className="text-xs tabular-nums"
              style={{ color: isExhausted ? "#c75050" : "var(--hp-text-muted)" }}
            >
              {usage.current} / {usage.limit}
            </span>
          </div>

          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: "var(--hp-border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>

          {isExhausted && (
            <p className="text-[10px] mt-1" style={{ color: "#c75050" }}>
              Limit reached — resets next month
            </p>
          )}
          {isLow && !isExhausted && (
            <p className="text-[10px] mt-1" style={{ color: "#d4a03c" }}>
              {usage.remaining} credit{usage.remaining === 1 ? "" : "s"} remaining
            </p>
          )}
        </div>
      </div>

      {/* Credit cost breakdown */}
      <div className="space-y-1.5 text-[10px]" style={{ color: "var(--hp-text-muted)" }}>
        <div>
          <span className="font-semibold" style={{ color: "var(--hp-text)" }}>Full Test</span>
          {" "}{CREDIT_COSTS.full} cr
        </div>
        <div>
          <span className="font-semibold" style={{ color: "var(--hp-text)" }}>Section Test</span>
          <span className="ml-1">
            {CREDIT_COSTS.section.map(({ label, cost }) => `${label} ${cost}`).join(" · ")}
          </span>
        </div>
        <div>
          <span className="font-semibold" style={{ color: "var(--hp-text)" }}>Quiz</span>
          <span className="ml-1">
            {CREDIT_COSTS.quiz.map(({ label, cost }) => `${label} ${cost}`).join(" · ")}
          </span>
        </div>
      </div>
    </div>
  );
}
