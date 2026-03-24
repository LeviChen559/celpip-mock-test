-- Migration: Rename old short IDs to new descriptive IDs
-- Run this in the Supabase SQL Editor
-- This updates BOTH:
--   1. Any table with a `part_id` column (your content table)
--   2. The `test_records.details` JSONB (answer keys inside stored records)

-- ============================================================
-- PART 1: Update part_id column (adjust table name if needed)
-- ============================================================
-- If your table is NOT called "listening_parts", replace the
-- table name below with the correct one.

-- Listening
UPDATE listening_parts SET part_id = 'Listening-Practice-01' WHERE part_id = 'L0';
UPDATE listening_parts SET part_id = 'Listening-Part1-01' WHERE part_id = 'L1';
UPDATE listening_parts SET part_id = 'Listening-Part2-01' WHERE part_id = 'L2';
UPDATE listening_parts SET part_id = 'Listening-Part3-01' WHERE part_id = 'L3';
UPDATE listening_parts SET part_id = 'Listening-Part4-01' WHERE part_id = 'L4';
UPDATE listening_parts SET part_id = 'Listening-Part5-01' WHERE part_id = 'L5';
UPDATE listening_parts SET part_id = 'Listening-Part6-01' WHERE part_id = 'L6';
UPDATE listening_parts SET part_id = 'Listening-Part1-02' WHERE part_id = 'L7';
UPDATE listening_parts SET part_id = 'Listening-Part2-02' WHERE part_id = 'L8';
UPDATE listening_parts SET part_id = 'Listening-Part3-02' WHERE part_id = 'L9';
UPDATE listening_parts SET part_id = 'Listening-Part4-02' WHERE part_id = 'L10';
UPDATE listening_parts SET part_id = 'Listening-Part5-02' WHERE part_id = 'L11';
UPDATE listening_parts SET part_id = 'Listening-Part6-02' WHERE part_id = 'L12';
UPDATE listening_parts SET part_id = 'Listening-Part1-03' WHERE part_id = 'L13';
UPDATE listening_parts SET part_id = 'Listening-Part4-03' WHERE part_id = 'L14';
UPDATE listening_parts SET part_id = 'Listening-Part5-03' WHERE part_id = 'L15';

-- Writing (adjust table name if needed)
UPDATE writing_tasks SET part_id = 'Writing-Task1-01' WHERE part_id = 'W1';
UPDATE writing_tasks SET part_id = 'Writing-Task2-01' WHERE part_id = 'W2';
UPDATE writing_tasks SET part_id = 'Writing-Task1-02' WHERE part_id = 'W3';
UPDATE writing_tasks SET part_id = 'Writing-Task2-02' WHERE part_id = 'W4';
UPDATE writing_tasks SET part_id = 'Writing-Task1-03' WHERE part_id = 'W5';
UPDATE writing_tasks SET part_id = 'Writing-Task2-03' WHERE part_id = 'W6';
UPDATE writing_tasks SET part_id = 'Writing-Task1-04' WHERE part_id = 'W7';
UPDATE writing_tasks SET part_id = 'Writing-Task2-04' WHERE part_id = 'W8';
UPDATE writing_tasks SET part_id = 'Writing-Task1-05' WHERE part_id = 'W9';
UPDATE writing_tasks SET part_id = 'Writing-Task2-05' WHERE part_id = 'W10';
UPDATE writing_tasks SET part_id = 'Writing-Task1-06' WHERE part_id = 'W11';
UPDATE writing_tasks SET part_id = 'Writing-Task2-06' WHERE part_id = 'W12';
UPDATE writing_tasks SET part_id = 'Writing-Task1-07' WHERE part_id = 'W13';
UPDATE writing_tasks SET part_id = 'Writing-Task2-07' WHERE part_id = 'W14';
UPDATE writing_tasks SET part_id = 'Writing-Task1-08' WHERE part_id = 'W15';
UPDATE writing_tasks SET part_id = 'Writing-Task2-08' WHERE part_id = 'W16';
UPDATE writing_tasks SET part_id = 'Writing-Task1-09' WHERE part_id = 'W17';
UPDATE writing_tasks SET part_id = 'Writing-Task2-09' WHERE part_id = 'W18';

