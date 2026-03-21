"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import HeroAnimation from "@/components/HeroAnimation";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  ClipboardList,
  Layers,
  HelpCircle,
  CalendarCheck,
  TrendingUp,
  SearchCheck,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Full Mock Test",
    icon: ClipboardList,
    description:
      "Complete timed test with all 4 sections — Listening, Reading, Writing, and Speaking.",
    color: "#c78b3c",
  },
  {
    title: "Section Practice",
    icon: Layers,
    description:
      "Focus on a single section at your own pace with full timing simulation.",
    color: "#6b8f71",
  },
  {
    title: "Quiz Mode",
    icon: HelpCircle,
    description:
      "Untimed question-by-question practice with instant feedback on every answer.",
    color: "#7a8fc7",
  },
  {
    title: "Smart Study Plan",
    icon: CalendarCheck,
    description:
      "Set your test date and goal score — we generate a phased study plan tailored to your weak areas.",
    color: "#c77a8b",
  },
  {
    title: "Test Review",
    icon: SearchCheck,
    description:
      "Review every answer after each test — see what you got right, what you missed, and the correct answers.",
    color: "#8bc7a3",
  },
  {
    title: "Track Progress",
    icon: TrendingUp,
    description:
      "Save your test history, view score trends, and plan your study schedule.",
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
    score: "CLB 9",
    location: "Toronto, ON",
    quote:
      "The study plan feature was a game-changer. It identified my weak spots in listening and gave me a structured path. I went from a 7 to a 9 in just 3 weeks.",
    color: "#c78b3c",
  },
  {
    name: "Marco L.",
    score: "CLB 10",
    location: "Vancouver, BC",
    quote:
      "The quiz mode with instant feedback helped me understand my mistakes right away. The full mock tests felt very close to the real exam.",
    color: "#6b8f71",
  },
  {
    name: "Aisha K.",
    score: "CLB 8",
    location: "Calgary, AB",
    quote:
      "I only had 2 weeks to prepare and was very stressed. The auto-generated study plan kept me focused and on track. Highly recommend.",
    color: "#7a8fc7",
  },
  {
    name: "David C.",
    score: "CLB 9",
    location: "Montreal, QC",
    quote:
      "Being able to practice individual sections was exactly what I needed. I spent extra time on writing and speaking, and my scores improved significantly.",
    color: "#c77a8b",
  },
  {
    name: "Yuki T.",
    score: "CLB 10",
    location: "Ottawa, ON",
    quote:
      "The progress tracking kept me motivated. Seeing my score trend go up over time gave me the confidence I needed heading into the real test.",
    color: "#8bc7a3",
  },
  {
    name: "Fatima R.",
    score: "CLB 8",
    location: "Edmonton, AB",
    quote:
      "I loved how the plan adjusted focus to my weakest areas. The three-phase approach made so much sense.",
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
          className="text-xs sm:text-sm font-semibold tracking-wider sm:tracking-widest uppercase shrink-0"
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
                CELPIP Preparation
              </span>
            </div>
            <h1
              className="hp-reveal hp-reveal-d2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Master the
              <br />
              <span
                className="hp-accent-line"
                style={{ color: "var(--hp-accent)" }}
              >
                CELPIP
              </span>{" "}
              exam.
            </h1>
            <p
              className="hp-reveal hp-reveal-d3 text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--hp-text-muted)" }}
            >
              Build confidence with realistic practice tests covering all four
              sections. AI-powered study plans. Instant feedback. Track your
              progress to test day.
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
            { value: "4", label: "Test Sections" },
            { value: "96+", label: "Questions" },
            { value: "~3h", label: "Full Test" },
            { value: "AI", label: "Study Plans" },
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

      {/* ── Try a Free Quiz ──────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Try a{" "}
            <span style={{ color: "var(--hp-accent)" }}>Free Quiz</span>
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            No account needed. Jump right in and test your skills.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            {
              title: "Listening",
              description: "Listen to a conversation and answer comprehension questions.",
              icon: Headphones,
              color: "#c78b3c",
              href: "/quiz/listening?part=0",
              detail: "Part 1 — Practice",
            },
            {
              title: "Reading",
              description: "Read a passage and answer questions about key details.",
              icon: BookOpen,
              color: "#6b8f71",
              href: "/quiz/reading?part=0",
              detail: "Part 1 — Practice",
            },
          ].map((q, i) => (
            <button
              key={q.title}
              onClick={() => router.push(q.href)}
              className={`hp-glass rounded-2xl p-6 text-left relative overflow-hidden group transition-all hp-reveal hp-reveal-d${i + 1}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = q.color;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--hp-border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={{ border: "1px solid var(--hp-border)" }}
            >
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                style={{ background: q.color, opacity: 0.5 }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${q.color}15`, color: q.color }}
                >
                  <q.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-lg font-bold mb-0.5"
                    style={{ color: q.color, fontFamily: "var(--font-serif)" }}
                  >
                    {q.title}
                  </p>
                  <p
                    className="text-xs font-medium mb-2"
                    style={{ color: "var(--hp-text-muted)" }}
                  >
                    {q.detail}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--hp-text-muted)" }}
                  >
                    {q.description}
                  </p>
                </div>
                <ArrowRight
                  className="w-5 h-5 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: q.color }}
                />
              </div>
            </button>
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
              prepare
            </span>
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            Multiple study modes designed to help you succeed on test day.
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
                New Feature
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                AI-Powered
                <br />
                <span style={{ color: "var(--hp-accent)" }}>Study Plan</span>
              </h2>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: "var(--hp-text-muted)" }}
              >
                Tell us your test date and target score. We analyze your past
                performance, identify weak areas, and generate a personalized
                day-by-day study plan with three phases:
              </p>

              {/* Phase timeline */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    phase: "Foundation",
                    pct: "60%",
                    desc: "Build skills with quizzes and section drills on weak areas",
                  },
                  {
                    phase: "Integration",
                    pct: "30%",
                    desc: "Mixed practice sessions with full mock tests",
                  },
                  {
                    phase: "Final Prep",
                    pct: "10%",
                    desc: "Full timed simulations and targeted review",
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
                    "Listening Quiz Practice",
                    "Reading Section Practice",
                  ],
                },
                {
                  day: "Tue",
                  items: [
                    "Writing Section Practice",
                    "Speaking Quiz Practice",
                  ],
                },
                { day: "Wed", items: ["Full Mock Test"] },
                {
                  day: "Thu",
                  items: [
                    "Listening Review — Weak Areas",
                    "Quick Quiz Review",
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
            Our mock test mirrors the official CELPIP structure
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
            Trusted by{" "}
            <span style={{ color: "var(--hp-accent)" }}>thousands</span>
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            Real results from real test-takers across Canada.
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
          Ready to start
          <br />
          <span style={{ color: "var(--hp-accent)" }}>practicing?</span>
        </h2>
        <p
          className="text-base mb-8 relative hp-reveal hp-reveal-d1"
          style={{ color: "var(--hp-text-muted)" }}
        >
          Create a free account and take your first mock test today.
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
            className="text-xs tracking-widest uppercase"
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
