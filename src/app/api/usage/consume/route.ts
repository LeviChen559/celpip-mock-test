import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage, SECTION_CREDITS } from "@/lib/api-usage";

/**
 * POST /api/usage/consume
 * Consume credits when a user finishes a test/quiz.
 * Body: { section: "reading" | "listening" | "speaking" | "writing" }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { section } = await req.json();
  const cost = SECTION_CREDITS[section];
  if (!cost) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
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

  return NextResponse.json({ consumed: cost, section, ...usage });
}
