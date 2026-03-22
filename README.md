# PugPIP — Free CELPIP Mock Tests & Practice

A comprehensive web-based practice platform for the **CELPIP (Canadian English Language Proficiency Index Program) General Test**. Built with Next.js, it provides full-length mock tests, section-specific practice, untimed quiz mode, AI-powered writing feedback, and teacher/admin management tools.

## Core Features

- Full-length timed mock tests (Listening, Reading, Writing, Speaking)
- Section practice mode with timing simulation
- Untimed quiz practice with instant feedback
- AI-powered writing feedback via Claude API
- AI-generated smart study plan with schedule tracking
- Text-to-speech audio via ElevenLabs API
- Test history, score trends, and full answer review
- Report-a-problem system for question quality control
- Monthly API usage limits by role (user: 15, subscriber: 100, teacher/admin: unlimited)
- Role-based access (user, subscriber, teacher, admin)
- Teacher portal for student progress monitoring
- Admin dashboard for user and content management

## Features in Detail

### Full-Length Mock Tests (Timed)
- **Listening** (~47 min) — Problem solving, conversations, information gathering, news, discussions, viewpoints
- **Reading** (~55 min) — Correspondence, diagrams, information, viewpoints
- **Writing** (~53 min) — Email writing & survey response tasks
- **Speaking** (~20 min) — 8 task types including advice, descriptions, comparisons, opinions
- Automatic submission when timer expires, simulating real CELPIP test conditions

### Section Practice Mode
- Practice individual sections with full timing simulation
- No need to commit to all 4 sections at once

### Quiz Practice (Untimed)
- Question-by-question practice with instant feedback
- Available for Listening and Reading sections

### AI-Powered Writing Feedback
- Claude API evaluates writing responses with detailed scoring
- Provides strengths, areas for improvement, and example high-score responses

### Smart Study Plan Generator
- Set your test date and target score
- AI-generated phased study plan tailored to weak areas
- Schedule tracking with persistent study items

### Audio Features
- Text-to-speech via ElevenLabs API (male/female voices)
- Pre-recorded audio for listening tests with transcript display

### Test History & Progress Tracking
- Persistent test results and score trends
- Full answer review with correct/incorrect breakdown
- Study plan completion tracking

### Report a Problem
- Flag any question as incorrect or problematic from the review page
- User comments help improve test quality
- Admin dashboard for triaging and resolving reports

### User Authentication & Roles
- Email/password authentication via Supabase
- Role-based access: user, subscriber, teacher, admin

### Teacher Portal
- View assigned students and their progress
- Track individual student test records and average scores
- Monitor student study schedules

### Admin Dashboard
- Full user management (roles, deletion)
- Teacher–student assignment (single and bulk)
- Red flag report triaging and resolution
- User test history and statistics overview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Base UI |
| Icons | Lucide React |
| State | Zustand 5 (with localStorage persistence) |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude API |
| Audio | ElevenLabs TTS API |
| Package Manager | pnpm |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file with:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── admin/          # Admin & teacher operations
│   │   ├── auth/profile/   # User profile
│   │   ├── red-flags/      # Problem report submission & lookup
│   │   ├── tts/            # ElevenLabs text-to-speech
│   │   └── writing-feedback/ # Claude-powered writing evaluation
│   ├── test/               # Full mock test (listening/reading/writing/speaking)
│   ├── quiz/               # Untimed quiz practice
│   ├── quiz-practice/      # Writing & speaking practice
│   ├── dashboard/          # User dashboard & study tools
│   ├── results/            # Test results & scoring
│   ├── review/             # Answer review with red flag reporting
│   ├── login/ & signup/    # Authentication pages
│   ├── teacher/            # Teacher portal
│   └── admin/              # Admin dashboard & red flag management
├── components/             # Reusable React components
│   ├── ui/                 # shadcn UI primitives
│   ├── AuthProvider.tsx    # Auth context wrapper
│   ├── HeroAnimation.tsx   # Landing page mascot animation
│   ├── MyTests.tsx         # Test history display
│   ├── MySchedule.tsx      # Study schedule management
│   ├── StudyPlan.tsx       # AI study plan display
│   ├── RedFlagButton.tsx   # Report-a-problem button
│   ├── TranscriptAudioPlayer.tsx
│   ├── ReadingPassageRenderer.tsx
│   ├── QuestionCard.tsx
│   ├── TestNavigation.tsx
│   ├── Timer.tsx
│   └── ...
├── lib/                    # Utilities & business logic
│   ├── celpip-data.ts      # Main test content
│   ├── *-data-extra.ts     # Additional practice content
│   ├── store.ts            # Zustand stores
│   ├── test-store.ts       # Test state management
│   ├── hooks/              # Custom React hooks
│   │   ├── use-auth.ts     # Authentication state
│   │   ├── use-history.ts  # Test record management
│   │   └── use-schedule.ts # Study schedule management
│   └── supabase/           # Supabase client & server config
docs/                       # Documentation & SQL schemas
public/                     # Static assets (audio, images, SVGs)
```

## Deployment

Deploy on [Vercel](https://vercel.com) for the best Next.js experience. See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
