-- AI-Native Score Improvement System: Database Migration
-- Creates tables for AI scoring, diagnostics, and study planning

-- ─── New Table: user_goals ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_goals (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  goal_score    integer NOT NULL CHECK (goal_score BETWEEN 2 AND 12),
  target_date   date,
  focus_sections text[] DEFAULT '{}',
  sessions_per_day integer DEFAULT 2 CHECK (sessions_per_day BETWEEN 1 AND 10),
  created_at    timestamptz DEFAULT now(),
  active        boolean DEFAULT true
);

-- Partial unique index: only one active goal per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_goals_active
  ON user_goals (user_id) WHERE (active = true);

-- ─── New Table: ai_scores ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_scores (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  test_record_id  uuid REFERENCES test_records(id) ON DELETE CASCADE,
  section         text NOT NULL CHECK (section IN ('writing', 'speaking')),
  task_id         text NOT NULL,
  task_type       text NOT NULL,
  scores          jsonb NOT NULL,
  weaknesses      text[] DEFAULT '{}',
  improvements    jsonb DEFAULT '[]',
  high_score_sample text,
  practice_tasks  text[] DEFAULT '{}',
  raw_response    text NOT NULL,
  model_version   text NOT NULL,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_scores_user_section
  ON ai_scores (user_id, section, created_at DESC);

-- ─── New Table: diagnostics ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS diagnostics (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  section          text NOT NULL CHECK (section IN ('writing', 'speaking')),
  analysis_window  int NOT NULL DEFAULT 5,
  patterns         jsonb NOT NULL,
  recommendations  text[] NOT NULL,
  score_trajectory jsonb NOT NULL,
  predicted_score  numeric(3,1),
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnostics_user
  ON diagnostics (user_id, section, created_at DESC);

-- ─── Alter existing tables ──────────────────────────────────────────────────────

-- Add current_goal_id to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'current_goal_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_goal_id uuid REFERENCES user_goals(id);
  END IF;
END $$;

-- Add AI planner columns to schedule_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'schedule_items' AND column_name = 'source'
  ) THEN
    ALTER TABLE schedule_items ADD COLUMN source text DEFAULT 'manual';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'schedule_items' AND column_name = 'ai_metadata'
  ) THEN
    ALTER TABLE schedule_items ADD COLUMN ai_metadata jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'schedule_items' AND column_name = 'diagnostic_id'
  ) THEN
    ALTER TABLE schedule_items ADD COLUMN diagnostic_id uuid REFERENCES diagnostics(id);
  END IF;
END $$;

-- ─── Row Level Security ─────────────────────────────────────────────────────────

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;

-- user_goals: users can only access their own goals
CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals"
  ON user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE USING (auth.uid() = user_id);

-- ai_scores: users can only access their own scores
CREATE POLICY "Users can view own ai_scores"
  ON ai_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai_scores"
  ON ai_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- diagnostics: users can only access their own diagnostics
CREATE POLICY "Users can view own diagnostics"
  ON diagnostics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own diagnostics"
  ON diagnostics FOR INSERT WITH CHECK (auth.uid() = user_id);
