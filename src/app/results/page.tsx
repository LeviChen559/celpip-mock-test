"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  listeningPartsOfficial as listeningParts,
  readingPartsOfficial as readingParts,
  writingTasksOfficial as writingTasks,
  speakingTasksOfficial as speakingTasks,
  calculateCelpipScore,
  estimateWritingScore,
  estimateSpeakingScore,
} from "@/lib/celpip-data";
import { getTestState, resetTestState, PracticeSection } from "@/lib/test-store";
import { useHistory } from "@/lib/hooks/use-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import type { WritingEvaluationScores, WritingEvaluationImprovement } from "@/lib/prompts/writing-evaluation";

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function getScoreLabel(score: number): string {
  if (score >= 10) return "Advanced";
  if (score >= 8) return "Upper Intermediate";
  if (score >= 6) return "Intermediate";
  if (score >= 4) return "Lower Intermediate";
  return "Beginner";
}

function getScoreColor(score: number): string {
  if (score >= 10) return "text-green-600";
  if (score >= 8) return "text-blue-600";
  if (score >= 6) return "text-yellow-600";
  return "text-red-600";
}

interface SectionResult {
  name: string;
  score: number;
  detail: string;
  color: string;
}

interface AiScoreResult {
  id: string | null;
  scores: WritingEvaluationScores;
  weaknesses: string[];
  improvements: WritingEvaluationImprovement[];
  high_score_sample: string;
  practice_tasks: string[];
}

