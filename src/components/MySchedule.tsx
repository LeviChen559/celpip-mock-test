"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useSchedule, ScheduleItem } from "@/lib/hooks/use-schedule";

const sectionOptions = [
  { value: "full", label: "Full Mock Test", bg: "bg-purple-100 text-[#6b4c9a] border-purple-200" },
  { value: "listening", label: "Listening", bg: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "reading", label: "Reading", bg: "bg-green-100 text-green-700 border-green-200" },
  { value: "writing", label: "Writing", bg: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "speaking", label: "Speaking", bg: "bg-pink-100 text-pink-700 border-pink-200" },
  { value: "quiz-listening", label: "Listening Quiz", bg: "bg-orange-50 text-orange-600 border-orange-200" },
  { value: "quiz-reading", label: "Reading Quiz", bg: "bg-green-50 text-green-600 border-green-200" },
];

function getSectionStyle(value: string) {
  return sectionOptions.find((o) => o.value === value) || sectionOptions[0];
}

function getSectionDot(value: string): string {
  if (value === "full") return "bg-[#6b4c9a]";
  if (value === "listening" || value === "quiz-listening") return "bg-orange-400";
  if (value === "reading" || value === "quiz-reading") return "bg-green-500";
  if (value === "writing") return "bg-purple-500";
  if (value === "speaking") return "bg-pink-500";
  return "bg-gray-400";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(d);
}

