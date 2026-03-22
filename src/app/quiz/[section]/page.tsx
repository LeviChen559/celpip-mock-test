"use client";

import { useState, useMemo, use, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  listeningParts,
  readingParts,
  calculateCelpipScore,
  type Question,
} from "@/lib/celpip-data";
import { useHistory } from "@/lib/hooks/use-history";
import { useAuth } from "@/lib/hooks/use-auth";
import { useShuffleMap, shuffledOptions, toOriginalIndex, toShuffledIndex } from "@/lib/shuffle-options";
import TranscriptAudioPlayer from "@/components/TranscriptAudioPlayer";
import ReadingPassageRenderer from "@/components/ReadingPassageRenderer";
import RedFlagButton from "@/components/RedFlagButton";

interface QuizQuestion {
  question: Question;
  context?: string;
  contextLabel?: string;
  partTitle: string;
  partId?: string;
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
        partId: p.id,
      }))
    );
  }
  if (section === "reading") {
    const parts = partParam === "all" ? readingParts : [readingParts[Number(partParam)]];
    return parts.flatMap((p) =>
      p.questions.map((q) => ({
        question: q,
        context: q.passage || p.passage,
        contextLabel: "Passage",
        partTitle: p.title,
        partId: p.id,
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

// ── Circular timer ring ──────────────────────────────
function TimerRing({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const pct = totalTime > 0 ? timeLeft / totalTime : 0;
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const isWarning = timeLeft <= totalTime * 0.25 && timeLeft > 60;
  const isCritical = timeLeft <= 60;

  const strokeColor = isCritical
    ? "var(--quiz-terra)"
    : isWarning
    ? "#d4a843"
    : "var(--quiz-copper)";

  const textColor = isCritical
    ? "text-[var(--quiz-terra)]"
    : isWarning
    ? "text-yellow-700"
    : "text-[var(--quiz-ink)]";

  const pulseClass = isCritical
    ? "quiz-timer-critical"
    : isWarning
    ? "quiz-timer-warning"
    : "";

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-[var(--quiz-border)] shrink-0 ${pulseClass}`}>
      <svg width="30" height="30" viewBox="0 0 30 30" className="shrink-0 -rotate-90">
        <circle
          cx="15" cy="15" r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="2.5"
        />
        <circle
          cx="15" cy="15" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
        />
      </svg>
      <span className={`font-mono text-xs sm:text-sm font-bold tracking-tight ${textColor}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

// ── Progress dots ────────────────────────────────────
function ProgressDots({
  total,
  current,
  answers,
  onSelect,
}: {
  total: number;
  current: number;
  answers: Record<number, number>;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, idx) => {
        const isActive = idx === current;
        const isAnswered = answers[idx] !== undefined;
        return (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`rounded-full transition-all duration-300 ${
              isActive
                ? "w-6 h-2.5 bg-[var(--quiz-copper)] quiz-dot-active"
                : isAnswered
                ? "w-2.5 h-2.5 bg-[var(--quiz-copper)]/50"
                : "w-2.5 h-2.5 bg-black/10 hover:bg-black/20"
            }`}
            title={`Question ${idx + 1}${isAnswered ? " (answered)" : ""}`}
          />
        );
      })}
    </div>
  );
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
  const { currentUser } = useAuth();

  const ctaLabel = currentUser ? "Dashboard" : "Get Started";
  const ctaHref = currentUser ? "/dashboard" : "/signup";

  const partParam = searchParams.get("part") || "all";

  const questions = useMemo(
    () => buildQuestions(section, partParam),
    [section, partParam]
  );

  const allQuestionsFlat = useMemo(
    () => questions.map((qq) => qq.question),
    [questions]
  );
  const shuffleMap = useShuffleMap(allQuestionsFlat);

  // Check if this part is paid content and user lacks access
  const isPaidContent = useMemo(() => {
    if (section !== "reading" || partParam === "all") return false;
    const part = readingParts[Number(partParam)];
    return part?.paid === true;
  }, [section, partParam]);

  const userRole = currentUser?.role || "subscriber";
  const hasPaidAccess = userRole === "admin" || userRole === "teacher";

  // Reading: 1 minute per question global timer. Listening: 30s per question.
  const LISTENING_QUESTION_TIME = 30;
  const totalTime = questions.length * 60;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(section === "listening" ? LISTENING_QUESTION_TIME : totalTime);
  const [phase, setPhase] = useState<"quiz" | "review" | "finished">("quiz");
  const { addRecord } = useHistory();
  const [resultSaved, setResultSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [slideKey, setSlideKey] = useState(0);
  const [audioFinishedParts, setAudioFinishedParts] = useState<Set<string>>(new Set());
  const [questionSpoken, setQuestionSpoken] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

  // Reading: global countdown timer
  useEffect(() => {
    if (section === "listening") return;
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
  }, [phase, section]);

  // Listening: per-question 30s countdown — only ticks when on questions step (audio finished)
  const listeningTimerActiveRef = useRef(false);
  useEffect(() => {
    if (section !== "listening") return;
    if (phase !== "quiz") return;

    // Determine if current part audio has finished
    const currentPartId = questions[currentIndex]?.partId;
    const audioFinished = currentPartId ? audioFinishedParts.has(currentPartId) : true;
    listeningTimerActiveRef.current = audioFinished;

    if (!audioFinished || !questionSpoken) return;

    // Reset timer for this question
    setTimeLeft(LISTENING_QUESTION_TIME);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-advance to next question or finish
          if (currentIndex < questions.length - 1) {
            setCurrentIndex((ci) => ci + 1);
            setSlideKey((k) => k + 1);
          } else {
            setPhase("review");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, phase, currentIndex, audioFinishedParts, questionSpoken]);

  const finishQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPhase("review");
  }, []);

  const goToQuestion = useCallback((idx: number) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setQuestionSpoken(false);
    setIsSpeakingQuestion(false);
    setCurrentIndex(idx);
    setSlideKey((k) => k + 1);
  }, []);

  const handleAudioEnded = useCallback((partId: string) => {
    setAudioFinishedParts((prev) => new Set(prev).add(partId));
  }, []);

  const speakQuestion = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setQuestionSpoken(true);
      setIsSpeakingQuestion(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => {
      setQuestionSpoken(true);
      setIsSpeakingQuestion(false);
    };
    utterance.onerror = () => {
      setQuestionSpoken(true);
      setIsSpeakingQuestion(false);
    };
    setIsSpeakingQuestion(true);
    setQuestionSpoken(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Trigger speech when audio finishes for listening questions
  useEffect(() => {
    if (section !== "listening") return;
    if (phase !== "quiz") return;
    const currentPartId = questions[currentIndex]?.partId;
    const audioFinished = currentPartId ? audioFinishedParts.has(currentPartId) : true;
    if (!audioFinished) return;

    const questionText = questions[currentIndex]?.question.question;
    if (questionText) {
      speakQuestion(questionText);
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, phase, currentIndex, audioFinishedParts, speakQuestion]);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (questions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center quiz-page">
        <p className="text-[var(--quiz-ink)]/50 font-serif text-lg">No questions found.</p>
      </main>
    );
  }

  if (isPaidContent && !hasPaidAccess) {
    return (
      <main className="min-h-screen quiz-page flex items-center justify-center px-6" style={{ backgroundColor: "var(--quiz-parchment)" }}>
        <div className="quiz-card w-full max-w-md">
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--quiz-copper)]/10 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--quiz-copper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold text-[var(--quiz-ink)] mb-2">Premium Content</h2>
            <p className="text-sm text-[var(--quiz-ink)]/50 mb-6 leading-relaxed">
              This quiz is part of our Pro collection. Upgrade your account to access all premium practice materials.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-2.5 text-sm font-semibold rounded-lg bg-[var(--quiz-copper)] text-white hover:bg-[var(--quiz-copper-light)] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  const current = questions[currentIndex];
  const q = current.question;
  const answeredCount = Object.keys(answers).length;
  const sectionLabel = section === "listening" ? "Listening" : "Reading";

  // In the real CELPIP, ALL reading parts show all questions at once with dropdown selects
  const isReadingAllAtOnce = section === "reading" && questions.length > 0;

  // In the real CELPIP, listening Parts 4-6 use fill-in-blank dropdowns (all questions at once)
  const isListeningDropdown = section === "listening" && questions.length > 0
    && questions.every(qq => qq.question.question.includes("___"));

  // Gather all unique passages for the reading section (e.g. Part 1 has two emails)
  const readingPassages = useMemo(() => {
    if (!isReadingAllAtOnce) return [];
    const seen = new Set<string>();
    const passages: string[] = [];
    for (const qq of questions) {
      const ctx = qq.context || "";
      if (ctx && !seen.has(ctx)) {
        seen.add(ctx);
        passages.push(ctx);
      }
    }
    return passages;
  }, [isReadingAllAtOnce, questions]);

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
      details: {
        quiz: { correct, total },
        answers: {
          quiz: Object.fromEntries(
            questions.map((qq, idx) => [qq.question.id, answers[idx] ?? -1])
          ),
        },
      },
      overallScore: score,
    });
    setResultSaved(true);
  };

  // ── Review phase ───────────────────────────────────
  if (phase === "review") {
    const { correct, total } = computeResults();
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    if (!resultSaved) saveResult(correct, total);

    return (
      <main className="min-h-screen quiz-page" style={{ backgroundColor: "var(--quiz-parchment)" }}>
        {/* Review header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md quiz-header-line">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Icon + title */}
              <span className="w-7 h-7 rounded-lg bg-[#b8703b] flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </span>
              <span className="font-serif text-base font-bold text-[#1a1a2e] shrink-0">
                Review
              </span>

              {/* Score */}
              <span className="text-xs text-[#1a1a2e]/50 font-medium shrink-0">
                {correct}/{total} ({pct}%)
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Actions */}
              {!currentUser && (
                <button
                  onClick={() => router.push("/")}
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-black/[0.06] text-[#1a1a2e] hover:bg-[#f5f0e8] transition-colors shrink-0"
                >
                  Home
                </button>
              )}
              <button
                onClick={() => setPhase("finished")}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-black/[0.06] text-[#1a1a2e] hover:bg-[#f5f0e8] transition-colors shrink-0"
              >
                Summary
              </button>
              <button
                onClick={() => router.push(ctaHref)}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-[#b8703b] text-white hover:bg-[#d4884e] transition-colors shrink-0"
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Question-by-question review */}
        <div className="max-w-3xl mx-auto px-2 sm:px-6 py-8 sm:py-10 space-y-5">
          {questions.map((qq, idx) => {
            const userAnswer = answers[idx] ?? -1;
            const isCorrect = userAnswer === qq.question.correctAnswer;
            const wasSkipped = userAnswer === -1;

            const statusColor = isCorrect ? "sage" : wasSkipped ? "amber" : "terra";
            const statusBg = isCorrect ? "bg-[#e8f0eb]" : wasSkipped ? "bg-amber-50" : "bg-[#faeae8]";
            const statusText = isCorrect ? "text-[#3d7a5f]" : wasSkipped ? "text-amber-700" : "text-[#c4493c]";

            return (
              <div
                key={idx}
                className="quiz-card quiz-review-card"
                style={{ animationDelay: `${Math.min(idx * 0.06, 0.6)}s` }}
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                  isCorrect ? "bg-[#3d7a5f]" : wasSkipped ? "bg-amber-400" : "bg-[#c4493c]"
                }`} />

                <div className="p-5 pl-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${statusBg} ${statusText}`}>
                      {idx + 1}
                    </span>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${statusBg} ${statusText}`}>
                      {isCorrect ? "Correct" : wasSkipped ? "Skipped" : "Incorrect"}
                    </span>
                    <span className="text-xs text-[#1a1a2e]/40 ml-auto">
                      {qq.partTitle}
                    </span>
                    <RedFlagButton questionId={qq.question.id} section={section} />
                  </div>

                  <p className="text-sm font-medium text-[#1a1a2e] mb-4 leading-relaxed">{qq.question.question}</p>

                  <div className="space-y-2">
                    {qq.question.options.map((opt, optIdx) => {
                      const isCorrectOption = optIdx === qq.question.correctAnswer;
                      const isUserWrong = optIdx === userAnswer && !isCorrect;
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm ${
                            isCorrectOption
                              ? "border-[#3d7a5f]/30 bg-[#e8f0eb]"
                              : isUserWrong
                              ? "border-[#c4493c]/30 bg-[#faeae8]"
                              : "border-transparent bg-black/[0.02]"
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isCorrectOption
                              ? "bg-[#3d7a5f] text-white"
                              : isUserWrong
                              ? "bg-[#c4493c] text-white"
                              : "bg-black/5 text-[#1a1a2e]/40"
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className={`flex-1 ${isCorrectOption ? "font-medium text-[#3d7a5f]" : isUserWrong ? "text-[#c4493c]" : ""}`}>
                            {opt}
                          </span>
                          {isCorrectOption && (
                            <span className="text-[#3d7a5f] shrink-0">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                          {isUserWrong && (
                            <span className="text-[#c4493c] shrink-0">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {section === "listening" && qq.context && (
                    <div className="mt-4">
                      <TranscriptAudioPlayer
                        transcript={qq.context}
                        mode="text"
                        highlightAnswer={qq.question.options[qq.question.correctAnswer]}
                      />
                    </div>
                  )}
                </div>
              </div>
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
    const score = calculateCelpipScore(correct, total);

    return (
      <main className="min-h-screen quiz-page flex items-center justify-center px-6" style={{ backgroundColor: "var(--quiz-parchment)" }}>
        {/* Decorative background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[var(--quiz-copper)]/5 blur-[100px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[var(--quiz-sage)]/5 blur-[100px]" />
        </div>

        <div className="quiz-card w-full max-w-md relative z-10">
          <div className="p-8 text-center">
            {/* Decorative top accent */}
            <div className="w-12 h-1 rounded-full bg-[var(--quiz-copper)] mx-auto mb-6" />

            <h2 className="font-serif text-2xl font-bold text-[var(--quiz-ink)] mb-1">Quiz Complete</h2>
            <p className="text-sm text-[var(--quiz-ink)]/50 mb-8">
              {sectionLabel} — {partParam === "all" ? "All Parts" : current.partTitle}
            </p>

            {/* Score circle */}
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="6" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={pct >= 70 ? "var(--quiz-sage)" : pct >= 50 ? "#d4a843" : "var(--quiz-terra)"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold quiz-count ${
                  pct >= 70 ? "text-[var(--quiz-sage)]" : pct >= 50 ? "text-yellow-700" : "text-[var(--quiz-terra)]"
                }`}>
                  {pct}%
                </span>
                <span className="text-xs text-[var(--quiz-ink)]/40 font-medium">Score</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 mb-8 text-sm">
              <div className="text-center">
                <div className="font-bold text-[var(--quiz-ink)]">{correct}</div>
                <div className="text-[var(--quiz-ink)]/40 text-xs">Correct</div>
              </div>
              <div className="w-px h-8 bg-black/5" />
              <div className="text-center">
                <div className="font-bold text-[var(--quiz-ink)]">{total - correct}</div>
                <div className="text-[var(--quiz-ink)]/40 text-xs">Incorrect</div>
              </div>
              <div className="w-px h-8 bg-black/5" />
              <div className="text-center">
                <div className="font-bold text-[var(--quiz-copper)]">{score}</div>
                <div className="text-[var(--quiz-ink)]/40 text-xs">CELPIP</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  setCurrentIndex(0);
                  setAnswers({});
                  setTimeLeft(section === "listening" ? LISTENING_QUESTION_TIME : totalTime);
                  setPhase("quiz");
                  setResultSaved(false);
                  setSlideKey(0);
                  setAudioFinishedParts(new Set());
                  setQuestionSpoken(false);
                  setIsSpeakingQuestion(false);
                }}
                className="w-full py-2.5 text-sm font-semibold rounded-lg bg-[var(--quiz-copper)] text-white hover:bg-[var(--quiz-copper-light)] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setPhase("review")}
                className="w-full py-2.5 text-sm font-medium rounded-lg border border-[var(--quiz-border)] text-[var(--quiz-ink)] hover:bg-[var(--quiz-warm)] transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={() => router.push(ctaHref)}
                className="w-full py-2.5 text-sm font-medium rounded-lg text-[var(--quiz-ink)]/50 hover:text-[var(--quiz-ink)] transition-colors"
              >
                {currentUser ? "Back to Dashboard" : "Get Started Free"}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Quiz phase ───────────────────────────────────────

  // For listening: two-step flow — audio page first, then questions page
  const isListeningAudioStep = section === "listening" && current.partId && !audioFinishedParts.has(current.partId);

  // ── Listening: Audio Page ──────────────────────────
  if (isListeningAudioStep) {
    return (
      <main className="min-h-screen quiz-page" style={{ backgroundColor: "var(--quiz-parchment)" }}>
        <div className="hp-grain" style={{ opacity: 0.08 }} />

        {/* Header — minimal for listening step */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md quiz-header-line">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-2.5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0 bg-blue-500" />
              <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--quiz-ink)]/60 shrink-0 hidden sm:inline">
                Listening
              </span>
              <span className="font-serif text-sm font-bold text-[var(--quiz-ink)] truncate">
                {current.partTitle}
              </span>
              <div className="flex-1" />
              <button
                onClick={finishQuiz}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-[var(--quiz-border)] text-[var(--quiz-ink)] hover:bg-[var(--quiz-warm)] transition-colors shrink-0"
              >
                Finish
              </button>
              <button
                onClick={() => router.push(ctaHref)}
                className="p-1.5 rounded-lg text-[var(--quiz-ink)]/30 hover:text-[var(--quiz-ink)]/60 hover:bg-black/5 transition-colors shrink-0 hidden sm:flex"
                title="Quit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Centered audio player */}
        <div className="mx-auto px-2 sm:px-6 py-12 sm:py-20" style={{ maxWidth: "768px" }}>
          <div className="quiz-card">
            <div className="h-1 bg-gradient-to-r from-[var(--quiz-copper)] via-[var(--quiz-copper-light)] to-transparent" />
            <div className="p-6 sm:p-8">
              {/* Headphone icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--quiz-copper)]/10 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--quiz-copper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--quiz-ink)] text-center mb-2">
                {current.partTitle}
              </h2>
              <p className="text-sm text-[var(--quiz-ink)]/50 text-center mb-6">
                Listen carefully. Questions will appear after the audio finishes.
              </p>

              <TranscriptAudioPlayer
                transcript={current.context || ""}
                mode="audio"
                autoPlay
                partId={current.partId}
                onEnded={() => current.partId && handleAudioEnded(current.partId)}
              />

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--quiz-copper)] font-medium">
                <span className="w-2 h-2 rounded-full bg-[var(--quiz-copper)] animate-pulse" />
                Audio playing...
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Questions Page (reading always, listening after audio ends) ──
  return (
    <main className={`min-h-screen quiz-page ${section === "reading" ? "max-lg:h-screen max-lg:overflow-hidden" : ""}`} style={{ backgroundColor: "var(--quiz-parchment)" }}>
      {/* Subtle grain overlay */}
      <div className="hp-grain" style={{ opacity: 0.08 }} />

      {/* ── Header ─────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md quiz-header-line">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-2.5">
          {/* Single row: all items inline */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Section dot + label */}
            <span className={`w-2 h-2 rounded-full shrink-0 ${section === "listening" ? "bg-blue-500" : "bg-emerald-500"}`} />
            <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--quiz-ink)]/60 shrink-0 hidden sm:inline">
              {sectionLabel}
            </span>

            {/* Question counter / answered count */}
            {(isReadingAllAtOnce || isListeningDropdown) ? (
              <span className="text-sm text-[var(--quiz-ink)] shrink-0">
                <span className="font-bold">{answeredCount}</span>
                <span className="text-[var(--quiz-ink)]/40">/{questions.length} answered</span>
              </span>
            ) : (
              <>
                <span className="text-sm text-[var(--quiz-ink)] shrink-0">
                  <span className="font-bold">{currentIndex + 1}</span>
                  <span className="text-[var(--quiz-ink)]/40">/{questions.length}</span>
                </span>
                <span className="text-[11px] text-[var(--quiz-ink)]/40 shrink-0 hidden xs:inline">
                  {answeredCount} done
                </span>
              </>
            )}

            {/* Flexible spacer + progress dots (hidden for all-at-once layouts) */}
            <div className="flex-1 flex justify-center min-w-0 overflow-hidden px-1">
              {!isReadingAllAtOnce && !isListeningDropdown && (
                <ProgressDots
                  total={questions.length}
                  current={currentIndex}
                  answers={answers}
                  onSelect={goToQuestion}
                />
              )}
            </div>

            {/* Timer */}
            <TimerRing timeLeft={timeLeft} totalTime={section === "listening" ? LISTENING_QUESTION_TIME : totalTime} />

            {/* Finish button */}
            <button
              onClick={finishQuiz}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-[var(--quiz-border)] text-[var(--quiz-ink)] hover:bg-[var(--quiz-warm)] transition-colors shrink-0"
            >
              Finish
            </button>

            {/* Quit (X) */}
            <button
              onClick={() => router.push(ctaHref)}
              className="p-1.5 rounded-lg text-[var(--quiz-ink)]/30 hover:text-[var(--quiz-ink)]/60 hover:bg-black/5 transition-colors shrink-0 hidden sm:flex"
              title="Quit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <div className={`max-w-screen-xl mx-auto lg:px-10 lg:py-12 ${section === "reading" ? "px-0 py-0" : "px-2 sm:px-3 py-8"}`}>
        {isListeningDropdown ? (
          /* Listening Parts 4-6: all questions at once with dropdown selects */
          <div className="mx-auto" style={{ maxWidth: "768px" }}>
            <div className="flex flex-col gap-5">
              {/* Part title reminder */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(59,130,246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-bold text-[var(--quiz-ink)]">{current.partTitle}</span>
                <span className="text-[10px] uppercase tracking-widest text-[var(--quiz-ink)]/35 font-semibold">Complete the statements</span>
              </div>

              <div className="quiz-card !rounded-none sm:!rounded-[10px] !border-x-0 sm:!border-x">
                <div className="px-2 py-4 sm:p-6">
                  <p className="text-xs text-[var(--quiz-ink)]/50 mb-4 leading-relaxed italic">
                    Using the drop-down menu, choose the best option to complete each statement.
                  </p>
                  <div className="space-y-3">
                    {questions.map((qq, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                          answers[idx] !== undefined
                            ? "border-[var(--quiz-copper)]/30 bg-[var(--quiz-copper)]/[0.04]"
                            : "border-[var(--quiz-border)] bg-white"
                        }`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-[var(--quiz-copper)]/10 flex items-center justify-center text-xs font-bold text-[var(--quiz-copper)] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="flex-1 text-sm leading-relaxed text-[var(--quiz-ink)]">{qq.question.question}</p>
                        <select
                          value={answers[idx] !== undefined ? answers[idx] : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAnswers((prev) => {
                              if (val === "") {
                                const next = { ...prev };
                                delete next[idx];
                                return next;
                              }
                              return { ...prev, [idx]: Number(val) };
                            });
                          }}
                          className={`shrink-0 min-w-[70px] max-w-[220px] h-9 px-2 rounded-lg border text-sm font-medium text-center cursor-pointer transition-colors ${
                            answers[idx] !== undefined
                              ? "border-[var(--quiz-copper)] bg-[var(--quiz-copper)] text-white"
                              : "border-[var(--quiz-border)] bg-white text-[var(--quiz-ink)]/50 hover:border-[var(--quiz-copper)]/50"
                          }`}
                        >
                          <option value="">—</option>
                          {shuffledOptions(qq.question, shuffleMap).map((opt, optIdx) => (
                            <option key={optIdx} value={toOriginalIndex(qq.question.id, optIdx, shuffleMap)}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Finish button */}
                  <div className="flex justify-end mt-5">
                    <button
                      onClick={finishQuiz}
                      className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--quiz-copper)] text-white hover:bg-[var(--quiz-copper-light)] transition-colors"
                    >
                      Finish Quiz
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : section === "listening" ? (
          /* Listening Parts 1-3: single-column questions one at a time */
          <div className="mx-auto" style={{ maxWidth: "768px" }}>
            <div className="flex flex-col gap-5">
              {/* Part title reminder */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(59,130,246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-bold text-[var(--quiz-ink)]">{current.partTitle}</span>
                <span className="text-[10px] uppercase tracking-widest text-[var(--quiz-ink)]/35 font-semibold">Answer the questions</span>
              </div>

              <div className="quiz-card quiz-slide-in !rounded-none sm:!rounded-[10px] !border-x-0 sm:!border-x" key={slideKey}>
                <div className="px-2 py-4 sm:p-6">
                  {/* Question header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-[var(--quiz-copper)]/10 flex items-center justify-center text-sm font-bold text-[var(--quiz-copper)]">
                      {currentIndex + 1}
                    </span>
                    <span className="text-xs text-[var(--quiz-ink)]/40 font-medium">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                  </div>

                  {isSpeakingQuestion ? (
                    <div className="flex items-center gap-2 text-sm text-[var(--quiz-ink)]/60 mb-5">
                      <span className="w-2 h-2 rounded-full bg-[var(--quiz-copper)] animate-pulse" />
                      Listening to question...
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--quiz-ink)]/40 italic mb-5">Question was read aloud</p>
                  )}

                  {/* Options */}
                  <div className="space-y-2.5">
                    {shuffledOptions(q, shuffleMap).map((option, idx) => {
                      const originalIdx = toOriginalIndex(q.id, idx, shuffleMap);
                      const isSelected = answers[currentIndex] === originalIdx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setAnswers((prev) => ({ ...prev, [currentIndex]: originalIdx }))}
                          className={`quiz-option w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm ${
                            isSelected
                              ? "quiz-option-selected border-[var(--quiz-copper)]"
                              : "border-[var(--quiz-border)] hover:border-[var(--quiz-copper)]/30 bg-white"
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[var(--quiz-copper)] text-white"
                              : "bg-black/[0.04] text-[var(--quiz-ink)]/40"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className={`flex-1 ${isSelected ? "text-[var(--quiz-ink)] font-medium" : "text-[var(--quiz-ink)]/80"}`}>
                            {option}
                          </span>
                          {isSelected && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--quiz-copper)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => goToQuestion(currentIndex - 1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg border border-[var(--quiz-border)] text-[var(--quiz-ink)] hover:bg-[var(--quiz-warm)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => goToQuestion(currentIndex + 1)}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--quiz-copper)] text-white hover:bg-[var(--quiz-copper-light)] transition-colors"
                  >
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={finishQuiz}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--quiz-copper)] text-white hover:bg-[var(--quiz-copper-light)] transition-colors"
                  >
                    Finish Quiz
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : isReadingAllAtOnce ? (
          /* Reading: all questions at once with dropdown selects (matches real CELPIP format) */
          <>
          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-10">
            {/* Left: Passage(s) */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="quiz-card">
                <div className="h-1 bg-gradient-to-r from-[var(--quiz-copper)] via-[var(--quiz-copper-light)] to-transparent" />
                <div className="p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-serif text-lg font-bold text-[var(--quiz-ink)]">{current.partTitle}</h2>
                  </div>
                  {current.contextLabel && (
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--quiz-ink)]/35 font-semibold mb-4">
                      {current.contextLabel}
                    </p>
                  )}
                  <div className="bg-[var(--quiz-warm)] rounded-xl p-5 max-h-[calc(100vh-240px)] overflow-y-auto quiz-passage-scroll">
                    {readingPassages.map((passage, pIdx) => (
                      <div key={pIdx} className={pIdx > 0 ? "mt-6 pt-6 border-t border-black/10" : ""}>
                        <ReadingPassageRenderer passage={passage} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: All questions with dropdowns */}
            <div className="flex flex-col gap-3">
              <div className="quiz-card">
                <div className="p-5 lg:p-6">
                  <p className="text-xs text-[var(--quiz-ink)]/50 mb-4 leading-relaxed italic">
                    {questions[0]?.question.question?.includes("___") || questions[0]?.partId?.startsWith("Reading-Part3")
                      ? "Using the drop-down menu, choose the best option according to the information given."
                      : "Choose the best answer to each question."}
                  </p>
                  <div className="space-y-3">
                    {questions.map((qq, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                          answers[idx] !== undefined
                            ? "border-[var(--quiz-copper)]/30 bg-[var(--quiz-copper)]/[0.04]"
                            : "border-[var(--quiz-border)] bg-white"
                        }`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-[var(--quiz-copper)]/10 flex items-center justify-center text-xs font-bold text-[var(--quiz-copper)] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="flex-1 text-sm leading-relaxed text-[var(--quiz-ink)]">{qq.question.question}</p>
                        <select
                          value={answers[idx] !== undefined ? answers[idx] : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAnswers((prev) => {
                              if (val === "") {
                                const next = { ...prev };
                                delete next[idx];
                                return next;
                              }
                              return { ...prev, [idx]: Number(val) };
                            });
                          }}
                          className={`shrink-0 min-w-[70px] max-w-[200px] h-9 px-2 rounded-lg border text-sm font-medium text-center cursor-pointer transition-colors ${
                            answers[idx] !== undefined
                              ? "border-[var(--quiz-copper)] bg-[var(--quiz-copper)] text-white"
                              : "border-[var(--quiz-border)] bg-white text-[var(--quiz-ink)]/50 hover:border-[var(--quiz-copper)]/50"
                          }`}
                        >
                          <option value="">—</option>
                          {shuffledOptions(qq.question, shuffleMap).map((opt, optIdx) => (
                            <option key={optIdx} value={toOriginalIndex(qq.question.id, optIdx, shuffleMap)}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Finish button */}
                  <div className="flex justify-end mt-5">
                    <button
                      onClick={finishQuiz}
                      className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--quiz-copper)] text-white hover:bg-[var(--quiz-copper-light)] transition-colors"
                    >
                      Finish Quiz
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex flex-col lg:hidden" style={{ height: "calc(100vh - 52px)" }}>
            {/* Passage(s) */}
            <div className="shrink-0 px-2 sm:px-4 pt-0 sm:pt-2 pb-1">
              <div className="quiz-card sm:!rounded-[10px]">
                <div className="h-1 bg-gradient-to-r from-[var(--quiz-copper)] via-[var(--quiz-copper-light)] to-transparent" />
                <div className="px-3 py-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-serif text-base font-bold text-[var(--quiz-ink)]">{current.partTitle}</h2>
                    {current.contextLabel && (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--quiz-ink)]/35 font-semibold">
                        {current.contextLabel}
                      </span>
                    )}
                  </div>
                  <div className="bg-[var(--quiz-warm)] rounded-lg sm:rounded-xl p-2 sm:p-4 max-h-[30vh] overflow-y-auto quiz-passage-scroll">
                    {readingPassages.map((passage, pIdx) => (
                      <div key={pIdx} className={pIdx > 0 ? "mt-4 pt-4 border-t border-black/10" : ""}>
                        <ReadingPassageRenderer passage={passage} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* All questions */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-4">
              <div className="quiz-card sm:!rounded-[10px]">
                <div className="px-3 py-3 sm:p-4">
                  <p className="text-xs text-[var(--quiz-ink)]/50 mb-3 italic">
                    {questions[0]?.question.question?.includes("___") || questions[0]?.partId?.startsWith("Reading-Part3")
                      ? "Using the drop-down menu, choose the best option."
                      : "Choose the best answer to each question."}
                  </p>
                  <div className="space-y-2.5">
                    {questions.map((qq, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-2.5 rounded-lg border transition-colors ${
                          answers[idx] !== undefined
                            ? "border-[var(--quiz-copper)]/30 bg-[var(--quiz-copper)]/[0.04]"
                            : "border-[var(--quiz-border)] bg-white"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-md bg-[var(--quiz-copper)]/10 flex items-center justify-center text-[11px] font-bold text-[var(--quiz-copper)] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="flex-1 text-[13px] leading-relaxed text-[var(--quiz-ink)]">{qq.question.question}</p>
                        <select
                          value={answers[idx] !== undefined ? answers[idx] : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAnswers((prev) => {
                              if (val === "") {
                                const next = { ...prev };
                                delete next[idx];
                                return next;
                              }
                              return { ...prev, [idx]: Number(val) };
                            });
                          }}
                          className={`shrink-0 min-w-[60px] max-w-[160px] h-8 px-1.5 rounded-lg border text-[13px] font-medium text-center cursor-pointer transition-colors ${
                            answers[idx] !== undefined
                              ? "border-[var(--quiz-copper)] bg-[var(--quiz-copper)] text-white"
                              : "border-[var(--quiz-border)] bg-white text-[var(--quiz-ink)]/50"
                          }`}
                        >
                          <option value="">—</option>
                          {shuffledOptions(qq.question, shuffleMap).map((opt, optIdx) => (
                            <option key={optIdx} value={toOriginalIndex(qq.question.id, optIdx, shuffleMap)}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={finishQuiz}
                      className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--quiz-copper)] text-white hover:bg-[var(--quiz-copper-light)] transition-colors"
                    >
                      Finish Quiz
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
