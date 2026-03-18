"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useHistory, TestRecord } from "@/lib/hooks/use-history";

type TestType = "full" | "section" | "quiz";

const typeLabels: Record<TestType, string> = {
  full: "Full Mock Test",
  section: "Section Practice",
  quiz: "Quiz Practice",
};

const sectionStyles: Record<string, { bg: string }> = {
  listening: { bg: "bg-orange-100 text-orange-700 border-orange-200" },
  reading: { bg: "bg-green-100 text-green-700 border-green-200" },
  writing: { bg: "bg-purple-100 text-purple-700 border-purple-200" },
  speaking: { bg: "bg-pink-100 text-pink-700 border-pink-200" },
  full: { bg: "bg-purple-100 text-[#6b4c9a] border-purple-200" },
};

function getRecordLabel(r: TestRecord): string {
  if (r.type === "full") return "Full Mock Test";
  if (r.type === "section" && r.section) {
    return `${r.section.charAt(0).toUpperCase() + r.section.slice(1)} Practice`;
  }
  if (r.type === "quiz") {
    const sec = r.quizSection ? r.quizSection.charAt(0).toUpperCase() + r.quizSection.slice(1) : "";
    const part = r.quizPart === "all" ? "All Parts" : `Part ${Number(r.quizPart) + 1}`;
    return `${sec} Quiz — ${part}`;
  }
  return "Test";
}

function getRecordStyle(r: TestRecord) {
  if (r.type === "full") return sectionStyles.full;
  if (r.type === "section" && r.section) return sectionStyles[r.section] || sectionStyles.full;
  if (r.type === "quiz" && r.quizSection) return sectionStyles[r.quizSection] || sectionStyles.full;
  return sectionStyles.full;
}

function scoreColor(score: number): string {
  if (score >= 10) return "text-green-600";
  if (score >= 8) return "text-blue-600";
  if (score >= 6) return "text-yellow-600";
  return "text-red-600";
}

type FilterKey = "all" | TestType;

function hasAnswers(r: TestRecord): boolean {
  if (r.details?.answers && Object.keys(r.details.answers).length > 0) return true;
  if (r.details?.responses && Object.keys(r.details.responses).length > 0) return true;
  return false;
}

