"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeroAnimation from "@/components/HeroAnimation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Headphones, BookOpen, PenLine, Mic, ClipboardList, Layers, HelpCircle, CalendarCheck, TrendingUp, SearchCheck } from "lucide-react";

const features = [
  {
    title: "Full Mock Test",
    icon: ClipboardList,
    description: "Complete timed test with all 4 sections — Listening, Reading, Writing, and Speaking.",
    accent: "border-purple-300 bg-purple-50/60",
    titleColor: "text-purple-700",
  },
  {
    title: "Section Practice",
    icon: Layers,
    description: "Focus on a single section at your own pace with full timing simulation.",
    accent: "border-orange-300 bg-orange-50/60",
    titleColor: "text-orange-700",
  },
  {
    title: "Quiz Mode",
    icon: HelpCircle,
    description: "Untimed question-by-question practice with instant feedback on every answer.",
    accent: "border-green-300 bg-green-50/60",
    titleColor: "text-green-700",
  },
  {
    title: "Smart Study Plan",
    icon: CalendarCheck,
    description: "Set your test date and goal score — we generate a phased study plan tailored to your weak areas.",
    accent: "border-blue-300 bg-blue-50/60",
    titleColor: "text-blue-700",
  },
  {
    title: "Test Review",
    icon: SearchCheck,
    description: "Review every answer after each test — see what you got right, what you missed, and the correct answers.",
    accent: "border-cyan-300 bg-cyan-50/60",
    titleColor: "text-cyan-700",
  },
  {
    title: "Track Progress",
    icon: TrendingUp,
    description: "Save your test history, view score trends, and plan your study schedule.",
    accent: "border-pink-300 bg-pink-50/60",
    titleColor: "text-pink-700",
  },
];

