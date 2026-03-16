"use client";

import { useState, useMemo, use, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  listeningParts,
  readingParts,
  calculateCelpipScore,
  type Question,
} from "@/lib/celpip-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useHistory } from "@/lib/hooks/use-history";

interface QuizQuestion {
  question: Question;
  context?: string;
  contextLabel?: string;
  partTitle: string;
}

function buildQuestions(section: string, partParam: string): QuizQuestion[] {
  if (section === "listening") {
    const parts = partParam === "all" ? listeningParts : [listeningParts[Number(partParam)]];
    return parts.flatMap((p) =>
      p.questions.map((q) => ({
        question: q,
        context: p.transcript,
        contextLabel: "Transcript",
        partTitle: p.title,
      }))
    );
  }
  if (section === "reading") {
    const parts = partParam === "all" ? readingParts : [readingParts[Number(partParam)]];
    return parts.flatMap((p) =>
      p.questions.map((q) => ({
        question: q,
        context: p.passage,
        contextLabel: "Passage",
        partTitle: p.title,
      }))
    );
  }
  return [];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Component ──────────────────────────────────────────

export default function QuizPractice({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const partParam = searchParams.get("part") || "all";

  const questions = useMemo(
    () => buildQuestions(section, partParam),
    [section, partParam]
  );

  // 1 minute per question
  const totalTime = questions.length * 60;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [phase, setPhase] = useState<"quiz" | "review" | "finished">("quiz");
  const { addRecord } = useHistory();
  const [resultSaved, setResultSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (phase !== "quiz") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase("review");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const finishQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("review");
  }, []);

  if (questions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No questions found.</p>
      </main>
    );
  }

  const current = questions[currentIndex];
  const q = current.question;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const sectionLabel = section === "listening" ? "Listening" : "Reading";
  const sectionBadgeClass =
    section === "listening" ? "bg-blue-500 text-white" : "bg-emerald-500 text-white";

  const timerPct = (timeLeft / totalTime) * 100;
  const timerColor =
    timeLeft <= 60 ? "text-red-600" : timeLeft <= totalTime * 0.25 ? "text-yellow-600" : "text-[#1a1a2e]";

  // ── Compute results ──────────────────────────────────
  const computeResults = () => {
    let correct = 0;
    questions.forEach((qq, idx) => {
      if (answers[idx] === qq.question.correctAnswer) correct++;
    });
    return { correct, total: questions.length };
  };

  // ── Save result ──────────────────────────────────────
  const saveResult = (correct: number, total: number) => {
    if (resultSaved) return;
    const score = calculateCelpipScore(correct, total);
    addRecord({
      timestamp: Date.now(),
      type: "quiz",
      quizSection: section,
      quizPart: partParam,
      scores: {},
      details: { quiz: { correct, total } },
      overallScore: score,
    });
    setResultSaved(true);
  };

  // ── Review phase: show all answers ───────────────────
  if (phase === "review") {
    const { correct, total } = computeResults();
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    if (!resultSaved) saveResult(correct, total);

    return (
      <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
        {/* Summary header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-4">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={sectionBadgeClass}>{sectionLabel} Quiz</Badge>
              <span className="text-sm font-bold text-[#1a1a2e]">
                Results: {correct}/{total} correct ({pct}%)
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setPhase("finished")}
              >
                View Summary
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Question-by-question review */}
        <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
          {questions.map((qq, idx) => {
            const userAnswer = answers[idx] ?? -1;
            const isCorrect = userAnswer === qq.question.correctAnswer;
            const wasSkipped = userAnswer === -1;
            return (
              <Card
                key={idx}
                className={`border-2 rounded-2xl overflow-hidden ${
                  isCorrect ? "border-green-200" : wasSkipped ? "border-amber-200" : "border-red-200"
                }`}
              >
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCorrect ? "bg-green-100 text-green-700" : wasSkipped ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>
                      {idx + 1}
                    </span>
                    <Badge className={`text-[10px] border ${
                      isCorrect ? "bg-green-100 text-green-700 border-green-200"
                        : wasSkipped ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}>
                      {isCorrect ? "Correct" : wasSkipped ? "Skipped" : "Wrong"}
                    </Badge>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {qq.partTitle}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-[#1a1a2e] mb-3">{qq.question.question}</p>

                  <div className="space-y-1.5">
                    {qq.question.options.map((opt, optIdx) => {
                      let cls = "border-[#e2ddd5] bg-white";
                      if (optIdx === qq.question.correctAnswer) {
                        cls = "border-green-300 bg-green-50";
                      } else if (optIdx === userAnswer && !isCorrect) {
                        cls = "border-red-300 bg-red-50";
                      }
                      return (
                        <div key={optIdx} className={`flex items-center gap-2 p-2.5 rounded-lg border ${cls}`}>
                          <span className="text-xs font-bold w-5 text-center" style={{ color: "var(--muted-foreground)" }}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-sm flex-1">{opt}</span>
                          {optIdx === qq.question.correctAnswer && (
                            <span className="text-green-600 text-xs font-semibold">Correct</span>
                          )}
                          {optIdx === userAnswer && !isCorrect && optIdx !== qq.question.correctAnswer && (
                            <span className="text-red-600 text-xs font-semibold">Your answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    );
  }

  // ── Finished summary ─────────────────────────────────
  if (phase === "finished") {
    const { correct, total } = computeResults();
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <main className="min-h-screen bg-grid flex items-center justify-center px-4" style={{ backgroundColor: "var(--background)" }}>
        <Card className="w-full max-w-lg border-2 border-[#e2ddd5] rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Quiz Complete!</h2>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
              {sectionLabel} — {partParam === "all" ? "All Parts" : current.partTitle}
            </p>
            <div className="text-6xl font-bold mb-2">
              <span className={pct >= 70 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-600"}>
                {pct}%
              </span>
            </div>
            <p className="text-lg mb-6" style={{ color: "var(--muted-foreground)" }}>
              {correct} / {total} correct
            </p>
            <Progress value={pct} className="h-3 mb-8" />
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setCurrentIndex(0);
                  setAnswers({});
                  setTimeLeft(totalTime);
                  setPhase("quiz");
                  setResultSaved(false);
                }}
              >
                Retry
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setPhase("review");
                }}
              >
                Review Answers
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
              Question {currentIndex + 1} of {questions.length}
            </span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm font-medium text-[#1a1a2e]">
              {answeredCount}/{questions.length} answered
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e2ddd5] ${timerColor} font-mono text-sm font-bold`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatTime(timeLeft)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={finishQuiz}
            >
              Finish Quiz
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
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

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Context */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-2 border-[#e2ddd5] rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{current.partTitle}</CardTitle>
                {current.contextLabel && (
                  <p className="text-xs uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                    {current.contextLabel}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="bg-[#faf8f5] rounded-lg p-4 max-h-[calc(100vh-220px)] overflow-y-auto">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {current.context}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Question */}
          <div className="flex flex-col gap-4">
            <Card className="border-2 border-[#e2ddd5] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">
                  Question {currentIndex + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm leading-relaxed">{q.question}</p>
                <RadioGroup
                  key={currentIndex}
                  value={answers[currentIndex] !== undefined ? String(answers[currentIndex]) : ""}
                  onValueChange={(val) => {
                    setAnswers((prev) => ({ ...prev, [currentIndex]: Number(val) }));
                  }}
                >
                  {q.options.map((option, idx) => {
                    const isSelected = answers[currentIndex] === idx;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center space-x-3 py-2.5 px-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#6b4c9a] bg-purple-50"
                            : "border-[#e2ddd5] hover:border-[#6b4c9a]/50"
                        }`}
                      >
                        <RadioGroupItem value={String(idx)} id={`quiz-${idx}`} />
                        <Label
                          htmlFor={`quiz-${idx}`}
                          className="cursor-pointer text-sm leading-relaxed flex-1"
                        >
                          {String.fromCharCode(65 + idx)}. {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
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
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-[#6b4c9a] scale-125"
                        : answers[idx] !== undefined
                        ? "bg-[#6b4c9a]/40"
                        : "bg-[#e2ddd5]"
                    }`}
                    title={`Question ${idx + 1}${answers[idx] !== undefined ? " (answered)" : ""}`}
                  />
                ))}
              </div>

              {currentIndex < questions.length - 1 ? (
                <Button
                  className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                >
                  Next &rarr;
                </Button>
              ) : (
                <Button
                  className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white"
                  onClick={finishQuiz}
                >
                  Finish Quiz
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