export default function Results() {
  const router = useRouter();
  const { addRecord } = useHistory();
  const addRecordRef = useRef(addRecord);
  addRecordRef.current = addRecord;
  const [mounted, setMounted] = useState(false);
  const [practiceMode, setPracticeMode] = useState<PracticeSection>(null);
  const [sections, setSections] = useState<SectionResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [aiScoring, setAiScoring] = useState(false);
  const [aiScores, setAiScores] = useState<Record<string, AiScoreResult>>({});
  const [aiError, setAiError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    const state = getTestState();
    setPracticeMode(state.practiceMode);

    // Listening
    const allListeningQuestions = listeningParts.flatMap((p) => p.questions);
    const listeningTotal = allListeningQuestions.length;
    let listeningCorrect = 0;
    allListeningQuestions.forEach((q) => {
      if (state.listeningAnswers[q.id] === q.correctAnswer) {
        listeningCorrect++;
      }
    });
    const listeningScore = calculateCelpipScore(listeningCorrect, listeningTotal);

    // Reading
    const allReadingQuestions = readingParts.flatMap((p) => p.questions);
    const readingTotal = allReadingQuestions.length;
    let readingCorrect = 0;
    allReadingQuestions.forEach((q) => {
      if (state.readingAnswers[q.id] === q.correctAnswer) {
        readingCorrect++;
      }
    });
    const readingScore = calculateCelpipScore(readingCorrect, readingTotal);

    // Writing
    let writingScoreSum = 0;
    writingTasks.forEach((task) => {
      const text = state.writingResponses[task.id] || "";
      writingScoreSum += estimateWritingScore(
        countWords(text),
        task.minWords,
        task.maxWords
      );
    });
    const writingScore = Math.round(writingScoreSum / writingTasks.length);

    // Speaking
    let speakingScoreSum = 0;
    speakingTasks.forEach((task) => {
      const text = state.speakingResponses[task.id] || "";
      speakingScoreSum += estimateSpeakingScore(countWords(text));
    });
    const speakingScore = Math.round(speakingScoreSum / speakingTasks.length);

    const allSections: SectionResult[] = [
      {
        name: "Listening",
        score: listeningScore,
        detail: `${listeningCorrect}/${listeningTotal} correct`,
        color: "bg-blue-500",
      },
      {
        name: "Reading",
        score: readingScore,
        detail: `${readingCorrect}/${readingTotal} correct`,
        color: "bg-emerald-500",
      },
      {
        name: "Writing",
        score: writingScore,
        detail: "Estimated based on word count",
        color: "bg-amber-500",
      },
      {
        name: "Speaking",
        score: speakingScore,
        detail: "Estimated based on response length",
        color: "bg-purple-500",
      },
    ];

    // Filter to only the practiced section if in practice mode
    const sectionMap: Record<string, string> = {
      listening: "Listening",
      reading: "Reading",
      writing: "Writing",
      speaking: "Speaking",
    };

    const displayed = state.practiceMode
      ? allSections.filter((s) => s.name === sectionMap[state.practiceMode!])
      : allSections;

    setSections(displayed);

    const avg = displayed.reduce((sum, s) => sum + s.score, 0) / displayed.length;
    const finalScore = Math.round(avg);
    setOverallScore(finalScore);

    // Save to history and trigger AI scoring
    const saveAndScore = async () => {
      if (state.resultSaved) {
        setMounted(true);
        return;
      }

      const record = {
        timestamp: Date.now(),
        type: (state.practiceMode ? "section" : "full") as "full" | "section",
        section: state.practiceMode || undefined,
        scores: {
          listening: listeningScore,
          reading: readingScore,
          writing: writingScore,
          speaking: speakingScore,
        },
        details: {
          listening: { correct: listeningCorrect, total: listeningTotal },
          reading: { correct: readingCorrect, total: readingTotal },
          answers: {
            listening: state.listeningAnswers,
            reading: state.readingAnswers,
          },
        },
        overallScore: finalScore,
      };
      await addRecordRef.current(record);

      // Mark as saved
      const raw = localStorage.getItem("celpip-test-state");
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.resultSaved = true;
        localStorage.setItem("celpip-test-state", JSON.stringify(parsed));
      }

      setMounted(true);

      // Fire AI scoring asynchronously (don't block page render)
      triggerAiScoring(state);
    };

    setMounted(true);
    saveAndScore();

    async function triggerAiScoring(testState: typeof state) {
      setAiScoring(true);
      setAiError(null);
      const results: Record<string, AiScoreResult> = {};

      // Check if user is authenticated
      try {
        const authCheck: Response = await fetch("/api/ai/goal");
        if (!authCheck.ok) {
          setAiScoring(false);
          return; // Not authenticated
        }
      } catch {
        setAiScoring(false);
        return;
      }

      // Score writing tasks
      if (!testState.practiceMode || testState.practiceMode === "writing") {
        for (const task of writingTasks) {
          const text = testState.writingResponses[task.id] || "";
          if (countWords(text) < 10) continue;
          try {
            const writeRes: Response = await fetch("/api/ai/score", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                section: "writing",
                task_id: task.id,
                task_type: task.title,
                user_response: text,
                target_score: 8,
              }),
            });
            if (writeRes.ok) {
              const writeData: AiScoreResult = await writeRes.json();
              results[`writing-${task.id}`] = writeData;
              setSections((prev) =>
                prev.map((s) =>
                  s.name === "Writing"
                    ? {
                        ...s,
                        score: Math.round(writeData.scores.overall),
                        detail: `AI-evaluated: Task ${writeData.scores.task_response.score}, Coherence ${writeData.scores.coherence.score}, Vocab ${writeData.scores.vocabulary.score}, Grammar ${writeData.scores.grammar.score}`,
                      }
                    : s
                )
              );
            } else if (writeRes.status === 429) {
              setAiError("Monthly AI limit reached. Showing word-count estimate.");
              break;
            }
          } catch {
            // Fall back to word-count estimate silently
          }
        }
      }

      // Score speaking tasks
      if (!testState.practiceMode || testState.practiceMode === "speaking") {
        for (const task of speakingTasks) {
          const text = testState.speakingResponses[task.id] || "";
          if (countWords(text) < 10) continue;
          try {
            const speakRes: Response = await fetch("/api/ai/score", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                section: "speaking",
                task_id: task.id,
                task_type: task.title,
                user_response: text,
                target_score: 8,
              }),
            });
            if (speakRes.ok) {
              const speakData: AiScoreResult = await speakRes.json();
              results[`speaking-${task.id}`] = speakData;
              setSections((prev) =>
                prev.map((s) =>
                  s.name === "Speaking"
                    ? {
                        ...s,
                        score: Math.round(speakData.scores.overall),
                        detail: `AI-evaluated: Task ${speakData.scores.task_response.score}, Coherence ${speakData.scores.coherence.score}, Vocab ${speakData.scores.vocabulary.score}, Grammar ${speakData.scores.grammar.score}`,
                      }
                    : s
                )
              );
            } else if (speakRes.status === 429) {
              setAiError("Monthly AI limit reached. Showing word-count estimate.");
              break;
            }
          } catch {
            // Fall back silently
          }
        }
      }

      setAiScores(results);
      setAiScoring(false);

      // Trigger diagnostics in background
      if (Object.keys(results).length > 0) {
        const scoredSections = new Set(Object.keys(results).map((k) => k.split("-")[0]));
        scoredSections.forEach((sec) => {
          fetch("/api/ai/diagnose", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: sec }),
          }).catch(() => {});
        });
      }
    }
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Calculating results...</p>
      </main>
    );
  }

  const isPractice = practiceMode !== null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">
            {isPractice
              ? `${sections[0]?.name} Practice Results`
              : "Your Results"}
          </h1>
          <p className="text-muted-foreground">
            {isPractice
              ? "Single section practice score"
              : "PugPIP Score Report"}
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {isPractice ? "Section Score" : "Overall Estimated Score"}
            </p>
            <p
              className={`text-6xl font-bold ${getScoreColor(overallScore)}`}
            >
              {overallScore}
            </p>
            <p className="text-lg font-medium mt-1">
              {getScoreLabel(overallScore)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              CELPIP scores range from M (minimal) to 12 (advanced)
            </p>
          </CardContent>
        </Card>

        <div className={`grid ${sections.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : "md:grid-cols-2"} gap-4 mb-8`}>
          {sections.map((section) => {
            const sectionKey = section.name.toLowerCase();
            const aiKeys = Object.keys(aiScores).filter((k) => k.startsWith(sectionKey));
            const hasAi = aiKeys.length > 0;
            const isExpanded = expandedSection === section.name;

            return (
              <Card key={section.name} className="relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${section.color}`}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{section.name}</CardTitle>
                    {aiScoring && (sectionKey === "writing" || sectionKey === "speaking") && !hasAi && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] animate-pulse">
                        AI Scoring...
                      </Badge>
                    )}
                    {hasAi && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                        AI Evaluated
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 mb-2">
                    <span
                      className={`text-4xl font-bold ${getScoreColor(
                        section.score
                      )}`}
                    >
                      {section.score}
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">
                      / 12
                    </span>
                  </div>
                  <Progress value={(section.score / 12) * 100} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {section.detail}
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {getScoreLabel(section.score)}
                  </Badge>

                  {hasAi && (
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : section.name)}
                      className="block mt-3 text-xs font-medium text-[#6b4c9a] hover:underline"
                    >
                      {isExpanded ? "Hide breakdown" : "Show AI breakdown"}
                    </button>
                  )}

                  {isExpanded && aiKeys.map((key) => {
                    const ai = aiScores[key];
                    return (
                      <div key={key} className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        {/* Dimension scores */}
                        <div className="grid grid-cols-2 gap-2">
                          {(["task_response", "coherence", "vocabulary", "grammar"] as const).map((dim) => {
                            const d = ai.scores[dim];
                            return (
                              <div key={dim} className="text-xs">
                                <div className="flex justify-between mb-0.5">
                                  <span className="capitalize font-medium">{dim.replace("_", " ")}</span>
                                  <span className={getScoreColor(d.score)}>{d.score}/12</span>
                                </div>
                                <Progress value={(d.score / 12) * 100} className="h-1" />
                                <p className="text-[10px] text-muted-foreground mt-0.5">{d.comment}</p>
                              </div>
                            );
                          })}
                        </div>

                        {ai.scores.clb_estimate && (
                          <p className="text-xs">
                            <span className="font-medium">CLB Estimate:</span>{" "}
                            <span className="text-[#6b4c9a] font-bold">{ai.scores.clb_estimate}</span>
                          </p>
                        )}

                        {/* Weaknesses */}
                        {ai.weaknesses?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-1">Key Weaknesses:</p>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {ai.weaknesses.map((w, i) => (
                                <li key={i} className="flex gap-1">
                                  <span className="text-red-400 shrink-0">-</span>
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Improvements */}
                        {ai.improvements?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-1">How to Improve:</p>
                            <div className="space-y-1.5">
                              {ai.improvements.map((imp, i) => (
                                <div key={i} className="text-xs bg-gray-50 dark:bg-gray-900 rounded p-2">
                                  <p className="font-medium text-red-600">{imp.issue}</p>
                                  <p className="text-muted-foreground">{imp.fix}</p>
                                  {imp.example && (
                                    <p className="text-green-700 dark:text-green-400 italic mt-0.5">&ldquo;{imp.example}&rdquo;</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* High score sample */}
                        {ai.high_score_sample && (
                          <details className="text-xs">
                            <summary className="font-medium cursor-pointer text-[#6b4c9a]">
                              View Band 10-12 Example
                            </summary>
                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded p-2">
                              {ai.high_score_sample}
                            </p>
                          </details>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI scoring status */}
        {aiScoring && (
          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-purple-800 dark:text-purple-200 flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              AI is evaluating your writing and speaking responses. Scores will update automatically.
            </p>
          </div>
        )}

        {aiError && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-amber-800 dark:text-amber-200">{aiError}</p>
          </div>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Score Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between py-1">
                <span>10-12</span>
                <span className="text-green-600 font-medium">Advanced</span>
              </div>
              <div className="flex justify-between py-1">
                <span>8-9</span>
                <span className="text-blue-600 font-medium">Upper Intermediate</span>
              </div>
              <div className="flex justify-between py-1">
                <span>6-7</span>
                <span className="text-yellow-600 font-medium">Intermediate</span>
              </div>
              <div className="flex justify-between py-1">
                <span>4-5</span>
                <span className="text-orange-600 font-medium">Lower Intermediate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {(sections.some((s) => s.name === "Writing") || sections.some((s) => s.name === "Speaking")) && Object.keys(aiScores).length === 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Writing and speaking scores are estimated
              based on response length only. In the actual CELPIP test, these
              sections are scored by trained raters who evaluate content,
              coherence, vocabulary, and grammar.
            </p>
          </div>
        )}

        <Separator className="my-6" />

        <div className="flex justify-center gap-4">
          {isPractice && (
            <Button
              variant="outline"
              onClick={() => {
                resetTestState();
                router.push(
                  `/test/${practiceMode}`
                );
              }}
            >
              Retry This Section
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              resetTestState();
              router.push("/");
            }}
          >
            {isPractice ? "Practice Another Section" : "Take Another Test"}
          </Button>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    </main>
  );
}
