"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useSchedule, ScheduleItem } from "@/lib/hooks/use-schedule";
import { useHistory } from "@/lib/hooks/use-history";
import type { PlanItem } from "@/lib/prompts/planner";

// ── Section metadata ───────────────────────────────────

const sectionMeta = [
  { key: "listening", label: "Listening", bg: "bg-orange-100 text-orange-700 border-orange-200" },
  { key: "reading", label: "Reading", bg: "bg-green-100 text-green-700 border-green-200" },
  { key: "writing", label: "Writing", bg: "bg-purple-100 text-purple-700 border-purple-200" },
  { key: "speaking", label: "Speaking", bg: "bg-pink-100 text-pink-700 border-pink-200" },
];

const allSections = ["listening", "reading", "writing", "speaking"] as const;

// ── Helpers ────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function daysBetween(from: string, to: string): number {
  const a = new Date(from + "T00:00:00");
  const b = new Date(to + "T00:00:00");
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(d);
}

function weekdayName(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-CA", { weekday: "short" });
}

// ── Plan generation ────────────────────────────────────

interface PlanConfig {
  targetDate: string;
  goalScore: number;
  sessionsPerDay: number;
  focusAreas: string[];
}

function generatePlan(config: PlanConfig, weakSections: string[]): ScheduleItem[] {
  const { targetDate, goalScore, sessionsPerDay, focusAreas } = config;
  const today = todayStr();
  const totalDays = daysBetween(today, targetDate);

  if (totalDays <= 0) return [];

  const items: ScheduleItem[] = [];
  const startDate = addDays(today, 1); // start tomorrow

  // Determine priority order: weak sections first, then focus areas, then balanced
  const prioritySections = [...new Set([...weakSections, ...focusAreas, ...allSections])];

  // Plan phases:
  // Phase 1 (first 60%): Focus on weak areas with quizzes and section practice
  // Phase 2 (next 30%): Mixed practice with full mock tests
  // Phase 3 (last 10%): Full mock tests and light review

  const phase1End = Math.floor(totalDays * 0.6);
  const phase2End = Math.floor(totalDays * 0.9);

  for (let day = 0; day < totalDays; day++) {
    const date = addDays(startDate, day);
    const dayOfWeek = new Date(date + "T00:00:00").getDay();

    // Rest day on Sundays if plan is longer than 7 days
    if (dayOfWeek === 0 && totalDays > 7) {
      items.push({
        id: crypto.randomUUID(),
        date,
        section: "full",
        label: "Rest Day — Light Review Only",
        completed: false,
      });
      continue;
    }

    const sessionsToday = sessionsPerDay;

    if (day < phase1End) {
      // Phase 1: Foundation — quizzes and section practice, cycling through all priority sections across days
      for (let s = 0; s < sessionsToday; s++) {
        const sectionIndex = (day * sessionsToday + s) % prioritySections.length;
        const sectionKey = prioritySections[sectionIndex];
        if (day % 2 === 0) {
          // Quiz practice
          const quizSection = sectionKey === "writing" || sectionKey === "speaking" ? "listening" : sectionKey;
          items.push({
            id: crypto.randomUUID(),
            date,
            section: `quiz-${quizSection}`,
            label: `${capitalize(sectionKey)} Quiz Practice`,
            completed: false,
          });
        } else {
          // Section practice
          items.push({
            id: crypto.randomUUID(),
            date,
            section: sectionKey,
            label: `${capitalize(sectionKey)} Section Practice`,
            completed: false,
          });
        }
      }
    } else if (day < phase2End) {
      // Phase 2: Integration — mix of sections and full tests
      if (day % 3 === 0) {
        // Full mock test day
        items.push({
          id: crypto.randomUUID(),
          date,
          section: "full",
          label: "Full Mock Test",
          completed: false,
        });
      } else {
        for (let s = 0; s < sessionsToday; s++) {
          const sectionIndex = (day * sessionsToday + s) % prioritySections.length;
          const sectionKey = prioritySections[sectionIndex];
          items.push({
            id: crypto.randomUUID(),
            date,
            section: sectionKey,
            label: `${capitalize(sectionKey)} Practice`,
            completed: false,
          });
        }
      }
    } else {
      // Phase 3: Final prep — full mock tests and light review
      if (day % 2 === 0) {
        items.push({
          id: crypto.randomUUID(),
          date,
          section: "full",
          label: "Full Mock Test — Timed Simulation",
          completed: false,
        });
      } else {
        // Review weakest area
        const weakest = prioritySections[0] || "listening";
        items.push({
          id: crypto.randomUUID(),
          date,
          section: weakest,
          label: `${capitalize(weakest)} Review — Focus on Weak Areas`,
          completed: false,
        });
        if (sessionsToday > 1) {
          items.push({
            id: crypto.randomUUID(),
            date,
            section: `quiz-${weakest === "writing" || weakest === "speaking" ? "reading" : weakest}`,
            label: `Quick Quiz Review`,
            completed: false,
          });
        }
      }
    }
  }

  return items;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Component ──────────────────────────────────────────

export default function StudyPlan() {
  const t = useTranslations("studyPlan");
  const { targetDate, loading: scheduleLoading, setTargetDate, addItems, clearAll: clearSchedule } = useSchedule();
  const { records, loading: historyLoading } = useHistory();
  const [goalScore, setGoalScore] = useState(8);
  const [sessionsPerDay, setSessionsPerDay] = useState(2);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [planDate, setPlanDate] = useState("");
  const [generated, setGenerated] = useState(false);
  const [preview, setPreview] = useState<ScheduleItem[]>([]);
  const [useAiPlan, setUseAiPlan] = useState(false);
  const [aiPlanLoading, setAiPlanLoading] = useState(false);
  const [aiPlanSummary, setAiPlanSummary] = useState<string | null>(null);
  const [aiGoalProgress, setAiGoalProgress] = useState<{ current_avg: number; target: number; days_remaining: number; on_track: boolean } | null>(null);
  const [goalSaving, setGoalSaving] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);

  useEffect(() => {
    if (!scheduleLoading && targetDate) setPlanDate(targetDate);
  }, [scheduleLoading, targetDate]);

  // Load saved goal from API
  useEffect(() => {
    fetch("/api/ai/goal")
      .then((res) => (res.ok ? res.json() : null))
      .then((goal) => {
        if (goal) {
          setGoalScore(goal.goal_score);
          setSessionsPerDay(goal.sessions_per_day);
          setFocusAreas(goal.focus_sections || []);
          if (goal.target_date) setPlanDate(goal.target_date);
          setGoalSaved(true);
        }
      })
      .catch(() => {});
  }, []);

  if (scheduleLoading || historyLoading) return null;

  // Analyze past performance to find weak sections
  const sectionScores: Record<string, number[]> = {
    listening: [],
    reading: [],
    writing: [],
    speaking: [],
  };

  records.forEach((r) => {
    if (r.scores.listening != null) sectionScores.listening.push(r.scores.listening);
    if (r.scores.reading != null) sectionScores.reading.push(r.scores.reading);
    if (r.scores.writing != null) sectionScores.writing.push(r.scores.writing);
    if (r.scores.speaking != null) sectionScores.speaking.push(r.scores.speaking);
  });

  const avgScores: Record<string, number | null> = {};
  allSections.forEach((s) => {
    const scores = sectionScores[s];
    avgScores[s] = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  });

  const weakSections: string[] = allSections
    .filter((s) => avgScores[s] !== null && avgScores[s]! < goalScore)
    .sort((a, b) => (avgScores[a] ?? 0) - (avgScores[b] ?? 0));

  const totalDays = planDate ? daysBetween(todayStr(), planDate) : 0;

  const toggleFocus = (section: string) => {
    setFocusAreas((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
    setGenerated(false);
    setPreview([]);
  };

  const handleSaveGoal = async () => {
    setGoalSaving(true);
    try {
      const res = await fetch("/api/ai/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_score: goalScore,
          target_date: planDate || null,
          focus_sections: focusAreas,
          sessions_per_day: sessionsPerDay,
        }),
      });
      if (res.ok) setGoalSaved(true);
    } catch {
      // Goal save failed silently
    }
    setGoalSaving(false);
  };

  const handleGenerate = async () => {
    if (!planDate || totalDays <= 0) return;

    // Save goal first
    if (!goalSaved) await handleSaveGoal();

    if (useAiPlan) {
      // Use AI planner
      setAiPlanLoading(true);
      setGenerated(false);
      try {
        const res = await fetch("/api/ai/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days_ahead: Math.min(totalDays, 14) }),
        });
        if (res.ok) {
          const data = await res.json();
          const aiItems: ScheduleItem[] = (data.plan_items as PlanItem[]).map((item) => ({
            id: crypto.randomUUID(),
            date: item.date,
            section: item.section,
            label: item.label,
            completed: false,
          }));
          setPreview(aiItems);
          setAiPlanSummary(data.summary);
          setAiGoalProgress(data.goal_progress);
          setGenerated(true);
        } else if (res.status === 429) {
          setAiPlanSummary("Monthly AI limit reached. Using algorithmic plan instead.");
          // Fall back to algorithmic
          const plan = generatePlan(
            { targetDate: planDate, goalScore, sessionsPerDay, focusAreas },
            weakSections
          );
          setPreview(plan);
          setGenerated(true);
        } else {
          const err = await res.json();
          setAiPlanSummary(err.error || "AI plan failed. Using algorithmic plan.");
          const plan = generatePlan(
            { targetDate: planDate, goalScore, sessionsPerDay, focusAreas },
            weakSections
          );
          setPreview(plan);
          setGenerated(true);
        }
      } catch {
        // Fall back to algorithmic plan
        const plan = generatePlan(
          { targetDate: planDate, goalScore, sessionsPerDay, focusAreas },
          weakSections
        );
        setPreview(plan);
        setGenerated(true);
      }
      setAiPlanLoading(false);
    } else {
      const plan = generatePlan(
        { targetDate: planDate, goalScore, sessionsPerDay, focusAreas },
        weakSections
      );
      setPreview(plan);
      setGenerated(true);
    }
  };

  const handleApply = async () => {
    // Clear existing schedule items
    await clearSchedule();
    // Set target date and add all plan items
    await setTargetDate(planDate);
    await addItems(preview.map(({ id, ...rest }) => rest));
    setGenerated(false);
    setPreview([]);
  };


  // Group preview by date
  const grouped: Record<string, ScheduleItem[]> = {};
  preview.forEach((item) => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });
  const sortedDates = Object.keys(grouped).sort();

  // Phase labels
  const phase1End = Math.floor(totalDays * 0.6);
  const phase2End = Math.floor(totalDays * 0.9);

  function getPhase(date: string): string {
    const day = daysBetween(addDays(todayStr(), 1), date);
    if (day < phase1End) return "foundation";
    if (day < phase2End) return "integration";
    return "finalPrep";
  }

  function getPhaseColor(phase: string): string {
    if (phase === "foundation") return "bg-blue-100 text-blue-700 border-blue-200";
    if (phase === "integration") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  }

  const translatedSectionMeta = sectionMeta.map((s) => ({
    ...s,
    label: t(`section_${s.key}`),
  }));

  const getSectionStyle = (section: string) => {
    return (
      translatedSectionMeta.find((m) => m.key === section) ||
      (section.startsWith("quiz-")
        ? translatedSectionMeta.find((m) => m.key === section.replace("quiz-", ""))
        : null) ||
      { key: "full", label: t("sectionFull"), bg: "bg-purple-100 text-[#6b4c9a] border-purple-200" }
    );
  };

  return (
    <div>
      {/* ── Configuration ─────────────────────────── */}
      <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-6">
        <CardContent className="pt-5">
          <p className="text-lg font-bold text-[#1a1a2e] mb-4">{t("generatePlan")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Target date */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">{t("testDate")}</label>
              <input
                type="date"
                value={planDate}
                onChange={(e) => { setPlanDate(e.target.value); setGenerated(false); setPreview([]); }}
                min={addDays(todayStr(), 1)}
                className="w-full border border-[#e2ddd5] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#6b4c9a] transition-colors"
              />
              {totalDays > 0 && (
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {t("daysFromNow", { days: totalDays })}
                </p>
              )}
            </div>

            {/* Goal score */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                {t("goalScore")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={goalScore}
                  onChange={(e) => { setGoalScore(Number(e.target.value)); setGenerated(false); setPreview([]); }}
                  className="flex-1 accent-[#6b4c9a]"
                />
                <span className="text-2xl font-bold text-[#6b4c9a] w-8 text-center">{goalScore}</span>
              </div>
            </div>
          </div>

          {/* Sessions per day */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1">{t("sessionsPerDay")}</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => { setSessionsPerDay(n); setGenerated(false); setPreview([]); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sessionsPerDay === n
                      ? "bg-[#6b4c9a] text-white shadow-sm"
                      : "bg-white border border-[#e2ddd5] text-[#6b6b7b] hover:border-[#6b4c9a]"
                  }`}
                >
                  {t("sessionCount", { count: n })}
                </button>
              ))}
            </div>
          </div>

          {/* Focus areas */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
              {t("focusAreas")} <span className="font-normal" style={{ color: "var(--muted-foreground)" }}>{t("focusAreasOptional")}</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {translatedSectionMeta.map((s) => {
                const avg = avgScores[s.key];
                const isWeak = weakSections.includes(s.key);
                const isSelected = focusAreas.includes(s.key);
                return (
                  <button
                    key={s.key}
                    onClick={() => toggleFocus(s.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? s.bg
                        : "bg-white border-[#e2ddd5] text-[#6b6b7b] hover:border-[#6b4c9a]"
                    }`}
                  >
                    {s.label}
                    {avg !== null && (
                      <span className="ml-1 opacity-70">({avg})</span>
                    )}
                    {isWeak && !isSelected && (
                      <span className="ml-1 text-red-500">!</span>
                    )}
                  </button>
                );
              })}
            </div>
            {weakSections.length > 0 && (
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                {t("weakestAreas", { areas: weakSections.map((s) => capitalize(s)).join(", ") })}
              </p>
            )}
          </div>

          {/* AI Plan toggle */}
          <div className="flex items-center gap-3 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useAiPlan}
                onChange={(e) => { setUseAiPlan(e.target.checked); setGenerated(false); setPreview([]); }}
                className="w-4 h-4 rounded accent-[#6b4c9a]"
              />
              <span className="text-sm font-medium text-[#1a1a2e]">
                {t("useAiPlan")}
              </span>
            </label>
            {useAiPlan && (
              <Badge className="bg-purple-100 text-[#6b4c9a] border-purple-200 text-[10px]">
                {t("personalizedDiagnostics")}
              </Badge>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={!planDate || totalDays <= 0 || aiPlanLoading}
              className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white px-8"
            >
              {aiPlanLoading ? t("aiPlanning") : useAiPlan ? t("generateAiPlan") : t("generatePlanBtn")}
            </Button>
            {!goalSaved && (
              <Button
                onClick={handleSaveGoal}
                disabled={goalSaving}
                variant="outline"
                className="rounded-full px-6"
              >
                {goalSaving ? t("saving") : t("saveGoal")}
              </Button>
            )}
            {goalSaved && (
              <Badge variant="outline" className="text-green-600 border-green-300 text-xs self-center">
                {t("goalSaved")}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Plan summary ──────────────────────────── */}
      {generated && preview.length > 0 && (
        <>
          <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-6">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-bold text-[#1a1a2e]">{t("planOverview")}</p>
                <Button
                  onClick={handleApply}
                  className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
                >
                  {t("applyToSchedule")}
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#6b4c9a]">{totalDays}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t("totalDays")}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#6b4c9a]">{preview.length}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t("sessions")}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#6b4c9a]">
                    {preview.filter((p) => p.section === "full").length}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t("fullTests")}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#6b4c9a]">{goalScore}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t("targetScore")}</p>
                </div>
              </div>

              {/* AI summary */}
              {aiPlanSummary && useAiPlan && (
                <div className="bg-purple-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-purple-800">{aiPlanSummary}</p>
                  {aiGoalProgress && (
                    <div className="flex gap-4 mt-2 text-xs text-purple-600">
                      <span>{t("currentAvg")}: <strong>{aiGoalProgress.current_avg}</strong></span>
                      <span>{t("target")}: <strong>{aiGoalProgress.target}</strong></span>
                      <span>{aiGoalProgress.days_remaining} {t("daysLeft")}</span>
                      <Badge className={aiGoalProgress.on_track ? "bg-green-100 text-green-700 text-[10px]" : "bg-red-100 text-red-700 text-[10px]"}>
                        {aiGoalProgress.on_track ? t("onTrack") : t("needsFocus")}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {/* Phase breakdown */}
              {!useAiPlan && (
                <div className="flex gap-2 flex-wrap">
                  {([
                    { key: "foundation", label: t("phaseFoundation"), pct: 60, desc: t("phaseFoundationDesc") },
                    { key: "integration", label: t("phaseIntegration"), pct: 30, desc: t("phaseIntegrationDesc") },
                    { key: "finalPrep", label: t("phaseFinalPrep"), pct: 10, desc: t("phaseFinalPrepDesc") },
                  ] as const).map((phase) => (
                    <div key={phase.key} className="flex-1 min-w-[120px]">
                      <Badge className={getPhaseColor(phase.key) + " border text-xs mb-1"}>
                        {phase.label}
                      </Badge>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        ~{phase.pct}% — {phase.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Day-by-day preview ─────────────────── */}
          <div className="space-y-3">
            {sortedDates.map((date, idx) => {
              const dateItems = grouped[date];
              const phase = getPhase(date);
              const prevPhase = idx > 0 ? getPhase(sortedDates[idx - 1]) : "";
              const showPhaseLabel = phase !== prevPhase;

              return (
                <div key={date}>
                  {showPhaseLabel && (
                    <div className="flex items-center gap-2 mb-3 mt-2">
                      <Badge className={getPhaseColor(phase) + " border text-xs"}>
                        {t("phaseLabel", { phase: phase === "foundation" ? t("phaseFoundation") : phase === "integration" ? t("phaseIntegration") : t("phaseFinalPrep") })}
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                  )}
                  <div className="flex gap-3 items-start">
                    {/* Date column */}
                    <div className="w-16 shrink-0 text-right pt-1">
                      <p className="text-xs font-bold text-[#1a1a2e]">{weekdayName(date)}</p>
                      <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                        {formatDate(date).replace(/,?\s*\d{4}$/, "")}
                      </p>
                    </div>

                    {/* Sessions */}
                    <div className="flex-1 space-y-1.5">
                      {dateItems.map((item) => {
                        const style = getSectionStyle(item.section);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 p-2.5 rounded-xl border border-[#e2ddd5] bg-white"
                          >
                            <Badge className={`${style.bg} border text-[10px] shrink-0`}>
                              {style.label}
                            </Badge>
                            <p className="text-sm text-[#1a1a2e] flex-1">{item.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {generated && preview.length === 0 && (
        <Card className="border-2 border-dashed border-[#e2ddd5] rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-lg font-medium text-[#1a1a2e] mb-1">{t("cannotGenerate")}</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {t("cannotGenerateDesc")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
