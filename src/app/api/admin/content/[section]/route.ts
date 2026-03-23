import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SECTION_TABLES, QUESTION_TABLES, isAdmin } from "@/lib/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const table = SECTION_TABLES[section];
  if (!table) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status");
  let query = supabase.from(table).select("*").order("sort_order");
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // For listening/reading, attach question counts
  if (section === "listening" || section === "reading") {
    const qTable = QUESTION_TABLES[section];
    const fkCol = section === "listening" ? "listening_part_id" : "reading_part_id";
    const ids = (data || []).map((d: Record<string, unknown>) => d.id);

    if (ids.length > 0) {
      const { data: counts } = await supabase
        .from(qTable)
        .select(fkCol)
        .in(fkCol, ids);

      const countMap: Record<string, number> = {};
      for (const row of counts || []) {
        const pid = (row as Record<string, unknown>)[fkCol] as string;
        countMap[pid] = (countMap[pid] || 0) + 1;
      }

      for (const item of data || []) {
        (item as Record<string, unknown>).question_count = countMap[(item as Record<string, unknown>).id as string] || 0;
      }
    }
  }

  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const table = SECTION_TABLES[section];
  if (!table) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { data, error } = await supabase.from(table).insert(body).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
