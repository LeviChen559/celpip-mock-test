"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resetTestState, saveTestState, PracticeSection } from "@/lib/test-store";
import { listeningParts, readingParts, writingTasks, speakingTasks } from "@/lib/celpip-data";
import MyTests from "@/components/MyTests";
import MySchedule from "@/components/MySchedule";
import StudyPlan from "@/components/StudyPlan";
import { useAuth } from "@/lib/hooks/use-auth";
import { useHistory } from "@/lib/hooks/use-history";
import { Headphones, BookOpen, PenLine, Mic, type LucideIcon } from "lucide-react";

// ── Helpers ────────────────────────────────────────────

// Convert ALL CAPS to Title Case
function toTitleCase(str: string): string {
  if (str !== str.toUpperCase()) return str;
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// Extract a short topic from the first line of a passage/transcript
function extractTopic(text: string): string {
  let topic: string;
  const subjectMatch = text.match(/Subject:\s*(.+)/);
  if (subjectMatch) {
    topic = subjectMatch[1].replace(/\s*—.*/, "").trim().slice(0, 50);
    return toTitleCase(topic);
  }
  const speakerMatch = text.trim().match(/^(\w[\w\s]*?)(?:\s*\(.*?\))?:\s*(.+)/);
  if (speakerMatch) {
    topic = speakerMatch[2].trim().slice(0, 50);
    return toTitleCase(topic);
  }
  const first = text.trim().split("\n")[0].trim();
  topic = first.replace(/\s*—.*/, "").slice(0, 50);
  return toTitleCase(topic);
}

// ── Section data ───────────────────────────────────────

// Official CELPIP section structure — first set of parts only
const sections = [
  {
    title: "Listening",
    key: "listening" as PracticeSection,
    icon: Headphones,
    description:
      "Conversations, news reports, and discussions with multiple-choice questions.",
    duration: "~47 min",
    summary: "6 parts + practice, 39 questions",
    accent: "border-orange-300 bg-orange-50/60",
    titleColor: "text-orange-700",
    linkColor: "text-orange-600",
    href: "/test/listening",
    quizBase: "/quiz/listening",
    officialParts: listeningParts.slice(0, 7).map((p, i) => ({
      index: i,
      title: p.title,
      topic: extractTopic(p.transcript),
      questionCount: p.questions.length,
    })),
  },
  {
    title: "Reading",
    key: "reading" as PracticeSection,
    icon: BookOpen,
    description:
      "Emails, schedules, articles, and opinion pieces with comprehension questions.",
    duration: "~55 min",
    summary: "4 parts + practice, 39 questions",
    accent: "border-green-300 bg-green-50/60",
    titleColor: "text-green-700",
    linkColor: "text-green-600",
    href: "/test/reading",
    quizBase: "/quiz/reading",
    officialParts: readingParts.slice(0, 5).map((p, i) => ({
      index: i,
      title: p.title,
      topic: extractTopic(p.passage),
      questionCount: p.questions.length,
    })),
  },
  {
    title: "Writing",
    key: "writing" as PracticeSection,
    icon: PenLine,
    description:
      "Write an email and respond to a survey question with structured responses.",
    duration: "~53 min",
    summary: "2 tasks",
    accent: "border-purple-300 bg-purple-50/60",
    titleColor: "text-purple-700",
    linkColor: "text-purple-600",
    href: "/test/writing",
    quizBase: "/quiz-practice/writing",
    officialParts: writingTasks.slice(0, 2).map((t, i) => ({
      index: i,
      title: t.title,
      topic: extractTopic(t.prompt),
      questionCount: 1,
    })),
  },
  {
    title: "Speaking",
    key: "speaking" as PracticeSection,
    icon: Mic,
    description:
      "Respond to prompts covering advice, descriptions, opinions, and persuasion.",
    duration: "~20 min",
    summary: "8 tasks + practice",
    accent: "border-pink-300 bg-pink-50/60",
    titleColor: "text-pink-700",
    linkColor: "text-pink-600",
    href: "/test/speaking",
    quizBase: "/quiz-practice/speaking",
    officialParts: speakingTasks.slice(0, 9).map((t, i) => ({
      index: i,
      title: t.title,
      topic: extractTopic(t.prompt),
      questionCount: 1,
    })),
  },
];

// Group parts/tasks by their CELPIP category, using the first item's full title as label
// e.g. "Part 1: Reading Correspondence" groups all "Reading Correspondence" quizzes
function extractCategoryKey(title: string): string {
  if (title.startsWith("Practice")) return "Practice Task";
  const match = title.match(/(?:Part|Task)\s+\d+:\s+(.+)/);
  return match ? match[1] : title;
}

interface QuizItem { id: string; title: string; topic?: string; questionCount: number; originalIndex: number }
interface QuizCategory { category: string; items: QuizItem[] }

function groupByCategory(
  parts: { id: string; title: string; topic?: string; questionCount: number }[]
): QuizCategory[] {
  const map = new Map<string, { label: string; items: QuizItem[] }>();
  parts.forEach((p, idx) => {
    const key = extractCategoryKey(p.title);
    if (!map.has(key)) map.set(key, { label: p.title, items: [] });
    map.get(key)!.items.push({ ...p, originalIndex: idx });
  });
  return Array.from(map.values()).map(({ label, items }) => ({ category: label, items }));
}

const quizSections = [
  {
    key: "listening",
    title: "Listening",
    icon: Headphones,
    description: "Conversations, news reports, and discussions with multiple-choice questions.",
    accent: "border-orange-300 bg-orange-50/60",
    titleColor: "text-orange-700",
    linkColor: "text-orange-600",
    categories: groupByCategory(
      listeningParts.map((p) => ({ id: p.id, title: p.title, topic: extractTopic(p.transcript), questionCount: p.questions.length }))
    ),
  },
  {
    key: "reading",
    title: "Reading",
    icon: BookOpen,
    description: "Emails, schedules, articles, and opinion pieces with comprehension questions.",
    accent: "border-green-300 bg-green-50/60",
    titleColor: "text-green-700",
    linkColor: "text-green-600",
    categories: groupByCategory(
      readingParts.map((p) => ({ id: p.id, title: p.title, topic: extractTopic(p.passage), questionCount: p.questions.length }))
    ),
  },
  {
    key: "writing",
    title: "Writing",
    icon: PenLine,
    description: "Write an email and respond to a survey question with structured responses.",
    accent: "border-purple-300 bg-purple-50/60",
    titleColor: "text-purple-700",
    linkColor: "text-purple-600",
    categories: groupByCategory(
      writingTasks.map((t) => ({ id: t.id, title: t.title, topic: extractTopic(t.prompt), questionCount: 1 }))
    ),
  },
  {
    key: "speaking",
    title: "Speaking",
    icon: Mic,
    description: "Respond to prompts covering advice, descriptions, opinions, and persuasion.",
    accent: "border-pink-300 bg-pink-50/60",
    titleColor: "text-pink-700",
    linkColor: "text-pink-600",
    categories: groupByCategory(
      speakingTasks.map((t) => ({ id: t.id, title: t.title, topic: extractTopic(t.prompt), questionCount: 1 }))
    ),
  },
];

// ── Tabs ───────────────────────────────────────────────

const tabs = [
  { key: "full", label: "Full Mock Test" },
  { key: "section", label: "Section Practice" },
  { key: "quiz", label: "Quiz Practice" },
  { key: "plan", label: "Study Plan" },
  { key: "mytests", label: "My Test Results" },
  { key: "schedule", label: "My Schedule" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

// ── Page ───────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const { currentUser, loading, signOut } = useAuth();
  const { records } = useHistory();
  const [activeTab, setActiveTab] = useState<TabKey>("full");
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [loading, currentUser, router]);

  useEffect(() => {
    if (!currentUser) return;
    import("@/lib/supabase/client").then(({ createClient: create }) => {
      const supabase = create();
      supabase.from("profiles").select("role").eq("id", currentUser.id).single()
        .then(({ data, error }: { data: { role: string } | null; error: unknown }) => {
          console.log("Admin check:", { data, error });
          if (data?.role === "admin") setIsAdmin(true);
        });
    });
  }, [currentUser]);

  if (loading || !currentUser) return null;

  // Build a map of completed quiz keys: "section:partIndex" → most recent record
  const completedQuizMap = new Map<string, number>();
  records
    .filter((r) => r.type === "quiz" && r.quizSection && r.quizPart)
    .forEach((r) => {
      const key = `${r.quizSection}:${r.quizPart}`;
      const prev = completedQuizMap.get(key);
      if (!prev || r.timestamp > prev) completedQuizMap.set(key, r.timestamp);
    });
  const isQuizDone = (section: string, partIndex: number) =>
    completedQuizMap.has(`${section}:${partIndex}`);
  const getQuizFinishedAt = (section: string, partIndex: number) => {
    const ts = completedQuizMap.get(`${section}:${partIndex}`);
    if (!ts) return "";
    return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const handleFullTest = () => {
    resetTestState();
    saveTestState({ practiceMode: null });
    router.push("/test");
  };

  const handleSectionPractice = (section: (typeof sections)[number]) => {
    resetTestState();
    saveTestState({ practiceMode: section.key });
    router.push(section.href);
  };

  return (
    <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
      {/* ── Top nav ────────────────────────────────── */}
      <nav className="max-w-screen-xl mx-auto px-6 pt-6 flex items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="text-sm font-bold text-[#6b4c9a] hover:underline mr-auto"
        >
          CELPIP Mock Test
        </button>

        {tabs.slice(4).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[#6b4c9a] text-white shadow-sm"
                : "text-[#6b6b7b] hover:text-[#6b4c9a]"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="w-px h-5 bg-[#e2ddd5] mx-1" />
        <span className="text-sm font-medium text-[#1a1a2e]">
          {currentUser.name}
        </span>
        {isAdmin && (
          <button
            onClick={() => router.push("/admin")}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-purple-600 hover:bg-purple-50 transition-colors"
          >
            Admin
          </button>
        )}
        <button
          onClick={() => signOut()}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-[#6b6b7b] hover:text-red-600 transition-colors"
        >
          Sign Out
        </button>
      </nav>

      {/* ── Welcome header ─────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-16">
          <h2 className="text-3xl font-sans font-bold text-[#1a1a2e]">
            Welcome back, {currentUser.name.split(" ")[0]}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Full timed tests, single section practice, or untimed quiz mode
            with instant feedback.
          </p>
        </div>
      </section>

      {/* ── Tab navigation (Tines-style pill tabs) ─ */}
      <section className="max-w-screen-xl mx-auto px-6 pb-10">
        <div className="flex gap-2 mb-8">
          {tabs.slice(0, 4).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-[#6b4c9a] text-white shadow-sm"
                  : "bg-white border border-[#e2ddd5] text-[#6b6b7b] hover:border-[#6b4c9a] hover:text-[#6b4c9a]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Full Mock Test ──────────────── */}
        {activeTab === "full" && (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {sections.map((s) => (
                <Card
                  key={s.title}
                  className={`border-2 ${s.accent} rounded-2xl overflow-hidden`}
                >
                  <CardContent className="py-6">
                    <h3 className={`text-xl font-sans font-medium mb-1 ${s.titleColor} flex items-center gap-2`}>
                      <s.icon className="w-5 h-5" />
                      {s.title}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>
                      {s.duration} · {s.summary}
                    </p>
                    <div className="space-y-1 mb-3">
                      {s.officialParts.map((part, i) => (
                        <p key={i} className="text-[11px] text-[#1a1a2e]">
                          <span className={`font-medium ${s.titleColor}`}>{i + 1}.</span>{" "}
                          {part.topic}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center space-y-3">
              <Button
                size="lg"
                className="text-base px-10 py-6 rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white shadow-sm"
                onClick={handleFullTest}
              >
                Start Full Mock Test
              </Button>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                ~2 hours 55 minutes — Listening, Reading, Writing, Speaking
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 2: Section Practice ────────────── */}
        {activeTab === "section" && (
          <div className="flex gap-6">
            {/* Sidebar */}
            <Card className="w-48 shrink-0 border-0 rounded-2xl h-fit shadow-none">
              <CardContent className="pt-5 space-y-1.5">
                {sections.map((s) => {
                  const isActive = (expandedSection || "listening") === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setExpandedSection(s.key)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 ${
                        isActive
                          ? `${s.accent} ${s.titleColor} border-2 shadow-sm`
                          : "bg-white border-2 border-transparent text-[#6b6b7b] hover:text-[#6b4c9a]"
                      }`}
                    >
                      <s.icon className="w-4 h-4" />
                      {s.title}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="flex-1 border-0 rounded-2xl shadow-none">
              <CardContent className="py-6 px-6">
              {sections.map((s) => {
                if ((expandedSection || "listening") !== s.key) return null;
                return (
                  <div key={s.key}>
                    <div className="mb-4 text-center">
                      <h3 className={`text-xl font-sans font-medium ${s.titleColor} flex items-center justify-center gap-2 mb-1`}>
                        <s.icon className="w-5 h-5" />
                        {s.title}
                      </h3>
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {s.description}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                        {s.duration} · {s.summary}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      {s.officialParts.map((part, i) => (
                        <button
                          key={i}
                          onClick={() => router.push(`${s.quizBase}?part=${part.index}`)}
                          className="w-full text-left px-3 py-2.5 rounded-xl bg-white border border-[#e2ddd5] hover:border-[#6b4c9a] hover:shadow-sm transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${s.accent} ${s.titleColor}`}>
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-[#1a1a2e]">{part.title}</p>
                              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                                {part.topic} · {part.questionCount} {part.questionCount === 1 ? "question" : "questions"}
                              </p>
                            </div>
                          </div>
                          <span className={`text-sm font-semibold ${s.linkColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            Start &rarr;
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Tab 4: Study Plan ──────────────────── */}
        {activeTab === "plan" && <StudyPlan />}

        {/* ── Tab 5: My Test Results ────────────────────── */}
        {activeTab === "mytests" && <MyTests />}

        {/* ── Tab 5: My Schedule ─────────────────── */}
        {activeTab === "schedule" && <MySchedule />}

        {/* ── Tab 3: Quiz Practice ───────────────── */}
        {activeTab === "quiz" && (
          <div className="flex gap-6">
            {/* Sidebar */}
            <Card className="w-48 shrink-0 border-0 rounded-2xl h-fit shadow-none">
              <CardContent className="pt-5 space-y-1.5">
                {quizSections.map((qs) => {
                  const isActive = (expandedQuiz || "listening") === qs.key;
                  return (
                    <button
                      key={qs.key}
                      onClick={() => setExpandedQuiz(qs.key)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 ${
                        isActive
                          ? `${qs.accent} ${qs.titleColor} border-2 shadow-sm`
                          : "bg-white border-2 border-transparent text-[#6b6b7b] hover:text-[#6b4c9a]"
                      }`}
                    >
                      <qs.icon className="w-4 h-4" />
                      {qs.title}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="flex-1 border-0 rounded-2xl shadow-none">
              <CardContent className="py-6 px-6">
              {quizSections.map((qs) => {
                if ((expandedQuiz || "listening") !== qs.key) return null;
                const totalParts = qs.categories.reduce((sum, cat) => sum + cat.items.length, 0);
                const base = qs.key === "writing" || qs.key === "speaking" ? "/quiz-practice" : "/quiz";
                return (
                  <div key={qs.key}>
                    <div className="mb-4 text-center">
                      <h3 className={`text-xl font-sans font-medium ${qs.titleColor} flex items-center justify-center gap-2 mb-1`}>
                        <qs.icon className="w-5 h-5" />
                        {qs.title}
                      </h3>
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {qs.description}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                        {qs.categories.length} parts · {totalParts} quizzes
                      </p>
                    </div>

                    <div className="space-y-4">
                      {qs.categories.map((cat) => (
                        <div key={cat.category}>
                          <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${qs.titleColor}`}>
                            {cat.category}
                          </p>
                          <div className="space-y-1.5">
                            {cat.items.map((item, i) => {
                              const done = isQuizDone(qs.key, item.originalIndex);
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => router.push(`${base}/${qs.key}?part=${item.originalIndex}`)}
                                  className={`w-full text-left px-3 py-2.5 rounded-xl border hover:border-[#6b4c9a] hover:shadow-sm transition-all flex items-center justify-between group ${
                                    done ? "bg-green-50/60 border-green-200" : "bg-white border-[#e2ddd5]"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    {done ? (
                                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-green-100 text-green-700">
                                        &#10003;
                                      </span>
                                    ) : (
                                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${qs.accent} ${qs.titleColor}`}>
                                        {i + 1}
                                      </span>
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-[#1a1a2e]">
                                        {item.topic || `Quiz ${i + 1}`}
                                      </p>
                                      <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                                        {item.questionCount} {item.questionCount === 1 ? "question" : "questions"}
                                        {done && <span className="ml-1 text-green-600 font-medium">· {getQuizFinishedAt(qs.key, item.originalIndex)}</span>}
                                      </p>
                                    </div>
                                  </div>
                                  <span className={`text-sm font-semibold ${qs.linkColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    {done ? "Redo" : "Start"} &rarr;
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
