"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import HeroAnimation from "@/components/HeroAnimation";
import {
  Target,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Star,
  Sparkles,
  Check,
  X,
  CircleAlert,
  Clock,
  ShieldQuestion,
} from "lucide-react";

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
            {/* Headline variation 2: "Hit your target CELPIP score in 30 days — not 6 months." */}
            {/* Headline variation 3: "Stuck at CLB 7? Your AI coach knows exactly what to fix." */}
            <h1
              className="hp-reveal hp-reveal-d2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Stop practicing blindly.
              <br />
              <span
                className="hp-accent-line"
                style={{ color: "var(--hp-accent)" }}
              >
                Improve
              </span>{" "}
              your CELPIP score.
            </h1>
            <p
              className="hp-reveal hp-reveal-d3 text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--hp-text-muted)" }}
            >
              PugPIP analyzes your weaknesses, tells you exactly what to practice each day, and tracks your score improvement — so nothing is wasted.
            </p>
            <div className="hp-reveal hp-reveal-d4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <button
                onClick={handleCta}
                className="hp-cta-btn px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {!loading && currentUser ? "Go to Dashboard" : "Start Free Diagnosis"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
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
                See How It Works
              </button>
            </div>
            {/* Trust indicators */}
            <div className="hp-reveal hp-reveal-d5 flex flex-wrap gap-4 sm:gap-6 mt-8 justify-center md:justify-start">
              {[
                "2,000+ scores improved",
                "AI-scored on 4 dimensions",
                "Personalized 30-day plans",
              ].map((t) => (
                <span
                  key={t}
                  className="text-xs font-medium flex items-center gap-1.5"
                  style={{ color: "var(--hp-text-muted)" }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: "var(--hp-accent)" }} />
                  {t}
                </span>
              ))}
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
            { value: "2,000+", label: "Scores Improved" },
            { value: "+1.5", label: "Avg. CLB Increase" },
            { value: "30", label: "Day Study Plans" },
            { value: "4", label: "Score Dimensions" },
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

      {/* ── Problem ────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Sound{" "}
            <span style={{ color: "var(--hp-accent)" }}>familiar?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[
            {
              icon: ShieldQuestion,
              title: "Practicing without direction",
              description:
                "You take mock tests. You check answers. But your score stays the same. Because nobody tells you why you got it wrong — or what to fix first.",
              color: "#c4493c",
            },
            {
              icon: CircleAlert,
              title: "No real feedback",
              description:
                "Generic answer keys don't explain your writing weaknesses. You don't know if your coherence is the issue, your grammar, or your vocabulary.",
              color: "#c78b3c",
            },
            {
              icon: Clock,
              title: "Running out of time",
              description:
                "Your test date is approaching. You've spent weeks studying everything equally — instead of focusing on the 2–3 things that would actually move your score.",
              color: "#7a8fc7",
            },
          ].map((p, i) => (
            <div
              key={p.title}
              className={`hp-problem-card rounded-2xl p-6 relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${p.color}15`, color: p.color }}
              >
                <p.icon className="w-5 h-5" />
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "var(--hp-text)" }}
              >
                {p.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {p.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14 hp-reveal hp-reveal-d4">
          <p className="hp-quote-line">
            You don&apos;t need more practice. You need the <em>right</em> practice.
          </p>
        </div>
      </section>

      {/* ── Solution ───────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <div className="hp-reveal">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase mb-5 px-3 py-1.5 rounded-full"
              style={{
                color: "var(--hp-accent)",
                background: "var(--hp-accent-glow)",
                border: "1px solid rgba(199,139,60,0.15)",
              }}
            >
              <Sparkles className="w-3 h-3" />
              Meet Your AI Score Coach
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal hp-reveal-d1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            This is not another
            <br />
            <span style={{ color: "var(--hp-accent)" }}>mock test platform.</span>
          </h2>
          <p
            className="text-base max-w-2xl mx-auto hp-reveal hp-reveal-d2"
            style={{ color: "var(--hp-text-muted)" }}
          >
            PugPIP is an AI-powered score improvement system that diagnoses your weaknesses,
            builds your study plan, and tells you exactly what to practice — every single day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[
            {
              icon: Target,
              title: "Know exactly what to fix",
              description:
                "AI scores your responses across 4 CELPIP dimensions. It finds your top 3 weaknesses — not guesses, data.",
              callout: "Fix coherence → +1 CLB",
              color: "#c78b3c",
            },
            {
              icon: CalendarCheck,
              title: "Follow a plan that adapts",
              description:
                "Get a personalized daily study plan. 3-minute tasks. No wasted time. The plan shifts as your scores change.",
              callout: "Day 1: Grammar drills. Day 14: Full mock test.",
              color: "#6b8f71",
            },
            {
              icon: TrendingUp,
              title: "Watch your score climb",
              description:
                "Track your predicted score over time. Know if you're on track before test day.",
              callout: "7.0 → 8.5 in 28 days",
              color: "#7a8fc7",
            },
          ].map((s, i) => (
            <div
              key={s.title}
              className={`hp-glass rounded-2xl p-6 relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                style={{ background: s.color, opacity: 0.5 }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="hp-icon-glow w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${s.color}15`, color: s.color }}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="text-base font-semibold mb-1.5"
                    style={{ color: "var(--hp-text)" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: "var(--hp-text-muted)" }}
                  >
                    {s.description}
                  </p>
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: `${s.color}12`, color: s.color }}
                  >
                    {s.callout}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section id="how-it-works" className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Three steps to your{" "}
            <span style={{ color: "var(--hp-accent)" }}>target score</span>
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            From diagnosis to improvement in minutes, not months.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: "Take a 5-minute diagnostic",
              description:
                "Complete one writing or listening task. The AI scores it across 4 CELPIP dimensions and identifies your exact gaps.",
              color: "#c78b3c",
              cta: "Try Listening",
              href: "/quiz/listening?part=0",
            },
            {
              step: "2",
              title: "Get your personalized plan",
              description:
                "Based on your weaknesses, the AI builds a day-by-day study plan — targeted drills, practice tasks, and mock tests.",
              color: "#6b8f71",
              cta: "Try Writing",
              href: "/quiz-practice/writing?part=0",
            },
            {
              step: "3",
              title: "Improve and track progress",
              description:
                "Follow your daily tasks. Watch your predicted score improve. Walk into test day knowing you're ready.",
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

      {/* ── Product Experience / Dashboard Demo ────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="hp-glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden hp-reveal">
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(199,139,60,0.1) 0%, transparent 70%)",
            }}
          />
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Dashboard mockup */}
            <div className="space-y-3 hp-reveal hp-reveal-d1">
              {/* Score improvement card */}
              <div className="hp-mockup-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--hp-text-muted)" }}>
                  Score Improvement
                </p>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-bold" style={{ color: "var(--hp-text-muted)", fontFamily: "var(--font-serif)" }}>7.0</span>
                  <ArrowRight className="w-5 h-5 mb-1" style={{ color: "var(--hp-accent)" }} />
                  <span className="text-3xl font-bold" style={{ color: "var(--hp-accent)", fontFamily: "var(--font-serif)" }}>8.5</span>
                  <span className="text-xs font-semibold mb-1 px-2 py-0.5 rounded-full" style={{ background: "#6b8f7115", color: "#6b8f71" }}>+1.5 CLB</span>
                </div>
                <div className="hp-mockup-progress-bar">
                  <div className="hp-mockup-progress-fill" style={{ width: "75%" }} />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "var(--hp-text-muted)" }}>Day 21 of 30</p>
              </div>

              {/* Top weaknesses card */}
              <div className="hp-mockup-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--hp-text-muted)" }}>
                  Top Weaknesses
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Coherence (Writing)", pct: "45%" },
                    { label: "Grammar (Writing)", pct: "60%" },
                    { label: "Vocabulary (Speaking)", pct: "70%" },
                  ].map((w) => (
                    <div key={w.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "var(--hp-text)" }}>{w.label}</span>
                        <span style={{ color: "var(--hp-accent)" }}>{w.pct}</span>
                      </div>
                      <div className="hp-mockup-progress-bar">
                        <div className="hp-mockup-progress-fill" style={{ width: w.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's tasks card */}
              <div className="hp-mockup-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--hp-text-muted)" }}>
                  Today&apos;s Tasks
                </p>
                <div className="space-y-2">
                  {[
                    { task: "Grammar Drill — Sentence Structure", time: "3 min" },
                    { task: "Writing Task 1 — AI Scored", time: "15 min" },
                    { task: "Vocabulary Review — Coherence Words", time: "5 min" },
                  ].map((t) => (
                    <div
                      key={t.task}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5"
                      style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
                    >
                      <span className="text-xs font-medium" style={{ color: "var(--hp-text)" }}>{t.task}</span>
                      <span className="text-xs shrink-0 ml-2" style={{ color: "var(--hp-text-muted)" }}>{t.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="hp-reveal hp-reveal-d2">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase mb-5 px-3 py-1.5 rounded-full"
                style={{
                  color: "var(--hp-accent)",
                  background: "var(--hp-accent-glow)",
                  border: "1px solid rgba(199,139,60,0.15)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Inside the Dashboard
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                See your improvement
                <br />
                <span style={{ color: "var(--hp-accent)" }}>in real time</span>
              </h2>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--hp-text-muted)" }}
              >
                Every day, your dashboard shows exactly what to do. No guessing.
                No scrolling through question banks. Just the tasks that will move
                your score the most.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "AI feedback on every response",
                  "Weakness tracking across attempts",
                  "Score prediction updated daily",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--hp-accent)" }} />
                    <span className="text-sm" style={{ color: "var(--hp-text)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleCta}
                className="hp-cta-btn px-6 py-3 rounded-full text-sm flex items-center gap-2"
              >
                {!loading && currentUser ? "Go to Dashboard" : "Start Free Diagnosis"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison ─────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Not all CELPIP prep is{" "}
            <span style={{ color: "var(--hp-accent)" }}>the same</span>
          </h2>
        </div>

        <div className="hp-glass rounded-2xl overflow-hidden max-w-3xl mx-auto hp-reveal hp-reveal-d1">
          <div className="overflow-x-auto">
            <table className="hp-compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Traditional Prep</th>
                  <th>PugPIP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Feedback", old: "Answer keys only", pugpip: "AI scores 4 dimensions with tips" },
                  { feature: "Study Plan", old: "Figure it out yourself", pugpip: "Personalized daily tasks" },
                  { feature: "Weakness Detection", old: "None", pugpip: "AI identifies top 3 gaps" },
                  { feature: "Score Tracking", old: "Take another test and hope", pugpip: "Predicted score updated daily" },
                  { feature: "Time to Improve", old: "Months of general practice", pugpip: "Weeks of targeted practice" },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="font-semibold" style={{ color: "var(--hp-text)" }}>{row.feature}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 shrink-0" style={{ color: "#c4493c" }} />
                        {row.old}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#6b8f71" }} />
                        {row.pugpip}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* ── Final CTA ──────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 text-center px-4 sm:px-6">
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
          Your target score is
          <br />
          <span style={{ color: "var(--hp-accent)" }}>closer than you think.</span>
        </h2>
        <p
          className="text-base mb-4 relative hp-reveal hp-reveal-d1"
          style={{ color: "var(--hp-text-muted)" }}
        >
          Most users see measurable improvement within 2 weeks. Start with a free AI diagnosis — it takes 5 minutes.
        </p>
        <p
          className="text-sm mb-8 relative hp-reveal hp-reveal-d2 italic max-w-lg mx-auto"
          style={{ color: "var(--hp-text-muted)" }}
        >
          &ldquo;Your CELPIP tutor charges $60/hr and still can&apos;t tell you exactly what to fix.&rdquo;
        </p>
        <button
          onClick={handleCta}
          className="hp-cta-btn px-10 py-5 rounded-full text-lg flex items-center gap-3 mx-auto relative hp-reveal hp-reveal-d3"
        >
          {!loading && currentUser ? "Go to Dashboard" : "Start Free Diagnosis"}
          <ArrowRight className="w-5 h-5" />
        </button>
        <p
          className="text-xs mt-4 relative hp-reveal hp-reveal-d4"
          style={{ color: "var(--hp-text-muted)" }}
        >
          No credit card required. Stop guessing. Start knowing.
        </p>
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
