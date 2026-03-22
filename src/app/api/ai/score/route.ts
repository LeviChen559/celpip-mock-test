import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/api-usage";
import {
  buildWritingEvaluationPrompt,
  WritingEvaluationResponse,
} from "@/lib/prompts/writing-evaluation";

const MODEL = "claude-opus-4-6";

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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
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
      { error: "Monthly API limit reached", limit: usage.limit, current: usage.current },
      { status: 429 }
    );
  }
  // --- End auth & usage limit ---

  const { test_record_id, section, task_id, task_type, user_response, target_score } =
    await req.json();

  if (!section || !task_id || !task_type || !user_response) {
    return NextResponse.json(
      { error: "Missing required fields: section, task_id, task_type, user_response" },
      { status: 400 }
    );
  }

  if (!["writing", "speaking"].includes(section)) {
    return NextResponse.json(
      { error: "section must be 'writing' or 'speaking'" },
      { status: 400 }
    );
  }

  const client = new Anthropic({ apiKey });

  // Build the evaluation prompt
  const promptText = buildWritingEvaluationPrompt({
    targetScore: target_score || 8,
    taskType: task_type,
    timeLimit: section === "writing" ? "27 minutes" : "3 minutes",
    userResponse: user_response,
  });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: "user", content: promptText }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    let evaluation: WritingEvaluationResponse;
    try {
      evaluation = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Store in ai_scores table
    const { data: aiScore, error: insertError } = await supabase
      .from("ai_scores")
      .insert({
        user_id: user.id,
        test_record_id: test_record_id || null,
        section,
        task_id,
        task_type,
        scores: evaluation.scores,
        weaknesses: evaluation.weaknesses || [],
        improvements: evaluation.improvements || [],
        high_score_sample: evaluation.high_score_sample || null,
        practice_tasks: evaluation.practice || [],
        raw_response: user_response,
        model_version: MODEL,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("ai_scores insert error:", insertError);
      // Still return the evaluation even if storage fails
    }

    return NextResponse.json({
      id: aiScore?.id || null,
      scores: evaluation.scores,
      weaknesses: evaluation.weaknesses,
      improvements: evaluation.improvements,
      high_score_sample: evaluation.high_score_sample,
      practice_tasks: evaluation.practice,
    });
  } catch (err) {
    console.error("AI scoring error:", err);
    return NextResponse.json(
      { error: "Failed to generate AI score" },
      { status: 500 }
    );
  }
}