-- Speaking (adjust table name if needed)
UPDATE speaking_tasks SET part_id = 'Speaking-Practice-01' WHERE part_id = 'S0';
UPDATE speaking_tasks SET part_id = 'Speaking-Task1-01' WHERE part_id = 'S1';
UPDATE speaking_tasks SET part_id = 'Speaking-Task2-01' WHERE part_id = 'S2';
UPDATE speaking_tasks SET part_id = 'Speaking-Task3-01' WHERE part_id = 'S3';
UPDATE speaking_tasks SET part_id = 'Speaking-Task4-01' WHERE part_id = 'S4';
UPDATE speaking_tasks SET part_id = 'Speaking-Task5-01' WHERE part_id = 'S5';
UPDATE speaking_tasks SET part_id = 'Speaking-Task6-01' WHERE part_id = 'S6';
UPDATE speaking_tasks SET part_id = 'Speaking-Task7-01' WHERE part_id = 'S7';
UPDATE speaking_tasks SET part_id = 'Speaking-Task8-01' WHERE part_id = 'S8';
UPDATE speaking_tasks SET part_id = 'Speaking-Task1-02' WHERE part_id = 'S9';
UPDATE speaking_tasks SET part_id = 'Speaking-Task2-02' WHERE part_id = 'S10';
UPDATE speaking_tasks SET part_id = 'Speaking-Task3-02' WHERE part_id = 'S11';
UPDATE speaking_tasks SET part_id = 'Speaking-Task4-02' WHERE part_id = 'S12';
UPDATE speaking_tasks SET part_id = 'Speaking-Task5-02' WHERE part_id = 'S13';
UPDATE speaking_tasks SET part_id = 'Speaking-Task6-02' WHERE part_id = 'S14';
UPDATE speaking_tasks SET part_id = 'Speaking-Task7-02' WHERE part_id = 'S15';
UPDATE speaking_tasks SET part_id = 'Speaking-Task8-02' WHERE part_id = 'S16';
UPDATE speaking_tasks SET part_id = 'Speaking-Task1-03' WHERE part_id = 'S17';
UPDATE speaking_tasks SET part_id = 'Speaking-Task2-03' WHERE part_id = 'S18';
UPDATE speaking_tasks SET part_id = 'Speaking-Task3-03' WHERE part_id = 'S19';
UPDATE speaking_tasks SET part_id = 'Speaking-Task4-03' WHERE part_id = 'S20';
UPDATE speaking_tasks SET part_id = 'Speaking-Task5-03' WHERE part_id = 'S21';
UPDATE speaking_tasks SET part_id = 'Speaking-Task6-03' WHERE part_id = 'S22';
UPDATE speaking_tasks SET part_id = 'Speaking-Task7-03' WHERE part_id = 'S23';
UPDATE speaking_tasks SET part_id = 'Speaking-Task8-03' WHERE part_id = 'S24';

-- ============================================================
-- PART 2: Update question IDs inside test_records.details JSONB
-- ============================================================
-- This updates the answer keys stored in details->'answers'->'quiz'
-- and details->'answers'->'listening' for existing test records.
--
-- Listening question IDs (L0Q1 -> Listening-Practice-01-Q1, etc.)
-- This requires a function to do the JSONB key rename.

