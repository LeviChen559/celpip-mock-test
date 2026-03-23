# Admin Content CRM — Design Spec

## Overview

A content management system (CRM) for admin users to create, edit, delete, and publish test content across all four CELPIP sections (Listening, Reading, Writing, Speaking), including image and audio media management.

## Goals

- Allow admins to manage all test content through a web UI instead of editing code
- Support image and audio uploads across all sections
- Implement a draft/publish workflow so content can be prepared before going live
- Migrate all existing hardcoded test data into the database
- Maintain backwards compatibility with the existing test-taking interface

## Architecture Decision

**Supabase-Native (Hybrid Storage)**
- Structured content (questions, passages, prompts) in Supabase PostgreSQL tables
- Binary media (images, audio) in Supabase Storage buckets
- Admin auth via existing Supabase role-based access control
- No new external dependencies

---

## 1. Database Schema

### 1.1 `listening_parts`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | Default `gen_random_uuid()` |
| part_id | text UNIQUE NOT NULL | e.g., "L1", "L7" |
| title | text NOT NULL | |
| instruction | text NOT NULL | |
| transcript | text NOT NULL | |
| audio_url | text | Supabase Storage URL |
| image_url | text | Optional |
| status | text NOT NULL DEFAULT 'draft' | 'draft' or 'published' |
| sort_order | integer NOT NULL DEFAULT 0 | Display ordering |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

### 1.2 `reading_parts`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | Default `gen_random_uuid()` |
| part_id | text UNIQUE NOT NULL | e.g., "Reading-Part1-01" |
| title | text NOT NULL | |
| instruction | text NOT NULL | |
| passage | text NOT NULL | |
| image_url | text | Optional |
| status | text NOT NULL DEFAULT 'draft' | 'draft' or 'published' |
| paid | boolean NOT NULL DEFAULT false | |
| sort_order | integer NOT NULL DEFAULT 0 | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

### 1.3 `writing_tasks`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | Default `gen_random_uuid()` |
| task_id | text UNIQUE NOT NULL | e.g., "W1" |
| title | text NOT NULL | |
| instruction | text NOT NULL | |
| prompt | text NOT NULL | |
| min_words | integer NOT NULL | |
| max_words | integer NOT NULL | |
| image_url | text | Optional |
| audio_url | text | Optional |
| status | text NOT NULL DEFAULT 'draft' | 'draft' or 'published' |
| sort_order | integer NOT NULL DEFAULT 0 | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

### 1.4 `speaking_tasks`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | Default `gen_random_uuid()` |
| task_id | text UNIQUE NOT NULL | e.g., "S1" |
| title | text NOT NULL | |
| instruction | text NOT NULL | |
| prompt | text NOT NULL | |
| prep_time | integer NOT NULL | Seconds |
| response_time | integer NOT NULL | Seconds |
| image_url | text | Optional |
| audio_url | text | Optional |
| status | text NOT NULL DEFAULT 'draft' | 'draft' or 'published' |
| sort_order | integer NOT NULL DEFAULT 0 | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

### 1.5 `questions` (shared by listening + reading)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | Default `gen_random_uuid()` |
| question_id | text NOT NULL | e.g., "L1Q1" |
| parent_id | uuid NOT NULL | FK → listening_parts.id or reading_parts.id |
| parent_type | text NOT NULL | 'listening' or 'reading' |
| question | text NOT NULL | |
| options | jsonb NOT NULL | String array |
| correct_answer | integer NOT NULL | Index into options |
| passage | text | Optional per-question passage |
| image_url | text | Optional |
| sort_order | integer NOT NULL DEFAULT 0 | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

Indexes: `(parent_id, parent_type)`, unique on `(question_id, parent_id)`.

### 1.6 `media`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | Default `gen_random_uuid()` |
| file_name | text NOT NULL | |
| file_path | text NOT NULL | Storage path |
| file_type | text NOT NULL | 'image' or 'audio' |
| mime_type | text NOT NULL | |
| file_size | integer NOT NULL | Bytes |
| uploaded_by | uuid NOT NULL | FK → profiles.id |
| created_at | timestamptz DEFAULT now() | |

---

## 2. Supabase Storage

### Buckets

