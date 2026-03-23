# Admin Content CRM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an admin CRM for managing CELPIP test content (all 4 sections) with draft/publish workflow, media uploads, and data migration from hardcoded TypeScript files to Supabase.

**Architecture:** Content stored in Supabase PostgreSQL tables with separate tables per section + split question tables for listening/reading. Media in Supabase Storage buckets. RESTful API routes under `/api/admin/content/`. Admin UI pages under `/admin/content/`. Data access layer maps DB rows to existing TypeScript interfaces.

**Tech Stack:** Next.js 16, TypeScript, Supabase (PostgreSQL + Storage + RLS), @base-ui/react AlertDialog, Tailwind CSS 4, Zustand

**Spec:** `docs/superpowers/specs/2026-03-23-admin-content-crm-design.md`

---

## File Structure

### New Files

```
supabase/migrations/20260323_content_crm.sql          # DB schema + RLS + storage buckets
src/lib/content.ts                                      # Data access layer (DB → interfaces, server)
src/lib/content-client.ts                               # Data access layer (DB → interfaces, client)
src/lib/admin-auth.ts                                   # Shared admin auth helpers + table maps
src/components/admin/content/ConfirmDialog.tsx           # Reusable confirmation modal
src/components/admin/content/StatusBadge.tsx             # Draft/Published badge
src/components/admin/content/ContentListTable.tsx        # Reusable table for content lists
src/components/admin/content/MediaUploader.tsx           # Drag-and-drop upload with preview
src/components/admin/content/QuestionEditor.tsx          # Inline question CRUD + reorder
src/components/admin/content/ContentForm.tsx             # Section-specific edit forms
src/app/api/admin/content/[section]/route.ts            # GET list, POST create
src/app/api/admin/content/[section]/[id]/route.ts       # GET, PUT, DELETE single
src/app/api/admin/content/[section]/[id]/publish/route.ts # POST toggle publish
src/app/api/admin/content/[section]/[id]/questions/route.ts       # POST add question
src/app/api/admin/content/[section]/[id]/questions/[qid]/route.ts # PUT, DELETE question
src/app/api/admin/media/upload/route.ts                 # POST upload
src/app/api/admin/media/[id]/route.ts                   # DELETE media
src/app/admin/content/page.tsx                          # Content dashboard
src/app/admin/content/listening/page.tsx                # Listening list
src/app/admin/content/listening/new/page.tsx            # Create listening part
src/app/admin/content/listening/[id]/page.tsx           # Edit listening part
src/app/admin/content/reading/page.tsx                  # Reading list
src/app/admin/content/reading/new/page.tsx              # Create reading part
src/app/admin/content/reading/[id]/page.tsx             # Edit reading part
src/app/admin/content/writing/page.tsx                  # Writing list
src/app/admin/content/writing/new/page.tsx              # Create writing task
src/app/admin/content/writing/[id]/page.tsx             # Edit writing task
src/app/admin/content/speaking/page.tsx                 # Speaking list
src/app/admin/content/speaking/new/page.tsx             # Create speaking task
src/app/admin/content/speaking/[id]/page.tsx            # Edit speaking task
scripts/migrate-content.ts                              # One-time data migration
```

### Modified Files

```
src/lib/celpip-data.ts                                  # Add optional imageUrl/audioUrl to interfaces
src/app/admin/page.tsx                                  # Add "Content Management" nav link
src/app/test/listening/page.tsx                         # Fetch from DB via content.ts
src/app/test/reading/page.tsx                           # Fetch from DB via content.ts
src/app/test/writing/page.tsx                           # Fetch from DB via content.ts
src/app/test/speaking/page.tsx                          # Fetch from DB via content.ts
src/app/quiz/page.tsx                                   # Fetch from DB via content-client.ts
src/app/quiz/[section]/page.tsx                         # Fetch from DB via content-client.ts
src/app/quiz-practice/[section]/page.tsx                # Fetch from DB via content-client.ts
src/app/dashboard/page.tsx                              # Fetch from DB via content-client.ts
```

---

## Task 1: Database Schema Migration

**Files:**
- Create: `supabase/migrations/20260323_content_crm.sql`

- [ ] **Step 1: Write the SQL migration file**