export default function MyTests() {
  const router = useRouter();
  const { records, loading, deleteRecord, clearAll } = useHistory();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showClearDialog, setShowClearDialog] = useState(false);

  if (loading) return null;

  const filtered = filter === "all" ? records : records.filter((r) => r.type === filter);
  const totalTests = records.length;
  const avgScore = totalTests > 0
    ? Math.round(records.reduce((s, r) => s + r.overallScore, 0) / totalTests)
    : 0;
  const bestScore = totalTests > 0 ? Math.max(...records.map((r) => r.overallScore)) : 0;

  const handleClear = () => {
    clearAll();
    setShowClearDialog(false);
  };

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "full", label: "Full Tests" },
    { key: "section", label: "Sections" },
    { key: "quiz", label: "Quizzes" },
  ];

  const chartData = [...records].sort((a, b) => a.timestamp - b.timestamp).slice(-10);

  return (
    <div>
      {/* Summary */}
      {totalTests > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { value: totalTests, label: "Tests Taken", color: "text-[#1a1a2e]" },
            { value: avgScore, label: "Avg Score", color: scoreColor(avgScore) },
            { value: bestScore, label: "Best Score", color: scoreColor(bestScore) },
          ].map((stat) => (
            <Card key={stat.label} className="border-2 border-[#e2ddd5] rounded-2xl">
              <CardContent className="pt-5 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Mini chart */}
      {chartData.length >= 2 && (
        <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-6">
          <CardContent className="pt-5">
            <p className="text-sm font-medium text-[#1a1a2e] mb-3">
              Score Trend (last {chartData.length} tests)
            </p>
            <div className="flex items-end gap-1.5" style={{ height: 120 }}>
              {chartData.map((r) => {
                const barHeight = Math.max((r.overallScore / 12) * 100, 6);
                const barColor = r.type === "full" ? "bg-[#6b4c9a]"
                  : r.quizSection === "listening" || r.section === "listening" ? "bg-orange-400"
                  : r.quizSection === "reading" || r.section === "reading" ? "bg-green-500"
                  : r.quizSection === "writing" || r.section === "writing" ? "bg-purple-500"
                  : r.quizSection === "speaking" || r.section === "speaking" ? "bg-pink-500"
                  : "bg-[#6b4c9a]";
                return (
                  <div key={r.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className={`text-[10px] font-bold mb-1 ${scoreColor(r.overallScore)}`}>
                      {r.overallScore}
                    </span>
                    <div
                      className={`w-full rounded-t-md ${barColor} opacity-70 hover:opacity-100 transition-opacity`}
                      style={{ height: `${barHeight}%` }}
                      title={`${getRecordLabel(r)} — Score: ${r.overallScore}/12`}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-[#6b4c9a] text-white shadow-sm"
                : "bg-white border border-[#e2ddd5] text-[#6b6b7b] hover:border-[#6b4c9a] hover:text-[#6b4c9a]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results list */}
      {filtered.length === 0 ? (
        <Card className="border-2 border-dashed border-[#e2ddd5] rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-lg font-medium text-[#1a1a2e] mb-1">
              {totalTests === 0 ? "No tests taken yet" : "No results for this filter"}
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {totalTests === 0
                ? "Complete a mock test, section practice, or quiz to see your results here."
                : "Try a different filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((r) => {
            const style = getRecordStyle(r);
            return (
              <Card key={r.id} className="border-2 border-[#e2ddd5] rounded-2xl overflow-hidden break-inside-avoid">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={`${style.bg} border text-xs`}>
                          {typeLabels[r.type]}
                        </Badge>
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {new Intl.DateTimeFormat("en-CA", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(r.timestamp))}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#1a1a2e] mb-1">
                        {getRecordLabel(r)}
                      </p>
                      {r.type === "full" && (
                        <div className="flex gap-3 flex-wrap text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {r.scores.listening != null && <span>L: <strong className="text-[#1a1a2e]">{r.scores.listening}</strong></span>}
                          {r.scores.reading != null && <span>R: <strong className="text-[#1a1a2e]">{r.scores.reading}</strong></span>}
                          {r.scores.writing != null && <span>W: <strong className="text-[#1a1a2e]">{r.scores.writing}</strong></span>}
                          {r.scores.speaking != null && <span>S: <strong className="text-[#1a1a2e]">{r.scores.speaking}</strong></span>}
                        </div>
                      )}
                      {r.details.quiz && (
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {r.details.quiz.correct}/{r.details.quiz.total} correct
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-3xl font-bold ${scoreColor(r.overallScore)}`}>
                        {r.overallScore}
                      </p>
                      <Progress value={(r.overallScore / 12) * 100} className="h-1.5 w-16 mt-1" />
                      <div className="flex gap-2 mt-2">
                        {hasAnswers(r) && (
                          <button
                            onClick={() => router.push(`/review?id=${r.id}`)}
                            className="text-xs font-medium text-[#6b4c9a] hover:underline transition-colors"
                          >
                            Review
                          </button>
                        )}
                        <button
                          onClick={() => deleteRecord(r.id)}
                          className="text-xs hover:text-red-600 transition-colors"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {totalTests > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowClearDialog(true)}
            className="text-sm hover:text-red-600 transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            Clear All History
          </button>
        </div>
      )}

      {/* Clear All Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowClearDialog(false)} />
          <Card className="relative z-10 w-full max-w-md border-2 border-red-200 rounded-2xl shadow-xl">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Clear All Test History?</h3>
              <p className="text-sm mb-1" style={{ color: "var(--muted-foreground)" }}>
                This will permanently delete <strong className="text-red-600">all {totalTests} test results</strong> from the database.
              </p>
              <p className="text-sm mb-5 text-red-600 font-medium">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowClearDialog(false)}
                  className="rounded-full px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleClear}
                  className="rounded-full px-6 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