CREATE OR REPLACE FUNCTION migrate_answer_keys()
RETURNS void AS $$
DECLARE
  rec RECORD;
  old_key TEXT;
  new_key TEXT;
  answer_path TEXT;
  updated_answers JSONB;
  mappings TEXT[][] := ARRAY[
    -- Listening Practice
    ARRAY['L0Q1', 'Listening-Practice-01-Q1'],
    -- Listening Part1 Set 01
    ARRAY['L1Q1', 'Listening-Part1-01-Q1'], ARRAY['L1Q2', 'Listening-Part1-01-Q2'],
    ARRAY['L1Q3', 'Listening-Part1-01-Q3'], ARRAY['L1Q4', 'Listening-Part1-01-Q4'],
    ARRAY['L1Q5', 'Listening-Part1-01-Q5'], ARRAY['L1Q6', 'Listening-Part1-01-Q6'],
    ARRAY['L1Q7', 'Listening-Part1-01-Q7'], ARRAY['L1Q8', 'Listening-Part1-01-Q8'],
    -- Listening Part2 Set 01
    ARRAY['L2Q1', 'Listening-Part2-01-Q1'], ARRAY['L2Q2', 'Listening-Part2-01-Q2'],
    ARRAY['L2Q3', 'Listening-Part2-01-Q3'], ARRAY['L2Q4', 'Listening-Part2-01-Q4'],
    ARRAY['L2Q5', 'Listening-Part2-01-Q5'],
    -- Listening Part3 Set 01
    ARRAY['L3Q1', 'Listening-Part3-01-Q1'], ARRAY['L3Q2', 'Listening-Part3-01-Q2'],
    ARRAY['L3Q3', 'Listening-Part3-01-Q3'], ARRAY['L3Q4', 'Listening-Part3-01-Q4'],
    ARRAY['L3Q5', 'Listening-Part3-01-Q5'], ARRAY['L3Q6', 'Listening-Part3-01-Q6'],
    -- Listening Part4 Set 01
    ARRAY['L4Q1', 'Listening-Part4-01-Q1'], ARRAY['L4Q2', 'Listening-Part4-01-Q2'],
    ARRAY['L4Q3', 'Listening-Part4-01-Q3'], ARRAY['L4Q4', 'Listening-Part4-01-Q4'],
    ARRAY['L4Q5', 'Listening-Part4-01-Q5'],
    -- Listening Part5 Set 01
    ARRAY['L5Q1', 'Listening-Part5-01-Q1'], ARRAY['L5Q2', 'Listening-Part5-01-Q2'],
    ARRAY['L5Q3', 'Listening-Part5-01-Q3'], ARRAY['L5Q4', 'Listening-Part5-01-Q4'],
    ARRAY['L5Q5', 'Listening-Part5-01-Q5'], ARRAY['L5Q6', 'Listening-Part5-01-Q6'],
    ARRAY['L5Q7', 'Listening-Part5-01-Q7'], ARRAY['L5Q8', 'Listening-Part5-01-Q8'],
    -- Listening Part6 Set 01
    ARRAY['L6Q1', 'Listening-Part6-01-Q1'], ARRAY['L6Q2', 'Listening-Part6-01-Q2'],
    ARRAY['L6Q3', 'Listening-Part6-01-Q3'], ARRAY['L6Q4', 'Listening-Part6-01-Q4'],
    ARRAY['L6Q5', 'Listening-Part6-01-Q5'], ARRAY['L6Q6', 'Listening-Part6-01-Q6'],
    -- Listening Part1 Set 02
    ARRAY['L7Q1', 'Listening-Part1-02-Q1'], ARRAY['L7Q2', 'Listening-Part1-02-Q2'],
    ARRAY['L7Q3', 'Listening-Part1-02-Q3'], ARRAY['L7Q4', 'Listening-Part1-02-Q4'],
    ARRAY['L7Q5', 'Listening-Part1-02-Q5'], ARRAY['L7Q6', 'Listening-Part1-02-Q6'],
    ARRAY['L7Q7', 'Listening-Part1-02-Q7'], ARRAY['L7Q8', 'Listening-Part1-02-Q8'],
    -- Listening Part2 Set 02
    ARRAY['L8Q1', 'Listening-Part2-02-Q1'], ARRAY['L8Q2', 'Listening-Part2-02-Q2'],
    ARRAY['L8Q3', 'Listening-Part2-02-Q3'], ARRAY['L8Q4', 'Listening-Part2-02-Q4'],
    ARRAY['L8Q5', 'Listening-Part2-02-Q5'],
    -- Listening Part3 Set 02
    ARRAY['L9Q1', 'Listening-Part3-02-Q1'], ARRAY['L9Q2', 'Listening-Part3-02-Q2'],
    ARRAY['L9Q3', 'Listening-Part3-02-Q3'], ARRAY['L9Q4', 'Listening-Part3-02-Q4'],
    ARRAY['L9Q5', 'Listening-Part3-02-Q5'], ARRAY['L9Q6', 'Listening-Part3-02-Q6'],
    -- Listening Part4 Set 02
    ARRAY['L10Q1', 'Listening-Part4-02-Q1'], ARRAY['L10Q2', 'Listening-Part4-02-Q2'],
    ARRAY['L10Q3', 'Listening-Part4-02-Q3'], ARRAY['L10Q4', 'Listening-Part4-02-Q4'],
    ARRAY['L10Q5', 'Listening-Part4-02-Q5'],
    -- Listening Part5 Set 02
    ARRAY['L11Q1', 'Listening-Part5-02-Q1'], ARRAY['L11Q2', 'Listening-Part5-02-Q2'],
    ARRAY['L11Q3', 'Listening-Part5-02-Q3'], ARRAY['L11Q4', 'Listening-Part5-02-Q4'],
    ARRAY['L11Q5', 'Listening-Part5-02-Q5'], ARRAY['L11Q6', 'Listening-Part5-02-Q6'],
    ARRAY['L11Q7', 'Listening-Part5-02-Q7'], ARRAY['L11Q8', 'Listening-Part5-02-Q8'],
    -- Listening Part6 Set 02
    ARRAY['L12Q1', 'Listening-Part6-02-Q1'], ARRAY['L12Q2', 'Listening-Part6-02-Q2'],
    ARRAY['L12Q3', 'Listening-Part6-02-Q3'], ARRAY['L12Q4', 'Listening-Part6-02-Q4'],
    ARRAY['L12Q5', 'Listening-Part6-02-Q5'], ARRAY['L12Q6', 'Listening-Part6-02-Q6'],
    -- Listening Part1 Set 03
    ARRAY['L13Q1', 'Listening-Part1-03-Q1'], ARRAY['L13Q2', 'Listening-Part1-03-Q2'],
    ARRAY['L13Q3', 'Listening-Part1-03-Q3'], ARRAY['L13Q4', 'Listening-Part1-03-Q4'],
    ARRAY['L13Q5', 'Listening-Part1-03-Q5'], ARRAY['L13Q6', 'Listening-Part1-03-Q6'],
    ARRAY['L13Q7', 'Listening-Part1-03-Q7'], ARRAY['L13Q8', 'Listening-Part1-03-Q8'],
    -- Listening Part4 Set 03
    ARRAY['L14Q1', 'Listening-Part4-03-Q1'], ARRAY['L14Q2', 'Listening-Part4-03-Q2'],
    ARRAY['L14Q3', 'Listening-Part4-03-Q3'], ARRAY['L14Q4', 'Listening-Part4-03-Q4'],
    ARRAY['L14Q5', 'Listening-Part4-03-Q5'],
    -- Listening Part5 Set 03
    ARRAY['L15Q1', 'Listening-Part5-03-Q1'], ARRAY['L15Q2', 'Listening-Part5-03-Q2'],
    ARRAY['L15Q3', 'Listening-Part5-03-Q3'], ARRAY['L15Q4', 'Listening-Part5-03-Q4'],
    ARRAY['L15Q5', 'Listening-Part5-03-Q5'], ARRAY['L15Q6', 'Listening-Part5-03-Q6'],
    ARRAY['L15Q7', 'Listening-Part5-03-Q7'], ARRAY['L15Q8', 'Listening-Part5-03-Q8']
  ];
  i INT;