```sql
-- Content CRM Tables
-- listening_parts
CREATE TABLE IF NOT EXISTS listening_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id text UNIQUE NOT NULL,
  title text NOT NULL,
  instruction text NOT NULL,
  transcript text NOT NULL,
  audio_url text,
  image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- reading_parts
CREATE TABLE IF NOT EXISTS reading_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id text UNIQUE NOT NULL,
  title text NOT NULL,
  instruction text NOT NULL,
  passage text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  paid boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- writing_tasks
CREATE TABLE IF NOT EXISTS writing_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id text UNIQUE NOT NULL,
  title text NOT NULL,
  instruction text NOT NULL,
  prompt text NOT NULL,
  min_words integer NOT NULL,
  max_words integer NOT NULL,
  image_url text,
  audio_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- speaking_tasks
CREATE TABLE IF NOT EXISTS speaking_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id text UNIQUE NOT NULL,
  title text NOT NULL,
  instruction text NOT NULL,
  prompt text NOT NULL,
  prep_time integer NOT NULL,
  response_time integer NOT NULL,
  image_url text,
  audio_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- listening_questions
CREATE TABLE IF NOT EXISTS listening_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id text NOT NULL,
  listening_part_id uuid NOT NULL REFERENCES listening_parts(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  passage text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (question_id, listening_part_id)
);

-- reading_questions
CREATE TABLE IF NOT EXISTS reading_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id text NOT NULL,
  reading_part_id uuid NOT NULL REFERENCES reading_parts(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  passage text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (question_id, reading_part_id)
);

-- media tracking
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('image', 'audio')),
  mime_type text NOT NULL,
  file_size integer NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_listening_questions_part ON listening_questions(listening_part_id);
CREATE INDEX idx_reading_questions_part ON reading_questions(reading_part_id);
CREATE INDEX idx_listening_parts_status ON listening_parts(status);
CREATE INDEX idx_reading_parts_status ON reading_parts(status);
CREATE INDEX idx_writing_tasks_status ON writing_tasks(status);
CREATE INDEX idx_speaking_tasks_status ON speaking_tasks(status);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listening_parts_updated_at BEFORE UPDATE ON listening_parts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reading_parts_updated_at BEFORE UPDATE ON reading_parts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER writing_tasks_updated_at BEFORE UPDATE ON writing_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER speaking_tasks_updated_at BEFORE UPDATE ON speaking_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER listening_questions_updated_at BEFORE UPDATE ON listening_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reading_questions_updated_at BEFORE UPDATE ON reading_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE listening_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Admin check helper (reusable)
-- SELECT: published for everyone, all for admin
CREATE POLICY "Anyone can read published listening_parts"
  ON listening_parts FOR SELECT
  USING (status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can insert listening_parts"
  ON listening_parts FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update listening_parts"
  ON listening_parts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete listening_parts"
  ON listening_parts FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- reading_parts RLS (same pattern)
CREATE POLICY "Anyone can read published reading_parts"
  ON reading_parts FOR SELECT
  USING (status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can insert reading_parts"
  ON reading_parts FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update reading_parts"
  ON reading_parts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete reading_parts"
  ON reading_parts FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- writing_tasks RLS
CREATE POLICY "Anyone can read published writing_tasks"
  ON writing_tasks FOR SELECT
  USING (status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can insert writing_tasks"
  ON writing_tasks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update writing_tasks"
  ON writing_tasks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete writing_tasks"
  ON writing_tasks FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- speaking_tasks RLS
CREATE POLICY "Anyone can read published speaking_tasks"
  ON speaking_tasks FOR SELECT
  USING (status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can insert speaking_tasks"
  ON speaking_tasks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update speaking_tasks"
  ON speaking_tasks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete speaking_tasks"
  ON speaking_tasks FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- listening_questions RLS
CREATE POLICY "Public can read questions of published listening parts"
  ON listening_questions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM listening_parts WHERE id = listening_questions.listening_part_id AND status = 'published')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can insert listening_questions"
  ON listening_questions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update listening_questions"
  ON listening_questions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete listening_questions"
  ON listening_questions FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- reading_questions RLS
CREATE POLICY "Public can read questions of published reading parts"
  ON reading_questions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM reading_parts WHERE id = reading_questions.reading_part_id AND status = 'published')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can insert reading_questions"
  ON reading_questions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update reading_questions"
  ON reading_questions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete reading_questions"
  ON reading_questions FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- media RLS
CREATE POLICY "Anyone can read media"
  ON media FOR SELECT USING (true);

CREATE POLICY "Admin can insert media"
  ON media FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete media"
  ON media FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Storage buckets (run via Supabase dashboard or SQL)
INSERT INTO storage.buckets (id, name, public) VALUES ('test-images', 'test-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('test-audio', 'test-audio', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public can read test-images" ON storage.objects FOR SELECT USING (bucket_id = 'test-images');
CREATE POLICY "Admin can upload test-images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'test-images' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can delete test-images" ON storage.objects FOR DELETE USING (
  bucket_id = 'test-images' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can read test-audio" ON storage.objects FOR SELECT USING (bucket_id = 'test-audio');
CREATE POLICY "Admin can upload test-audio" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'test-audio' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can delete test-audio" ON storage.objects FOR DELETE USING (
  bucket_id = 'test-audio' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

- [ ] **Step 2: Apply migration to Supabase**

Run the SQL migration in Supabase dashboard (SQL Editor) or via CLI:
```bash
# If using Supabase CLI:
supabase db push
# Or copy-paste into Supabase Dashboard → SQL Editor → Run
```

- [ ] **Step 3: Verify tables exist**

Run in Supabase SQL Editor:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('listening_parts', 'reading_parts', 'writing_tasks', 'speaking_tasks', 'listening_questions', 'reading_questions', 'media');
```
Expected: 7 rows returned.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260323_content_crm.sql
git commit -m "feat: add content CRM database schema, RLS, and storage buckets"
```

---

## Task 2: Extended TypeScript Interfaces + Data Access Layer

**Files:**
- Create: `src/lib/content-types.ts`
- Create: `src/lib/content.ts`
- Modify: `src/lib/celpip-data.ts` (add optional media fields to interfaces)

- [ ] **Step 1: Add optional media fields to existing interfaces**

In `src/lib/celpip-data.ts`, update the interfaces:

```typescript
// Add to Question interface:
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  passage?: string;
  imageUrl?: string;  // NEW
}

// Add to ListeningPart interface:
export interface ListeningPart {
  id: string;
  title: string;
  instruction: string;
  transcript: string;
  questions: Question[];
  audioUrl?: string;  // NEW
  imageUrl?: string;  // NEW
}

// Add to ReadingPart interface:
export interface ReadingPart {
  id: string;
  title: string;
  instruction: string;
  passage: string;
  questions: Question[];
  paid?: boolean;
  imageUrl?: string;  // NEW
}

// Add to WritingTask interface:
export interface WritingTask {
  id: string;
  title: string;
  instruction: string;
  prompt: string;
  minWords: number;
  maxWords: number;
  imageUrl?: string;  // NEW
  audioUrl?: string;  // NEW
}

