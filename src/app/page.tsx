"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import HeroAnimation from "@/components/HeroAnimation";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Brain,
  Target,
  CalendarCheck,
  Layers,
  TrendingUp,
  Zap,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "AI Writing & Speaking Feedback",
    icon: Brain,
    description:
      "Get scored on 4 CELPIP dimensions with specific, actionable improvement tips from our AI examiner.",
    color: "#c78b3c",
  },
  {
    title: "Weakness Detection",
    icon: Target,
    description:
      "The system tracks error patterns across your attempts and surfaces your top 3 weaknesses.",
    color: "#6b8f71",
  },
  {
    title: "Adaptive Study Plan",
    icon: CalendarCheck,
    description:
      "Set your test date and target score. Get a day-by-day plan that shifts focus as your scores change.",
    color: "#7a8fc7",
  },
  {
    title: "Realistic Practice",
    icon: Layers,
    description:
      "Full mock tests and section practice that mirror the real CELPIP format and timing.",
    color: "#c77a8b",
  },
  {
    title: "Score Progression",
    icon: TrendingUp,
    description:
      "See your predicted score trend over time. Know if you're on track before test day.",
    color: "#8bc7a3",
  },
  {
    title: "Targeted Drills",
    icon: Zap,
    description:
      "Practice exercises generated specifically for your weak areas — grammar, coherence, vocabulary, or task response.",
    color: "#c7a33c",
  },
];

const testSections = [
  {
    label: "Listening",
    detail: "6 parts, 30 questions",
    time: "~47 min",
    color: "#c78b3c",
    Icon: Headphones,
  },
  {
    label: "Reading",
    detail: "4 parts, 27 questions",
    time: "~55 min",
    color: "#6b8f71",
    Icon: BookOpen,
  },
  {
    label: "Writing",
    detail: "2 tasks",
    time: "~53 min",
    color: "#7a8fc7",
    Icon: PenLine,
  },
  {
    label: "Speaking",
    detail: "8 tasks",
    time: "~20 min",
    color: "#c77a8b",
    Icon: Mic,
  },
];

const testimonials = [
  {
    name: "Priya S.",
    score: "CLB 7 → 9",
    location: "Toronto, ON",
    quote:
      "The AI found that my writing lacked coherence — I kept jumping between ideas. After two weeks of targeted drills, my writing score jumped from 7 to 9.",
    color: "#c78b3c",
  },
  {
    name: "Marco L.",
    score: "CLB 8 → 10",
    location: "Vancouver, BC",
    quote:
      "My daily tasks were exactly what I needed. The system knew my vocabulary was strong but my grammar was holding me back, so every drill focused there.",
    color: "#6b8f71",
  },
  {
    name: "Aisha K.",
    score: "CLB 6 → 8",
    location: "Calgary, AB",
    quote:
      "I only had 2 weeks. The AI diagnosed my weakest areas on day one, and the adaptive plan got me from 6 to 8. No wasted time on things I already knew.",
    color: "#7a8fc7",
  },
  {
    name: "David C.",
    score: "CLB 7 → 9",
    location: "Montreal, QC",
    quote:
      "Seeing my predicted score go up each week kept me motivated. The AI feedback on my speaking responses was more useful than any tutor I'd tried.",
    color: "#c77a8b",
  },
  {
    name: "Yuki T.",
    score: "CLB 8 → 10",
    location: "Ottawa, ON",
    quote:
      "The score progression chart showed exactly where I was improving and where I still had gaps. I walked into the real test knowing I was ready.",
    color: "#8bc7a3",
  },
  {
    name: "Fatima R.",
    score: "CLB 6 → 8",
    location: "Edmonton, AB",
    quote:
      "The AI kept adjusting my plan as I improved. Week one was all grammar drills, but by week three it shifted to full mock tests. Smart system.",
    color: "#c7a33c",
  },
];

