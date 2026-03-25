"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetTestState, saveTestState, PracticeSection } from "@/lib/test-store";
import {
  listeningParts as hardcodedListeningParts,
  readingParts as hardcodedReadingParts,
  writingTasks as hardcodedWritingTasks,
  speakingTasks as hardcodedSpeakingTasks,
  type ListeningPart,
  type ReadingPart,
  type WritingTask,
  type SpeakingTask,
} from "@/lib/celpip-data";
import { getListeningPartsClient, getReadingPartsClient, getWritingTasksClient, getSpeakingTasksClient } from "@/lib/content-client";
import MyTests from "@/components/MyTests";
import MySchedule from "@/components/MySchedule";
import StudyPlan from "@/components/StudyPlan";
import ApiUsageCounter from "@/components/ApiUsageCounter";
import { useAuth } from "@/lib/hooks/use-auth";
import { useHistory } from "@/lib/hooks/use-history";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  ArrowRight,
  CheckCircle2,
  Lock,
  ClipboardList,
  BarChart3,
  CalendarDays,
  FileText,
  Layers,
  Zap,
  HatGlasses,
  User,
  UserCheck,
  UserStar,
  LogOut,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────

function toTitleCase(str: string): string {
  if (str !== str.toUpperCase()) return str;
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

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

function buildSections(
  listeningParts: ListeningPart[],
  readingParts: ReadingPart[],
  writingTasks: WritingTask[],
  speakingTasks: SpeakingTask[]
) {
  return [
    {
      title: "Listening",
      key: "listening" as PracticeSection,
      icon: Headphones,
      description:
        "Conversations, news reports, and discussions with multiple-choice questions.",
      duration: "~47 min",
      summary: "6 parts + practice, 39 questions",
      color: "#b8703b",
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
      color: "#5a8a6a",
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
      color: "#7a7ac7",
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
      color: "#c77a8b",
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
}

// Group parts/tasks by their CELPIP category
function extractCategoryKey(title: string): string {
  if (title.startsWith("Practice")) return "Practice Task";
  // New format: "01 | 8 Questions | Listening to Problem Solving"
  // or "01 | 1 Task | Writing an Email"
  const pipeMatch = title.match(/\d+\s*\|\s*(?:\d+\s*(?:Questions?|Tasks?)\s*\|\s*)?(.+)/);
  if (pipeMatch) return pipeMatch[1];
  // Legacy format: "Part 1: Listening to Problem Solving"
  const match = title.match(/(?:Part|Task)\s+\d+:\s+(.+)/);
  return match ? match[1] : title;
}

interface QuizItem {
  id: string;
  title: string;
  topic?: string;
  questionCount: number;
  originalIndex: number;
  paid?: boolean;
}
interface QuizCategory {
  category: string;
  items: QuizItem[];
}

function groupByCategory(
  parts: { id: string; title: string; topic?: string; questionCount: number; paid?: boolean }[]
): QuizCategory[] {
  const map = new Map<string, { items: QuizItem[] }>();
  parts.forEach((p, idx) => {
    const key = extractCategoryKey(p.title);
    if (!map.has(key)) map.set(key, { items: [] });
    map.get(key)!.items.push({ ...p, originalIndex: idx });
  });
  return Array.from(map.entries()).map(([key, { items }]) => ({
    category: key,
    items,
  }));
}

function buildQuizSections(
  listeningParts: ListeningPart[],
  readingParts: ReadingPart[],
  writingTasks: WritingTask[],
  speakingTasks: SpeakingTask[]
) {
  return [
    {
      key: "listening",
      title: "Listening",
      icon: Headphones,
      description:
        "Conversations, news reports, and discussions with multiple-choice questions.",
      color: "#b8703b",
      categories: groupByCategory(
        listeningParts.map((p) => ({
          id: p.id,
          title: p.title,
          topic: extractTopic(p.transcript),
          questionCount: p.questions.length,
        }))
      ),
    },
    {
      key: "reading",
      title: "Reading",
      icon: BookOpen,
      description:
        "Emails, schedules, articles, and opinion pieces with comprehension questions.",
      color: "#5a8a6a",
      categories: groupByCategory(
        readingParts.map((p) => ({
          id: p.id,
          title: p.title,
          topic: extractTopic(p.passage),
          questionCount: p.questions.length,
          paid: p.paid,
        }))
      ),
    },
    {
      key: "writing",
      title: "Writing",
      icon: PenLine,
      description:
        "Write an email and respond to a survey question with structured responses.",
      color: "#7a7ac7",
      categories: groupByCategory(
        writingTasks.map((t) => ({
          id: t.id,
          title: t.title,
          topic: extractTopic(t.prompt),
          questionCount: 1,
        }))
      ),
    },
    {
      key: "speaking",
      title: "Speaking",
      icon: Mic,
      description:
        "Respond to prompts covering advice, descriptions, opinions, and persuasion.",
      color: "#c77a8b",
      categories: groupByCategory(
        speakingTasks.map((t) => ({
          id: t.id,
          title: t.title,
          topic: extractTopic(t.prompt),
          questionCount: 1,
        }))
      ),
    },
  ];
}

// ── Tabs ───────────────────────────────────────────────

const tabs = [
  { key: "full", label: "Full Mock Test", icon: FileText },
  { key: "section", label: "Section Practice", icon: Layers },
  { key: "quiz", label: "Quiz Practice", icon: Zap },
  { key: "plan", label: "Study Plan", icon: ClipboardList },
  { key: "mytests", label: "My Test Results", icon: BarChart3 },
  { key: "schedule", label: "My Schedule", icon: CalendarDays },
] as const;

type TabKey = (typeof tabs)[number]["key"];

// ── Page ───────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const { currentUser, loading, signOut } = useAuth();
  const { records } = useHistory();
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [quizCategoryFilter, setQuizCategoryFilter] = useState<string | null>(null);
  const userRole = currentUser?.role || "subscriber";

  const [listeningParts, setListeningParts] = useState(hardcodedListeningParts);
  const [readingParts, setReadingParts] = useState(hardcodedReadingParts);
  const [writingTasks, setWritingTasks] = useState(hardcodedWritingTasks);
  const [speakingTasks, setSpeakingTasks] = useState(hardcodedSpeakingTasks);

  useEffect(() => {
    getListeningPartsClient().then(setListeningParts);
    getReadingPartsClient().then(setReadingParts);
    getWritingTasksClient().then(setWritingTasks);
    getSpeakingTasksClient().then(setSpeakingTasks);
  }, []);

  const sections = buildSections(listeningParts, readingParts, writingTasks, speakingTasks);
  const quizSections = buildQuizSections(listeningParts, readingParts, writingTasks, speakingTasks);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [loading, currentUser, router]);

  // Set default tab based on role
  useEffect(() => {
    if (currentUser) {
      setActiveTab((prev) => prev ?? (userRole === "admin" || userRole === "teacher" ? "full" : "quiz"));
    }
  }, [currentUser, userRole]);

  if (loading || !currentUser || !activeTab) return null;

  const canAccessFullTest = userRole === "admin" || userRole === "teacher";
  const visibleTabs = canAccessFullTest ? tabs : tabs.filter((t) => t.key !== "full");

  // Build a map of completed quiz keys
  const completedQuizMap = new Map<string, number>();
  records
    .filter((r) => r.type === "quiz" && r.quizSection && r.quizPart)
    .forEach((r) => {
      const key = `${r.quizSection}:${r.quizPart}`;
      const prev = completedQuizMap.get(key);
      if (!prev || r.timestamp > prev)
        completedQuizMap.set(key, r.timestamp);
    });
  const isQuizDone = (section: string, partIndex: number) =>
    completedQuizMap.has(`${section}:${partIndex}`);
  const getQuizFinishedAt = (section: string, partIndex: number) => {
    const ts = completedQuizMap.get(`${section}:${partIndex}`);
    if (!ts) return "";
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleFullTest = () => {
    resetTestState();
    saveTestState({ practiceMode: null });
    router.push("/test");
  };

  return (
    <main className="homepage bg-grid min-h-screen relative">
      {/* Grain */}
      <div className="hp-grain" />

      {/* Background meshes */}
      <div
        className="hp-mesh"
        style={{
          width: 500,
          height: 500,
          top: -150,
          right: -100,
          background:
            "radial-gradient(circle, rgba(184,112,59,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="hp-mesh"
        style={{
          width: 400,
          height: 400,
          bottom: "20%",
          left: -120,
          background:
            "radial-gradient(circle, rgba(90,138,106,0.05) 0%, transparent 70%)",
        }}
      />

      {/* ── Top nav ────────────────────────────────── */}
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-6 flex items-center gap-2 relative z-10">
        <button
          onClick={() => router.push("/")}
          className="text-xs font-semibold tracking-widest mr-auto transition-colors shrink-0"
          style={{ color: "var(--hp-accent)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--hp-accent-light)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--hp-accent)")
          }
        >
          PugPIP
        </button>

        {/* Desktop-only nav tabs */}
        <div className="hidden md:flex items-center gap-2">
          {visibleTabs.filter((t) => ["plan", "mytests", "schedule"].includes(t.key)).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5"
                style={{
                  background:
                    activeTab === tab.key ? "var(--hp-accent)" : "transparent",
                  color:
                    activeTab === tab.key ? "#ffffff" : "var(--hp-text-muted)",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key)
                    e.currentTarget.style.color = "var(--hp-text)";
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key)
                    e.currentTarget.style.color = "var(--hp-text-muted)";
                }}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
              </button>
            );
          })}

          <div
            className="w-px h-5 mx-1"
            style={{ background: "var(--hp-border)" }}
          />
        </div>

        {(() => {
          const RoleIcon = userRole === "admin" ? HatGlasses : userRole === "teacher" ? UserCheck : userRole === "subscriber" ? UserStar : User;
          const roleLabel = userRole === "admin" ? "Admin" : userRole === "teacher" ? "Teacher" : null;
          const isClickable = userRole === "admin";
          return isClickable ? (
            <button
              onClick={() => router.push("/admin")}
              className="px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
              style={{ color: "var(--hp-accent)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--hp-accent-light)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--hp-accent)")
              }
            >
              <RoleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{currentUser.name}{roleLabel && ` · ${roleLabel}`}</span>
            </button>
          ) : (
            <span
              className="text-sm font-medium inline-flex items-center gap-1.5"
              style={{ color: "var(--hp-text)" }}
            >
              <RoleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{currentUser.name}{roleLabel && ` · ${roleLabel}`}</span>
            </span>
          );
        })()}
        {userRole === "teacher" && (
          <button
            onClick={() => router.push("/teacher")}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{ color: "var(--hp-accent)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--hp-accent-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--hp-accent)")
            }
          >
            My Students
          </button>
        )}
        <button
          onClick={() => signOut()}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5"
          style={{ color: "var(--hp-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c75050")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--hp-text-muted)")
          }
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </nav>

      {/* ── Welcome header ─────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-16">
          <div className="flex-1 min-w-0">
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--hp-text)",
              }}
            >
              Welcome back,{" "}
              <span style={{ color: "var(--hp-accent)" }}>
                {currentUser.name.split(" ")[0]}
              </span>
            </h2>
            <p
              className="text-base leading-relaxed mt-1"
              style={{ color: "var(--hp-text-muted)" }}
            >
              Full timed tests, single section practice, or untimed quiz mode
              with instant feedback.
            </p>
          </div>
          <div className="w-full md:w-56 shrink-0">
            <ApiUsageCounter />
          </div>
        </div>
      </section>

      {/* ── Tab navigation ─────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-10 relative z-10">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none sm:flex-wrap flex-nowrap">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const isHeaderTab = ["plan", "mytests", "schedule"].includes(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "px-4 sm:px-5"
                    : "px-2.5 sm:px-5"
                } ${isHeaderTab ? "md:hidden" : ""}`}
                style={{
                  background:
                    isActive ? "var(--hp-accent)" : "var(--hp-glass)",
                  color:
                    isActive ? "#ffffff" : "var(--hp-text-muted)",
                  border:
                    isActive
                      ? "1px solid var(--hp-accent)"
                      : "1px solid var(--hp-border)",
                  boxShadow:
                    isActive
                      ? "0 2px 8px rgba(184,112,59,0.15)"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "var(--hp-accent)";
                    e.currentTarget.style.color = "var(--hp-accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "var(--hp-border)";
                    e.currentTarget.style.color = "var(--hp-text-muted)";
                  }
                }}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {/* On mobile: only show label for active tab; on sm+: always show */}
                <span className={isActive ? "" : "hidden sm:inline"}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Tab 1: Full Mock Test ──────────────── */}
        {activeTab === "full" && canAccessFullTest && (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {sections.map((s) => (
                <div
                  key={s.title}
                  className="hp-glass rounded-2xl p-5 relative overflow-hidden"
                >
                  {/* Accent top */}
                  <div
                    className="absolute top-0 left-5 right-5 h-[2px] rounded-full"
                    style={{ background: s.color, opacity: 0.4 }}
                  />
                  <h3
                    className="text-lg font-semibold mb-1 flex items-center gap-2"
                    style={{ color: s.color }}
                  >
                    <s.icon className="w-5 h-5" />
                    {s.title}
                  </h3>
                  <p
                    className="text-xs mb-3"
                    style={{ color: "var(--hp-text-muted)" }}
                  >
                    {s.duration} · {s.summary}
                  </p>
                  <div className="space-y-1 mb-3">
                    {s.officialParts.map((part, i) => (
                      <p
                        key={i}
                        className="text-[11px]"
                        style={{ color: "var(--hp-text)" }}
                      >
                        <span className="font-medium" style={{ color: s.color }}>
                          {i + 1}.
                        </span>{" "}
                        {part.topic}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-3">
              <button
                className="hp-cta-btn px-10 py-4 rounded-full text-base flex items-center gap-2 mx-auto"
                onClick={handleFullTest}
              >
                Start Full Mock Test
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-sm" style={{ color: "var(--hp-text-muted)" }}>
                ~2 hours 55 minutes — Listening, Reading, Writing, Speaking
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 2: Section Practice ────────────── */}
        {activeTab === "section" && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Sidebar — horizontal scroll on mobile, vertical on md+ */}
            <div className="flex md:flex-col gap-2 md:gap-1.5 overflow-x-auto pb-2 md:pb-0 md:w-48 md:shrink-0 scrollbar-none">
              {sections.map((s) => {
                const isActive =
                  (expandedSection || "listening") === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setExpandedSection(s.key)}
                    className="md:w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0"
                    style={{
                      background: isActive ? `${s.color}12` : "transparent",
                      color: isActive ? s.color : "var(--hp-text-muted)",
                      border: isActive
                        ? `2px solid ${s.color}30`
                        : "2px solid transparent",
                      boxShadow: isActive
                        ? "0 2px 8px rgba(0,0,0,0.04)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = s.color;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.color = "var(--hp-text-muted)";
                    }}
                  >
                    <s.icon className="w-4 h-4" />
                    {s.title}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {sections.map((s) => {
                if ((expandedSection || "listening") !== s.key) return null;
                return (
                  <div key={s.key}>
                    <div className="mb-5 text-center">
                      <h3
                        className="text-xl font-semibold flex items-center justify-center gap-2 mb-1"
                        style={{ color: s.color }}
                      >
                        <s.icon className="w-5 h-5" />
                        {s.title}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "var(--hp-text-muted)" }}
                      >
                        {s.description}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--hp-text-muted)" }}
                      >
                        {s.duration} · {s.summary}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      {s.officialParts.map((part, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            router.push(
                              `${s.quizBase}?part=${part.index}`
                            )
                          }
                          className="hp-glass w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                              style={{
                                background: `${s.color}12`,
                                color: s.color,
                              }}
                            >
                              {i + 1}
                            </span>
                            <div>
                              <p
                                className="text-sm font-medium"
                                style={{ color: "var(--hp-text)" }}
                              >
                                {part.title}
                              </p>
                              <p
                                className="text-[11px]"
                                style={{
                                  color: "var(--hp-text-muted)",
                                }}
                              >
                                {part.topic} · {part.questionCount}{" "}
                                {part.questionCount === 1
                                  ? "question"
                                  : "questions"}
                              </p>
                            </div>
                          </div>
                          <span
                            className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                            style={{ color: s.color }}
                          >
                            Start
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab 3: Quiz Practice ───────────────── */}
        {activeTab === "quiz" && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Sidebar — horizontal scroll on mobile, vertical on md+ */}
            <div className="flex md:flex-col gap-2 md:gap-1.5 overflow-x-auto pb-2 md:pb-0 md:w-48 md:shrink-0 scrollbar-none">
              {quizSections.map((qs) => {
                const isActive =
                  (expandedQuiz || "listening") === qs.key;
                return (
                  <button
                    key={qs.key}
                    onClick={() => { setExpandedQuiz(qs.key); setQuizCategoryFilter(null); }}
                    className="md:w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0"
                    style={{
                      background: isActive
                        ? `${qs.color}12`
                        : "transparent",
                      color: isActive
                        ? qs.color
                        : "var(--hp-text-muted)",
                      border: isActive
                        ? `2px solid ${qs.color}30`
                        : "2px solid transparent",
                      boxShadow: isActive
                        ? "0 2px 8px rgba(0,0,0,0.04)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.color = qs.color;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.color =
                          "var(--hp-text-muted)";
                    }}
                  >
                    <qs.icon className="w-4 h-4" />
                    {qs.title}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {quizSections.map((qs) => {
                if ((expandedQuiz || "listening") !== qs.key) return null;
                const totalParts = qs.categories.reduce(
                  (sum, cat) => sum + cat.items.length,
                  0
                );
                const base =
                  qs.key === "writing" || qs.key === "speaking"
                    ? "/quiz-practice"
                    : "/quiz";
                return (
                  <div key={qs.key}>
                    <div className="mb-5 text-center">
                      <h3
                        className="text-xl font-semibold flex items-center justify-center gap-2 mb-1"
                        style={{ color: qs.color }}
                      >
                        <qs.icon className="w-5 h-5" />
                        {qs.title}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "var(--hp-text-muted)" }}
                      >
                        {qs.description}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--hp-text-muted)" }}
                      >
                        {qs.categories.length} parts · {totalParts}{" "}
                        quizzes
                      </p>
                    </div>

                    {/* Category filter tabs */}
                    {qs.categories.length > 2 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        <button
                          onClick={() => setQuizCategoryFilter(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: quizCategoryFilter === null ? qs.color : "var(--hp-glass)",
                            color: quizCategoryFilter === null ? "#fff" : "var(--hp-text-muted)",
                            border: `1px solid ${quizCategoryFilter === null ? qs.color : "var(--hp-border)"}`,
                          }}
                        >
                          All
                        </button>
                        {qs.categories.map((cat) => {
                          const label = cat.category;
                          const isActive = quizCategoryFilter === cat.category;
                          return (
                            <button
                              key={cat.category}
                              onClick={() => setQuizCategoryFilter(cat.category)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              style={{
                                background: isActive ? qs.color : "var(--hp-glass)",
                                color: isActive ? "#fff" : "var(--hp-text-muted)",
                                border: `1px solid ${isActive ? qs.color : "var(--hp-border)"}`,
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="space-y-5">
                      {qs.categories
                        .filter((cat) => quizCategoryFilter === null || cat.category === quizCategoryFilter)
                        .map((cat) => (
                        <div key={cat.category}>
                          <p
                            className="text-xs font-semibold uppercase tracking-wide mb-2"
                            style={{ color: qs.color }}
                          >
                            {cat.category}
                          </p>
                          <div className="space-y-1.5">
                            {cat.items.map((item, i) => {
                              const done = isQuizDone(
                                qs.key,
                                item.originalIndex
                              );
                              const isPaid = item.paid === true;
                              const isLocked = isPaid && userRole !== "admin" && userRole !== "teacher";
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    if (isLocked) return;
                                    router.push(
                                      `${base}/${qs.key}?part=${item.originalIndex}`
                                    );
                                  }}
                                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-all ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
                                  style={{
                                    background: isLocked
                                      ? "rgba(0,0,0,0.03)"
                                      : done
                                      ? "rgba(90,138,106,0.06)"
                                      : "var(--hp-glass)",
                                    border: isLocked
                                      ? "1px solid rgba(0,0,0,0.08)"
                                      : done
                                      ? "1px solid rgba(90,138,106,0.15)"
                                      : "1px solid var(--hp-border)",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (isLocked) return;
                                    e.currentTarget.style.borderColor =
                                      qs.color;
                                    e.currentTarget.style.transform =
                                      "translateY(-1px)";
                                    e.currentTarget.style.boxShadow =
                                      "0 4px 12px rgba(0,0,0,0.06)";
                                  }}
                                  onMouseLeave={(e) => {
                                    if (isLocked) return;
                                    e.currentTarget.style.borderColor = done
                                      ? "rgba(90,138,106,0.15)"
                                      : "var(--hp-border)";
                                    e.currentTarget.style.transform =
                                      "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                      "none";
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    {isLocked ? (
                                      <Lock
                                        className="w-5 h-5 shrink-0"
                                        style={{ color: "var(--hp-text-muted)" }}
                                      />
                                    ) : done ? (
                                      <CheckCircle2
                                        className="w-5 h-5 shrink-0"
                                        style={{ color: "#5a8a6a" }}
                                      />
                                    ) : (
                                      <span
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                                        style={{
                                          background: `${qs.color}12`,
                                          color: qs.color,
                                        }}
                                      >
                                        {i + 1}
                                      </span>
                                    )}
                                    <div>
                                      <p
                                        className="text-sm font-medium"
                                        style={{
                                          color: isLocked ? "var(--hp-text-muted)" : "var(--hp-text)",
                                        }}
                                      >
                                        {item.topic || `Quiz ${i + 1}`}
                                        {isPaid && (
                                          <span
                                            className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                                            style={{
                                              background: "linear-gradient(135deg, #d4a843, #b8703b)",
                                              color: "#fff",
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            PRO
                                          </span>
                                        )}
                                      </p>
                                      <p
                                        className="text-[11px]"
                                        style={{
                                          color: "var(--hp-text-muted)",
                                        }}
                                      >
                                        {item.questionCount}{" "}
                                        {item.questionCount === 1
                                          ? "question"
                                          : "questions"}
                                        {done && !isLocked && (
                                          <span
                                            className="ml-1 font-medium"
                                            style={{ color: "#5a8a6a" }}
                                          >
                                            ·{" "}
                                            {getQuizFinishedAt(
                                              qs.key,
                                              item.originalIndex
                                            )}
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  {isLocked ? (
                                    <span
                                      className="text-[11px] font-medium"
                                      style={{ color: "var(--hp-text-muted)" }}
                                    >
                                      Upgrade
                                    </span>
                                  ) : (
                                    <span
                                      className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                      style={{ color: qs.color }}
                                    >
                                      {done ? "Redo" : "Start"}
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                  )}
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
            </div>
          </div>
        )}

        {/* ── Tab 4: Study Plan ──────────────────── */}
        {activeTab === "plan" && <StudyPlan />}

        {/* ── Tab 5: My Test Results ─────────────── */}
        {activeTab === "mytests" && <MyTests />}

        {/* ── Tab 6: My Schedule ─────────────────── */}
        {activeTab === "schedule" && <MySchedule />}
      </section>
    </main>
  );
}
