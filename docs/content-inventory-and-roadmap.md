# Content Inventory & Roadmap

> Last updated: 2026-03-25

This document tracks the current quiz/test content inventory, target content levels for each pricing tier, and what needs to be created.

---

## Pricing Plans & Content Requirements

| Plan | Price | AI Credits | Content Need |
|------|-------|------------|--------------|
| Free | $0 | 15/month | Basic quiz access, full mock test |
| Improver | $15/month | 100/month | Enough writing/speaking variety to use credits meaningfully |
| Intensive | $45/3 months | 500/month | ~90 days daily practice without repetition |
| Score Guarantee | $79 one-time | Unlimited/90 days | 90 days unlimited — highest content demand |

---

## 1. Quiz Practice — Target: 50 sets per part

### 1.1 Listening (6 scored part types)

| Part | Type | Questions/Part | Have | Target | Missing |
|------|------|----------------|------|--------|---------|
| Part 1 | Problem Solving | 8 | 3 | 50 | **47** |
| Part 2 | Daily Life Conversation | 5 | 2 | 50 | **48** |
| Part 3 | Listening for Information | 6 | 2 | 50 | **48** |
| Part 4 | News Item | 5 | 3 | 50 | **47** |
| Part 5 | Discussion | 8 | 3 | 50 | **47** |
| Part 6 | Viewpoints | 6 | 2 | 50 | **48** |
| | **Subtotal** | | **15** | **300** | **285** |

**Current files:**
- `src/lib/celpip-data.ts` — Official Set 1 (7 parts incl. Practice)
- `src/lib/listening-data-extra.ts` — Sets 2-3 (9 parts, incomplete Set 3)

**Notes:**
- Parts 2, 3, 6 are the weakest — only 2 sets each
- Each part requires: transcript, instruction, and multiple-choice questions with correct answers
- Audio URLs optional but recommended for production

---

### 1.2 Reading (4 scored part types)

| Part | Type | Questions/Part | Have | Target | Missing |
|------|------|----------------|------|--------|---------|
| Part 1 | Correspondence / Email | 11 | 9 | 50 | **41** |
| Part 2 | Apply a Diagram | 8 | 9 | 50 | **41** |
| Part 3 | Information / Article | 9 | 9 | 50 | **41** |
| Part 4 | Viewpoints / Opinion | 10 | 9 | 50 | **41** |
| | **Subtotal** | | **36** | **200** | **164** |

**Current files:**
- `src/lib/celpip-data.ts` — Official Set 1 (5 parts incl. Practice)
- `src/lib/reading-data-extra.ts` — Sets 2-4 (12 parts)
- `src/lib/mad-english-task1-correspondence.ts` — Sets 5-9, Part 1 (5 parts)
- `src/lib/mad-english-task2-diagram.ts` — Sets 5-9, Part 2 (5 parts)
- `src/lib/mad-english-task3-information.ts` — Sets 5-9, Part 3 (5 parts)
- `src/lib/mad-english-task4-viewpoints.ts` — Sets 5-9, Part 4 (5 parts)

**Notes:**
- Best-covered section — already at 9 sets per part
- MAD English sets (5-9) are marked `paid: true`
- Each part requires: passage text, instruction, and multiple-choice questions with correct answers

---

### 1.3 Writing (2 task types)

| Task | Type | Have | Target | Missing |
|------|------|------|--------|---------|
| Task 1 | Writing an Email (150-200 words) | 9 | 50 | **41** |
| Task 2 | Survey Response (150-200 words) | 9 | 50 | **41** |
| | **Subtotal** | **18** | **100** | **82** |

**Current files:**
- `src/lib/celpip-data.ts` — Official Set 1 (2 tasks)
- `src/lib/writing-data-extra.ts` — Sets 2-9 (16 tasks)

**Notes:**
- AI-scored section — high credit consumption on Improver+ plans
- Each task requires: prompt scenario, instruction, min/max word count
- Users doing 1 session/day repeat content every ~9 days currently

---

### 1.4 Speaking (8 scored task types)

| Task | Type | Response Time | Have | Target | Missing |
|------|------|---------------|------|--------|---------|
| Task 1 | Giving Advice | 90s | 3 | 50 | **47** |
| Task 2 | Personal Experience | 60s | 3 | 50 | **47** |
| Task 3 | Describing a Scene | 60s | 3 | 50 | **47** |
| Task 4 | Making Predictions | 60s | 3 | 50 | **47** |
| Task 5 | Comparing & Persuading | 60s | 3 | 50 | **47** |
| Task 6 | Dealing with Difficult Situation | 60s | 3 | 50 | **47** |
| Task 7 | Expressing Opinions | 90s | 3 | 50 | **47** |
| Task 8 | Describing Unusual Situation | 60s | 3 | 50 | **47** |
| | **Subtotal** | | **24** | **400** | **376** |

