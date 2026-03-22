// ─── Types ────────────────────────────────────────────────────────────────────

export interface WritingEvaluationScores {
  task_response: { score: number; comment: string };
  coherence: { score: number; comment: string };
  vocabulary: { score: number; comment: string };
  grammar: { score: number; comment: string };
  overall: number;
  clb_estimate: string;
}

export interface WritingEvaluationImprovement {
  issue: string;
  fix: string;
  example: string;
}

export interface WritingEvaluationResponse {
  scores: WritingEvaluationScores;
  weaknesses: string[];
  improvements: WritingEvaluationImprovement[];
  high_score_sample: string;
  practice: string[];
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export interface WritingEvaluationParams {
  targetScore: number;
  taskType: string;
  timeLimit: string;
  userResponse: string;
}

export function buildWritingEvaluationPrompt(
  params: WritingEvaluationParams,
): string {
  const { targetScore, taskType, timeLimit, userResponse } = params;

  return `You are a certified CELPIP examiner and an expert English writing coach.

Your job is NOT only to give a score, but to help the student improve their CELPIP performance as efficiently as possible.

You must follow these steps strictly:

---

[Step 1: Understand Context]

Student Target Score: ${targetScore}
Task Type: ${taskType} (e.g., Writing Task 1 / Task 2 / Speaking Task)
Time Limit: ${timeLimit}

Student Response:
${userResponse}

---

[Step 2: Score the Response]

Evaluate the response using CELPIP criteria:

1. Task Response
2. Coherence and Organization
3. Vocabulary
4. Grammar and Sentence Structure

For each category:
- Give a score (1–12)
- Give a short explanation (1–2 sentences)

Then provide:
- Overall Score (1–12)
- Estimated CLB level

---

[Step 3: Identify Weakness Patterns]

Analyze the response and identify SPECIFIC, REPEATED weaknesses.

Avoid generic feedback.

Examples of GOOD insights:
- "Frequent errors in complex sentence structures"
- "Limited use of transition words affects coherence"
- "Vocabulary lacks variation in opinion phrases"

List top 3 weaknesses.

---

[Step 4: Provide Actionable Improvements]

For each weakness:
- Explain what is wrong
- Show how to fix it
- Provide 1 improved example sentence

---

[Step 5: Rewrite High-Scoring Version]

Rewrite the student's response into a Band 10–12 level answer.

Keep the same idea, but improve:
- clarity
- structure
- vocabulary
- grammar

---

[Step 6: Generate Targeted Practice]

Create 2 short practice exercises specifically targeting the student's weaknesses.

Each exercise should:
- Be quick (1–3 minutes)
- Focus on ONE skill only

---

[Tone Rules]

- Be direct and constructive
- Do NOT be overly polite or vague
- Focus on improvement, not praise
- Avoid generic advice

---

[Output Format: JSON]

Return the result in this JSON structure (respond ONLY with valid JSON, no markdown):

{
  "scores": {
    "task_response": { "score": "", "comment": "" },
    "coherence": { "score": "", "comment": "" },
    "vocabulary": { "score": "", "comment": "" },
    "grammar": { "score": "", "comment": "" },
    "overall": "",
    "clb_estimate": ""
  },
  "weaknesses": [],
  "improvements": [
    {
      "issue": "",
      "fix": "",
      "example": ""
    }
  ],
  "high_score_sample": "",
  "practice": []
}`;
}
