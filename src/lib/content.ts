import { createClient } from "@/lib/supabase/server";
import type { ListeningPart, ReadingPart, WritingTask, SpeakingTask, Question } from "./celpip-data";

// Fallback imports for migration period
import {
  listeningParts as hardcodedListening,
  readingParts as hardcodedReading,
  writingTasks as hardcodedWriting,
  speakingTasks as hardcodedSpeaking,
} from "./celpip-data";

function mapQuestion(row: Record<string, unknown>): Question {
  return {
    id: row.question_id as string,
    question: row.question as string,
    options: row.options as string[],
    correctAnswer: row.correct_answer as number,
    passage: row.passage as string | undefined,
    imageUrl: row.image_url as string | undefined,
  };
}

export async function getListeningParts(): Promise<ListeningPart[]> {
  const supabase = await createClient();
  const { data: parts, error } = await supabase
    .from("listening_parts")
    .select("*")
    .eq("status", "published")
    .order("sort_order");

  if (error || !parts || parts.length === 0) return hardcodedListening;

  const partIds = parts.map((p) => p.id);
  const { data: questions } = await supabase
    .from("listening_questions")
    .select("*")
    .in("listening_part_id", partIds)
    .order("sort_order");

  const questionsByPart = new Map<string, Question[]>();
  for (const q of questions || []) {
    const list = questionsByPart.get(q.listening_part_id) || [];
    list.push(mapQuestion(q));
    questionsByPart.set(q.listening_part_id, list);
  }

  return parts.map((p) => ({
    id: p.part_id,
    title: p.title,
    instruction: p.instruction,
    transcript: p.transcript,
    questions: questionsByPart.get(p.id) || [],
    audioUrl: p.audio_url || undefined,
    imageUrl: p.image_url || undefined,
  }));
}

export async function getReadingParts(): Promise<ReadingPart[]> {
  const supabase = await createClient();
  const { data: parts, error } = await supabase
    .from("reading_parts")
    .select("*")
    .eq("status", "published")
    .order("sort_order");

  if (error || !parts || parts.length === 0) return hardcodedReading;

  const partIds = parts.map((p) => p.id);
  const { data: questions } = await supabase
    .from("reading_questions")
    .select("*")
    .in("reading_part_id", partIds)
    .order("sort_order");

  const questionsByPart = new Map<string, Question[]>();
  for (const q of questions || []) {
    const list = questionsByPart.get(q.reading_part_id) || [];
    list.push(mapQuestion(q));
    questionsByPart.set(q.reading_part_id, list);
  }

  return parts.map((p) => ({
    id: p.part_id,
    title: p.title,
    instruction: p.instruction,
    passage: p.passage,
    questions: questionsByPart.get(p.id) || [],
    paid: p.paid === true ? true : undefined,
    imageUrl: p.image_url || undefined,
  }));
}

export async function getWritingTasks(): Promise<WritingTask[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_tasks")
    .select("*")
    .eq("status", "published")
    .order("sort_order");

  if (error || !data || data.length === 0) return hardcodedWriting;

  return data.map((t) => ({
    id: t.task_id,
    title: t.title,
    instruction: t.instruction,
    prompt: t.prompt,
    minWords: t.min_words,
    maxWords: t.max_words,
    imageUrl: t.image_url || undefined,
    audioUrl: t.audio_url || undefined,
  }));
}

export async function getSpeakingTasks(): Promise<SpeakingTask[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("speaking_tasks")
    .select("*")
    .eq("status", "published")
    .order("sort_order");

  if (error || !data || data.length === 0) return hardcodedSpeaking;

  return data.map((t) => ({
    id: t.task_id,
    title: t.title,
    instruction: t.instruction,
    prompt: t.prompt,
    prepTime: t.prep_time,
    responseTime: t.response_time,
    imageUrl: t.image_url || undefined,
    audioUrl: t.audio_url || undefined,
  }));
}
