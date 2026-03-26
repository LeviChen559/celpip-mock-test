import { SupabaseClient } from "@supabase/supabase-js";

const MONTHLY_LIMITS: Record<string, number | null> = {
  user: 15,
  subscriber: 100,
  improver: 100,      // AI scoring + diagnostics + planner
  intensive: 500,     // Everything + real-time feedback
  guarantee: null,    // Unlimited (time-boxed to 90 days)
  teacher: null,      // unlimited
  admin: null,        // unlimited
};

/** Credit cost per finished quiz/test by section */
export const SECTION_CREDITS: Record<string, number> = {
  reading: 1,
  listening: 2,
  speaking: 2,
  writing: 3,
};

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

interface UsageResult {
  allowed: boolean;
  current: number;
  limit: number | null;
  remaining: number | null;
}

/**
 * Check whether the user has enough credits, and increment the counter if allowed.
 * `cost` defaults to 1 for backward compatibility.
 */
export async function checkAndIncrementUsage(
  supabase: SupabaseClient,
  userId: string,
  role: string,
  cost: number = 1
): Promise<UsageResult> {
  const limit = role in MONTHLY_LIMITS ? MONTHLY_LIMITS[role] : MONTHLY_LIMITS.user;
  const month = getCurrentMonth();

  // Unlimited for teacher/admin/guarantee
  if (limit === null) {
    // Still track for analytics, but always allow
    await supabase.rpc("increment_api_usage", { p_user_id: userId, p_month: month });
    return { allowed: true, current: 0, limit: null, remaining: null };
  }

  // Get current usage
  const { data } = await supabase
    .from("api_usage")
    .select("call_count")
    .eq("user_id", userId)
    .eq("month", month)
    .single();

  const current = data?.call_count ?? 0;

  if (current + cost > limit) {
    return { allowed: false, current, limit, remaining: Math.max(0, limit - current) };
  }

  // Increment by cost via upsert
  await supabase
    .from("api_usage")
    .upsert(
      { user_id: userId, month, call_count: current + cost, updated_at: new Date().toISOString() },
      { onConflict: "user_id,month" }
    );

  return {
    allowed: true,
    current: current + cost,
    limit,
    remaining: limit - current - cost,
  };
}

/**
 * Get current usage for a user (read-only, no increment).
 */
export async function getUsage(
  supabase: SupabaseClient,
  userId: string,
  role: string
): Promise<{ current: number; limit: number | null; remaining: number | null }> {
  const limit = role in MONTHLY_LIMITS ? MONTHLY_LIMITS[role] : MONTHLY_LIMITS.user;
  const month = getCurrentMonth();

  const { data } = await supabase
    .from("api_usage")
    .select("call_count")
    .eq("user_id", userId)
    .eq("month", month)
    .single();

  const current = data?.call_count ?? 0;

  return {
    current,
    limit,
    remaining: limit === null ? null : Math.max(0, limit - current),
  };
}