export default function Home() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  const handleCta = () =>
    router.push(!loading && currentUser ? "/dashboard" : "/signup");

  return (
    <main className="homepage bg-grid min-h-screen relative">
      {/* Grain overlay */}
      <div className="hp-grain" />

      {/* Background meshes */}
      <div
        className="hp-mesh"
        style={{
          width: 600,
          height: 600,
          top: -200,
          right: -100,
          background:
            "radial-gradient(circle, rgba(184,112,59,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="hp-mesh"
        style={{
          width: 500,
          height: 500,
          bottom: "30%",
          left: -150,
          background:
            "radial-gradient(circle, rgba(107,143,113,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Decorative rings */}
      <div
        className="hp-deco-ring"
        style={{ width: 400, height: 400, top: 100, right: -180 }}
      />
      <div
        className="hp-deco-ring"
        style={{ width: 260, height: 260, top: "60%", left: -100 }}
      />

      {/* ── Nav ─────────────────────────────────────── */}
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex justify-between items-center relative z-10 hp-reveal">
        <span
          className="text-xs sm:text-sm font-semibold tracking-wider sm:tracking-widest shrink-0"
          style={{ color: "var(--hp-accent)" }}
        >
          PugPIP
        </span>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!loading && currentUser ? (
            <>
              <span
                className="text-sm hidden sm:inline"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {currentUser.name}
              </span>
              <button
                onClick={() => router.push("/dashboard")}
                className="hp-cta-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm"
              >
                Dashboard
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-colors"
                style={{ color: "var(--hp-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--hp-text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--hp-text-muted)")
                }
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="hp-cta-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm whitespace-nowrap"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="hp-reveal hp-reveal-d1">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase mb-6 px-4 py-2 rounded-full"
                style={{
                  color: "var(--hp-accent)",
                  background: "var(--hp-accent-glow)",
                  border: "1px solid rgba(199,139,60,0.2)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Score Improvement System
              </span>
            </div>
            <h1
              className="hp-reveal hp-reveal-d2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Reach your
              <br />
              <span
                className="hp-accent-line"
                style={{ color: "var(--hp-accent)" }}
              >
                target
              </span>{" "}
              CELPIP score.
            </h1>
            <p
              className="hp-reveal hp-reveal-d3 text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--hp-text-muted)" }}
            >
              AI analyzes your weaknesses, builds your study plan, and tracks
              your score improvement — so you know exactly what to practice
              every day.
            </p>
            <div className="hp-reveal hp-reveal-d4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <button
                onClick={handleCta}
                className="hp-cta-btn px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {!loading && currentUser ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-medium transition-all text-center"
                style={{
                  color: "var(--hp-text-muted)",
                  border: "1px solid var(--hp-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--hp-accent)";
                  e.currentTarget.style.color = "var(--hp-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--hp-border)";
                  e.currentTarget.style.color = "var(--hp-text-muted)";
                }}
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="shrink-0 hp-reveal hp-reveal-d5">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────── */}
      <section className="relative z-10 my-8">
        <div className="hp-strip max-w-screen-xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 hp-reveal hp-reveal-d6">
          {[
            { value: "4", label: "Score Dimensions" },
            { value: "AI", label: "Examiner Feedback" },
            { value: "30", label: "Day Plans" },
            { value: "Live", label: "Score Tracking" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-2xl font-bold"
                style={{
                  color: "var(--hp-accent)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                {s.value}
              </p>
              <p
                className="text-xs font-medium tracking-wide uppercase"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            How it{" "}
            <span style={{ color: "var(--hp-accent)" }}>works</span>
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            Three steps from your current level to your target score.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: "Take a Practice Test",
              description: "Complete a writing or listening task. Takes 5 minutes.",
              color: "#c78b3c",
              cta: "Try Listening",
              href: "/quiz/listening?part=0",
            },
            {
              step: "2",
              title: "Get AI Diagnosis",
              description: "Our AI examiner scores your response across 4 CELPIP dimensions and identifies your exact weaknesses.",
              color: "#6b8f71",
              cta: "Try Writing",
              href: "/quiz-practice/writing?part=0",
            },
            {
              step: "3",
              title: "Follow Your Plan",
              description: "Receive a personalized daily study plan that adapts as you improve.",
              color: "#7a8fc7",
              cta: "Get Started",
              href: "/signup",
            },
          ].map((s, i) => (
            <div
              key={s.step}
              className={`hp-glass rounded-2xl p-6 text-center relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                style={{ background: s.color, opacity: 0.5 }}
              />
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold"
                style={{ background: `${s.color}15`, color: s.color, fontFamily: "var(--font-serif)" }}
              >
                {s.step}
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "var(--hp-text)" }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {s.description}
              </p>
              <button
                onClick={() => router.push(s.href)}
                className="text-sm font-medium inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                style={{ color: s.color }}
              >
                {s.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────── */}
      <section
        id="features"
        className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10"
      >
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Everything you need
            <br />
            to{" "}
            <span style={{ color: "var(--hp-accent)" }}>
              improve
            </span>
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            AI-driven tools that diagnose weaknesses and accelerate your score.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`hp-glass rounded-2xl p-6 relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              {/* Accent top border */}
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                style={{ background: f.color, opacity: 0.5 }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="hp-icon-glow w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${f.color}15`,
                    color: f.color,
                  }}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="text-base font-semibold mb-1.5"
                    style={{ color: "var(--hp-text)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--hp-text-muted)" }}
                  >
                    {f.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Study Plan showcase ──────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="hp-glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden hp-reveal">
          {/* Decorative glow */}
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(199,139,60,0.1) 0%, transparent 70%)",
            }}
          />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase mb-5 px-3 py-1.5 rounded-full"
                style={{
                  color: "var(--hp-accent)",
                  background: "var(--hp-accent-glow)",
                  border: "1px solid rgba(199,139,60,0.15)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                AI-Powered
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Your Personal
                <br />
                <span style={{ color: "var(--hp-accent)" }}>Score Coach</span>
              </h2>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: "var(--hp-text-muted)" }}
              >
                Set your test date and target score. The AI diagnoses your
                weaknesses, builds an adaptive study plan, and adjusts it as
                your scores change — three phases to your goal:
              </p>

              {/* Phase timeline */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    phase: "Diagnose & Build",
                    pct: "60%",
                    desc: "AI identifies your weakest dimensions and assigns targeted practice",
                  },
                  {
                    phase: "Practice & Measure",
                    pct: "30%",
                    desc: "Mixed sessions with score tracking to measure improvement",
                  },
                  {
                    phase: "Simulate & Refine",
                    pct: "10%",
                    desc: "Full timed tests with final gap analysis",
                  },
                ].map((p, i) => (
                  <div key={p.phase} className="flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className={`hp-phase-dot ${i === 2 ? "last" : ""}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {p.phase}{" "}
                        <span
                          className="font-normal"
                          style={{ color: "var(--hp-accent)" }}
                        >
                          {p.pct}
                        </span>
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--hp-text-muted)" }}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCta}
                className="hp-cta-btn px-6 py-3 rounded-full text-sm flex items-center gap-2"
              >
                Create Your Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Schedule preview */}
            <div className="space-y-3">
              {[
                {
                  day: "Mon",
                  items: [
                    "Grammar Drill — Sentence Structure",
                    "Writing Task 1 — AI Scored",
                  ],
                },
                {
                  day: "Tue",
                  items: [
                    "Vocabulary Drill — Coherence Words",
                    "Listening Practice — Part 3",
                  ],
                },
                { day: "Wed", items: ["Full Mock Test + AI Report"] },
                {
                  day: "Thu",
                  items: [
                    "Weakness Review — Top 3 Gaps",
                    "Speaking Task — AI Feedback",
                  ],
                },
              ].map((row, ri) => (
                <div
                  key={row.day}
                  className={`flex gap-4 items-start hp-reveal hp-reveal-d${ri + 2}`}
                >
                  <span
                    className="w-10 text-right text-xs font-bold pt-3 shrink-0"
                    style={{ color: "var(--hp-accent)" }}
                  >
                    {row.day}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    {row.items.map((item, i) => (
                      <div
                        key={i}
                        className="hp-glass rounded-xl px-4 py-3 text-xs"
                        style={{ color: "var(--hp-text)" }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Test Format ─────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            CELPIP General
            <br />
            <span style={{ color: "var(--hp-accent)" }}>Test Format</span>
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            Practice the exact format you will face on test day
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testSections.map((s, i) => (
            <div
              key={s.label}
              className={`hp-glass rounded-2xl p-6 text-center relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `${s.color}15`,
                  color: s.color,
                }}
              >
                <s.Icon className="w-7 h-7" />
              </div>
              <p
                className="text-xl font-bold mb-1"
                style={{ color: s.color, fontFamily: "var(--font-serif)" }}
              >
                {s.label}
              </p>
              <p
                className="text-sm mb-1"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {s.detail}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--hp-text-muted)", opacity: 0.7 }}
              >
                {s.time}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Real{" "}
            <span style={{ color: "var(--hp-accent)" }}>score improvements</span>
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            Test-takers across Canada reaching their target scores.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`hp-glass rounded-2xl p-6 relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              {/* Accent bar */}
              <div
                className="hp-testimonial-bar"
                style={{ background: t.color }}
              />
              <div className="pl-4">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5"
                      style={{ color: t.color }}
                      fill={t.color}
                    />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-5 italic"
                  style={{ color: "var(--hp-text-muted)" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `${t.color}20`,
                      color: t.color,
                    }}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--hp-text)" }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--hp-text-muted)" }}>
                      Scored {t.score} &middot; {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 text-center px-4 sm:px-6">
        {/* CTA glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(199,139,60,0.08) 0%, transparent 70%)",
          }}
        />
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative hp-reveal"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Ready to hit your
          <br />
          <span style={{ color: "var(--hp-accent)" }}>target score?</span>
        </h2>
        <p
          className="text-base mb-8 relative hp-reveal hp-reveal-d1"
          style={{ color: "var(--hp-text-muted)" }}
        >
          Join thousands of test-takers who improved their CELPIP score with AI-powered preparation.
        </p>
        <button
          onClick={handleCta}
          className="hp-cta-btn px-10 py-5 rounded-full text-lg flex items-center gap-3 mx-auto relative hp-reveal hp-reveal-d2"
        >
          {!loading && currentUser ? "Go to Dashboard" : "Get Started Free"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="relative z-10 pb-10">
        <div
          className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-8 flex justify-between items-center"
          style={{
            borderTop: "1px solid var(--hp-border)",
          }}
        >
          <span
            className="text-xs tracking-widest"
            style={{ color: "var(--hp-text-muted)" }}
          >
            PugPIP
          </span>
          <span className="text-xs" style={{ color: "var(--hp-text-muted)" }}>
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  );
}
