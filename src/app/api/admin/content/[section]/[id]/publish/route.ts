import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SECTION_TABLES, isAdmin } from "@/lib/admin-auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  const { section, id } = await params;
  const table = SECTION_TABLES[section];
  if (!table) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Fetch current status
  const { data: current, error: fetchError } = await supabase
    .from(table)
    .select("status")
    .eq("id", id)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newStatus = current.status === "published" ? "draft" : "published";

  const { data, error } = await supabase
    .from(table)
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
