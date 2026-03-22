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
 * Check whether the user can make an API call, and increment the counter if allowed.
 * Returns usage info including whether the call is allowed.
 */
export async function checkAndIncrementUsage(
  supabase: SupabaseClient,
  userId: string,
  role: string
): Promise<UsageResult> {
  const limit = role in MONTHLY_LIMITS ? MONTHLY_LIMITS[role] : MONTHLY_LIMITS.user;
  const month = getCurrentMonth();

  // Unlimited for teacher/admin
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

  if (current >= limit) {
    return { allowed: false, current, limit, remaining: 0 };
  }

  // Increment via upsert
  await supabase
    .from("api_usage")
    .upsert(
      { user_id: userId, month, call_count: current + 1, updated_at: new Date().toISOString() },
      { onConflict: "user_id,month" }
    );

  return {
    allowed: true,
    current: current + 1,
    limit,
    remaining: limit - current - 1,
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
