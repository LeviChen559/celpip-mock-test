import { createClient } from "@supabase/supabase-js";
import { listeningParts, readingParts, writingTasks, speakingTasks } from "../src/lib/celpip-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateListening() {
  console.log(`Migrating ${listeningParts.length} listening parts...`);
  for (let i = 0; i < listeningParts.length; i++) {
    const part = listeningParts[i];
    const { data, error } = await supabase
      .from("listening_parts")
      .upsert({
        part_id: part.id,
        title: part.title,
        instruction: part.instruction,
        transcript: part.transcript,
        status: "published",
        sort_order: i,
      }, { onConflict: "part_id" })
      .select("id")
      .single();

    if (error) {
      console.error(`  Error inserting listening part ${part.id}:`, error.message);
      continue;
    }

    for (let j = 0; j < part.questions.length; j++) {
      const q = part.questions[j];
      const { error: qErr } = await supabase
        .from("listening_questions")
        .upsert({
          question_id: q.id,
          listening_part_id: data.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correctAnswer,
          passage: q.passage || null,
          sort_order: j,
        }, { onConflict: "question_id,listening_part_id" });

      if (qErr) console.error(`  Error inserting question ${q.id}:`, qErr.message);
    }
  }
  console.log("  Done.");
}

async function migrateReading() {
  console.log(`Migrating ${readingParts.length} reading parts...`);
  for (let i = 0; i < readingParts.length; i++) {
    const part = readingParts[i];
    const { data, error } = await supabase
      .from("reading_parts")
      .upsert({
        part_id: part.id,
        title: part.title,
        instruction: part.instruction,
        passage: part.passage,
        paid: part.paid || false,
        status: "published",
        sort_order: i,
      }, { onConflict: "part_id" })
      .select("id")
      .single();

    if (error) {
      console.error(`  Error inserting reading part ${part.id}:`, error.message);
      continue;
    }

    for (let j = 0; j < part.questions.length; j++) {
      const q = part.questions[j];
      const { error: qErr } = await supabase
        .from("reading_questions")
        .upsert({
          question_id: q.id,
          reading_part_id: data.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correctAnswer,
          passage: q.passage || null,
          sort_order: j,
        }, { onConflict: "question_id,reading_part_id" });

      if (qErr) console.error(`  Error inserting question ${q.id}:`, qErr.message);
    }
  }
  console.log("  Done.");
}

async function migrateWriting() {
  console.log(`Migrating ${writingTasks.length} writing tasks...`);
  for (let i = 0; i < writingTasks.length; i++) {
    const task = writingTasks[i];
    const { error } = await supabase
      .from("writing_tasks")
      .upsert({
        task_id: task.id,
        title: task.title,
        instruction: task.instruction,
        prompt: task.prompt,
        min_words: task.minWords,
        max_words: task.maxWords,
        status: "published",
        sort_order: i,
      }, { onConflict: "task_id" });

    if (error) console.error(`  Error inserting writing task ${task.id}:`, error.message);
  }
  console.log("  Done.");
}

async function migrateSpeaking() {
  console.log(`Migrating ${speakingTasks.length} speaking tasks...`);
  for (let i = 0; i < speakingTasks.length; i++) {
    const task = speakingTasks[i];
    const { error } = await supabase
      .from("speaking_tasks")
      .upsert({
        task_id: task.id,
        title: task.title,
        instruction: task.instruction,
        prompt: task.prompt,
        prep_time: task.prepTime,
        response_time: task.responseTime,
        status: "published",
        sort_order: i,
      }, { onConflict: "task_id" });

    if (error) console.error(`  Error inserting speaking task ${task.id}:`, error.message);
  }
  console.log("  Done.");
}

async function verify() {
  console.log("\nVerification:");
  const tables = [
    { name: "listening_parts", expected: listeningParts.length },
    { name: "reading_parts", expected: readingParts.length },
    { name: "writing_tasks", expected: writingTasks.length },
    { name: "speaking_tasks", expected: speakingTasks.length },
  ];

  for (const t of tables) {
    const { count } = await supabase.from(t.name).select("*", { count: "exact", head: true });
    const status = count === t.expected ? "OK" : "MISMATCH";
    console.log(`  ${t.name}: ${count}/${t.expected} [${status}]`);
  }

  const { count: lqCount } = await supabase.from("listening_questions").select("*", { count: "exact", head: true });
  const expectedLQ = listeningParts.reduce((sum, p) => sum + p.questions.length, 0);
  console.log(`  listening_questions: ${lqCount}/${expectedLQ} [${lqCount === expectedLQ ? "OK" : "MISMATCH"}]`);

  const { count: rqCount } = await supabase.from("reading_questions").select("*", { count: "exact", head: true });
  const expectedRQ = readingParts.reduce((sum, p) => sum + p.questions.length, 0);
  console.log(`  reading_questions: ${rqCount}/${expectedRQ} [${rqCount === expectedRQ ? "OK" : "MISMATCH"}]`);
}

async function main() {
  console.log("Starting content migration...\n");
  await migrateListening();
  await migrateReading();
  await migrateWriting();
  await migrateSpeaking();
  await verify();
  console.log("\nMigration complete!");
}

main().catch(console.error);