// Add to SpeakingTask interface:
export interface SpeakingTask {
  id: string;
  title: string;
  instruction: string;
  prompt: string;
  prepTime: number;
  responseTime: number;
  imageUrl?: string;  // NEW
  audioUrl?: string;  // NEW
}
```

- [ ] **Step 2: Create the data access layer**

Create `src/lib/content.ts`:

```typescript
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
```

- [ ] **Step 3: Verify the app still builds**

```bash
npm run build
```

Expected: Build succeeds (no breaking changes since media fields are optional).

- [ ] **Step 4: Commit**

```bash
git add src/lib/celpip-data.ts src/lib/content.ts
git commit -m "feat: add data access layer for content from Supabase with fallback"
```

---

## Task 3: Data Migration Script

**Files:**
- Create: `scripts/migrate-content.ts`

- [ ] **Step 1: Write the migration script**

Create `scripts/migrate-content.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";
import { listeningParts } from "../src/lib/celpip-data";
import { readingParts } from "../src/lib/celpip-data";
import { writingTasks } from "../src/lib/celpip-data";
import { speakingTasks } from "../src/lib/celpip-data";

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
      // Per-question passage is already resolved to string in the exported data
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
```

- [ ] **Step 2: Run the migration**

```bash
npx tsx scripts/migrate-content.ts
```

Expected: All counts match, all rows marked OK.

- [ ] **Step 3: Commit**

```bash
git add scripts/migrate-content.ts
git commit -m "feat: add content migration script from hardcoded data to Supabase"
```

---

## Task 4: Shared Admin Auth Helper + Content API Routes (List & Create)

**Files:**
- Create: `src/lib/admin-auth.ts`
- Create: `src/app/api/admin/content/[section]/route.ts`

- [ ] **Step 1: Create the shared admin auth helper**

Create `src/lib/admin-auth.ts`:

```typescript
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
```

- [ ] **Step 2: Create the section list + create API route**

Create `src/app/api/admin/content/[section]/route.ts`:

```typescript
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
        const pid = row[fkCol] as string;
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
```

- [ ] **Step 2: Verify the route compiles**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin-auth.ts src/app/api/admin/content/
git commit -m "feat: add shared admin auth helper and content list/create API routes"
```

---

## Task 5: Content API Routes (Get, Update, Delete, Publish)

**Files:**
- Create: `src/app/api/admin/content/[section]/[id]/route.ts`
- Create: `src/app/api/admin/content/[section]/[id]/publish/route.ts`

- [ ] **Step 1: Create the single-item CRUD route**

Create `src/app/api/admin/content/[section]/[id]/route.ts`:

```typescript
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
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  // Attach questions for listening/reading
  if (section === "listening" || section === "reading") {
    const qTable = QUESTION_TABLES[section];
    const fkCol = section === "listening" ? "listening_part_id" : "reading_part_id";
    const { data: questions } = await supabase
      .from(qTable)
      .select("*")
      .eq(fkCol, id)
      .order("sort_order");
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
  // Remove fields that shouldn't be updated directly
  delete body.id;
  delete body.created_at;
  delete body.updated_at;
  delete body.questions;
  delete body.question_count;

  const { data, error } = await supabase.from(table).update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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

  // Questions are cascade-deleted by FK constraint
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Create the publish toggle route**

Create `src/app/api/admin/content/[section]/[id]/publish/route.ts`:

```typescript
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

  // Get current status
  const { data: current, error: fetchErr } = await supabase
    .from(table).select("status").eq("id", id).single();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 404 });

  const newStatus = current.status === "published" ? "draft" : "published";
  const { data, error } = await supabase
    .from(table).update({ status: newStatus }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/content/
git commit -m "feat: add content CRUD and publish toggle API routes"
```

---

## Task 6: Questions API Routes

**Files:**
- Create: `src/app/api/admin/content/[section]/[id]/questions/route.ts`
- Create: `src/app/api/admin/content/[section]/[id]/questions/[qid]/route.ts`

- [ ] **Step 1: Create the add-question route**

Create `src/app/api/admin/content/[section]/[id]/questions/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QUESTION_TABLES, FK_COLUMNS, isAdmin } from "@/lib/admin-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  const { section, id } = await params;
  const qTable = QUESTION_TABLES[section];
  const fkCol = FK_COLUMNS[section];
  if (!qTable) return NextResponse.json({ error: "Section does not have questions" }, { status: 400 });

  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  body[fkCol] = id;

  const { data, error } = await supabase.from(qTable).insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
