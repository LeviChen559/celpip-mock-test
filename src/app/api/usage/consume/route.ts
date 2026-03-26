import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage, QUIZ_CREDITS, SECTION_TEST_CREDITS, FULL_TEST_CREDITS } from "@/lib/api-usage";

/**
 * POST /api/usage/consume
 * Consume credits when a user finishes a test/quiz.
 * Body: { section, type: "quiz" | "section" | "full" }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { section, type } = await req.json();

  let cost: number;
  if (type === "full") {
    cost = FULL_TEST_CREDITS;
  } else if (type === "section") {
    cost = SECTION_TEST_CREDITS[section];
    if (!cost) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
  } else {
    // quiz (default)
    cost = QUIZ_CREDITS[section];
    if (!cost) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = profile?.role ?? "user";

  const usage = await checkAndIncrementUsage(supabase, user.id, role, cost);

  if (!usage.allowed) {
    return NextResponse.json(
      { error: "Monthly credit limit reached", ...usage },
      { status: 429 }
    );
  }

  return NextResponse.json({ consumed: cost, section, type, ...usage });
}
