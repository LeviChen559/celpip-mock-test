import { createClient } from "@/lib/supabase/server";

export const SECTION_TABLES: Record<string, string> = {
  listening: "listening_parts",
  reading: "reading_parts",
  writing: "writing_tasks",
  speaking: "speaking_tasks",
};

export const QUESTION_TABLES: Record<string, string> = {
  listening: "listening_questions",
  reading: "reading_questions",
};

export const FK_COLUMNS: Record<string, string> = {
  listening: "listening_part_id",
  reading: "reading_part_id",
};

export async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin";
}
