"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
  Play,
  Lightbulb,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ExternalLink,
  Timer,
  StickyNote,
  Mail,
  MessageCircle,
  SearchIcon,
  Crosshair,
  BarChartHorizontal,
  AlertTriangle,
  type LucideIcon,
  HatGlasses,
  User,
  UserCheck,
  LogOut,
  Crown,
  Settings,
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
  speakingTasks: SpeakingTask[],
  t: (key: string) => string,
  tc: (key: string) => string
) {
  return [
    {
      title: tc("listening"),
      key: "listening" as PracticeSection,
      icon: Headphones,
      description: t("listeningDesc"),
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
      title: tc("reading"),
      key: "reading" as PracticeSection,
      icon: BookOpen,
      description: t("readingDesc"),
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
      title: tc("writing"),
      key: "writing" as PracticeSection,
      icon: PenLine,
      description: t("writingDesc"),
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
      title: tc("speaking"),
      key: "speaking" as PracticeSection,
      icon: Mic,
      description: t("speakingDesc"),
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
  speakingTasks: SpeakingTask[],
  t: (key: string) => string,
  tc: (key: string) => string
) {
  return [
    {
      key: "listening",
      title: tc("listening"),
      icon: Headphones,
      description: t("listeningDesc"),
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
      title: tc("reading"),
      icon: BookOpen,
      description: t("readingDesc"),
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
      title: tc("writing"),
      icon: PenLine,
      description: t("writingDesc"),
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
      title: tc("speaking"),
      icon: Mic,
      description: t("speakingDesc"),
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
  { key: "full", labelKey: "fullMockTest", icon: FileText },
  { key: "section", labelKey: "sectionPractice", icon: Layers },
  { key: "quiz", labelKey: "quizPractice", icon: Zap },
  { key: "plan", labelKey: "studyPlan", icon: ClipboardList },
  { key: "mytests", labelKey: "myTestResults", icon: BarChart3 },
  { key: "schedule", labelKey: "mySchedule", icon: CalendarDays },
  { key: "videos", labelKey: "videos", icon: Play },
  { key: "advice", labelKey: "advice", icon: Lightbulb },
  { key: "strategy", labelKey: "strategy", icon: Target },
] as const;

type TabKey = (typeof tabs)[number]["key"];

// ── Page ───────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const { currentUser, loading, signOut } = useAuth();
  const { records } = useHistory();
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [quizCategoryFilter, setQuizCategoryFilter] = useState<string | null>(null);
  const userRole = currentUser?.role || "improver";

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

  const sections = buildSections(listeningParts, readingParts, writingTasks, speakingTasks, t, tc);
  const quizSections = buildQuizSections(listeningParts, readingParts, writingTasks, speakingTasks, t, tc);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [loading, currentUser, router]);

  // Set default tab based on role
  useEffect(() => {
    if (currentUser) {
      setActiveTab((prev) => prev ?? (userRole === "admin" || userRole === "teacher" || userRole === "editor" ? "full" : "quiz"));
    }
  }, [currentUser, userRole]);

  if (loading || !currentUser || !activeTab) return null;

  const canAccessFullTest = userRole === "admin" || userRole === "teacher" || userRole === "editor";
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
          <Image src="/logo-celpip-en-hz@2x.png" alt="CELPIP" width={100} height={44} style={{aspectRatio:"256/113"}} />
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
                {t(tab.labelKey)}
              </button>
            );
          })}

          <div
            className="w-px h-5 mx-1"
            style={{ background: "var(--hp-border)" }}
          />
        </div>

        {(() => {
          const RoleIcon = userRole === "admin" ? HatGlasses : (userRole === "teacher" || userRole === "editor") ? UserCheck : User;
          const roleLabel = userRole === "admin" ? tc("admin") : userRole === "teacher" ? tc("teacher") : userRole === "editor" ? tc("editor") : null;
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
        {(userRole === "teacher" || userRole === "editor") && (
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
            {tc("myStudents")}
          </button>
        )}
        {userRole === "user" && (
          <button
            onClick={() => router.push("/payment")}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5"
            style={{
              background: "var(--hp-accent)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--hp-accent-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--hp-accent)";
            }}
          >
            <Crown className="w-3.5 h-3.5" />
            {tc("upgrade")}
          </button>
        )}
        <button
          onClick={() => router.push("/settings")}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5"
          style={{ color: "var(--hp-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--hp-accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--hp-text-muted)")
          }
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
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
          {tc("signOut")}
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
              {t("welcomeBack", { name: currentUser.name.split(" ")[0] })}
            </h2>
            <p
              className="text-base leading-relaxed mt-1"
              style={{ color: "var(--hp-text-muted)" }}
            >
              {t("subtitle")}
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
                  {t(tab.labelKey)}
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
                {t("startFullTest")}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-sm" style={{ color: "var(--hp-text-muted)" }}>
                {t("fullTestDesc")}
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
                              const isLocked = isPaid && userRole !== "admin" && userRole !== "teacher" && userRole !== "editor";
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
                                      {tc("upgrade")}
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

        {/* ── Tab 7: Videos ───────────────── */}
        {activeTab === "videos" && (
          <div className="space-y-8">
            {/* ── Video Resources ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5" style={{ color: "var(--hp-accent)" }} />
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--hp-text)" }}
                >
                  {t("videoResources")}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {([
                  {
                    title: t("video_0_title"),
                    section: tc("listening"),
                    duration: "12:34",
                    thumbnail: Headphones,
                    color: "#b8703b",
                    description: t("video_0_desc"),
                  },
                  {
                    title: t("video_1_title"),
                    section: tc("reading"),
                    duration: "15:20",
                    thumbnail: BookOpen,
                    color: "#5a8a6a",
                    description: t("video_1_desc"),
                  },
                  {
                    title: t("video_2_title"),
                    section: tc("writing"),
                    duration: "18:45",
                    thumbnail: PenLine,
                    color: "#7a7ac7",
                    description: t("video_2_desc"),
                  },
                  {
                    title: t("video_3_title"),
                    section: tc("speaking"),
                    duration: "10:15",
                    thumbnail: Mic,
                    color: "#c77a8b",
                    description: t("video_3_desc"),
                  },
                  {
                    title: t("video_4_title"),
                    section: t("videoSectionGeneral"),
                    duration: "8:50",
                    thumbnail: BarChartHorizontal,
                    color: "var(--hp-text-muted)",
                    description: t("video_4_desc"),
                  },
                  {
                    title: t("video_5_title"),
                    section: t("videoSectionGeneral"),
                    duration: "14:10",
                    thumbnail: AlertTriangle,
                    color: "var(--hp-text-muted)",
                    description: t("video_5_desc"),
                  },
                ]).map((video) => (
                  <div
                    key={video.title}
                    className="hp-glass rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    {/* Thumbnail area */}
                    <div
                      className="relative h-32 flex items-center justify-center"
                      style={{ background: `${video.color}08` }}
                    >
                      <video.thumbnail className="w-10 h-10" style={{ color: video.color }} />
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(0,0,0,0.3)" }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.95)" }}
                        >
                          <Play
                            className="w-5 h-5 ml-0.5"
                            style={{ color: video.color }}
                          />
                        </div>
                      </div>
                      <span
                        className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                        style={{
                          background: "rgba(0,0,0,0.6)",
                          color: "#fff",
                        }}
                      >
                        {video.duration}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: `${video.color}12`,
                            color: video.color,
                          }}
                        >
                          {video.section}
                        </span>
                      </div>
                      <h4
                        className="text-sm font-bold leading-snug mb-1"
                        style={{ color: "var(--hp-text)" }}
                      >
                        {video.title}
                      </h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--hp-text-muted)" }}
                      >
                        {video.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 8: Advice ───────────────── */}
        {activeTab === "advice" && (
          <div className="space-y-8">
            {/* ── Expert Advice ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5" style={{ color: "var(--hp-accent)" }} />
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--hp-text)" }}
                >
                  {t("expertAdvice")}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {([
                  { title: t("advice_0_title"), content: t("advice_0_content"), icon: Timer, category: t("strategy") },
                  { title: t("advice_1_title"), content: t("advice_1_content"), icon: StickyNote, category: tc("listening") },
                  { title: t("advice_2_title"), content: t("advice_2_content"), icon: Mail, category: tc("writing") },
                  { title: t("advice_3_title"), content: t("advice_3_content"), icon: MessageCircle, category: tc("speaking") },
                  { title: t("advice_4_title"), content: t("advice_4_content"), icon: SearchIcon, category: tc("reading") },
                  { title: t("advice_5_title"), content: t("advice_5_content"), icon: Crosshair, category: t("strategy") },
                ]).map((advice) => (
                  <div
                    key={advice.title}
                    className="hp-glass rounded-2xl p-5 relative overflow-hidden"
                  >
                    <div
                      className="absolute top-0 left-5 right-5 h-[2px] rounded-full"
                      style={{ background: "var(--hp-accent)", opacity: 0.2 }}
                    />
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center" style={{ background: "var(--hp-accent-glow)" }}>
                        <advice.icon className="w-5 h-5" style={{ color: "var(--hp-accent)" }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{
                              background: "var(--hp-accent-glow)",
                              color: "var(--hp-accent)",
                            }}
                          >
                            {advice.category}
                          </span>
                        </div>
                        <h4
                          className="text-sm font-bold mb-1.5"
                          style={{ color: "var(--hp-text)" }}
                        >
                          {advice.title}
                        </h4>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--hp-text-muted)" }}
                        >
                          {advice.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Useful Links ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="w-5 h-5" style={{ color: "var(--hp-accent)" }} />
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--hp-text)" }}
                >
                  {t("usefulLinks")}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: t("link_0_label"), url: "https://www.celpip.ca", description: t("link_0_desc") },
                  { label: t("link_1_label"), url: "https://www.celpip.ca/prepare-for-celpip/score-comparison", description: t("link_1_desc") },
                  { label: t("link_2_label"), url: "https://www.celpip.ca/prepare-for-celpip/free-practice-test", description: t("link_2_desc") },
                  { label: t("link_3_label"), url: "https://www.celpip.ca/take-celpip/test-day", description: t("link_3_desc") },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hp-glass rounded-xl p-4 flex flex-col gap-1.5 group"
                  >
                    <span
                      className="text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                      style={{ color: "var(--hp-accent)" }}
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </span>
                    <span
                      className="text-[11px] leading-relaxed"
                      style={{ color: "var(--hp-text-muted)" }}
                    >
                      {link.description}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* ── Tab 9: Strategy (based on test results) ───────────────── */}
        {activeTab === "strategy" && (() => {
          const sectionKeys = ["listening", "reading", "writing", "speaking"] as const;
          type SectionKey = typeof sectionKeys[number];
          const sectionMeta: Record<SectionKey, { icon: LucideIcon; color: string; label: string }> = {
            listening: { icon: Headphones, color: "#b8703b", label: tc("listening") },
            reading:   { icon: BookOpen, color: "#5a8a6a", label: tc("reading") },
            writing:   { icon: PenLine, color: "#7a7ac7", label: tc("writing") },
            speaking:  { icon: Mic, color: "#c77a8b", label: tc("speaking") },
          };

          const scoresBySection: Record<SectionKey, number[]> = {
            listening: [], reading: [], writing: [], speaking: [],
          };
          records.forEach((r) => {
            // For full/section tests, scores has all 4 keys
            sectionKeys.forEach((sk) => {
              const s = r.scores[sk];
              if (s != null) scoresBySection[sk].push(s);
            });
            // For quiz records, the score may only be in overallScore with quizSection indicating the section
            if (r.type === "quiz" && r.quizSection && sectionKeys.includes(r.quizSection as SectionKey)) {
              const sk = r.quizSection as SectionKey;
              // Only add if not already captured via r.scores
              if (r.scores[sk] == null && r.overallScore != null) {
                scoresBySection[sk].push(r.overallScore);
              }
            }
          });

          const avg = (arr: number[]) => arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null;
          const getScore = (r: typeof records[number], sk: SectionKey) =>
            r.scores[sk] ?? (r.type === "quiz" && r.quizSection === sk ? r.overallScore : null);
          const latest = (sk: SectionKey) => {
            const sorted = records
              .filter((r) => getScore(r, sk) != null)
              .sort((a, b) => b.timestamp - a.timestamp);
            return sorted.length ? getScore(sorted[0], sk)! : null;
          };

          const sectionStats = sectionKeys.map((sk) => ({
            key: sk,
            ...sectionMeta[sk],
            average: avg(scoresBySection[sk]),
            latest: latest(sk),
            testCount: scoresBySection[sk].length,
          }));

          const hasAnyData = sectionStats.some((s) => s.testCount > 0);
          const maxScore = 12;

          // Sort sections by latest score to identify strongest/weakest
          const ranked = [...sectionStats].filter((s) => s.latest != null).sort((a, b) => (b.latest ?? 0) - (a.latest ?? 0));
          const strongest = ranked[0] ?? null;
          const weakest = ranked.length > 1 ? ranked[ranked.length - 1] : null;

          // Radar chart helpers
          const radarCx = 170, radarCy = 140, radarR = 100;
          const radarAngles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]; // top, right, bottom, left
          const radarPoint = (angle: number, value: number) => ({
            x: radarCx + Math.cos(angle) * (value / maxScore) * radarR,
            y: radarCy + Math.sin(angle) * (value / maxScore) * radarR,
          });

          // Improvement tips
          const getTips = (sk: SectionKey, score: number | null): { priorityKey: string; tipKeys: string[] } => {
            if (score == null) return { priorityKey: "noDataYet", tipKeys: ["takeTestRecs"] };
            if (score >= 10) return { priorityKey: "priorityExcellent", tipKeys: [`tip_${sk}_exc_0`, `tip_${sk}_exc_1`, `tip_${sk}_exc_2`] };
            if (score >= 8) return { priorityKey: "priorityStrong", tipKeys: [`tip_${sk}_str_0`, `tip_${sk}_str_1`, `tip_${sk}_str_2`] };
            if (score >= 6) return { priorityKey: "priorityDeveloping", tipKeys: [`tip_${sk}_dev_0`, `tip_${sk}_dev_1`, `tip_${sk}_dev_2`] };
            return { priorityKey: "priorityNeedsFocus", tipKeys: [`tip_${sk}_nds_0`, `tip_${sk}_nds_1`, `tip_${sk}_nds_2`] };
          };

          const getBarColor = (score: number) =>
            score >= 10 ? "#22c55e" : score >= 8 ? "#3b82f6" : score >= 6 ? "#f59e0b" : "#ef4444";

          const getTag = (sk: string) => {
            if (strongest && sk === strongest.key && weakest && sk !== weakest.key) return { textKey: "strengthTag", bg: "#22c55e" };
            if (weakest && sk === weakest.key && strongest && sk !== strongest.key) return { textKey: "weaknessTag", bg: "#ef4444" };
            return null;
          };

          return (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" style={{ color: "var(--hp-accent)" }} />
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--hp-text)" }}
                >
                  {t("improvementStrategy")}
                </h3>
              </div>
              <p className="text-sm" style={{ color: "var(--hp-text-muted)" }}>
                {hasAnyData
                  ? t("personalizedRecs")
                  : t("takePracticeUnlock")}
              </p>
            </div>

            {/* ── Charts Row ── */}
            {hasAnyData && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="hp-glass rounded-2xl p-5">
                  <h4 className="text-sm font-bold mb-4" style={{ color: "var(--hp-text)" }}>
                    {t("skillsOverview")}
                  </h4>
                  <svg viewBox="0 0 340 300" className="w-full max-w-[340px] mx-auto">
                    {/* Grid rings */}
                    {[0.25, 0.5, 0.75, 1].map((pct) => (
                      <polygon
                        key={pct}
                        points={radarAngles.map((a) => {
                          const p = radarPoint(a, maxScore * pct);
                          return `${p.x},${p.y}`;
                        }).join(" ")}
                        fill="none"
                        stroke="var(--hp-border)"
                        strokeWidth="1"
                        opacity={0.5}
                      />
                    ))}
                    {/* Axis lines */}
                    {radarAngles.map((a, i) => {
                      const p = radarPoint(a, maxScore);
                      return (
                        <line
                          key={i}
                          x1={radarCx} y1={radarCy}
                          x2={p.x} y2={p.y}
                          stroke="var(--hp-border)"
                          strokeWidth="1"
                          opacity={0.4}
                        />
                      );
                    })}
                    {/* Score polygon */}
                    <polygon
                      points={sectionStats.map((s, i) => {
                        const p = radarPoint(radarAngles[i], s.latest ?? 0);
                        return `${p.x},${p.y}`;
                      }).join(" ")}
                      fill="var(--hp-accent)"
                      fillOpacity={0.15}
                      stroke="var(--hp-accent)"
                      strokeWidth="2"
                    />
                    {/* Score dots */}
                    {sectionStats.map((s, i) => {
                      const p = radarPoint(radarAngles[i], s.latest ?? 0);
                      return (
                        <circle
                          key={s.key}
                          cx={p.x} cy={p.y} r="5"
                          fill={s.color}
                          stroke="#fff"
                          strokeWidth="2"
                        />
                      );
                    })}
                    {/* Labels */}
                    {sectionStats.map((s, i) => {
                      const labelOffset = 18;
                      const p = radarPoint(radarAngles[i], maxScore);
                      const dx = i === 1 ? labelOffset : i === 3 ? -labelOffset : 0;
                      const dy = i === 0 ? -labelOffset : i === 2 ? labelOffset + 4 : 0;
                      const anchor = i === 1 ? "start" : i === 3 ? "end" : "middle";
                      return (
                        <g key={s.key}>
                          <text
                            x={p.x + dx} y={p.y + dy}
                            textAnchor={anchor}
                            dominantBaseline="central"
                            className="text-[11px] font-semibold"
                            fill={s.color}
                          >
                            {s.label}
                          </text>
                          <text
                            x={p.x + dx} y={p.y + dy + 13}
                            textAnchor={anchor}
                            dominantBaseline="central"
                            className="text-[10px] font-bold"
                            fill="var(--hp-text)"
                          >
                            {s.latest ?? "—"}
                          </text>
                        </g>
                      );
                    })}
                    {/* Ring score labels */}
                    {[3, 6, 9, 12].map((val, i) => (
                      <text
                        key={val}
                        x={radarCx + 4}
                        y={radarCy - (([0.25, 0.5, 0.75, 1][i]) * radarR) - 3}
                        className="text-[8px]"
                        fill="var(--hp-text-muted)"
                        textAnchor="start"
                      >
                        {val}
                      </text>
                    ))}
                  </svg>
                </div>

                {/* Bar Chart — Strength / Weakness */}
                <div className="hp-glass rounded-2xl p-5">
                  <h4 className="text-sm font-bold mb-4" style={{ color: "var(--hp-text)" }}>
                    {t("scoreBreakdown")}
                  </h4>
                  <div className="space-y-5">
                    {sectionStats.map((s) => {
                      const score = s.latest ?? 0;
                      const pct = (score / maxScore) * 100;
                      const tag = getTag(s.key);
                      return (
                        <div key={s.key}>
                          {/* Label row */}
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <s.icon className="w-4 h-4" style={{ color: s.color }} />
                              <span className="text-xs font-semibold" style={{ color: "var(--hp-text)" }}>
                                {s.label}
                              </span>
                              {tag && (
                                <span
                                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                  style={{ background: `${tag.bg}18`, color: tag.bg }}
                                >
                                  {t(tag.textKey as Parameters<typeof t>[0])}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold" style={{ color: "var(--hp-text)" }}>
                                {s.latest != null ? s.latest : "—"}
                              </span>
                              <span className="text-[10px]" style={{ color: "var(--hp-text-muted)" }}>
                                / {maxScore}
                              </span>
                            </div>
                          </div>
                          {/* Bar */}
                          <div
                            className="w-full h-3 rounded-full overflow-hidden"
                            style={{ background: "var(--hp-border)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${pct}%`,
                                background: s.latest != null
                                  ? `linear-gradient(90deg, ${s.color}, ${getBarColor(score)})`
                                  : "var(--hp-text-muted)",
                              }}
                            />
                          </div>
                          {/* Avg + count */}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px]" style={{ color: "var(--hp-text-muted)" }}>
                              {s.testCount > 0 ? t("avgLabel", { average: s.average ?? "—" }) : t("noTestsYet")}
                            </span>
                            <span className="text-[10px]" style={{ color: "var(--hp-text-muted)" }}>
                              {s.testCount > 0 ? t("testCount", { count: s.testCount }) : ""}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary callout */}
                  {strongest && weakest && strongest.key !== weakest.key && (
                    <div
                      className="mt-6 rounded-xl p-3 text-xs leading-relaxed"
                      style={{ background: "var(--hp-accent-glow)", color: "var(--hp-text)" }}
                    >
                      <span className="font-bold" style={{ color: "#22c55e" }}>{t("strongestLabel")}:</span>{" "}
                      {strongest.label} ({strongest.latest}){" · "}
                      <span className="font-bold" style={{ color: "#ef4444" }}>{t("weakestLabel")}:</span>{" "}
                      {weakest.label} ({weakest.latest}){" · "}
                      <span style={{ color: "var(--hp-text-muted)" }}>
                        {t("focusPractice", { skill: weakest.label })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Per-Part Detail Breakdown ── */}
            {hasAnyData && (() => {
              // Build per-part scores from quiz records
              // quizPart is the part index as a string
              const partScores: Record<SectionKey, Map<string, { scores: number[]; latest: number; latestTs: number; title: string }>> = {
                listening: new Map(), reading: new Map(), writing: new Map(), speaking: new Map(),
              };

              // Get part titles from quizSections
              const partTitleMap: Record<string, Record<string, string>> = {};
              quizSections.forEach((qs) => {
                partTitleMap[qs.key] = {};
                qs.categories.forEach((cat) => {
                  cat.items.forEach((item) => {
                    partTitleMap[qs.key][String(item.originalIndex)] = item.title;
                  });
                });
              });

              records.forEach((r) => {
                if (r.type !== "quiz" || !r.quizSection || r.quizPart == null) return;
                const sk = r.quizSection as SectionKey;
                if (!sectionKeys.includes(sk)) return;
                const partKey = String(r.quizPart);
                const score = r.scores[sk] ?? r.overallScore;
                if (score == null) return;
                const map = partScores[sk];
                if (!map.has(partKey)) {
                  map.set(partKey, {
                    scores: [],
                    latest: score,
                    latestTs: r.timestamp,
                    title: partTitleMap[sk]?.[partKey] || `Part ${Number(partKey) + 1}`,
                  });
                }
                const entry = map.get(partKey)!;
                entry.scores.push(score);
                if (r.timestamp > entry.latestTs) {
                  entry.latest = score;
                  entry.latestTs = r.timestamp;
                }
              });

              // Check if any section has part data
              const hasPartData = sectionKeys.some((sk) => partScores[sk].size > 0);
              if (!hasPartData) return null;

              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold" style={{ color: "var(--hp-text)" }}>
                    {t("partByPart")}
                  </h4>
                  {sectionStats.filter((s) => partScores[s.key].size > 0).map((s) => {
                    const parts = Array.from(partScores[s.key].entries())
                      .sort((a, b) => Number(a[0]) - Number(b[0]))
                      .map(([partKey, data]) => ({
                        partKey,
                        ...data,
                        average: Math.round((data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10) / 10,
                      }));
                    const partLatests = parts.map((p) => p.latest);
                    const bestPart = parts.reduce((best, p) => p.latest > best.latest ? p : best, parts[0]);
                    const worstPart = parts.reduce((worst, p) => p.latest < worst.latest ? p : worst, parts[0]);

                    return (
                      <details key={s.key} className="hp-glass rounded-2xl overflow-hidden group">
                        <summary
                          className="flex items-center justify-between p-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden"
                        >
                          <div className="flex items-center gap-2">
                            <s.icon className="w-5 h-5" style={{ color: s.color }} />
                            <span className="text-sm font-bold" style={{ color: "var(--hp-text)" }}>
                              {s.label}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: `${s.color}15`, color: s.color }}>
                              {t("partsTestedCount", { count: parts.length })}
                            </span>
                          </div>
                          <ChevronDown
                            className="w-4 h-4 transition-transform group-open:rotate-180"
                            style={{ color: "var(--hp-text-muted)" }}
                          />
                        </summary>

                        <div className="px-4 pb-4 space-y-3">
                          {/* Mini bar chart for each part */}
                          {parts.map((p) => {
                            const pct = (p.latest / maxScore) * 100;
                            const isBest = parts.length > 1 && p.partKey === bestPart.partKey;
                            const isWorst = parts.length > 1 && p.partKey === worstPart.partKey && bestPart.partKey !== worstPart.partKey;
                            const barColor = getBarColor(p.latest);
                            // Shorten title: extract meaningful name
                            const shortTitle = p.title.replace(/^\d+\s*\|\s*\d+\s*(?:Questions?|Tasks?)\s*\|\s*/, "")
                              .replace(/^(?:Part|Task)\s+\d+:\s*/, "");
                            return (
                              <div key={p.partKey}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[11px] font-semibold shrink-0" style={{ color: "var(--hp-text)" }}>
                                      {t("partN", { n: Number(p.partKey) + 1 })}
                                    </span>
                                    <span className="text-[10px] truncate" style={{ color: "var(--hp-text-muted)" }}>
                                      {shortTitle}
                                    </span>
                                    {isBest && (
                                      <span className="text-[8px] font-bold uppercase px-1 py-0.5 rounded shrink-0" style={{ background: "#22c55e18", color: "#22c55e" }}>
                                        {t("bestBadge")}
                                      </span>
                                    )}
                                    {isWorst && (
                                      <span className="text-[8px] font-bold uppercase px-1 py-0.5 rounded shrink-0" style={{ background: "#ef444418", color: "#ef4444" }}>
                                        {t("weakestBadge")}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0 ml-2">
                                    <span className="text-[11px] font-bold" style={{ color: barColor }}>
                                      {p.latest}
                                    </span>
                                    <span className="text-[9px]" style={{ color: "var(--hp-text-muted)" }}>
                                      / {maxScore}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="flex-1 h-2 rounded-full overflow-hidden"
                                    style={{ background: "var(--hp-border)" }}
                                  >
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{
                                        width: `${pct}%`,
                                        background: `linear-gradient(90deg, ${s.color}88, ${barColor})`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-[9px] w-16 text-right shrink-0" style={{ color: "var(--hp-text-muted)" }}>
                                    avg {p.average} · {p.scores.length}x
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                          {/* Summary for this section */}
                          {parts.length > 1 && bestPart.partKey !== worstPart.partKey && (
                            <div
                              className="rounded-lg p-2.5 mt-2 text-[11px] leading-relaxed"
                              style={{ background: `${s.color}08`, color: "var(--hp-text-muted)" }}
                            >
                              <span className="font-semibold" style={{ color: "#22c55e" }}>{t("bestLabel")}:</span>{" "}
                              {t("partN", { n: Number(bestPart.partKey) + 1 })} ({bestPart.latest}){" · "}
                              <span className="font-semibold" style={{ color: "#ef4444" }}>{t("weakestLabel")}:</span>{" "}
                              {t("partN", { n: Number(worstPart.partKey) + 1 })} ({worstPart.latest}){" · "}
                              {t("prioritizePart", { n: Number(worstPart.partKey) + 1, skill: s.label })}
                            </div>
                          )}
                        </div>
                      </details>
                    );
                  })}
                </div>
              );
            })()}

            {/* ── Per-section strategy cards ── */}
            <div>
              <h4 className="text-sm font-bold mb-4" style={{ color: "var(--hp-text)" }}>
                {hasAnyData ? t("improvementPlan") : t("generalTips")}
              </h4>
              <div className="grid sm:grid-cols-2 gap-5">
                {sectionStats.map((s) => {
                  const { priorityKey, tipKeys } = getTips(s.key, s.latest);
                  const priorityColor = s.latest == null ? "var(--hp-text-muted)"
                    : s.latest >= 10 ? "#22c55e"
                    : s.latest >= 8 ? "#3b82f6"
                    : s.latest >= 6 ? "#f59e0b"
                    : "#ef4444";
                  const PriorityIcon = s.latest == null ? Minus
                    : s.latest >= 8 ? TrendingUp
                    : TrendingDown;
                  const tag = getTag(s.key);

                  return (
                    <div
                      key={s.key}
                      className="hp-glass rounded-2xl p-5 relative overflow-hidden"
                      style={tag?.textKey === "weaknessTag" ? { border: "1px solid #ef444430" } : undefined}
                    >
                      <div
                        className="absolute top-0 left-5 right-5 h-[2px] rounded-full"
                        style={{ background: s.color, opacity: 0.3 }}
                      />

                      {/* Section header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <s.icon className="w-5 h-5" style={{ color: s.color }} />
                          <h4 className="text-sm font-bold" style={{ color: "var(--hp-text)" }}>
                            {s.label}
                          </h4>
                          {tag && (
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{ background: `${tag.bg}18`, color: tag.bg }}
                            >
                              {t(tag.textKey as Parameters<typeof t>[0])}
                            </span>
                          )}
                        </div>
                        {s.latest != null && (
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${priorityColor}15`, color: priorityColor }}
                          >
                            {t("scoreLabel", { score: s.latest })}
                          </span>
                        )}
                      </div>

                      {/* Priority badge */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <PriorityIcon className="w-3.5 h-3.5" style={{ color: priorityColor }} />
                        <span
                          className="text-[11px] font-semibold"
                          style={{ color: priorityColor }}
                        >
                          {t(priorityKey as Parameters<typeof t>[0])}
                        </span>
                      </div>

                      {/* Tips */}
                      <ul className="space-y-2">
                        {tipKeys.map((tipKey, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2
                              className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              style={{ color: s.color, opacity: 0.7 }}
                            />
                            <span
                              className="text-xs leading-relaxed"
                              style={{ color: "var(--hp-text-muted)" }}
                            >
                              {t(tipKey as Parameters<typeof t>[0])}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          );
        })()}
      </section>
    </main>
  );
}
