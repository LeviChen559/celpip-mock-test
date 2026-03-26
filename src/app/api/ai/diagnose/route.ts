import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import {
  buildDiagnosticPrompt,
  DiagnosticResponse,
} from "@/lib/prompts/diagnostic";

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

  // --- End auth check ---

  const { section } = await req.json();

  if (!section || !["writing", "speaking"].includes(section)) {
    return NextResponse.json(
      { error: "section is required and must be 'writing' or 'speaking'" },
      { status: 400 }
    );
  }

  // Fetch last 5 AI scores for this user + section
  const { data: scores, error: fetchError } = await supabase
    .from("ai_scores")
    .select("scores, weaknesses, task_type, created_at")
    .eq("user_id", user.id)
    .eq("section", section)
    .order("created_at", { ascending: false })
    .limit(5);

  if (fetchError) {
    console.error("Failed to fetch ai_scores:", fetchError);
    return NextResponse.json(
      { error: "Failed to fetch score history" },
      { status: 500 }
    );
  }

  if (!scores || scores.length < 2) {
    return NextResponse.json({
      insufficient_data: true,
      message: `Complete at least 2 ${section} tasks to see diagnostics.`,
    });
  }

  // Build the prompt
  const scoreHistory = scores.reverse().map((s) => ({
    date: new Date(s.created_at).toISOString().split("T")[0],
    task_type: s.task_type,
    scores: s.scores as {
      task_response: { score: number; comment: string };
      coherence: { score: number; comment: string };
      vocabulary: { score: number; comment: string };
      grammar: { score: number; comment: string };
      overall: number;
    },
    weaknesses: s.weaknesses as string[],
  }));

  const promptText = buildDiagnosticPrompt({ section, scoreHistory });

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1536,
      messages: [{ role: "user", content: promptText }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    let diagnostic: DiagnosticResponse;
    try {
      diagnostic = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI diagnostic response" },
        { status: 500 }
      );
    }

    // Store in diagnostics table
    const { data: diagRow, error: insertError } = await supabase
      .from("diagnostics")
      .insert({
        user_id: user.id,
        section,
        analysis_window: scores.length,
        patterns: diagnostic.patterns,
        recommendations: diagnostic.recommendations,
        score_trajectory: diagnostic.score_trajectory,
        predicted_score: diagnostic.predicted_score,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("diagnostics insert error:", insertError);
    }

    return NextResponse.json({
      id: diagRow?.id || null,
      patterns: diagnostic.patterns,
      recommendations: diagnostic.recommendations,
      score_trajectory: diagnostic.score_trajectory,
      predicted_score: diagnostic.predicted_score,
      insufficient_data: false,
    });
  } catch (err) {
    console.error("AI diagnostic error:", err);
    return NextResponse.json(
      { error: "Failed to generate diagnostic" },
      { status: 500 }
    );
  }
}