- **`test-images`** — images for any section
  - Path convention: `{section}/{part_id}/{filename}`
  - Example: `listening/L1/scene.jpg`, `writing/W3/prompt-image.png`

- **`test-audio`** — audio clips for any section
  - Path convention: `{section}/{part_id}/{filename}`
  - Example: `listening/L1/transcript.mp3`, `speaking/S5/sample.mp3`

### Access Policies

- **Read**: Public (anyone can read from both buckets)
- **Upload/Delete**: Admin role only (verified via Supabase auth session)

---

## 3. Row-Level Security (RLS) Policies

| Table | SELECT | INSERT / UPDATE / DELETE |
|-------|--------|--------------------------|
| listening_parts | `status = 'published'` for anon/authenticated; all rows for admin | Admin only |
| reading_parts | Same as above | Admin only |
| writing_tasks | Same as above | Admin only |
| speaking_tasks | Same as above | Admin only |
| questions | Readable if parent is readable | Admin only |
| media | Public read | Admin only |

Admin check: `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')`

---

## 4. API Endpoints

All endpoints require admin authentication (verified via Supabase session + role check).

### Content CRUD

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/content/[section]` | GET | List all parts/tasks for a section. Optional `?status=draft\|published` filter |
| `/api/admin/content/[section]` | POST | Create new part/task |
| `/api/admin/content/[section]/[id]` | GET | Get single part/task with its questions (for listening/reading) |
| `/api/admin/content/[section]/[id]` | PUT | Update part/task fields |
| `/api/admin/content/[section]/[id]` | DELETE | Delete part/task, cascade delete questions and associated media |
| `/api/admin/content/[section]/[id]/publish` | POST | Toggle publish/unpublish status |

`[section]` is one of: `listening`, `reading`, `writing`, `speaking`.

### Questions (Listening & Reading only)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/content/[section]/[id]/questions` | POST | Add question to a part |
| `/api/admin/content/[section]/[id]/questions/[qid]` | PUT | Update question |
| `/api/admin/content/[section]/[id]/questions/[qid]` | DELETE | Delete question |

