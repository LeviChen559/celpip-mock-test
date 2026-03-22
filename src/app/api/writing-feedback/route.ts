import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/api-usage";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  // --- Auth & usage limit ---
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = profile?.role ?? "user";

  const usage = await checkAndIncrementUsage(supabase, user.id, role);
  if (!usage.allowed) {
    return NextResponse.json(
      {
        error: "Monthly API limit reached",
        limit: usage.limit,
        current: usage.current,
      },
      { status: 429 }
    );
  }
  // --- End auth & usage limit ---

  const { taskTitle, taskPrompt, userResponse, score, minWords, maxWords } =
    await req.json();

  if (!taskPrompt || !userResponse) {
    return NextResponse.json(
      { error: "taskPrompt and userResponse are required" },
      { status: 400 }
    );
  }

  const client = new Anthropic({ apiKey });

  const wordCount = userResponse
    .trim()
    .split(/\s+/)
    .filter((w: string) => w.length > 0).length;

  try {
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a CELPIP writing examiner. Analyze the following writing task response and provide specific, actionable feedback.

**Task:** ${taskTitle}
**Prompt:** ${taskPrompt}
**Word count:** ${wordCount} words (target: ${minWords}–${maxWords} words)
**Estimated CELPIP Score:** ${score}/12

**Student's Response:**
${userResponse}

Please provide feedback in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "scoreExplanation": "2-3 sentences explaining specifically why this response received a score of ${score}/12. Mention concrete issues like vocabulary range, sentence structure variety, task completion, tone/register, coherence, or grammar errors found in the response.",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "exampleResponse": "A complete rewritten version of the email that would score 9-10/12. Use the same scenario but demonstrate: varied vocabulary, complex sentence structures, appropriate formal tone, clear organization, and fully address all task requirements. Must be ${minWords}-${maxWords} words."
}`,
      },
    ],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";

  let feedback;
  try {
    feedback = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }

  return NextResponse.json(feedback);
  } catch (err) {
    console.error("Writing feedback API error:", err);
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
  }
}
