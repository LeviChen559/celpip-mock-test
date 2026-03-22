// ─── Types ────────────────────────────────────────────────────────────────────

export interface DiagnosticPatterns {
  recurring_weaknesses: string[];
  trending_up: string[];
  trending_down: string[];
  strongest_dimension: string;
  weakest_dimension: string;
}

export interface DiagnosticTrajectoryPoint {
  date: string;
  overall: number;
  dimensions: {
    task_response: number;
    coherence: number;
    vocabulary: number;
    grammar: number;
  };
}

export interface DiagnosticResponse {
  patterns: DiagnosticPatterns;
  recommendations: string[];
  score_trajectory: DiagnosticTrajectoryPoint[];
  predicted_score: number | null;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export interface DiagnosticParams {
  section: "writing" | "speaking";
  scoreHistory: Array<{
    date: string;
    task_type: string;
    scores: {
      task_response: { score: number; comment: string };
      coherence: { score: number; comment: string };
      vocabulary: { score: number; comment: string };
      grammar: { score: number; comment: string };
      overall: number;
    };
    weaknesses: string[];
  }>;
}

export function buildDiagnosticPrompt(params: DiagnosticParams): string {
  const { section, scoreHistory } = params;

  const historyText = scoreHistory
    .map(
      (entry, i) =>
        `Attempt ${i + 1} (${entry.date}, ${entry.task_type}):
  Task Response: ${entry.scores.task_response.score}/12 — ${entry.scores.task_response.comment}
  Coherence: ${entry.scores.coherence.score}/12 — ${entry.scores.coherence.comment}
  Vocabulary: ${entry.scores.vocabulary.score}/12 — ${entry.scores.vocabulary.comment}
  Grammar: ${entry.scores.grammar.score}/12 — ${entry.scores.grammar.comment}
  Overall: ${entry.scores.overall}/12
  Weaknesses: ${entry.weaknesses.join(", ")}`
    )
    .join("\n\n");

  return `You are a CELPIP exam analytics specialist. Analyze this student's ${section} performance across ${scoreHistory.length} attempts and identify patterns.

---

[Score History]

${historyText}

---

[Your Task]

1. **Recurring Weaknesses:** Identify weaknesses that appear in 2+ attempts. Be specific (e.g., "Lacks transition words between paragraphs" not "Poor coherence").

2. **Trends:** For each dimension (task_response, coherence, vocabulary, grammar), determine if the student is trending UP (improving), DOWN (declining), or STABLE.

3. **Strongest & Weakest Dimensions:** Based on the most recent 2-3 attempts, which dimension is strongest and which is weakest?

4. **Recommendations:** Provide 3-5 prioritized, actionable recommendations. Each should reference specific score data. Example: "Focus on vocabulary variety — your vocabulary score dropped from 8 to 6 across the last 2 attempts."

5. **Predicted Score:** Based on the trajectory, predict the student's likely overall score on their next attempt. If the trend is unclear, return null.

6. **Score Trajectory:** Return the scores as a time series for charting.

---

[Output Format: JSON]

Return ONLY valid JSON (no markdown):

{
  "patterns": {
    "recurring_weaknesses": ["specific weakness 1", "specific weakness 2"],
    "trending_up": ["dimension names improving"],
    "trending_down": ["dimension names declining"],
    "strongest_dimension": "dimension name",
    "weakest_dimension": "dimension name"
  },
  "recommendations": ["prioritized action 1", "prioritized action 2", "prioritized action 3"],
  "score_trajectory": [
    {
      "date": "2026-03-15",
      "overall": 6,
      "dimensions": { "task_response": 7, "coherence": 5, "vocabulary": 7, "grammar": 6 }
    }
  ],
  "predicted_score": 7.5
}`;
}
