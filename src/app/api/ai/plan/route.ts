import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/api-usage";
import { buildPlannerPrompt, PlanResponse } from "@/lib/prompts/planner";

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

  const { days_ahead } = await req.json();
  const daysAhead = days_ahead || 7;

  // Read active goal
  const { data: goal } = await supabase
    .from("user_goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (!goal) {
    return NextResponse.json(
      { error: "No active goal set. Please set a goal first via POST /api/ai/goal." },
      { status: 400 }
    );
  }

  // Read latest diagnostics for each section
  const diagnosticSections = (goal.focus_sections as string[])?.length > 0
    ? (goal.focus_sections as string[]).filter((s: string) => ["writing", "speaking"].includes(s))
    : ["writing", "speaking"];

  const diagnostics = [];
  for (const section of diagnosticSections) {
    const { data: diag } = await supabase
      .from("diagnostics")
      .select("*")
      .eq("user_id", user.id)
      .eq("section", section)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (diag) {
      const patterns = diag.patterns as {
        weakest_dimension: string;
        strongest_dimension: string;
        trending_down: string[];
        trending_up: string[];
      };
      diagnostics.push({
        section,
        weakest_dimension: patterns.weakest_dimension,
        strongest_dimension: patterns.strongest_dimension,
        trending_down: patterns.trending_down,
        trending_up: patterns.trending_up,
        recommendations: diag.recommendations as string[],
        predicted_score: diag.predicted_score ? Number(diag.predicted_score) : null,
      });
    }
  }

  // Read incomplete schedule items to avoid duplicates
  const today = new Date().toISOString().split("T")[0];
  const { data: incompleteItems } = await supabase
    .from("schedule_items")
    .select("date, section, label")
    .eq("user_id", user.id)
    .eq("completed", false)
    .gte("date", today)
    .order("date", { ascending: true });

  const promptText = buildPlannerPrompt({
    goalScore: goal.goal_score,
    targetDate: goal.target_date,
    focusSections: goal.focus_sections as string[],
    sessionsPerDay: goal.sessions_per_day,
    daysAhead,
    startDate: today,
    diagnostics,
    incompleteItems: incompleteItems || [],
  });

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: "user", content: promptText }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    let plan: PlanResponse;
    try {
      plan = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI plan response" },
        { status: 500 }
      );
    }

    // Find the latest diagnostic ID for linking
    const { data: latestDiag } = await supabase
      .from("diagnostics")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Insert plan items into schedule_items
    const scheduleRows = plan.plan_items.map((item) => ({
      user_id: user.id,
      date: item.date,
      section: item.section,
      label: item.label,
      completed: false,
      source: "ai_planner",
      ai_metadata: {
        reason: item.reason,
        target_dimension: item.target_dimension,
        difficulty: item.difficulty,
      },
      diagnostic_id: latestDiag?.id || null,
    }));

    if (scheduleRows.length > 0) {
      const { error: insertError } = await supabase
        .from("schedule_items")
        .insert(scheduleRows);

      if (insertError) {
        console.error("schedule_items insert error:", insertError);
      }
    }

    return NextResponse.json({
      plan_items: plan.plan_items,
      summary: plan.summary,
      goal_progress: plan.goal_progress,
    });
  } catch (err) {
    console.error("AI planner error:", err);
    return NextResponse.json(
      { error: "Failed to generate study plan" },
      { status: 500 }
    );
  }
}
