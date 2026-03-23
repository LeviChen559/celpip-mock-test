import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QUESTION_TABLES, FK_COLUMNS, isAdmin } from "@/lib/admin-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  const { section, id } = await params;

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

  const fkColumn = FK_COLUMNS[section];
  const insertData = { ...body, [fkColumn]: id };

  const { data, error } = await supabase
    .from(qTable)
    .insert(insertData)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