```

- [ ] **Step 2: Create the update/delete question route**

Create `src/app/api/admin/content/[section]/[id]/questions/[qid]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QUESTION_TABLES, isAdmin } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string; qid: string }> }
) {
  const { section, qid } = await params;
  const qTable = QUESTION_TABLES[section];
  if (!qTable) return NextResponse.json({ error: "Section does not have questions" }, { status: 400 });

  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  delete body.id;
  delete body.created_at;
  delete body.updated_at;

  const { data, error } = await supabase.from(qTable).update(body).eq("id", qid).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string; qid: string }> }
) {
  const { section, qid } = await params;
  const qTable = QUESTION_TABLES[section];
  if (!qTable) return NextResponse.json({ error: "Section does not have questions" }, { status: 400 });

  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { error } = await supabase.from(qTable).delete().eq("id", qid);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/content/
git commit -m "feat: add question CRUD API routes for listening and reading"
```

---

## Task 7: Media Upload/Delete API Routes

**Files:**
- Create: `src/app/api/admin/media/upload/route.ts`
- Create: `src/app/api/admin/media/[id]/route.ts`

- [ ] **Step 1: Create the upload route**

Create `src/app/api/admin/media/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin-auth";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data: { user } } = await supabase.auth.getUser();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const section = formData.get("section") as string;
  const partId = formData.get("partId") as string;

  if (!file || !section || !partId) {
    return NextResponse.json({ error: "Missing file, section, or partId" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");
  if (!isImage && !isAudio) {
    return NextResponse.json({ error: "File must be an image or audio" }, { status: 400 });
  }

  const bucket = isImage ? "test-images" : "test-audio";
  const filePath = `${section}/${partId}/${file.name}`;

  const { error: uploadErr } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

  // Track in media table
  const { data: media, error: mediaErr } = await supabase
    .from("media")
    .insert({
      file_name: file.name,
      file_path: filePath,
      file_type: isImage ? "image" : "audio",
      mime_type: file.type,
      file_size: file.size,
      uploaded_by: user!.id,
    })
    .select()
    .single();

  if (mediaErr) {
    return NextResponse.json({ error: mediaErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ...media,
    publicUrl: urlData.publicUrl,
  }, { status: 201 });
}
```

- [ ] **Step 2: Create the delete media route**

Create `src/app/api/admin/media/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin-auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Get media record
  const { data: media, error: fetchErr } = await supabase
    .from("media").select("*").eq("id", id).single();
  if (fetchErr) return NextResponse.json({ error: "Media not found" }, { status: 404 });

  // Delete from storage
  const bucket = media.file_type === "image" ? "test-images" : "test-audio";
  await supabase.storage.from(bucket).remove([media.file_path]);

  // Delete from media table
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/media/
git commit -m "feat: add media upload and delete API routes"
```

---

## Task 8: Shared Admin CRM Components

**Files:**
- Create: `src/components/admin/content/ConfirmDialog.tsx`
- Create: `src/components/admin/content/StatusBadge.tsx`

- [ ] **Step 1: Create the ConfirmDialog component**

Create `src/components/admin/content/ConfirmDialog.tsx`:

```tsx
"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useState } from "react";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger render={trigger} />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50">
          <AlertDialog.Title className="text-lg font-semibold">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-gray-600">
            {description}
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end gap-3">
            <AlertDialog.Close className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
              {cancelLabel}
            </AlertDialog.Close>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-md text-white ${
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } disabled:opacity-50`}
            >
              {loading ? "..." : confirmLabel}
            </button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
```

- [ ] **Step 2: Create the StatusBadge component**

Create `src/components/admin/content/StatusBadge.tsx`:

```tsx
interface StatusBadgeProps {
  status: "draft" | "published";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === "published"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/content/
git commit -m "feat: add ConfirmDialog and StatusBadge components"
```

---

## Task 9: MediaUploader Component

**Files:**
- Create: `src/components/admin/content/MediaUploader.tsx`

- [ ] **Step 1: Create the MediaUploader component**

Create `src/components/admin/content/MediaUploader.tsx`:

```tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image, Music } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

interface MediaUploaderProps {
  section: string;
  partId: string;
  currentImageUrl?: string | null;
  currentAudioUrl?: string | null;
  onImageUploaded: (url: string, mediaId: string) => void;
  onAudioUploaded: (url: string, mediaId: string) => void;
  onImageRemoved: () => void;
  onAudioRemoved: () => void;
}

export function MediaUploader({
  section,
  partId,
  currentImageUrl,
  currentAudioUrl,
  onImageUploaded,
  onAudioUploaded,
  onImageRemoved,
  onAudioRemoved,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", section);
      formData.append("partId", partId);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Upload failed: ${err.error}`);
        return;
      }

      const data = await res.json();
      if (file.type.startsWith("image/")) {
        onImageUploaded(data.publicUrl, data.id);
      } else {
        onAudioUploaded(data.publicUrl, data.id);
      }
    } finally {
      setUploading(false);
    }
  }, [section, partId, onImageUploaded, onAudioUploaded]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Media</h3>

      {/* Image upload */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Image className="w-4 h-4" />
          <span className="text-sm font-medium">Image</span>
        </div>
        {currentImageUrl ? (
          <div className="relative">
            <img src={currentImageUrl} alt="Content image" className="max-h-48 rounded" />
            <ConfirmDialog
              trigger={
                <button className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700">
                  <X className="w-3 h-3" />
                </button>
              }
              title="Remove Image"
              description="Are you sure you want to remove this file?"
              confirmLabel="Remove"
              variant="danger"
              onConfirm={onImageRemoved}
            />
          </div>
        ) : (
          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        )}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>

      {/* Audio upload */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Music className="w-4 h-4" />
          <span className="text-sm font-medium">Audio</span>
        </div>
        {currentAudioUrl ? (
          <div className="space-y-2">
            <audio controls src={currentAudioUrl} className="w-full" />
            <ConfirmDialog
              trigger={
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50">
                  <X className="w-3 h-3" /> Remove
                </button>
              }
              title="Remove Audio"
              description="Are you sure you want to remove this file?"
              confirmLabel="Remove"
              variant="danger"
              onConfirm={onAudioRemoved}
            />
          </div>
        ) : (
          <button
            onClick={() => audioInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Audio"}
          </button>
        )}
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/content/MediaUploader.tsx
git commit -m "feat: add MediaUploader component with image/audio upload and preview"
```

---

## Task 10: QuestionEditor Component

**Files:**
- Create: `src/components/admin/content/QuestionEditor.tsx`

- [ ] **Step 1: Create the QuestionEditor component**

Create `src/components/admin/content/QuestionEditor.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

interface QuestionData {
  id?: string;
  question_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  passage?: string;
  sort_order: number;
}

interface QuestionEditorProps {
  questions: QuestionData[];
  section: string;
  parentId: string;
  partId: string; // e.g., "L1" — used for generating question IDs
  onQuestionsChange: (questions: QuestionData[]) => void;
}

export function QuestionEditor({
  questions,
  section,
  parentId,
  partId,
  onQuestionsChange,
}: QuestionEditorProps) {
  const [saving, setSaving] = useState<string | null>(null);

  const addQuestion = () => {
    const nextNum = questions.length + 1;
    const questionId = `${partId}Q${nextNum}`;
    const newQ: QuestionData = {
      question_id: questionId,
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      sort_order: questions.length,
    };
    onQuestionsChange([...questions, newQ]);
  };

  const updateQuestion = (index: number, updates: Partial<QuestionData>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    onQuestionsChange(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    const opts = [...updated[qIndex].options];
    opts[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: opts };
    onQuestionsChange(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex] = {
      ...updated[qIndex],
      options: [...updated[qIndex].options, ""],
    };
    onQuestionsChange(updated);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    const opts = updated[qIndex].options.filter((_, i) => i !== optIndex);
    let correctAnswer = updated[qIndex].correct_answer;
    if (optIndex < correctAnswer) correctAnswer--;
    else if (optIndex === correctAnswer) correctAnswer = 0;
    updated[qIndex] = { ...updated[qIndex], options: opts, correct_answer: correctAnswer };
    onQuestionsChange(updated);
  };

  const removeQuestion = async (index: number) => {
    const q = questions[index];
    if (q.id) {
      setSaving(q.id);
      try {
        const res = await fetch(
          `/api/admin/content/${section}/${parentId}/questions/${q.id}`,
          { method: "DELETE" }
        );
        if (!res.ok) {
          alert("Failed to delete question");
          return;
        }
      } finally {
        setSaving(null);
      }
    }
    const updated = questions.filter((_, i) => i !== index);
    updated.forEach((q, i) => (q.sort_order = i));
    onQuestionsChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Questions ({questions.length})
        </h3>
        <button
          onClick={addQuestion}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-3 h-3" /> Add Question
        </button>
      </div>

      {questions.map((q, qIdx) => (
        <div key={q.id || `new-${qIdx}`} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Q{qIdx + 1}: {q.question_id}</span>
            </div>
            <ConfirmDialog
              trigger={
                <button
                  disabled={saving === q.id}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              }
              title="Delete Question"
              description="Are you sure you want to remove this question?"
              confirmLabel="Delete"
              variant="danger"
              onConfirm={() => removeQuestion(qIdx)}
            />
          </div>

          {/* Question text */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Question</label>
            <textarea
              value={q.question}
              onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Per-question passage (optional) */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Passage (optional)</label>
            <textarea
              value={q.passage || ""}
              onChange={(e) => updateQuestion(qIdx, { passage: e.target.value || undefined })}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Per-question passage (if different from main)"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Options</label>
            {q.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name={`correct-${q.id || qIdx}`}
                  checked={q.correct_answer === optIdx}
                  onChange={() => updateQuestion(qIdx, { correct_answer: optIdx })}
                  className="accent-green-600"
                />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  placeholder={`Option ${optIdx + 1}`}
                />
                {q.options.length > 2 && (
                  <button
                    onClick={() => removeOption(qIdx, optIdx)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addOption(qIdx)}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              + Add option
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/content/QuestionEditor.tsx
git commit -m "feat: add QuestionEditor component for inline question management"
```

---

## Task 11: ContentListTable Component

**Files:**
- Create: `src/components/admin/content/ContentListTable.tsx`

- [ ] **Step 1: Create the ContentListTable component**

Create `src/components/admin/content/ContentListTable.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";

interface ContentItem {
  id: string;
  part_id?: string;
  task_id?: string;
  title: string;
  status: "draft" | "published";
  question_count?: number;
  updated_at: string;
}

interface ContentListTableProps {
  items: ContentItem[];
  section: string;
  showQuestionCount?: boolean;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish: (id: string) => Promise<void>;
}

export function ContentListTable({
  items,
  section,
  showQuestionCount = false,
  onDelete,
  onTogglePublish,
}: ContentListTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-3 px-4 font-medium">ID</th>
            <th className="py-3 px-4 font-medium">Title</th>
            <th className="py-3 px-4 font-medium">Status</th>
            {showQuestionCount && <th className="py-3 px-4 font-medium">Questions</th>}
            <th className="py-3 px-4 font-medium">Updated</th>
            <th className="py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-mono text-xs">{item.part_id || item.task_id}</td>
              <td className="py-3 px-4">{item.title}</td>
              <td className="py-3 px-4">
                <StatusBadge status={item.status} />
              </td>
              {showQuestionCount && (
                <td className="py-3 px-4">{item.question_count ?? "-"}</td>
              )}
              <td className="py-3 px-4 text-gray-500">
                {new Date(item.updated_at).toLocaleDateString("en-CA")}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => router.push(`/admin/content/${section}/${item.id}`)}
                    className="p-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <ConfirmDialog
                    trigger={
                      <button
                        className="p-1.5 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded"
                        title={item.status === "published" ? "Unpublish" : "Publish"}
                      >
                        {item.status === "published" ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                    title={item.status === "published" ? "Unpublish Content" : "Publish Content"}
                    description={
                      item.status === "published"
                        ? "This will hide this content from users. It will remain as a draft."
                        : "This will make this content visible to all users."
                    }
                    confirmLabel={item.status === "published" ? "Unpublish" : "Publish"}
                    onConfirm={() => onTogglePublish(item.id)}
                  />
                  <ConfirmDialog
                    trigger={
                      <button
                        className="p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    }
                    title="Delete Content"
                    description={`This will permanently delete this ${section} content and all its questions and media. This cannot be undone.`}
                    confirmLabel="Delete"
                    variant="danger"
                    onConfirm={() => onDelete(item.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={showQuestionCount ? 6 : 5} className="py-8 text-center text-gray-400">
                No content found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/content/ContentListTable.tsx
git commit -m "feat: add ContentListTable component for content list views"
```

---

## Task 12: Content Dashboard Page

**Files:**
- Create: `src/app/admin/content/page.tsx`
- Modify: `src/app/admin/page.tsx` (add nav link)

- [ ] **Step 1: Create the content dashboard page**

Create `src/app/admin/content/page.tsx`:

```tsx
"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Headphones, PenTool, Mic } from "lucide-react";

interface SectionStats {
  total: number;
  published: number;
  draft: number;
}

const SECTIONS = [
  { key: "listening", label: "Listening", icon: Headphones },
  { key: "reading", label: "Reading", icon: BookOpen },
  { key: "writing", label: "Writing", icon: PenTool },
  { key: "speaking", label: "Speaking", icon: Mic },
];

export default function ContentDashboard() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, SectionStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && currentUser?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    async function fetchStats() {
      const results: Record<string, SectionStats> = {};
      for (const s of SECTIONS) {
        try {
          const res = await fetch(`/api/admin/content/${s.key}`);
          if (res.ok) {
            const data = await res.json();
            results[s.key] = {
              total: data.length,
              published: data.filter((d: { status: string }) => d.status === "published").length,
              draft: data.filter((d: { status: string }) => d.status === "draft").length,
            };
          }
        } catch {
          results[s.key] = { total: 0, published: 0, draft: 0 };
        }
      }
      setStats(results);
      setLoading(false);
    }
    if (currentUser?.role === "admin") fetchStats();
  }, [currentUser]);

  if (authLoading || loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map(({ key, label, icon: Icon }) => {
          const s = stats[key] || { total: 0, published: 0, draft: 0 };
          return (
            <button
              key={key}
              onClick={() => router.push(`/admin/content/${key}`)}
              className="flex items-start gap-4 p-6 border rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <Icon className="w-8 h-8 text-blue-600 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold">{label}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {s.total} total &middot; {s.published} published &middot; {s.draft} draft
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add "Content Management" link to admin page**

In `src/app/admin/page.tsx`, find the admin navigation area and add a link/button to `/admin/content`. Look for where tabs or navigation links are rendered and add:

```tsx
<button
  onClick={() => router.push("/admin/content")}
  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
>
  Content Management
</button>
```

Place this near the top of the admin page, after the title/header area.

- [ ] **Step 3: Verify build and test navigation**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/content/page.tsx src/app/admin/page.tsx
git commit -m "feat: add content dashboard page and admin nav link"
```

---

## Task 13: Section List Pages (Listening, Reading, Writing, Speaking)

**Files:**
- Create: `src/app/admin/content/listening/page.tsx`
- Create: `src/app/admin/content/reading/page.tsx`
- Create: `src/app/admin/content/writing/page.tsx`
- Create: `src/app/admin/content/speaking/page.tsx`

- [ ] **Step 1: Create a shared section list page pattern**

All four section list pages follow the same pattern. Create `src/app/admin/content/listening/page.tsx`:

```tsx
"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { ContentListTable } from "@/components/admin/content/ContentListTable";

export default function ListeningListPage() {
  const section = "listening";
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const res = await fetch(`/api/admin/content/${section}`);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && currentUser?.role !== "admin") router.push("/dashboard");
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    if (currentUser?.role === "admin") fetchItems();
  }, [currentUser, fetchItems]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/content/${section}/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  };

  const handleTogglePublish = async (id: string) => {
    const res = await fetch(`/api/admin/content/${section}/${id}/publish`, { method: "POST" });
    if (res.ok) fetchItems();
  };

  if (authLoading || loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/content")} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold capitalize">{section} Parts</h1>
        </div>
        <button
          onClick={() => router.push(`/admin/content/${section}/new`)}
          className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> New Part
        </button>
      </div>
      <ContentListTable
        items={items}
        section={section}
        showQuestionCount={true}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create reading list page**

Create `src/app/admin/content/reading/page.tsx` — same as listening but with `section = "reading"` and `showQuestionCount={true}`.

- [ ] **Step 3: Create writing list page**

Create `src/app/admin/content/writing/page.tsx` — same pattern but with `section = "writing"`, title "Writing Tasks", button label "New Task", and `showQuestionCount={false}`.

- [ ] **Step 4: Create speaking list page**

Create `src/app/admin/content/speaking/page.tsx` — same pattern but with `section = "speaking"`, title "Speaking Tasks", button label "New Task", and `showQuestionCount={false}`.

- [ ] **Step 5: Verify build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/content/listening/page.tsx src/app/admin/content/reading/page.tsx src/app/admin/content/writing/page.tsx src/app/admin/content/speaking/page.tsx
git commit -m "feat: add section list pages for all four content sections"
```

---

## Task 14: Listening Edit/Create Pages

**Files:**
- Create: `src/app/admin/content/listening/new/page.tsx`
- Create: `src/app/admin/content/listening/[id]/page.tsx`

- [ ] **Step 1: Create the listening create page**

Create `src/app/admin/content/listening/new/page.tsx`:

```tsx
"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MediaUploader } from "@/components/admin/content/MediaUploader";
import { QuestionEditor } from "@/components/admin/content/QuestionEditor";
import { ConfirmDialog } from "@/components/admin/content/ConfirmDialog";

export default function NewListeningPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    part_id: "",
    title: "",
    instruction: "",
    transcript: "",
    audio_url: null as string | null,
    image_url: null as string | null,
    status: "draft" as "draft" | "published",
    sort_order: 0,
  });
  const [questions, setQuestions] = useState<Array<{
    id?: string;
    question_id: string;
    question: string;
    options: string[];
    correct_answer: number;
    passage?: string;
    sort_order: number;
  }>>([]);

  useEffect(() => {
    if (!authLoading && currentUser?.role !== "admin") router.push("/dashboard");
  }, [authLoading, currentUser, router]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/listening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error}`);
        return;
      }
      const data = await res.json();

      // Save questions
      for (const q of questions) {
        await fetch(`/api/admin/content/listening/${data.id}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(q),
        });
      }

      router.push(`/admin/content/listening`);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/content/listening")} className="p-1 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">New Listening Part</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Part ID</label>
            <input
              type="text"
              value={form.part_id}
              onChange={(e) => setForm({ ...form, part_id: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="e.g., L7"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instruction</label>
          <textarea
            value={form.instruction}
            onChange={(e) => setForm({ ...form, instruction: e.target.value })}
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transcript</label>
          <textarea
            value={form.transcript}
            onChange={(e) => setForm({ ...form, transcript: e.target.value })}
            rows={8}
            className="w-full border rounded px-3 py-2 text-sm font-mono"
          />
        </div>

        <MediaUploader
          section="listening"
          partId={form.part_id || "new"}
          currentImageUrl={form.image_url}
          currentAudioUrl={form.audio_url}
          onImageUploaded={(url) => setForm({ ...form, image_url: url })}
          onAudioUploaded={(url) => setForm({ ...form, audio_url: url })}
          onImageRemoved={() => setForm({ ...form, image_url: null })}
          onAudioRemoved={() => setForm({ ...form, audio_url: null })}
        />

        <QuestionEditor
          questions={questions}
          section="listening"
          parentId=""
          partId={form.part_id || "NEW"}
          onQuestionsChange={setQuestions}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => router.push("/admin/content/listening")}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <ConfirmDialog
            trigger={
              <button
                disabled={saving || !form.part_id || !form.title}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create"}
              </button>
            }
            title="Create Listening Part"
            description="Are you sure you want to create this listening content?"
            confirmLabel="Create"
            onConfirm={handleCreate}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the listening edit page**

Create `src/app/admin/content/listening/[id]/page.tsx`:

```tsx
"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { MediaUploader } from "@/components/admin/content/MediaUploader";
import { QuestionEditor } from "@/components/admin/content/QuestionEditor";
import { StatusBadge } from "@/components/admin/content/StatusBadge";
import { ConfirmDialog } from "@/components/admin/content/ConfirmDialog";

export default function EditListeningPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [questions, setQuestions] = useState<Array<{
    id?: string;
    question_id: string;
    question: string;
    options: string[];
    correct_answer: number;
    passage?: string;
    sort_order: number;
  }>>([]);

  useEffect(() => {
    if (!authLoading && currentUser?.role !== "admin") router.push("/dashboard");
  }, [authLoading, currentUser, router]);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/content/listening/${id}`);
    if (!res.ok) {
      router.push("/admin/content/listening");
      return;
    }
    const data = await res.json();
    setForm(data);
    setQuestions(data.questions || []);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    if (currentUser?.role === "admin") fetchData();
  }, [currentUser, fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/listening/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error}`);
        return;
      }

      // Save/create questions
      for (const q of questions) {
        if (q.id) {
          await fetch(`/api/admin/content/listening/${id}/questions/${q.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(q),
          });
        } else {
          await fetch(`/api/admin/content/listening/${id}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(q),
          });
        }
      }

      router.push("/admin/content/listening");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/content/listening")} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Edit Listening Part</h1>
          <StatusBadge status={form.status as "draft" | "published"} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Part ID</label>
            <input
              type="text"
              value={(form.part_id as string) || ""}
              onChange={(e) => setForm({ ...form, part_id: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={(form.sort_order as number) || 0}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={(form.title as string) || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instruction</label>
          <textarea
            value={(form.instruction as string) || ""}
            onChange={(e) => setForm({ ...form, instruction: e.target.value })}
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transcript</label>
          <textarea
            value={(form.transcript as string) || ""}
            onChange={(e) => setForm({ ...form, transcript: e.target.value })}
            rows={8}
            className="w-full border rounded px-3 py-2 text-sm font-mono"
          />
        </div>

        <MediaUploader
          section="listening"
          partId={(form.part_id as string) || id}
          currentImageUrl={form.image_url as string | null}
          currentAudioUrl={form.audio_url as string | null}
          onImageUploaded={(url) => setForm({ ...form, image_url: url })}
          onAudioUploaded={(url) => setForm({ ...form, audio_url: url })}
          onImageRemoved={() => setForm({ ...form, image_url: null })}
          onAudioRemoved={() => setForm({ ...form, audio_url: null })}
        />

        <QuestionEditor
          questions={questions}
          section="listening"
          parentId={id}
          partId={(form.part_id as string) || ""}
          onQuestionsChange={setQuestions}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => router.push("/admin/content/listening")}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <ConfirmDialog
            trigger={
              <button
                disabled={saving}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            }
            title="Save Changes"
            description="Are you sure you want to save these changes?"
            confirmLabel="Save"
            onConfirm={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/content/listening/
git commit -m "feat: add listening create and edit pages"
```

---

## Task 15: Reading Edit/Create Pages

**Files:**
- Create: `src/app/admin/content/reading/new/page.tsx`
- Create: `src/app/admin/content/reading/[id]/page.tsx`

- [ ] **Step 1: Create reading new page**

Same pattern as listening but with reading-specific fields:
- `passage` textarea instead of `transcript`
- `paid` boolean toggle (checkbox)
- Section = "reading"

- [ ] **Step 2: Create reading edit page**

Same pattern as listening edit but with reading-specific fields.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/content/reading/
git commit -m "feat: add reading create and edit pages"
```

---

## Task 16: Writing Edit/Create Pages

**Files:**
- Create: `src/app/admin/content/writing/new/page.tsx`
- Create: `src/app/admin/content/writing/[id]/page.tsx`

- [ ] **Step 1: Create writing new page**

Writing-specific fields (no questions, no transcript/passage):
- `task_id` instead of `part_id`
- `prompt` textarea
- `min_words` and `max_words` number inputs
- MediaUploader for optional image/audio
- No QuestionEditor

- [ ] **Step 2: Create writing edit page**

Same pattern with writing-specific fields.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/content/writing/
git commit -m "feat: add writing create and edit pages"
```

---

## Task 17: Speaking Edit/Create Pages

**Files:**
- Create: `src/app/admin/content/speaking/new/page.tsx`
- Create: `src/app/admin/content/speaking/[id]/page.tsx`

- [ ] **Step 1: Create speaking new page**

Speaking-specific fields (no questions):
- `task_id` instead of `part_id`
- `prompt` textarea
- `prep_time` and `response_time` number inputs (in seconds)
- MediaUploader for optional image/audio
- No QuestionEditor

- [ ] **Step 2: Create speaking edit page**

Same pattern with speaking-specific fields.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/content/speaking/
git commit -m "feat: add speaking create and edit pages"
```

---

## Task 18: Update Test Pages to Fetch from Database

**Files:**
- Modify: `src/app/test/listening/page.tsx`
- Modify: `src/app/test/reading/page.tsx`
- Modify: `src/app/test/writing/page.tsx`
- Modify: `src/app/test/speaking/page.tsx`

- [ ] **Step 1: Update listening test page**

In `src/app/test/listening/page.tsx`, replace:
```typescript
import { listeningPartsOfficial as listeningParts } from "@/lib/celpip-data";
```

The test pages are client components ("use client"). Since `content.ts` uses the server Supabase client, you need to either:
- Create a client-side fetch wrapper, OR
- Pass data from a server component parent

**Approach:** Add a client-side content fetcher in `src/lib/content-client.ts`:

```typescript
import { createClient } from "@/lib/supabase/client";
import type { ListeningPart, ReadingPart, WritingTask, SpeakingTask, Question } from "./celpip-data";
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
    passage: (row.passage as string) || undefined,
    imageUrl: (row.image_url as string) || undefined,
  };
}

export async function fetchListeningParts(): Promise<ListeningPart[]> {
  const supabase = createClient();
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

  const qMap = new Map<string, Question[]>();
  for (const q of questions || []) {
    const list = qMap.get(q.listening_part_id) || [];
    list.push(mapQuestion(q));
    qMap.set(q.listening_part_id, list);
  }

  return parts.map((p) => ({
    id: p.part_id,
    title: p.title,
    instruction: p.instruction,
    transcript: p.transcript,
    questions: qMap.get(p.id) || [],
    audioUrl: p.audio_url || undefined,
    imageUrl: p.image_url || undefined,
  }));
}

export async function fetchReadingParts(): Promise<ReadingPart[]> {
  const supabase = createClient();
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

  const qMap = new Map<string, Question[]>();
  for (const q of questions || []) {
    const list = qMap.get(q.reading_part_id) || [];
    list.push(mapQuestion(q));
    qMap.set(q.reading_part_id, list);
  }

  return parts.map((p) => ({
    id: p.part_id,
    title: p.title,
    instruction: p.instruction,
    passage: p.passage,
    questions: qMap.get(p.id) || [],
    paid: p.paid === true ? true : undefined,
    imageUrl: p.image_url || undefined,
  }));
}

export async function fetchWritingTasks(): Promise<WritingTask[]> {
  const supabase = createClient();
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

export async function fetchSpeakingTasks(): Promise<SpeakingTask[]> {
  const supabase = createClient();
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
```

Create `src/lib/content-client.ts` with the above code.

- [ ] **Step 2: Update listening test page to use DB data**

In `src/app/test/listening/page.tsx`:
- Replace `import { listeningPartsOfficial as listeningParts } from "@/lib/celpip-data"` with:
  ```typescript
  import { fetchListeningParts } from "@/lib/content-client";
  import type { ListeningPart } from "@/lib/celpip-data";
  ```
- Add state and effect to load data:
  ```typescript
  const [listeningParts, setListeningParts] = useState<ListeningPart[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchListeningParts().then((parts) => {
      setListeningParts(parts);
      setDataLoading(false);
    });
  }, []);
  ```
- Add loading gate before rendering test content
- **IMPORTANT:** Update all `useMemo` dependency arrays that reference the data. The existing pages use `useMemo(() => listeningParts.flatMap(...), [])` with empty deps because data was a static import. Now that data is in state, the dependency array must include the state variable: `useMemo(() => listeningParts.flatMap(...), [listeningParts])`
- Keep the rest of the component logic the same (it already uses `listeningParts` as a variable)

- [ ] **Step 3: Update reading, writing, speaking test pages**

Apply the same pattern to each:
- `src/app/test/reading/page.tsx` — use `fetchReadingParts`
- `src/app/test/writing/page.tsx` — use `fetchWritingTasks`
- `src/app/test/speaking/page.tsx` — use `fetchSpeakingTasks`

- [ ] **Step 4: Update quiz pages**

In `src/app/quiz/page.tsx` and `src/app/quiz/[section]/page.tsx`:
- Replace hardcoded imports with client fetchers
- Add loading states
- Update `useMemo` dependency arrays

- [ ] **Step 5: Update quiz-practice and dashboard pages**

In `src/app/quiz-practice/[section]/page.tsx`:
- Replace `writingTasks`, `speakingTasks` imports with `fetchWritingTasks`, `fetchSpeakingTasks`
- Add loading state and `useMemo` dependency updates

In `src/app/dashboard/page.tsx`:
- Replace `listeningParts`, `readingParts`, `writingTasks`, `speakingTasks` imports with client fetchers
- Add loading state

- [ ] **Step 6: Verify build**

```bash
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/content-client.ts src/app/test/ src/app/quiz/ src/app/quiz-practice/ src/app/dashboard/
git commit -m "feat: update test, quiz, and dashboard pages to fetch content from Supabase"
```

---

## Task 19: End-to-End Verification

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify admin CRM flow**

1. Log in as admin
2. Navigate to `/admin` → click "Content Management"
3. Verify dashboard shows correct counts for all 4 sections
4. Click into Listening → verify list shows all migrated parts
5. Click edit on a part → verify form is pre-filled with correct data
6. Modify a field → click Save → confirm dialog → verify change persisted
7. Create a new listening part → add questions → verify it appears in list
8. Toggle publish/unpublish → verify status badge changes
9. Delete a part → confirm dialog → verify it's removed
10. Test media upload (image + audio) on a part

- [ ] **Step 3: Verify test-taking pages still work**

1. Navigate to `/test/listening` → verify questions load from DB
2. Complete a few questions → verify answers save correctly
3. Check `/test/reading`, `/test/writing`, `/test/speaking`
4. Check `/quiz` page loads all parts from DB

- [ ] **Step 4: Verify draft/publish workflow**

1. Create a new part with status "draft"
2. Verify it does NOT appear in the test-taking pages
3. Publish it → verify it NOW appears in test-taking pages
4. Unpublish it → verify it disappears again

- [ ] **Step 5: Final build check**

```bash
npm run build
```

Expected: Clean build with no errors.

- [ ] **Step 6: Commit any remaining fixes**

```bash
git add -A
git commit -m "fix: address issues found during end-to-end verification"
```