function daysUntil(dateStr: string): number {
  if (!dateStr) return 0;
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// ── Calendar helpers ──────────────────────────────────

function getMonthDays(year: number, month: number): string[] {
  const days: string[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(date.toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getStartDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-CA", { month: "long", year: "numeric" });
}

// ── Component ─────────────────────────────────────────

type ViewMode = "list" | "calendar";

export default function MySchedule() {
  const { targetDate, items, loading, setTargetDate, addItem, toggleItem, deleteItem, clearAll } = useSchedule();
  const [formDate, setFormDate] = useState(todayStr());
  const [formSection, setFormSection] = useState("full");
  const [formLabel, setFormLabel] = useState("");
  const [view, setView] = useState<ViewMode>("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Calendar navigation
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  if (loading) return null;

  const handleAdd = async () => {
    if (!formDate) return;
    const opt = getSectionStyle(formSection);
    await addItem({
      date: formDate,
      section: formSection,
      label: formLabel || opt.label,
      completed: false,
    });
    setFormLabel("");
  };

  const days = daysUntil(targetDate);
  const completedCount = items.filter((i) => i.completed).length;
  const totalItems = items.length;
  const completionPct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const grouped: Record<string, ScheduleItem[]> = {};
  items.forEach((item) => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });
  const sortedDates = Object.keys(grouped).sort();
  const today = todayStr();

  // Calendar navigation handlers
  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
  };
  const goToToday = () => {
    setCalYear(now.getFullYear());
    setCalMonth(now.getMonth());
    setSelectedDate(today);
  };

  // Calendar data
  const monthDays = getMonthDays(calYear, calMonth);
  const startDay = getStartDayOfWeek(calYear, calMonth);
  const selectedItems = selectedDate ? (grouped[selectedDate] || []) : [];

  return (
    <div>
      {/* Target date & Progress */}
      <div className={`grid gap-4 mb-6 ${totalItems > 0 ? "md:grid-cols-2" : ""}`}>
        <Card className="border-2 border-[#e2ddd5] rounded-2xl">
          <CardContent className="pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1a1a2e] mb-1">Target Test Date</p>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={todayStr()}
                  className="border border-[#e2ddd5] rounded-lg px-3 py-2 text-sm bg-white w-full sm:w-auto"
                />
              </div>
              {targetDate && (
                <div className="text-right">
                  <p className={`text-3xl font-bold ${days > 0 ? "text-[#6b4c9a]" : "text-red-600"}`}>
                    {days > 0 ? days : 0}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {days > 0 ? "days remaining" : days === 0 ? "Test day!" : "Past due"}
                  </p>
                  {totalItems > 0 && (
                    <Button
                      onClick={() => clearAll()}
                      variant="outline"
                      className="mt-2 rounded-full border-red-300 text-red-600 hover:bg-red-50 text-xs px-4"
                    >
                      Reset Plan
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {totalItems > 0 && (
          <Card className="border-2 border-[#e2ddd5] rounded-2xl">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#1a1a2e]">Study Progress</p>
                <p className="text-sm font-bold text-[#6b4c9a]">{completedCount}/{totalItems}</p>
              </div>
              <Progress value={completionPct} className="h-2.5" />
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                {completionPct}% complete
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add form */}
      <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-6">
        <CardContent className="pt-5">
          <p className="text-sm font-medium text-[#1a1a2e] mb-3">Add Study Session</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="border border-[#e2ddd5] rounded-lg px-3 py-2 text-sm bg-white"
            />
            <select
              value={formSection}
              onChange={(e) => setFormSection(e.target.value)}
              className="border border-[#e2ddd5] rounded-lg px-3 py-2 text-sm bg-white"
            >
              {sectionOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              placeholder="Note (optional)"
              className="border border-[#e2ddd5] rounded-lg px-3 py-2 text-sm bg-white"
            />
            <Button
              onClick={handleAdd}
              className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-[#1a1a2e]">Schedule</p>
        <div className="flex rounded-full border border-[#e2ddd5] overflow-hidden">
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-1.5 text-xs font-medium transition-all ${
              view === "calendar"
                ? "bg-[#6b4c9a] text-white"
                : "bg-white text-[#6b6b7b] hover:text-[#6b4c9a]"
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-1.5 text-xs font-medium transition-all ${
              view === "list"
                ? "bg-[#6b4c9a] text-white"
                : "bg-white text-[#6b6b7b] hover:text-[#6b4c9a]"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Empty state */}
      {totalItems === 0 ? (
        <Card className="border-2 border-dashed border-[#e2ddd5] rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-lg font-medium text-[#1a1a2e] mb-1">No study sessions planned</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Set a target date and add study sessions to build your plan.
            </p>
          </CardContent>
        </Card>
      ) : view === "calendar" ? (
        /* ── Calendar View ────────────────────────── */
        <div>
          <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-4">
            <CardContent className="pt-4 pb-3">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={prevMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#1a1a2e] transition-colors"
                >
                  &larr;
                </button>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-[#1a1a2e]">{formatMonthYear(calYear, calMonth)}</p>
                  <button
                    onClick={goToToday}
                    className="text-[10px] font-medium text-[#6b4c9a] hover:underline"
                  >
                    Today
                  </button>
                </div>
                <button
                  onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#1a1a2e] transition-colors"
                >
                  &rarr;
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center text-[10px] font-medium py-1" style={{ color: "var(--muted-foreground)" }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-px">
                {/* Empty cells for days before month start */}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10" />
                ))}

                {/* Day cells */}
                {monthDays.map((dateStr) => {
                  const dayNum = new Date(dateStr + "T00:00:00").getDate();
                  const dayItems = grouped[dateStr] || [];
                  const hasItems = dayItems.length > 0;
                  const isToday = dateStr === today;
                  const isSelected = dateStr === selectedDate;
                  const isTarget = dateStr === targetDate;
                  const allCompleted = hasItems && dayItems.every((i) => i.completed);
                  const someCompleted = hasItems && dayItems.some((i) => i.completed) && !allCompleted;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`h-10 flex flex-col items-center justify-center relative rounded-lg transition-all text-xs
                        ${isSelected ? "bg-[#6b4c9a] text-white ring-2 ring-[#6b4c9a] ring-offset-1" : ""}
                        ${isToday && !isSelected ? "bg-purple-50 font-bold text-[#6b4c9a]" : ""}
                        ${isTarget && !isSelected ? "ring-2 ring-[#6b4c9a] ring-offset-1" : ""}
                        ${!isSelected && !isToday ? "hover:bg-gray-50 text-[#1a1a2e]" : ""}
                        ${allCompleted && !isSelected ? "text-green-600" : ""}
                      `}
                    >
                      <span className={`text-xs ${isToday && !isSelected ? "font-bold" : ""}`}>
                        {dayNum}
                      </span>

                      {/* Task indicators */}
                      {hasItems && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayItems.slice(0, 3).map((item, i) => (
                            <span
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected
                                  ? item.completed ? "bg-white/50" : "bg-white"
                                  : item.completed ? "bg-green-400" : getSectionDot(item.section)
                              }`}
                            />
                          ))}
                          {dayItems.length > 3 && (
                            <span className={`text-[8px] ${isSelected ? "text-white/70" : "text-[#6b6b7b]"}`}>
                              +{dayItems.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Completion checkmark */}
                      {allCompleted && (
                        <span className={`absolute top-0.5 right-0.5 text-[8px] ${isSelected ? "text-white" : "text-green-500"}`}>
                          &#10003;
                        </span>
                      )}
                      {someCompleted && (
                        <span className={`absolute top-0.5 right-0.5 text-[8px] ${isSelected ? "text-white/70" : "text-amber-500"}`}>
                          &#9679;
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-2 pt-2 border-t border-[#e2ddd5] flex-wrap">
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Completed
                </div>
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Listening
                </div>
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Reading
                </div>
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Writing
                </div>
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Speaking
                </div>
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6b4c9a]" /> Full Test
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected date detail panel */}
          {selectedDate && (
            <Card className="border-2 border-[#6b4c9a]/30 rounded-2xl">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#1a1a2e]">{formatDate(selectedDate)}</p>
                    {selectedDate === today && (
                      <Badge className="bg-[#6b4c9a] text-white text-[10px] px-2 py-0">Today</Badge>
                    )}
                    {selectedDate === targetDate && (
                      <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">Test Day</Badge>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-xs hover:text-red-600 transition-colors"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Close
                  </button>
                </div>

                {selectedItems.length === 0 ? (
                  <p className="text-sm py-4 text-center" style={{ color: "var(--muted-foreground)" }}>
                    No sessions scheduled for this day.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedItems.map((item) => {
                      const style = getSectionStyle(item.section);
                      const isAi = item.source === "ai_planner";
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            isAi ? "border-l-4 border-l-[#6b4c9a] border-[#e2ddd5] bg-purple-50/50" : "border-[#e2ddd5] bg-white"
                          } ${item.completed ? "opacity-60" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleItem(item.id)}
                            className="w-4 h-4 rounded accent-[#6b4c9a] cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={`${style.bg} border text-[10px] shrink-0`}>
                                {style.label}
                              </Badge>
                              {isAi && (
                                <Badge className="bg-purple-100 text-[#6b4c9a] border-purple-200 text-[10px]">
                                  AI Recommended
                                </Badge>
                              )}
                            </div>
                            <p
                              className={`text-sm mt-1 ${item.completed ? "line-through" : ""}`}
                              style={{ color: item.completed ? "var(--muted-foreground)" : "#1a1a2e" }}
                            >
                              {item.label}
                            </p>
                            {isAi && item.ai_metadata?.reason && (
                              <p className="text-[10px] mt-0.5 text-[#6b4c9a]">
                                {item.ai_metadata.reason}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-xs hover:text-red-600 transition-colors shrink-0"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* ── List View ────────────────────────────── */
        <div className="space-y-4">
          {sortedDates.map((date) => {
            const dateItems = grouped[date];
            const isPast = date < today;
            const isToday = date === today;
            return (
              <div key={date}>
                <div className="flex items-center gap-2 mb-2">
                  <p className={`text-sm font-bold ${isToday ? "text-[#6b4c9a]" : "text-[#1a1a2e]"}`}>
                    {formatDate(date)}
                  </p>
                  {isToday && (
                    <Badge className="bg-[#6b4c9a] text-white text-[10px] px-2 py-0">Today</Badge>
                  )}
                  {isPast && !isToday && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0" style={{ color: "var(--muted-foreground)" }}>
                      Past
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  {dateItems.map((item) => {
                    const style = getSectionStyle(item.section);
                    const isAi = item.source === "ai_planner";
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isAi ? "border-l-4 border-l-[#6b4c9a] border-[#e2ddd5] bg-purple-50/50" : "border-[#e2ddd5] bg-white"
                        } ${item.completed ? "opacity-60" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleItem(item.id)}
                          className="w-4 h-4 rounded accent-[#6b4c9a] cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${style.bg} border text-[10px] shrink-0`}>
                              {style.label}
                            </Badge>
                            {isAi && (
                              <Badge className="bg-purple-100 text-[#6b4c9a] border-purple-200 text-[10px]">
                                AI Recommended
                              </Badge>
                            )}
                          </div>
                          <p
                            className={`text-sm mt-1 ${item.completed ? "line-through" : ""}`}
                            style={{ color: item.completed ? "var(--muted-foreground)" : "#1a1a2e" }}
                          >
                            {item.label}
                          </p>
                          {isAi && item.ai_metadata?.reason && (
                            <p className="text-[10px] mt-0.5 text-[#6b4c9a]">
                              {item.ai_metadata.reason}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-xs hover:text-red-600 transition-colors shrink-0"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
                <Separator className="mt-4" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
