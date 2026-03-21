import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { questionId, section, comment } = await req.json();
  if (!questionId || !section) {
    return NextResponse.json(
      { error: "questionId and section are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("red_flags").insert({
    user_id: user.id,
    question_id: questionId,
    section,
    comment: comment || "",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const questionId = req.nextUrl.searchParams.get("questionId");
  if (!questionId) {
    return NextResponse.json(
      { error: "questionId required" },
      { status: 400 }
    );
  }

  const { data } = await supabase
    .from("red_flags")
    .select("id")
    .eq("user_id", user.id)
    .eq("question_id", questionId)
    .limit(1);

  return NextResponse.json({ flagged: (data?.length ?? 0) > 0 });
}
