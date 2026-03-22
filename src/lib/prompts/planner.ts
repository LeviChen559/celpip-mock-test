// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlanItem {
  date: string;
  section: string;
  label: string;
  reason: string;
  target_dimension: string | null;
  difficulty: "foundational" | "intermediate" | "advanced";
}

export interface PlanResponse {
  plan_items: PlanItem[];
  summary: string;
  goal_progress: {
    current_avg: number;
    target: number;
    days_remaining: number;
    on_track: boolean;
  };
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export interface PlannerParams {
  goalScore: number;
  targetDate: string | null;
  focusSections: string[];
  sessionsPerDay: number;
  daysAhead: number;
  startDate: string;
  diagnostics: Array<{
    section: string;
    weakest_dimension: string;
    strongest_dimension: string;
    trending_down: string[];
    trending_up: string[];
    recommendations: string[];
    predicted_score: number | null;
  }>;
  incompleteItems: Array<{
    date: string;
    section: string;
    label: string;
  }>;
}

export function buildPlannerPrompt(params: PlannerParams): string {
  const {
    goalScore,
    targetDate,
    focusSections,
    sessionsPerDay,
    daysAhead,
    startDate,
    diagnostics,
    incompleteItems,
  } = params;

  const daysRemaining = targetDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(targetDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const diagnosticsText =
    diagnostics.length > 0
      ? diagnostics
          .map(
            (d) =>
              `${d.section.toUpperCase()}:
  Weakest: ${d.weakest_dimension}
  Strongest: ${d.strongest_dimension}
  Trending up: ${d.trending_up.join(", ") || "none"}
  Trending down: ${d.trending_down.join(", ") || "none"}
  Recommendations: ${d.recommendations.join("; ")}
  Predicted score: ${d.predicted_score ?? "unknown"}`
          )
          .join("\n\n")
      : "No diagnostic data available yet. Create a balanced introductory plan.";

  const incompleteText =
    incompleteItems.length > 0
      ? `Already scheduled (do not duplicate):\n${incompleteItems.map((i) => `- ${i.date}: ${i.section} — ${i.label}`).join("\n")}`
      : "No existing scheduled items.";

  return `You are a CELPIP study planner AI. Create a personalized study plan based on the student's diagnostic data and goals.

---

[Student Profile]

Goal Score: ${goalScore}/12
Test Date: ${targetDate || "Not set"}
Days Remaining: ${daysRemaining ?? "Unknown"}
Focus Sections: ${focusSections.length > 0 ? focusSections.join(", ") : "All sections"}
Sessions Per Day: ${sessionsPerDay}
Plan Period: ${daysAhead} days starting ${startDate}

---

[Diagnostic Summary]

${diagnosticsText}

---

[Existing Schedule]

${incompleteText}

---

[Planning Rules]

1. Generate exactly ${sessionsPerDay * daysAhead} tasks across ${daysAhead} days (${sessionsPerDay} per day).
2. Prioritize the weakest dimensions and declining trends.
3. Include variety: mix writing practice, speaking practice, reading exposure, vocabulary drills, grammar exercises, and full mock tests.
4. Schedule at least 1 full mock test per week for benchmarking.
5. Include 1 rest/light-review day per week.
6. Each task must have a clear "reason" tied to diagnostic data or goal gap.
7. Difficulty should progress: start foundational if predicted score is far from goal, advanced if close.
8. Do not duplicate tasks already on the schedule.
9. Available sections: writing, speaking, listening, reading, quiz-reading, full.

---

[Output Format: JSON]

Return ONLY valid JSON (no markdown):

{
  "plan_items": [
    {
      "date": "2026-03-23",
      "section": "writing",
      "label": "Writing Task 1: Email with transition focus",
      "reason": "Your coherence score dropped from 7 to 5 — practice transition words",
      "target_dimension": "coherence",
      "difficulty": "intermediate"
    }
  ],
  "summary": "This week focuses on...",
  "goal_progress": {
    "current_avg": 6.5,
    "target": ${goalScore},
    "days_remaining": ${daysRemaining ?? 0},
    "on_track": false
  }
}`;
}
