import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SECTION_TABLES: Record<string, string> = {
  listening: "listening_parts",
  reading: "reading_parts",
  writing: "writing_tasks",
  speaking: "speaking_tasks",
};

const QUESTION_TABLES: Record<string, { table: string; fk: string }> = {
  listening: { table: "listening_questions", fk: "listening_part_id" },
  reading: { table: "reading_questions", fk: "reading_part_id" },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const table = SECTION_TABLES[section];
  if (!table) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const supabase = await createClient();
  const { data: parts, error } = await supabase
    .from(table)
    .select("*")
    .eq("status", "published")
    .order("sort_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!parts || parts.length === 0) return NextResponse.json([]);

  // For listening/reading, attach questions
  const qConfig = QUESTION_TABLES[section];
  if (qConfig) {
    const ids = parts.map((p) => p.id);
    const { data: questions } = await supabase
      .from(qConfig.table)
      .select("*")
      .in(qConfig.fk, ids)
      .order("sort_order");

    const questionsByPart = new Map<string, unknown[]>();
    for (const q of questions || []) {
      const pid = q[qConfig.fk] as string;
      const list = questionsByPart.get(pid) || [];
      list.push({
        id: q.question_id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        passage: q.passage || undefined,
        imageUrl: q.image_url || undefined,
      });
      questionsByPart.set(pid, list);
    }

    for (const part of parts) {
      part.questions = questionsByPart.get(part.id) || [];
    }
  }

  // Map to camelCase interface format
  const mapped = parts.map((p) => {
    const base: Record<string, unknown> = {
      id: p.part_id || p.task_id,
      title: p.title,
      instruction: p.instruction,
      imageUrl: p.image_url || undefined,
      audioUrl: p.audio_url || undefined,
    };

    if (section === "listening") {
      base.transcript = p.transcript;
      base.questions = p.questions || [];
    } else if (section === "reading") {
      base.passage = p.passage;
      base.questions = p.questions || [];
      if (p.paid) base.paid = true;
    } else if (section === "writing") {
      base.prompt = p.prompt;
      base.minWords = p.min_words;
      base.maxWords = p.max_words;
    } else if (section === "speaking") {
      base.prompt = p.prompt;
      base.prepTime = p.prep_time;
      base.responseTime = p.response_time;
    }

    return base;
  });

  return NextResponse.json(mapped);
}
