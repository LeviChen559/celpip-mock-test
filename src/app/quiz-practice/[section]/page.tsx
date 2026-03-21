"use client";

import { useState, useMemo, use, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { writingTasks, speakingTasks } from "@/lib/celpip-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useHistory } from "@/lib/hooks/use-history";
import { estimateWritingScore, estimateSpeakingScore } from "@/lib/celpip-data";

interface WritingFeedback {
  scoreExplanation: string;
  strengths: string[];
  improvements: string[];
  exampleResponse: string;
}

interface PracticeTask {
  id: string;
  title: string;
  instruction: string;
  prompt: string;
  minWords?: number;
  maxWords?: number;
  prepTime?: number;
  responseTime?: number;
}

function buildTasks(section: string, partParam: string): PracticeTask[] {
  if (section === "writing") {
    const tasks = partParam === "all" ? writingTasks : [writingTasks[Number(partParam)]];
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      instruction: t.instruction,
      prompt: t.prompt,
      minWords: t.minWords,
      maxWords: t.maxWords,
    }));
  }
  if (section === "speaking") {
    const tasks = partParam === "all" ? speakingTasks : [speakingTasks[Number(partParam)]];
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      instruction: t.instruction,
      prompt: t.prompt,
      prepTime: t.prepTime,
      responseTime: t.responseTime,
    }));
  }
  return [];
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function WritingSpeakingQuiz({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const partParam = searchParams.get("part") || "all";

  const tasks = useMemo(() => buildTasks(section, partParam), [section, partParam]);

  const isWriting = section === "writing";
  const isSpeaking = section === "speaking";

  // Time: writing = 27 min per task, speaking = prepTime + responseTime per task
  const totalTime = isWriting
    ? tasks.length * 27 * 60
    : tasks.reduce((sum, t) => sum + (t.prepTime || 30) + (t.responseTime || 60), 0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const { addRecord } = useHistory();
  const [resultSaved, setResultSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<number, WritingFeedback | null>>({});
  const [feedbackLoading, setFeedbackLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [finished]);

  if (tasks.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--muted-foreground)" }}>No tasks found.</p>
      </main>
    );
  }

  const current = tasks[currentIndex];
  const progress = ((currentIndex + 1) / tasks.length) * 100;
  const currentResponse = responses[currentIndex] || "";
  const wordCount = countWords(currentResponse);
  const answeredCount = Object.keys(responses).filter((k) => countWords(responses[Number(k)] || "") > 0).length;

  const sectionLabel = isWriting ? "Writing" : "Speaking";
  const sectionBadgeClass = isWriting ? "bg-purple-500 text-white" : "bg-pink-500 text-white";

  const timerPct = (timeLeft / totalTime) * 100;
  const timerColor =
    timeLeft <= 60 ? "text-red-600" : timeLeft <= totalTime * 0.25 ? "text-yellow-600" : "text-[#1a1a2e]";

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
  };

  const fetchFeedback = async (idx: number, task: PracticeTask, text: string, taskScore: number) => {
    if (feedbacks[idx] !== undefined || feedbackLoading[idx]) return;
    setFeedbackLoading((prev) => ({ ...prev, [idx]: true }));
    try {
      const res = await fetch("/api/writing-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: task.title,
          taskPrompt: task.prompt,
          userResponse: text,
          score: taskScore,
          minWords: task.minWords || 150,
          maxWords: task.maxWords || 200,
        }),
      });
      const data = await res.json();
      setFeedbacks((prev) => ({ ...prev, [idx]: res.ok ? data : null }));
    } catch {
      setFeedbacks((prev) => ({ ...prev, [idx]: null }));
    } finally {
      setFeedbackLoading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  // Compute scores
  const computeResults = () => {
    let totalScore = 0;
    tasks.forEach((task, idx) => {
      const text = responses[idx] || "";
      const wc = countWords(text);
      if (isWriting) {
        totalScore += estimateWritingScore(wc, task.minWords || 150, task.maxWords || 200);
      } else {
        totalScore += estimateSpeakingScore(wc);
      }
    });
    return Math.round(totalScore / tasks.length);
  };

  // Save result
  const saveResult = (score: number) => {
    if (resultSaved) return;
    addRecord({
      timestamp: Date.now(),
      type: "quiz",
      quizSection: section,
      quizPart: partParam,
      scores: isWriting ? { writing: score } : { speaking: score },
      details: {
        responses: Object.fromEntries(
          tasks.map((t, i) => [i, { title: t.title, prompt: t.prompt, text: responses[i] || "" }])
        ),
        feedbacks: Object.fromEntries(
          Object.entries(feedbacks).filter(([, v]) => v != null)
        ),
      },
      overallScore: score,
    });
    setResultSaved(true);
  };

  // ── Finished ──────────────────────────────────────────
  if (finished) {
    const score = computeResults();
    if (!resultSaved) saveResult(score);

    return (
      <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-4">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={sectionBadgeClass}>{sectionLabel} Quiz</Badge>
              <span className="text-sm font-bold text-[#1a1a2e]">
                Estimated Score: {score}/12
              </span>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-8">
          {/* Summary card */}
          <Card className="border-2 border-[#e2ddd5] rounded-2xl mb-6">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Quiz Complete!</h2>
              <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
                {sectionLabel} — {partParam === "all" ? "All Tasks" : current.title}
              </p>
              <p className={`text-6xl font-bold mb-2 ${score >= 8 ? "text-green-600" : score >= 6 ? "text-yellow-600" : "text-red-600"}`}>
                {score}
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
                Estimated PugPIP Score (out of 12)
              </p>
              <Progress value={(score / 12) * 100} className="h-3 max-w-xs mx-auto mb-6" />
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setCurrentIndex(0);
                    setResponses({});
                    setTimeLeft(totalTime);
                    setFinished(false);
                    setResultSaved(false);
                  }}
                >
                  Retry
                </Button>
                <Button
                  className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Response review */}
          <div className="space-y-4">
            {tasks.map((task, idx) => {
              const text = responses[idx] || "";
              const wc = countWords(text);
              const taskScore = isWriting
                ? estimateWritingScore(wc, task.minWords || 150, task.maxWords || 200)
                : estimateSpeakingScore(wc);
              const fb = feedbacks[idx];
              const isLoadingFb = feedbackLoading[idx];
              return (
                <Card key={idx} className="border-2 border-[#e2ddd5] rounded-2xl">
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isWriting ? "bg-purple-100 text-purple-700" : "bg-pink-100 text-pink-700"
                      }`}>
                        {idx + 1}
                      </span>
                      <p className="text-sm font-bold text-[#1a1a2e]">{task.title}</p>
                      <Badge className={`ml-auto border text-[10px] ${
                        taskScore >= 8 ? "bg-green-100 text-green-700 border-green-200"
                          : taskScore >= 6 ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}>
                        Score: {taskScore}/12
                      </Badge>
                    </div>
                    <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>
                      {wc} words {isWriting && task.minWords ? `(target: ${task.minWords}–${task.maxWords})` : ""}
                    </p>
                    {text ? (
                      <div className="bg-[#faf8f5] rounded-lg p-3 text-sm whitespace-pre-wrap">
                        {text}
                      </div>
                    ) : (
                      <p className="text-sm italic" style={{ color: "var(--muted-foreground)" }}>
                        No response submitted.
                      </p>
                    )}

                    {/* AI Feedback for writing tasks */}
                    {isWriting && text && (
                      <div className="mt-4">
                        {!fb && !isLoadingFb && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs border-[#6b4c9a] text-[#6b4c9a] hover:bg-purple-50"
                            onClick={() => fetchFeedback(idx, task, text, taskScore)}
                          >
                            Get AI Feedback &rarr;
                          </Button>
                        )}
                        {isLoadingFb && (
                          <div className="flex items-center gap-2 text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
                            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Analyzing your response…
                          </div>
                        )}
                        {fb && (
                          <div className="mt-3 space-y-4">
                            {/* Why this score */}
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Why Score {taskScore}/12?</p>
                              <p className="text-sm text-amber-900">{fb.scoreExplanation}</p>
                            </div>

                            {/* Strengths & Improvements */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Strengths</p>
                                <ul className="space-y-1">
                                  {fb.strengths.map((s, i) => (
                                    <li key={i} className="flex gap-1.5 text-sm text-green-900">
                                      <span className="mt-0.5 text-green-500">&#10003;</span>
                                      {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">To Reach 9–10</p>
                                <ul className="space-y-1">
                                  {fb.improvements.map((imp, i) => (
                                    <li key={i} className="flex gap-1.5 text-sm text-blue-900">
                                      <span className="mt-0.5 text-blue-400">&#8594;</span>
                                      {imp}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Example 9-10 response */}
                            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">Example 9–10 Response</p>
                              <div className="text-sm text-purple-900 whitespace-pre-wrap leading-relaxed">
                                {fb.exampleResponse}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // ── Quiz phase ───────────────────────────────────────
  return (
    <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={sectionBadgeClass}>{sectionLabel} Quiz</Badge>
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Task {currentIndex + 1} of {tasks.length}
            </span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm font-medium text-[#1a1a2e]">
              {answeredCount}/{tasks.length} completed
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e2ddd5] ${timerColor} font-mono text-sm font-bold`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatTime(timeLeft)}
            </div>
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleFinish}>
              Finish Quiz
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              Quit
            </Button>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto mt-2 flex gap-2 items-center">
          <Progress value={progress} className="h-2 flex-1" />
          <div className="w-20">
            <Progress value={timerPct} className="h-1.5" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Prompt */}
        <Card className="border-2 border-[#e2ddd5] rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{current.title}</CardTitle>
            <p className="text-xs uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
              {current.instruction}
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-[#faf8f5] rounded-lg p-4">
              <p className="text-sm leading-relaxed whitespace-pre-line">{current.prompt}</p>
            </div>
            {isWriting && current.minWords && (
              <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
                Target: {current.minWords}–{current.maxWords} words
              </p>
            )}
            {isSpeaking && (
              <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
                Prep: {current.prepTime}s | Response: {current.responseTime}s (type your response below)
              </p>
            )}
          </CardContent>
        </Card>

        {/* Response area */}
        <Card className="border-2 border-[#e2ddd5] rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Your Response</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={currentResponse}
              onChange={(e) => setResponses((prev) => ({ ...prev, [currentIndex]: e.target.value }))}
              placeholder={isWriting ? "Write your response here..." : "Type what you would say..."}
              className="w-full min-h-[300px] border border-[#e2ddd5] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#6b4c9a] transition-colors resize-y"
            />
            <div className="flex items-center justify-between mt-2">
              <p className={`text-xs font-medium ${
                isWriting && current.minWords
                  ? wordCount >= current.minWords && wordCount <= (current.maxWords || 200)
                    ? "text-green-600"
                    : wordCount > 0 ? "text-yellow-600" : ""
                  : ""
              }`} style={wordCount === 0 ? { color: "var(--muted-foreground)" } : undefined}>
                {wordCount} words
              </p>
              {isWriting && current.minWords && wordCount > 0 && (
                <Progress
                  value={Math.min((wordCount / (current.maxWords || 200)) * 100, 100)}
                  className="h-1.5 w-24"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="rounded-full"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            &larr; Previous
          </Button>

          <div className="flex gap-1.5">
            {tasks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? "bg-[#6b4c9a] scale-125"
                    : countWords(responses[idx] || "") > 0
                    ? "bg-[#6b4c9a]/40"
                    : "bg-[#e2ddd5]"
                }`}
                title={`Task ${idx + 1}`}
              />
            ))}
          </div>

          {currentIndex < tasks.length - 1 ? (
            <Button
              className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              Next &rarr;
            </Button>
          ) : (
            <Button
              className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
              onClick={handleFinish}
            >
              Finish Quiz
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
