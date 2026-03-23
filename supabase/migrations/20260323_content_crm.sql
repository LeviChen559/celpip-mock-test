-- ============================================================
-- Content CRM Schema
-- ============================================================

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE listening_parts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id      text UNIQUE NOT NULL,
  title        text NOT NULL,
  instruction  text NOT NULL,
  transcript   text NOT NULL,
  audio_url    text,
  image_url    text,
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order   int  NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE TABLE reading_parts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id      text UNIQUE NOT NULL,
  title        text NOT NULL,
  instruction  text NOT NULL,
  passage      text NOT NULL,
  image_url    text,
  paid         boolean NOT NULL DEFAULT false,
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order   int  NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE TABLE writing_tasks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id      text UNIQUE NOT NULL,
  title        text NOT NULL,
  instruction  text NOT NULL,
  prompt       text NOT NULL,
  min_words    int  NOT NULL,
  max_words    int  NOT NULL,
  image_url    text,
  audio_url    text,
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order   int  NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE TABLE speaking_tasks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id       text UNIQUE NOT NULL,
  title         text NOT NULL,
  instruction   text NOT NULL,
  prompt        text NOT NULL,
  prep_time     int  NOT NULL,
  response_time int  NOT NULL,
  image_url     text,
  audio_url     text,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order    int  NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE TABLE listening_questions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id        text NOT NULL,
  listening_part_id  uuid NOT NULL REFERENCES listening_parts (id) ON DELETE CASCADE,
  question           text NOT NULL,
  options            jsonb NOT NULL,
  correct_answer     int  NOT NULL,
  passage            text,
  image_url          text,
  sort_order         int  NOT NULL DEFAULT 0,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now(),
  UNIQUE (question_id, listening_part_id)
);

CREATE TABLE reading_questions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id      text NOT NULL,
  reading_part_id  uuid NOT NULL REFERENCES reading_parts (id) ON DELETE CASCADE,
  question         text NOT NULL,
  options          jsonb NOT NULL,
  correct_answer   int  NOT NULL,
  passage          text,
  image_url        text,
  sort_order       int  NOT NULL DEFAULT 0,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now(),
  UNIQUE (question_id, reading_part_id)
);

CREATE TABLE media (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name    text NOT NULL,
  file_path    text NOT NULL,
  file_type    text NOT NULL CHECK (file_type IN ('image', 'audio')),
  mime_type    text NOT NULL,
  file_size    int  NOT NULL,
  uploaded_by  uuid NOT NULL REFERENCES profiles (id),
  created_at   timestamptz DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX ON listening_questions (listening_part_id);
CREATE INDEX ON reading_questions  (reading_part_id);

CREATE INDEX ON listening_parts (status);
CREATE INDEX ON reading_parts   (status);
CREATE INDEX ON writing_tasks   (status);
CREATE INDEX ON speaking_tasks  (status);

-- ============================================================
-- updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_listening_parts_updated_at
  BEFORE UPDATE ON listening_parts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reading_parts_updated_at
  BEFORE UPDATE ON reading_parts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_writing_tasks_updated_at
  BEFORE UPDATE ON writing_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_speaking_tasks_updated_at
  BEFORE UPDATE ON speaking_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_listening_questions_updated_at
  BEFORE UPDATE ON listening_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reading_questions_updated_at
  BEFORE UPDATE ON reading_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE listening_parts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_parts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_tasks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_tasks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_questions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE media               ENABLE ROW LEVEL SECURITY;

-- listening_parts
CREATE POLICY "listening_parts_select" ON listening_parts
  FOR SELECT USING (
    status = 'published'
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "listening_parts_insert" ON listening_parts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "listening_parts_update" ON listening_parts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "listening_parts_delete" ON listening_parts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- reading_parts
CREATE POLICY "reading_parts_select" ON reading_parts
  FOR SELECT USING (
    status = 'published'
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "reading_parts_insert" ON reading_parts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "reading_parts_update" ON reading_parts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "reading_parts_delete" ON reading_parts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- writing_tasks
CREATE POLICY "writing_tasks_select" ON writing_tasks
  FOR SELECT USING (
    status = 'published'
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "writing_tasks_insert" ON writing_tasks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "writing_tasks_update" ON writing_tasks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "writing_tasks_delete" ON writing_tasks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- speaking_tasks
CREATE POLICY "speaking_tasks_select" ON speaking_tasks
  FOR SELECT USING (
    status = 'published'
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "speaking_tasks_insert" ON speaking_tasks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "speaking_tasks_update" ON speaking_tasks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "speaking_tasks_delete" ON speaking_tasks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- listening_questions
CREATE POLICY "listening_questions_select" ON listening_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listening_parts lp
      WHERE lp.id = listening_part_id AND lp.status = 'published'
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "listening_questions_insert" ON listening_questions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "listening_questions_update" ON listening_questions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "listening_questions_delete" ON listening_questions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- reading_questions
CREATE POLICY "reading_questions_select" ON reading_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reading_parts rp
      WHERE rp.id = reading_part_id AND rp.status = 'published'
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "reading_questions_insert" ON reading_questions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "reading_questions_update" ON reading_questions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "reading_questions_delete" ON reading_questions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- media
CREATE POLICY "media_select" ON media
  FOR SELECT USING (true);

CREATE POLICY "media_insert" ON media
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "media_delete" ON media
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- Storage buckets
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('test-images', 'test-images', true),
  ('test-audio',  'test-audio',  true)
ON CONFLICT (id) DO NOTHING;

-- test-images: public read
CREATE POLICY "test_images_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'test-images');

-- test-images: admin upload
CREATE POLICY "test_images_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'test-images'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- test-images: admin delete
CREATE POLICY "test_images_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'test-images'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- test-audio: public read
CREATE POLICY "test_audio_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'test-audio');

-- test-audio: admin upload
CREATE POLICY "test_audio_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'test-audio'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- test-audio: admin delete
CREATE POLICY "test_audio_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'test-audio'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