**Current files:**
- `src/lib/celpip-data.ts` — Official Set 1 (9 tasks incl. Practice)
- `src/lib/speaking-data-extra.ts` — Sets 2-3 (16 tasks)

**Notes:**
- AI-scored section — high credit consumption on Improver+ plans
- Each task requires: prompt, prep time (30s), response time, optional image
- Tasks 1 and 7 have longer response times (90s vs 60s)
- Only 3 sets per task type — users repeat every 3 days

---

## 2. Section Testing — Target: 10 sets per section

A "section test" is a timed, full-section simulation (all parts in sequence).

| Section | Parts per Set | Have | Target | Missing |
|---------|---------------|------|--------|---------|
| Listening | Practice + Parts 1-6 (39Q) | 1 | 10 | **9** |
| Reading | Practice + Parts 1-4 (39Q) | 1 | 10 | **9** |
| Writing | Task 1 + Task 2 | 1 | 10 | **9** |
| Speaking | Practice + Tasks 1-8 | 1 | 10 | **9** |
| | **Subtotal** | **4** | **40** | **36** |

**Notes:**
- Section tests use "official" part arrays (`listeningPartsOfficial`, etc.)
- Currently only 1 official set exists per section
- Each new set requires a complete set of all parts for that section
- Can reuse quiz practice content assembled into full section sets

---

## 3. Full Mock Tests — Target: 3 sets

A full mock test is all 4 sections in sequence, timed to match the real CELPIP exam.

| Type | Description | Have | Target | Missing |
|------|-------------|------|--------|---------|
| Full Mock Test | Listening + Reading + Writing + Speaking | 1 | 3 | **2** |

**Notes:**
- Each mock test = 1 Listening section + 1 Reading section + 1 Writing section + 1 Speaking section
- Total time: ~3 hours per mock test
- Route: `/test` runs all 4 sections sequentially

---

## 4. Diagnostic Test — Target: 1 set

| Type | Description | Have | Target | Missing |
|------|-------------|------|--------|---------|
| Diagnostic Test | Shortened assessment across all 4 sections to establish baseline level | 0 | 1 | **1** |

**Notes:**
- Shorter than a full mock test — samples key question types from each section
- Purpose: identify user's weakest areas and recommend a study plan
- Should produce a score estimate across all 4 dimensions
- Feeds into the AI study plan generator

---

## Grand Summary

| Category | Have | Target | Missing | % Complete |
|----------|------|--------|---------|------------|
| Listening Quiz Practice | 15 | 300 | 285 | 5% |
| Reading Quiz Practice | 36 | 200 | 164 | 18% |
| Writing Quiz Practice | 18 | 100 | 82 | 18% |
| Speaking Quiz Practice | 24 | 400 | 376 | 6% |
| Section Tests | 4 | 40 | 36 | 10% |
| Full Mock Tests | 1 | 3 | 2 | 33% |
| Diagnostic Test | 0 | 1 | 1 | 0% |
| **Total** | **98** | **1,044** | **946** | **9%** |

---

## Implementation Recommendations

### Storage Strategy

Hardcoding 946 content items in TypeScript is not practical. Recommended approach:

1. **Firestore Database** — Store all content in Firestore collections (`listening_parts`, `reading_parts`, `writing_tasks`, `speaking_tasks`)
2. **Existing API** — Content already served via `/api/content/{section}` with 5-minute client-side caching
3. **Admin Panel** — Use existing admin content management at `/admin/content` for review and publishing
4. **Keep hardcoded fallback** — Current hardcoded data remains as offline/fallback content

### Content Generation Pipeline

1. **Batch Generation Script** — Use Claude API to generate CELPIP-style content in bulk
   - Input: part type, set number, difficulty guidelines
   - Output: structured JSON matching TypeScript interfaces
   - Review: human QA before publishing

2. **Quality Standards**
   - Passages/transcripts must match CELPIP difficulty level and length
   - Questions must have exactly 1 correct answer
   - Distractors must be plausible but clearly wrong
   - Topics should be Canadian-context (workplace, community, daily life)

3. **Priority Order** (based on pricing plan value and current gaps)
   - P0: Speaking Tasks 1-8 (376 missing, AI-credit heavy)
   - P0: Listening Parts 1-6 (285 missing, weakest coverage)
   - P1: Writing Tasks 1-2 (82 missing, AI-credit heavy)
   - P1: Reading Parts 1-4 (164 missing, best current coverage)
   - P2: Section Tests (36 missing, can assemble from quiz content)
   - P2: Full Mock Tests (2 missing)
   - P3: Diagnostic Test (1 missing, requires custom design)