export default function Home() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  return (
    <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
      {/* ── Top nav ────────────────────────────────── */}
      <nav className="max-w-screen-xl mx-auto px-6 pt-6 flex justify-between items-center">
        <span className="text-sm font-bold text-[#6b4c9a]">CELPIP Mock Test</span>
        <div className="flex items-center gap-2">
          {!loading && currentUser ? (
            <>
              <span className="text-sm text-[#6b6b7b]">{currentUser.name}</span>
              <Button
                onClick={() => router.push("/dashboard")}
                className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
              >
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 rounded-full text-sm font-medium text-[#6b6b7b] hover:text-[#6b4c9a] transition-colors"
              >
                Sign In
              </button>
              <Button
                onClick={() => router.push("/login")}
                className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <Badge className="mb-5 bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100 text-sm font-medium px-4 py-1">
              CELPIP Preparation
            </Badge>
            <h1 className="text-5xl font-sans font-bold tracking-tight mb-5 text-[#1a1a2e]">
              CELPIP Mock Test
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--muted-foreground)" }}>
              Prepare for the Canadian English Language Proficiency Index
              Program. Build confidence with realistic practice tests covering
              all four sections.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Button
                size="lg"
                className="text-base px-8 py-6 rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white shadow-sm"
                onClick={() => router.push(!loading && currentUser ? "/dashboard" : "/login")}
              >
                {!loading && currentUser ? "Go to Dashboard" : "Get Started Free"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 rounded-full border-[#e2ddd5] text-[#6b6b7b] hover:border-[#6b4c9a] hover:text-[#6b4c9a]"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="shrink-0">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section id="features" className="max-w-screen-xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-sans font-bold text-[#1a1a2e] mb-3">
            Everything you need to prepare
          </h2>
          <p className="text-base" style={{ color: "var(--muted-foreground)" }}>
            Multiple study modes designed to help you succeed on test day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className={`border-2 ${f.accent} rounded-2xl overflow-hidden`}
            >
              <CardContent className="pt-6">
                <h3 className={`text-xl font-sans font-medium mb-2 ${f.titleColor} flex items-center justify-center gap-2`}>
                  <f.icon className="w-5 h-5" />
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Study Plan showcase ───────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pb-16">
        <Card className="border-2 border-blue-200 bg-blue-50/40 rounded-2xl overflow-hidden">
          <CardContent className="pt-8 pb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 text-sm font-medium px-3 py-0.5">
                  New Feature
                </Badge>
                <h2 className="text-2xl font-sans font-bold text-[#1a1a2e] mb-3">
                  AI-Powered Study Plan
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
                  Tell us your test date and target score. We analyze your past performance,
                  identify weak areas, and generate a personalized day-by-day study plan
                  with three phases:
                </p>
                <div className="space-y-2 mb-5">
                  {[
                    { phase: "Foundation", pct: "60%", desc: "Build skills with quizzes and section drills on weak areas", color: "bg-blue-100 text-blue-700" },
                    { phase: "Integration", pct: "30%", desc: "Mixed practice sessions with full mock tests", color: "bg-amber-100 text-amber-700" },
                    { phase: "Final Prep", pct: "10%", desc: "Full timed simulations and targeted review", color: "bg-red-100 text-red-700" },
                  ].map((p) => (
                    <div key={p.phase} className="flex items-start gap-2">
                      <Badge className={`${p.color} border text-[10px] shrink-0 mt-0.5`}>
                        {p.phase}
                      </Badge>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        <strong>{p.pct}</strong> — {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => router.push(!loading && currentUser ? "/dashboard" : "/login")}
                  className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
                >
                  Create Your Plan
                </Button>
              </div>
              <div className="space-y-2">
                {[
                  { day: "Mon", items: ["Listening Quiz Practice", "Reading Section Practice"] },
                  { day: "Tue", items: ["Writing Section Practice", "Speaking Quiz Practice"] },
                  { day: "Wed", items: ["Full Mock Test"] },
                  { day: "Thu", items: ["Listening Review — Focus on Weak Areas", "Quick Quiz Review"] },
                ].map((row) => (
                  <div key={row.day} className="flex gap-3 items-start">
                    <span className="w-10 text-right text-xs font-bold text-[#1a1a2e] pt-2">{row.day}</span>
                    <div className="flex-1 space-y-1">
                      {row.items.map((item, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg border border-[#e2ddd5] bg-white text-xs text-[#1a1a2e]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Test overview ────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pb-16">
        <Card className="border-2 border-[#e2ddd5] rounded-2xl overflow-hidden">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/celpip-logo.jpg" alt="CELPIP General Test" width={160} height={160} className="mx-auto mb-4" />
              <h2 className="text-2xl font-sans font-bold text-[#1a1a2e] mb-2">
                CELPIP General Test Format
              </h2>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Our mock test mirrors the official CELPIP structure
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Listening", detail: "6 parts, 30 questions", time: "~47 min", color: "text-orange-700", bg: "bg-orange-100", iconColor: "text-orange-600", Icon: Headphones },
                { label: "Reading", detail: "4 parts, 27 questions", time: "~55 min", color: "text-green-700", bg: "bg-green-100", iconColor: "text-green-600", Icon: BookOpen },
                { label: "Writing", detail: "2 tasks", time: "~53 min", color: "text-purple-700", bg: "bg-purple-100", iconColor: "text-purple-600", Icon: PenLine },
                { label: "Speaking", detail: "8 tasks", time: "~20 min", color: "text-pink-700", bg: "bg-pink-100", iconColor: "text-pink-600", Icon: Mic },
              ].map((s) => (
                <div key={s.label}>
                  <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                    <s.Icon className={`w-6 h-6 ${s.iconColor}`} />
                  </div>
                  <p className={`text-lg font-bold ${s.color}`}>{s.label}</p>
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{s.detail}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{s.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-sans font-bold text-[#1a1a2e] mb-3">
            What our users say
          </h2>
          <p className="text-base" style={{ color: "var(--muted-foreground)" }}>
            Thousands of test-takers have improved their CELPIP scores with our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              name: "Priya S.",
              role: "Scored CLB 9",
              location: "Toronto, ON",
              quote: "The study plan feature was a game-changer. It identified my weak spots in listening and gave me a structured path. I went from a 7 to a 9 in just 3 weeks.",
              accent: "border-orange-200",
              avatarBg: "bg-orange-200 text-orange-700",
            },
            {
              name: "Marco L.",
              role: "Scored CLB 10",
              location: "Vancouver, BC",
              quote: "The quiz mode with instant feedback helped me understand my mistakes right away. The full mock tests felt very close to the real exam — no surprises on test day.",
              accent: "border-green-200",
              avatarBg: "bg-green-200 text-green-700",
            },
            {
              name: "Aisha K.",
              role: "Scored CLB 8",
              location: "Calgary, AB",
              quote: "I only had 2 weeks to prepare and was very stressed. The auto-generated study plan kept me focused and on track. Highly recommend for anyone short on time.",
              accent: "border-purple-200",
              avatarBg: "bg-purple-200 text-purple-700",
            },
            {
              name: "David C.",
              role: "Scored CLB 9",
              location: "Montreal, QC",
              quote: "Being able to practice individual sections was exactly what I needed. I spent extra time on writing and speaking, and my scores improved significantly.",
              accent: "border-pink-200",
              avatarBg: "bg-pink-200 text-pink-700",
            },
            {
              name: "Yuki T.",
              role: "Scored CLB 10",
              location: "Ottawa, ON",
              quote: "The progress tracking kept me motivated. Seeing my score trend go up over time gave me the confidence I needed heading into the real test.",
              accent: "border-blue-200",
              avatarBg: "bg-blue-200 text-blue-700",
            },
            {
              name: "Fatima R.",
              role: "Scored CLB 8",
              location: "Edmonton, AB",
              quote: "I loved how the plan adjusted focus to my weakest areas. The three-phase approach — foundation, integration, final prep — made so much sense.",
              accent: "border-amber-200",
              avatarBg: "bg-amber-200 text-amber-700",
            },
          ].map((t) => (
            <Card
              key={t.name}
              className={`border-2 ${t.accent} rounded-2xl overflow-hidden`}
            >
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed mb-4 italic" style={{ color: "var(--muted-foreground)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-sm font-bold shrink-0`}>
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a2e]">{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {t.role} &middot; {t.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-3xl font-sans font-bold text-[#1a1a2e] mb-3">
          Ready to start practicing?
        </h2>
        <p className="text-base mb-6" style={{ color: "var(--muted-foreground)" }}>
          Create a free account and take your first mock test today.
        </p>
        <Button
          size="lg"
          className="text-base px-10 py-6 rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white shadow-sm"
          onClick={() => router.push(!loading && currentUser ? "/dashboard" : "/login")}
        >
          {!loading && currentUser ? "Go to Dashboard" : "Get Started Free"}
        </Button>
      </section>
    </main>
  );
}
