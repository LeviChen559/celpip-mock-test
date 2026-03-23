import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SECTION_TABLES, QUESTION_TABLES, isAdmin } from "@/lib/admin-auth";

export async function GET(
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

  const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // For listening/reading, attach questions from the corresponding question table
  if (section === "listening" || section === "reading") {
    const qTable = QUESTION_TABLES[section];
    const fkCol = section === "listening" ? "listening_part_id" : "reading_part_id";

    const { data: questions, error: qError } = await supabase
      .from(qTable)
      .select("*")
      .eq(fkCol, id)
      .order("sort_order");

    if (qError) return NextResponse.json({ error: qError.message }, { status: 500 });

    (data as Record<string, unknown>).questions = questions || [];
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  const { section, id } = await params;
  const table = SECTION_TABLES[section];
  if (!table) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();

  // Strip fields that should not be updated
  const { id: _id, created_at: _ca, updated_at: _ua, questions: _q, question_count: _qc, ...updateFields } = body;
  void _id; void _ca; void _ua; void _q; void _qc;

  const { data, error } = await supabase
    .from(table)
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(data);
}

export async function DELETE(
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

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
