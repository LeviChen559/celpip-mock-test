import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
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

  const { goal_score, target_date, focus_sections, sessions_per_day } =
    await req.json();

  if (!goal_score || goal_score < 2 || goal_score > 12) {
    return NextResponse.json(
      { error: "goal_score is required and must be between 2 and 12" },
      { status: 400 }
    );
  }

  // Deactivate any existing active goal
  await supabase
    .from("user_goals")
    .update({ active: false })
    .eq("user_id", user.id)
    .eq("active", true);

  // Insert new active goal
  const { data: goal, error } = await supabase
    .from("user_goals")
    .insert({
      user_id: user.id,
      goal_score,
      target_date: target_date || null,
      focus_sections: focus_sections || [],
      sessions_per_day: sessions_per_day || 2,
      active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Goal creation error:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }

  // Update profiles.current_goal_id for quick lookup
  await supabase
    .from("profiles")
    .update({
      current_goal_id: goal.id,
      ...(target_date ? { target_date } : {}),
    })
    .eq("id", user.id);

  return NextResponse.json(goal);
}

export async function GET() {
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

  const { data: goal } = await supabase
    .from("user_goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  return NextResponse.json(goal || null);
}
