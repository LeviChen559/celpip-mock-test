import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getUserRole(supabase: any): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    return data?.role ?? null;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isStaff(supabase: any) {
  const role = await getUserRole(supabase);
  return role === "admin" || role === "teacher";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isAdmin(supabase: any) {
  const role = await getUserRole(supabase);
  return role === "admin";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAuthUserId(supabase: any): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function buildUserStats(supabase: any, userIds?: string[]) {
  let query = supabase.from("test_records").select("user_id, overall_score, timestamp");
  if (userIds && userIds.length > 0) {
    query = query.in("user_id", userIds);
  }
  const { data: stats } = await query;

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
  return userStats;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const action = req.nextUrl.searchParams.get("action");

  if (action === "debug") {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
    return NextResponse.json({ userId: user?.id, email: user?.email, role: profile?.role, error: error?.message });
  }

  if (!(await isStaff(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (action === "users") {
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const userStats = await buildUserStats(supabase);

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

    // If caller is a teacher (not admin), verify they are assigned to this student
    const callerRole = await getUserRole(supabase);
    if (callerRole === "teacher") {
      const callerId = await getAuthUserId(supabase);
      const { data: assignment } = await supabase
        .from("teacher_student_assignments")
        .select("id")
        .eq("teacher_id", callerId)
        .eq("student_id", userId)
        .single();
      if (!assignment) {
        return NextResponse.json({ error: "Not your student" }, { status: 403 });
      }
    }

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

  if (action === "teachers") {
    const { data: teachers, error } = await supabase
      .from("profiles")
      .select("id, name, email")
      .eq("role", "teacher")
      .order("name");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(teachers || []);
  }

  if (action === "all-assignments") {
    const { data, error } = await supabase
      .from("teacher_student_assignments")
      .select("id, teacher_id, student_id, created_at");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  }

  if (action === "teacher-students") {
    const teacherId = req.nextUrl.searchParams.get("teacherId");
    if (!teacherId) return NextResponse.json({ error: "teacherId required" }, { status: 400 });

    // If caller is a teacher, they can only view their own students
    const callerRole = await getUserRole(supabase);
    if (callerRole === "teacher") {
      const callerId = await getAuthUserId(supabase);
      if (callerId !== teacherId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const { data: assignments } = await supabase
      .from("teacher_student_assignments")
      .select("student_id")
      .eq("teacher_id", teacherId);

    const studentIds = (assignments || []).map((a: { student_id: string }) => a.student_id);
    if (studentIds.length === 0) return NextResponse.json([]);

    const { data: students, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, target_date, created_at")
      .in("id", studentIds)
      .order("name");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const userStats = await buildUserStats(supabase, studentIds);

    const enriched = (students || []).map((s) => ({
      ...s,
      testCount: userStats[s.id]?.testCount || 0,
      avgScore: userStats[s.id]?.avgScore || 0,
      lastActive: userStats[s.id]?.lastActive || 0,
    }));

    return NextResponse.json(enriched);
  }

  if (action === "red-flags") {
    const { data, error } = await supabase
      .from("red_flags")
      .select("*, profiles!red_flags_user_id_fkey(name, email)")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { action, userId, role, teacherId, studentId, studentIds, flagId } = await req.json();

  if (action === "solve-red-flag") {
    if (!flagId) return NextResponse.json({ error: "flagId required" }, { status: 400 });
    const adminId = await getAuthUserId(supabase);
    const { error } = await supabase
      .from("red_flags")
      .update({ solved: true, solved_by: adminId, solved_at: new Date().toISOString() })
      .eq("id", flagId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "update-role") {
    if (!userId || !role) return NextResponse.json({ error: "userId and role required" }, { status: 400 });
    if (!["admin", "teacher", "user", "improver", "intensive", "guarantee"].includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "delete-user-records") {
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    await supabase.from("test_records").delete().eq("user_id", userId);
    await supabase.from("schedule_items").delete().eq("user_id", userId);

    return NextResponse.json({ success: true });
  }

  if (action === "delete-user") {
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });

    // Delete user data first (cascade should handle this, but be explicit)
    await supabase.from("test_records").delete().eq("user_id", userId);
    await supabase.from("schedule_items").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);

    // Delete from Supabase Auth using service role
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.message || "Failed to delete user" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (action === "assign-student") {
    if (!teacherId || !studentId) return NextResponse.json({ error: "teacherId and studentId required" }, { status: 400 });
    const adminId = await getAuthUserId(supabase);
    const { error } = await supabase
      .from("teacher_student_assignments")
      .insert({ teacher_id: teacherId, student_id: studentId, assigned_by: adminId });

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "Already assigned" }, { status: 409 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "unassign-student") {
    if (!teacherId || !studentId) return NextResponse.json({ error: "teacherId and studentId required" }, { status: 400 });
    const { error } = await supabase
      .from("teacher_student_assignments")
      .delete()
      .eq("teacher_id", teacherId)
      .eq("student_id", studentId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "bulk-assign-students") {
    if (!teacherId || !studentIds?.length) return NextResponse.json({ error: "teacherId and studentIds required" }, { status: 400 });
    const adminId = await getAuthUserId(supabase);
    const rows = studentIds.map((sid: string) => ({ teacher_id: teacherId, student_id: sid, assigned_by: adminId }));
    const { error } = await supabase
      .from("teacher_student_assignments")
      .upsert(rows, { onConflict: "teacher_id,student_id", ignoreDuplicates: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
