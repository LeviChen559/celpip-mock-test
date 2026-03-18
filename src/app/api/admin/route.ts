import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function isAdmin(supabase: ReturnType<Awaited<ReturnType<typeof createClient>>>) {
  const { data: { user } } = await (supabase as { auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> } }).auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin";
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const action = req.nextUrl.searchParams.get("action");

  if (action === "users") {
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Get test counts and last activity per user
    const { data: stats } = await supabase
      .from("test_records")
      .select("user_id, overall_score, timestamp");

    const userStats: Record<string, { testCount: number; avgScore: number; lastActive: number }> = {};
    if (stats) {
      for (const row of stats) {
        const uid = row.user_id as string;
        if (!userStats[uid]) userStats[uid] = { testCount: 0, avgScore: 0, lastActive: 0 };
        userStats[uid].testCount++;
        userStats[uid].avgScore += row.overall_score as number;
        userStats[uid].lastActive = Math.max(userStats[uid].lastActive, row.timestamp as number);
      }
      for (const uid of Object.keys(userStats)) {
        if (userStats[uid].testCount > 0) {
          userStats[uid].avgScore = Math.round(userStats[uid].avgScore / userStats[uid].testCount);
        }
      }
    }

    const enriched = (users || []).map((u) => ({
      ...u,
      testCount: userStats[u.id]?.testCount || 0,
      avgScore: userStats[u.id]?.avgScore || 0,
      lastActive: userStats[u.id]?.lastActive || 0,
    }));

    return NextResponse.json(enriched);
  }

  if (action === "user-details") {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: records } = await supabase
      .from("test_records")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(50);

    const { data: scheduleItems } = await supabase
      .from("schedule_items")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    return NextResponse.json({ profile, records: records || [], scheduleItems: scheduleItems || [] });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { action, userId, role } = await req.json();

  if (action === "update-role") {
    if (!userId || !role) return NextResponse.json({ error: "userId and role required" }, { status: 400 });
    if (!["user", "admin"].includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "delete-user-records") {
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    await supabase.from("test_records").delete().eq("user_id", userId);
    await supabase.from("schedule_items").delete().eq("user_id", userId);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