BEGIN
  -- Iterate through each answer path (quiz and listening)
  FOR answer_path IN SELECT unnest(ARRAY['quiz', 'listening']) LOOP
    FOR rec IN
      SELECT id, details
      FROM test_records
      WHERE details->'answers'->answer_path IS NOT NULL
    LOOP
      updated_answers := rec.details->'answers'->answer_path;

      FOR i IN 1..array_length(mappings, 1) LOOP
        old_key := mappings[i][1];
        new_key := mappings[i][2];

        IF updated_answers ? old_key THEN
          updated_answers := (updated_answers - old_key) || jsonb_build_object(new_key, updated_answers->old_key);
        END IF;
      END LOOP;

      UPDATE test_records
      SET details = jsonb_set(details, ARRAY['answers', answer_path], updated_answers)
      WHERE id = rec.id;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT migrate_answer_keys();
DROP FUNCTION migrate_answer_keys();

-- ============================================================
-- PART 3: Update red_flags question_id column
-- ============================================================
-- Listening question IDs
UPDATE red_flags SET question_id = 'Listening-Practice-01-Q1' WHERE question_id = 'L0Q1';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L1Q(\d+)$', 'Listening-Part1-01-Q\1') WHERE question_id ~ '^L1Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L2Q(\d+)$', 'Listening-Part2-01-Q\1') WHERE question_id ~ '^L2Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L3Q(\d+)$', 'Listening-Part3-01-Q\1') WHERE question_id ~ '^L3Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L4Q(\d+)$', 'Listening-Part4-01-Q\1') WHERE question_id ~ '^L4Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L5Q(\d+)$', 'Listening-Part5-01-Q\1') WHERE question_id ~ '^L5Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L6Q(\d+)$', 'Listening-Part6-01-Q\1') WHERE question_id ~ '^L6Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L7Q(\d+)$', 'Listening-Part1-02-Q\1') WHERE question_id ~ '^L7Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L8Q(\d+)$', 'Listening-Part2-02-Q\1') WHERE question_id ~ '^L8Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L9Q(\d+)$', 'Listening-Part3-02-Q\1') WHERE question_id ~ '^L9Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L10Q(\d+)$', 'Listening-Part4-02-Q\1') WHERE question_id ~ '^L10Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L11Q(\d+)$', 'Listening-Part5-02-Q\1') WHERE question_id ~ '^L11Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L12Q(\d+)$', 'Listening-Part6-02-Q\1') WHERE question_id ~ '^L12Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L13Q(\d+)$', 'Listening-Part1-03-Q\1') WHERE question_id ~ '^L13Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L14Q(\d+)$', 'Listening-Part4-03-Q\1') WHERE question_id ~ '^L14Q\d+$';
UPDATE red_flags SET question_id = regexp_replace(question_id, '^L15Q(\d+)$', 'Listening-Part5-03-Q\1') WHERE question_id ~ '^L15Q\d+$';
