import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUsage } from "@/lib/api-usage";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "user";
  const usage = await getUsage(supabase, user.id, role);

  return NextResponse.json(usage);
}
