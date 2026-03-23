import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QUESTION_TABLES, FK_COLUMNS, isAdmin } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string; qid: string }> }
) {
  const { section, qid } = await params;

  const qTable = QUESTION_TABLES[section];
  if (!qTable) {
    return NextResponse.json(
      { error: "Section does not support questions" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();

  // Strip fields that should not be updated
  const {
    id: _id,
    created_at: _ca,
    updated_at: _ua,
    [FK_COLUMNS[section]]: _fk,
    ...updateFields
  } = body;
  void _id; void _ca; void _ua; void _fk;

  const { data, error } = await supabase
    .from(qTable)
    .update(updateFields)
    .eq("id", qid)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string; qid: string }> }
) {
  const { section, qid } = await params;

  const qTable = QUESTION_TABLES[section];
  if (!qTable) {
    return NextResponse.json(
      { error: "Section does not support questions" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { error } = await supabase.from(qTable).delete().eq("id", qid);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
