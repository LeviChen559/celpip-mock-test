"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useSchedule, ScheduleItem } from "@/lib/hooks/use-schedule";
import { useHistory } from "@/lib/hooks/use-history";

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
      // Phase 1: Foundation — quizzes and section practice on weak areas
      for (let s = 0; s < sessionsToday; s++) {
        const sectionKey = prioritySections[s % prioritySections.length];
        if (s % 2 === 0) {
          // Quiz practice
          items.push({
            id: crypto.randomUUID(),
            date,
            section: `quiz-${sectionKey === "writing" || sectionKey === "speaking" ? "listening" : sectionKey}`,
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
          const sectionKey = prioritySections[s % prioritySections.length];
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
  const { targetDate, items, loading: scheduleLoading, setTargetDate, addItem, addItems, deleteItem, clearAll: clearSchedule } = useSchedule();
  const { records, loading: historyLoading } = useHistory();
  const [goalScore, setGoalScore] = useState(8);
  const [sessionsPerDay, setSessionsPerDay] = useState(2);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [planDate, setPlanDate] = useState("");
  const [generated, setGenerated] = useState(false);
  const [preview, setPreview] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (!scheduleLoading && targetDate) setPlanDate(targetDate);
  }, [scheduleLoading, targetDate]);

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

  const handleGenerate = () => {
    if (!planDate || totalDays <= 0) return;

    const plan = generatePlan(
      { targetDate: planDate, goalScore, sessionsPerDay, focusAreas },
      weakSections
    );
    setPreview(plan);
    setGenerated(true);
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
    if (day < phase1End) return "Foundation";
    if (day < phase2End) return "Integration";
    return "Final Prep";
  }

  function getPhaseColor(phase: string): string {
    if (phase === "Foundation") return "bg-blue-100 text-blue-700 border-blue-200";
    if (phase === "Integration") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  }

  const getSectionStyle = (section: string) => {
    return (
      sectionMeta.find((m) => m.key === section) ||
      (section.startsWith("quiz-")
        ? sectionMeta.find((m) => m.key === section.replace("quiz-", ""))
        : null) ||
      { key: "full", label: "Full Mock Test", bg: "bg-purple-100 text-[#6b4c9a] border-purple-200" }
    );
  };

  return (
    <div>
      {/* ── Configuration ─────────────────────────── */}
      <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-6">
        <CardContent className="pt-5">
          <p className="text-lg font-bold text-[#1a1a2e] mb-4">Generate Study Plan</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Target date */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Test Date</label>
              <input
                type="date"
                value={planDate}
                onChange={(e) => { setPlanDate(e.target.value); setGenerated(false); setPreview([]); }}
                min={addDays(todayStr(), 1)}
                className="w-full border border-[#e2ddd5] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#6b4c9a] transition-colors"
              />
              {totalDays > 0 && (
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {totalDays} days from now
                </p>
              )}
            </div>

            {/* Goal score */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                Goal Score (CELPIP 2–12)
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
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Sessions per Day</label>
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
                  {n} {n === 1 ? "session" : "sessions"}
                </button>
              ))}
            </div>
          </div>

          {/* Focus areas */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
              Focus Areas <span className="font-normal" style={{ color: "var(--muted-foreground)" }}>(optional — auto-detected from history)</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {sectionMeta.map((s) => {
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
                Based on your history, weakest areas:{" "}
                {weakSections.map((s) => capitalize(s)).join(", ")}
              </p>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!planDate || totalDays <= 0}
            className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white px-8"
          >
            Generate Plan
          </Button>
        </CardContent>
      </Card>

      {/* ── Plan summary ──────────────────────────── */}
      {generated && preview.length > 0 && (
        <>
          <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-6">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-bold text-[#1a1a2e]">Plan Overview</p>
                <Button
                  onClick={handleApply}
                  className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
                >
                  Apply to My Schedule
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#6b4c9a]">{totalDays}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Total Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#6b4c9a]">{preview.length}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#6b4c9a]">
                    {preview.filter((p) => p.section === "full").length}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Full Tests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#6b4c9a]">{goalScore}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Target Score</p>
                </div>
              </div>

              {/* Phase breakdown */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Foundation", pct: 60, desc: "Quizzes & section drills" },
                  { label: "Integration", pct: 30, desc: "Mixed practice & full tests" },
                  { label: "Final Prep", pct: 10, desc: "Full mock tests & review" },
                ].map((phase) => (
                  <div key={phase.label} className="flex-1 min-w-[120px]">
                    <Badge className={getPhaseColor(phase.label) + " border text-xs mb-1"}>
                      {phase.label}
                    </Badge>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      ~{phase.pct}% — {phase.desc}
                    </p>
                  </div>
                ))}
              </div>
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
                        {phase} Phase
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
            <p className="text-lg font-medium text-[#1a1a2e] mb-1">Cannot generate plan</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              The test date must be in the future. Please select a valid date.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
