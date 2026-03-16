"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useSchedule } from "@/lib/hooks/use-schedule";

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

export default function MySchedule() {
  const { targetDate, items, loading, setTargetDate, addItem, toggleItem, deleteItem } = useSchedule();
  const [formDate, setFormDate] = useState(todayStr());
  const [formSection, setFormSection] = useState("full");
  const [formLabel, setFormLabel] = useState("");

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

  const grouped: Record<string, typeof items> = {};
  items.forEach((item) => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });
  const sortedDates = Object.keys(grouped).sort();
  const today = todayStr();

  return (
    <div>
      {/* Target date */}
      <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-6">
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {totalItems > 0 && (
        <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-6">
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

      {/* Schedule list */}
      {totalItems === 0 ? (
        <Card className="border-2 border-dashed border-[#e2ddd5] rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-lg font-medium text-[#1a1a2e] mb-1">No study sessions planned</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Set a target date and add study sessions to build your plan.
            </p>
          </CardContent>
        </Card>
      ) : (
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
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border border-[#e2ddd5] bg-white transition-all ${
                          item.completed ? "opacity-60" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleItem(item.id)}
                          className="w-4 h-4 rounded accent-[#6b4c9a] cursor-pointer"
                        />
                        <Badge className={`${style.bg} border text-[10px] shrink-0`}>
                          {style.label}
                        </Badge>
                        <p
                          className={`text-sm flex-1 ${item.completed ? "line-through" : ""}`}
                          style={{ color: item.completed ? "var(--muted-foreground)" : "#1a1a2e" }}
                        >
                          {item.label}
                        </p>
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
