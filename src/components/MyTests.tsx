"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useHistory, TestRecord } from "@/lib/hooks/use-history";
import { createClient } from "@/lib/supabase/client";
import { listeningParts, readingParts } from "@/lib/celpip-data";

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

interface AiScoreRow {
  test_record_id: string;
  section: string;
  task_id: string;
  scores: {
    task_response: { score: number; comment: string };
    coherence: { score: number; comment: string };
    vocabulary: { score: number; comment: string };
    grammar: { score: number; comment: string };
    overall: number;
    clb_estimate: string;
  };
  weaknesses: string[];
  created_at: string;
}

const SECTION_KEYS = ["listening", "reading", "writing", "speaking"] as const;
type SectionKey = (typeof SECTION_KEYS)[number];
const sectionColors: Record<SectionKey, string> = {
  listening: "bg-orange-400",
  reading: "bg-green-500",
  writing: "bg-purple-500",
  speaking: "bg-pink-500",
};
const sectionTextColors: Record<SectionKey, string> = {
  listening: "text-orange-600",
  reading: "text-green-600",
  writing: "text-purple-600",
  speaking: "text-pink-600",
};

export default function MyTests() {
  const router = useRouter();
  const { records, loading, deleteRecord, clearAll } = useHistory();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [aiScoresMap, setAiScoresMap] = useState<Record<string, AiScoreRow[]>>({});
  const [allAiScores, setAllAiScores] = useState<AiScoreRow[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<SectionKey | null>(null);

  // Fetch AI scores for all records
  useEffect(() => {
    if (loading || records.length === 0) return;
    const supabase = createClient();
    supabase
      .from("ai_scores")
      .select("test_record_id, section, task_id, scores, weaknesses, created_at")
      .order("created_at", { ascending: true })
      .then(({ data }: { data: AiScoreRow[] | null }) => {
        if (!data) return;
        setAllAiScores(data as AiScoreRow[]);
        const map: Record<string, AiScoreRow[]> = {};
        (data as AiScoreRow[]).forEach((row) => {
          if (!row.test_record_id) return;
          if (!map[row.test_record_id]) map[row.test_record_id] = [];
          map[row.test_record_id].push(row);
        });
        setAiScoresMap(map);
      });
  }, [loading, records]);

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

  // Per-section analytics
  const sectionStats = SECTION_KEYS.map((sec) => {
    const sectionRecords = records.filter(
      (r) => r.section === sec || r.quizSection === sec || (r.type === "full" && r.scores[sec] != null)
    );
    const scores = sectionRecords.map((r) =>
      r.type === "full" ? (r.scores[sec] ?? 0) : r.overallScore
    );
    const latest5 = [...sectionRecords]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map((r) => r.type === "full" ? (r.scores[sec] ?? 0) : r.overallScore);
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const best = scores.length > 0 ? Math.max(...scores) : 0;
    const trend = latest5.length >= 2
      ? latest5[0] - latest5[latest5.length - 1]
      : 0;

    // AI dimension scores for writing/speaking
    const aiForSection = allAiScores.filter((ai) => ai.section === sec);
    const latestAi = aiForSection.slice(-3);
    const dimAvg = latestAi.length > 0
      ? {
          task_response: Math.round(latestAi.reduce((s, a) => s + (a.scores.task_response?.score || 0), 0) / latestAi.length * 10) / 10,
          coherence: Math.round(latestAi.reduce((s, a) => s + (a.scores.coherence?.score || 0), 0) / latestAi.length * 10) / 10,
          vocabulary: Math.round(latestAi.reduce((s, a) => s + (a.scores.vocabulary?.score || 0), 0) / latestAi.length * 10) / 10,
          grammar: Math.round(latestAi.reduce((s, a) => s + (a.scores.grammar?.score || 0), 0) / latestAi.length * 10) / 10,
        }
      : null;

    // Aggregate weaknesses (count frequency) for writing/speaking
    const weaknessCount = new Map<string, number>();
    aiForSection.forEach((ai) => {
      ai.weaknesses?.forEach((w) => {
        weaknessCount.set(w, (weaknessCount.get(w) || 0) + 1);
      });
    });
    const topWeaknesses = [...weaknessCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([w]) => w);

    // Per-category breakdown for listening/reading
    // Group by CELPIP category name (e.g. "Reading Correspondence") instead of raw part index
    const partScores: { part: string; avg: number; count: number }[] = [];
    if (sec === "listening" || sec === "reading") {
      const partsData = sec === "listening" ? listeningParts : readingParts;
      const categoryMap = new Map<string, number[]>();
      sectionRecords
        .filter((r) => r.type === "quiz" && r.quizPart && r.quizPart !== "all")
        .forEach((r) => {
          const idx = Number(r.quizPart!);
          const partTitle = partsData[idx]?.title || "";
          // Extract category: "01 | 8 Questions | Reading Correspondence" → "Reading Correspondence"
          const pipeMatch = partTitle.match(/\d+\s*\|\s*(?:\d+\s*(?:Questions?|Tasks?)\s*\|\s*)?(.+)/);
          const category = pipeMatch ? pipeMatch[1] : `Part ${idx + 1}`;
          if (!categoryMap.has(category)) categoryMap.set(category, []);
          categoryMap.get(category)!.push(r.overallScore);
        });
      categoryMap.forEach((vals, category) => {
        partScores.push({
          part: category,
          avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
          count: vals.length,
        });
      });
      // Sort by average score descending so weakest is easy to spot
      partScores.sort((a, b) => a.avg - b.avg);
    }

    // Quiz score history (last 8 for sparkline)
    const sparkline = [...sectionRecords]
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-8)
      .map((r) => r.type === "full" ? (r.scores[sec] ?? 0) : r.overallScore);

    return { key: sec, count: sectionRecords.length, avg, best, trend, dimAvg, topWeaknesses, sparkline, partScores };
  });

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

      {/* Section Analytics */}
      {sectionStats.some((s) => s.count > 0) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {sectionStats.map((stat) => {
            const isExpanded = expandedSection === stat.key;
            const hasData = stat.count > 0;
            const sectionLabel = stat.key.charAt(0).toUpperCase() + stat.key.slice(1);
            const weakestPart = stat.partScores.length >= 2
              ? stat.partScores.reduce((min, p) => (p.avg < min.avg ? p : min), stat.partScores[0])
              : null;

            return (
              <div key={stat.key} className="flex flex-col gap-3">
                <Card
                  className={`border-2 rounded-2xl transition-all cursor-pointer ${
                    isExpanded ? "border-[#6b4c9a]" : "border-[#e2ddd5] hover:border-[#6b4c9a]/30"
                  } ${!hasData ? "opacity-50" : ""}`}
                  onClick={() => hasData && setExpandedSection(isExpanded ? null : stat.key)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${sectionColors[stat.key]}`} />
                      <span className="text-xs font-medium text-[#1a1a2e]">{sectionLabel}</span>
                      {stat.trend !== 0 && (
                        <span className={`text-[10px] font-bold ml-auto ${stat.trend > 0 ? "text-green-600" : "text-red-500"}`}>
                          {stat.trend > 0 ? "+" : ""}{stat.trend}
                        </span>
                      )}
                    </div>

                    {hasData ? (
                      <>
                        <p className={`text-2xl font-bold ${scoreColor(stat.avg)}`}>{stat.avg}<span className="text-xs font-normal text-[#6b6b7b]">/12</span></p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-[10px] text-[#6b6b7b]">Best: <strong className="text-[#1a1a2e]">{stat.best}</strong></span>
                          <span className="text-[10px] text-[#6b6b7b]">{stat.count} test{stat.count !== 1 ? "s" : ""}</span>
                        </div>

                        {/* Mini sparkline */}
                        {stat.sparkline.length >= 2 && (
                          <div className="flex items-end gap-px mt-2" style={{ height: 24 }}>
                            {stat.sparkline.map((v, i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-sm ${sectionColors[stat.key]} opacity-60`}
                                style={{ height: `${Math.max((v / 12) * 100, 8)}%` }}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-[#6b6b7b] mt-1">No tests yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Expanded detail panel */}
                {isExpanded && hasData && (
                  <Card className="border-2 border-[#6b4c9a]/20 rounded-2xl">
                    <CardContent className="pt-4 pb-4 space-y-3">
                      <p className="text-xs font-semibold text-[#1a1a2e]">{sectionLabel} Analysis</p>

                      {/* Per-category breakdown for listening/reading */}
                      {stat.partScores.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#6b6b7b] font-bold mb-1.5">By Category</p>
                          <div className="space-y-1.5">
                            {stat.partScores.map((p) => {
                              const isWeakest = weakestPart && p.part === weakestPart.part && stat.partScores.length >= 2;
                              return (
                                <div key={p.part} className="flex items-center gap-2">
                                  <span className={`text-[10px] ${isWeakest ? "text-red-500 font-medium" : "text-[#6b6b7b]"} w-28 shrink-0 truncate`} title={p.part}>
                                    {p.part}
                                  </span>
                                  <div className="flex-1 h-1.5 rounded-full bg-black/5">
                                    <div
                                      className={`h-full rounded-full ${isWeakest ? "bg-red-400" : sectionColors[stat.key]}`}
                                      style={{ width: `${(p.avg / 12) * 100}%` }}
                                    />
                                  </div>
                                  <span className={`text-[10px] font-bold w-6 text-right ${isWeakest ? "text-red-500" : scoreColor(p.avg)}`}>
                                    {p.avg}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          {weakestPart && (
                            <p className="text-[10px] text-red-500 mt-1.5 font-medium">
                              {weakestPart.part} needs the most work (avg {weakestPart.avg}/12)
                            </p>
                          )}
                        </div>
                      )}

                      {/* AI dimension breakdown for writing/speaking */}
                      {stat.dimAvg && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#6b6b7b] font-bold mb-1.5">AI Dimensions (avg of last 3)</p>
                          <div className="space-y-1.5">
                            {(["task_response", "coherence", "vocabulary", "grammar"] as const).map((dim) => {
                              const val = stat.dimAvg![dim];
                              const allDims = [stat.dimAvg!.task_response, stat.dimAvg!.coherence, stat.dimAvg!.vocabulary, stat.dimAvg!.grammar];
                              const isWeakest = val === Math.min(...allDims) && new Set(allDims).size > 1;
                              return (
                                <div key={dim} className="flex items-center gap-2">
                                  <span className="text-[10px] text-[#6b6b7b] w-20 shrink-0 capitalize">{dim.replace("_", " ")}</span>
                                  <div className="flex-1 h-1.5 rounded-full bg-black/5">
                                    <div
                                      className={`h-full rounded-full ${isWeakest ? "bg-red-400" : sectionColors[stat.key]}`}
                                      style={{ width: `${(val / 12) * 100}%` }}
                                    />
                                  </div>
                                  <span className={`text-[10px] font-bold w-6 text-right ${isWeakest ? "text-red-500" : scoreColor(val)}`}>
                                    {val}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Top weaknesses */}
                      {stat.topWeaknesses.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#6b6b7b] font-bold mb-1.5">Recurring Weaknesses</p>
                          <div className="flex flex-wrap gap-1">
                            {stat.topWeaknesses.map((w) => (
                              <span key={w} className="inline-block bg-red-50 text-red-600 rounded px-1.5 py-0.5 text-[10px]">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No AI data hint for listening/reading */}
                      {!stat.dimAvg && stat.partScores.length === 0 && (
                        <p className="text-[10px] text-[#6b6b7b]">
                          Complete more quizzes for individual parts to see a detailed breakdown.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
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
                        {aiScoresMap[r.id] && (
                          <button
                            onClick={() => setExpandedRecord(expandedRecord === r.id ? null : r.id)}
                            className="text-xs font-medium text-[#6b4c9a] hover:underline transition-colors"
                          >
                            {expandedRecord === r.id ? "Hide AI" : "AI Scores"}
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

                  {/* AI Score Breakdown */}
                  {expandedRecord === r.id && aiScoresMap[r.id] && (
                    <div className="mt-3 pt-3 border-t border-[#e2ddd5] space-y-3">
                      {aiScoresMap[r.id].map((ai) => (
                        <div key={`${ai.section}-${ai.task_id}`} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="text-[10px] bg-green-100 text-green-700 border-green-200">
                              AI {ai.section}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{ai.task_id}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {(["task_response", "coherence", "vocabulary", "grammar"] as const).map((dim) => {
                              const d = ai.scores[dim];
                              return (
                                <div key={dim} className="flex justify-between text-xs">
                                  <span className="capitalize">{dim.replace("_", " ")}</span>
                                  <span className={`font-medium ${scoreColor(d.score)}`}>{d.score}/12</span>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs">
                            <span className="font-medium">Overall:</span>{" "}
                            <span className={`font-bold ${scoreColor(ai.scores.overall)}`}>{ai.scores.overall}/12</span>
                            {ai.scores.clb_estimate && (
                              <span className="ml-2 text-muted-foreground">CLB {ai.scores.clb_estimate}</span>
                            )}
                          </p>
                          {ai.weaknesses?.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {ai.weaknesses.map((w, i) => (
                                <span key={i} className="inline-block bg-red-50 text-red-600 rounded px-1.5 py-0.5 mr-1 mb-1 text-[10px]">
                                  {w}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