### Media

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/media/upload` | POST | Upload file to Supabase Storage, create media record |
| `/api/admin/media/[id]` | DELETE | Delete file from Storage and media record |

---

## 5. Admin CRM UI

### Routes

| Route | Purpose |
|-------|---------|
| `/admin/content` | Dashboard — content overview by section with published/draft counts |
| `/admin/content/listening` | List all listening parts |
| `/admin/content/listening/new` | Create new listening part |
| `/admin/content/listening/[id]` | Edit listening part + questions + media |
| `/admin/content/reading` | List all reading parts |
| `/admin/content/reading/new` | Create new reading part |
| `/admin/content/reading/[id]` | Edit reading part + questions + media |
| `/admin/content/writing` | List all writing tasks |
| `/admin/content/writing/new` | Create new writing task |
| `/admin/content/writing/[id]` | Edit writing task + media |
| `/admin/content/speaking` | List all speaking tasks |
| `/admin/content/speaking/new` | Create new speaking task |
| `/admin/content/speaking/[id]` | Edit speaking task + media |

### List Pages

Table view with columns:
- Title
- Part/Task ID
- Status (draft/published badge)
- Question count (listening/reading only)
- Last updated
- Actions: Edit, Delete, Publish/Unpublish

### Edit Forms

Section-specific fields with:
- Text inputs for title, instruction, part ID
- Textarea for transcript/passage/prompt
- Number inputs for word limits (writing), prep/response times (speaking)
- Inline question editor for listening/reading:
  - Add/remove/reorder questions
  - Each question: text input, options list editor, correct answer selector
- Media upload area:
  - Drag-and-drop or click to upload
  - Image thumbnail preview
  - Audio player preview
  - Delete media button
- Publish/Unpublish toggle
- Paid content toggle (reading only)

### Confirmation Dialogs

Every modifying action requires a confirmation dialog:

| Action | Dialog Message |
|--------|---------------|
| Create new content | "Are you sure you want to create this {section} content?" |
| Save edits | "Are you sure you want to save these changes?" |
| Delete part/task | "This will permanently delete this {section} and all its questions and media. This cannot be undone." |
| Delete a question | "Are you sure you want to remove this question?" |
| Publish | "This will make this content visible to all users." |
| Unpublish | "This will hide this content from users. It will remain as a draft." |
| Delete media file | "Are you sure you want to remove this file?" |

Built as a reusable `ConfirmDialog` component using existing Shadcn UI primitives.

### Navigation

Add "Content Management" link to the existing admin navigation/sidebar.

---

## 6. App Integration

### Data Fetching

Test-taking pages currently import from TypeScript files (`celpip-data.ts`, `*-data-extra.ts`). They will be updated to:

1. **Fetch from Supabase** via server-side queries in Next.js page components
2. **Filter by `status = 'published'`** only
3. **Map DB results to existing interfaces** (`ListeningPart[]`, `ReadingPart[]`, `WritingTask[]`, `SpeakingTask[]`) so downstream components need minimal changes
4. **Temporary fallback** — if DB returns empty for a section, fall back to hardcoded data. Remove fallback once migration is verified.

### Interface Compatibility

The existing TypeScript interfaces remain the same. A data access layer (`src/lib/content.ts`) will handle:
- Fetching from Supabase
- Mapping DB rows to existing interfaces
- Including resolved media URLs

---

## 7. Data Migration

### Script: `scripts/migrate-content.ts`

A one-time Node.js script that:

1. Imports all data from `celpip-data.ts`, `listening-data-extra.ts`, `reading-data-extra.ts`, `writing-data-extra.ts`, `speaking-data-extra.ts`
2. Inserts each part/task into its corresponding table
3. Inserts each question into the `questions` table with proper `parent_id` and `parent_type`
4. Sets all migrated content to `status = 'published'`
5. Assigns `sort_order` based on array index ordering
6. Media columns (`audio_url`, `image_url`) set to null — admin uploads media later via CRM

### Execution

```bash
npx tsx scripts/migrate-content.ts
```

Requires `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` environment variables.

### Validation

After migration, the script logs:
- Count of inserted rows per table
- Any errors or skipped records
- Verification query confirming row counts match source data

---

## 8. File Structure (New/Modified)

```
src/
  app/
    admin/
      content/
        page.tsx                          # Content dashboard
        listening/
          page.tsx                         # Listening list
          new/page.tsx                     # Create listening part
          [id]/page.tsx                    # Edit listening part
        reading/
          page.tsx                         # Reading list
          new/page.tsx                     # Create reading part
          [id]/page.tsx                    # Edit reading part
        writing/
          page.tsx                         # Writing list
          new/page.tsx                     # Create writing task
          [id]/page.tsx                    # Edit writing task
        speaking/
          page.tsx                         # Speaking list
          new/page.tsx                     # Create speaking task
          [id]/page.tsx                    # Edit speaking task
    api/
      admin/
        content/
          [section]/
            route.ts                      # GET list, POST create
            [id]/
              route.ts                    # GET, PUT, DELETE single
              publish/route.ts            # POST toggle publish
              questions/
                route.ts                  # POST add question
                [qid]/route.ts            # PUT, DELETE question
        media/
          upload/route.ts                 # POST upload
          [id]/route.ts                   # DELETE media
  components/
    admin/
      content/
        ContentListTable.tsx              # Reusable table for content lists
        ContentForm.tsx                   # Section-specific edit forms
        QuestionEditor.tsx                # Inline question add/edit/reorder
        MediaUploader.tsx                 # Drag-and-drop upload with preview
        ConfirmDialog.tsx                 # Reusable confirmation modal
        StatusBadge.tsx                   # Draft/Published badge
  lib/
    content.ts                            # Data access layer (Supabase → interfaces)
scripts/
  migrate-content.ts                      # One-time data migration script
supabase/
  migrations/
    20260323_content_crm.sql              # Schema migration (tables, RLS, storage)
```

Modified files:
- `src/app/admin/*` — add content nav link
- `src/app/test/listening/page.tsx` — fetch from DB instead of import
- `src/app/test/reading/page.tsx` — fetch from DB instead of import
- `src/app/test/writing/page.tsx` — fetch from DB instead of import
- `src/app/test/speaking/page.tsx` — fetch from DB instead of import
- Quiz and practice pages — same DB fetch updates
