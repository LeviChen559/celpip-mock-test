# CELPIP Mock Test

A comprehensive web-based practice platform for the **CELPIP (Canadian English Language Proficiency Index Program) General Test**. Built with Next.js, it provides full-length mock tests, section-specific practice, untimed quiz mode, and AI-powered writing feedback.

## Features

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
- Provides strengths, areas for improvement, and grammar/vocabulary suggestions

### Smart Study Plan Generator
- Set your test date and target score
- AI-generated phased study plan tailored to weak areas

### Audio Features
- Text-to-speech via ElevenLabs API
- Pre-recorded audio for listening tests with transcript display

### Test History & Progress Tracking
- Persistent test results and score trends
- Study plan completion tracking

### User Authentication & Roles
- Email/password authentication via Supabase
- Role-based access: subscriber, teacher, admin

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
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
│   ├── api/                # API routes (auth, TTS, writing feedback)
│   ├── test/               # Full mock test (listening/reading/writing/speaking)
│   ├── quiz/               # Untimed quiz practice
│   ├── quiz-practice/      # Section-specific practice
│   ├── dashboard/          # User dashboard & study tools
│   ├── results/            # Test results & scoring
│   ├── review/             # Answer review
│   ├── login/ & signup/    # Authentication pages
│   ├── teacher/            # Teacher portal
│   └── admin/              # Admin dashboard
├── components/             # Reusable React components
│   ├── ui/                 # shadcn UI primitives
│   ├── TranscriptAudioPlayer.tsx
│   ├── QuestionCard.tsx
│   ├── Timer.tsx
│   └── ...
├── lib/                    # Utilities & business logic
│   ├── celpip-data.ts      # Main test content
│   ├── *-data-extra.ts     # Additional practice content
│   ├── store.ts            # Zustand stores
│   ├── hooks/              # Custom React hooks
│   └── supabase/           # Supabase client & server config
docs/                       # Documentation & SQL schemas
public/                     # Static assets (audio, images, SVGs)
```

## Deployment

Deploy on [Vercel](https://vercel.com) for the best Next.js experience. See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
