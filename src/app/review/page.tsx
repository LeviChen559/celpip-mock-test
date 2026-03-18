"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  listeningPartsOfficial as listeningParts,
  readingPartsOfficial as readingParts,
  listeningParts as listeningPartsAll,
  readingParts as readingPartsAll,
  type Question,
} from "@/lib/celpip-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/use-auth";
import TranscriptAudioPlayer from "@/components/TranscriptAudioPlayer";

interface ReviewQuestion {
  question: Question;
  context?: string;
  contextLabel?: string;
  partTitle: string;
  userAnswer: number;
}

function scoreColor(score: number): string {
  if (score >= 10) return "text-green-600";
  if (score >= 8) return "text-blue-600";
  if (score >= 6) return "text-yellow-600";
  return "text-red-600";
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading review...</p>
      </main>
    }>
      <ReviewContent />
    </Suspense>
  );
}

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recordId = searchParams.get("id");
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!recordId || !currentUser) return;

    const supabase = createClient();
    supabase
      .from("test_records")
      .select("*")
      .eq("id", recordId)
      .eq("user_id", currentUser.id)
      .single()
      .then(({ data, error: err }: { data: Record<string, unknown> | null; error: { message: string } | null }) => {
        if (err || !data) {
          setError("Test record not found.");
        } else {
          setRecord(data);
        }
        setLoading(false);
      });
  }, [recordId, currentUser]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading review...</p>
      </main>
    );
  }

  if (error || !record) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-2 border-[#e2ddd5] rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-lg font-medium text-[#1a1a2e] mb-2">{error || "Record not found"}</p>
            <p className="text-sm text-muted-foreground mb-4">
              This test may not have saved detailed answers. Only tests taken after this update include reviewable answers.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const type = record.type as string;
  const details = (record.details || {}) as Record<string, unknown>;
  const answers = (details.answers || {}) as Record<string, Record<string, number>>;
  const scores = (record.scores || {}) as Record<string, number>;
  const overallScore = (record.overall_score || 0) as number;
  const section = record.section as string | null;
  const quizSection = record.quiz_section as string | null;
  const quizPart = record.quiz_part as string | null;
  const timestamp = record.timestamp as number;

  // Check if we have answers to review
  const responses = (details.responses || {}) as Record<string, { title: string; prompt: string; text: string }>;
  const feedbacks = (details.feedbacks || {}) as Record<string, { scoreExplanation: string; strengths: string[]; improvements: string[]; exampleResponse: string }>;
  const hasAnswers = (answers && Object.keys(answers).length > 0) || Object.keys(responses).length > 0;

  if (!hasAnswers) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-2 border-[#e2ddd5] rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-lg font-medium text-[#1a1a2e] mb-2">No detailed answers available</p>
            <p className="text-sm text-muted-foreground mb-4">
              This test was taken before answer tracking was enabled. Future tests will include full answer review.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Build review questions based on test type
  const reviewQuestions: ReviewQuestion[] = [];

  if (type === "quiz" && quizSection && quizPart != null) {
    const parts = quizSection === "listening" ? listeningPartsAll : readingPartsAll;
    const selectedParts = quizPart === "all" ? parts : [parts[Number(quizPart)]];
    const quizAnswers = answers.quiz || {};

    for (const p of selectedParts) {
      for (const q of p.questions) {
        reviewQuestions.push({
          question: q,
          context: q.passage || ("transcript" in p ? (p as { transcript: string }).transcript : ("passage" in p ? (p as { passage: string }).passage : undefined)),
          contextLabel: quizSection === "listening" ? "Transcript" : "Passage",
          partTitle: p.title,
          userAnswer: quizAnswers[q.id] ?? -1,
        });
      }
    }
  } else {
    // Full or section test
    const buildForSection = (
      sectionName: string,
      parts: { title: string; questions: Question[]; transcript?: string; passage?: string }[],
      userAnswers: Record<string, number>
    ) => {
      for (const p of parts) {
        for (const q of p.questions) {
          reviewQuestions.push({
            question: q,
            context: q.passage || p.transcript || p.passage,
            contextLabel: sectionName === "listening" ? "Transcript" : "Passage",
            partTitle: `${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} — ${p.title}`,
            userAnswer: userAnswers[q.id] ?? -1,
          });
        }
      }
    };

    if (answers.listening && (!section || section === "listening")) {
      buildForSection("listening", listeningParts as unknown as { title: string; questions: Question[]; transcript?: string; passage?: string }[], answers.listening);
    }
    if (answers.reading && (!section || section === "reading")) {
      buildForSection("reading", readingParts as unknown as { title: string; questions: Question[]; transcript?: string; passage?: string }[], answers.reading);
    }
  }

  const correct = reviewQuestions.filter((rq) => rq.userAnswer === rq.question.correctAnswer).length;
  const total = reviewQuestions.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Label
  let testLabel = "Full Mock Test";
  if (type === "section" && section) {
    testLabel = `${section.charAt(0).toUpperCase() + section.slice(1)} Practice`;
  } else if (type === "quiz" && quizSection) {
    const sec = quizSection.charAt(0).toUpperCase() + quizSection.slice(1);
    const part = quizPart === "all" ? "All Parts" : `Part ${Number(quizPart) + 1}`;
    testLabel = `${sec} Quiz — ${part}`;
  }

  const sectionBadgeClass =
    (quizSection === "listening" || section === "listening")
      ? "bg-blue-500 text-white"
      : (quizSection === "reading" || section === "reading")
      ? "bg-emerald-500 text-white"
      : (quizSection === "writing" || section === "writing")
      ? "bg-purple-500 text-white"
      : (quizSection === "speaking" || section === "speaking")
      ? "bg-pink-500 text-white"
      : "bg-purple-100 text-[#6b4c9a]";

  return (
    <main className="min-h-screen bg-grid" style={{ backgroundColor: "var(--background)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={sectionBadgeClass}>{testLabel}</Badge>
            {total > 0 && (
              <span className="text-sm font-bold text-[#1a1a2e]">
                {correct}/{total} correct ({pct}%)
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {new Intl.DateTimeFormat("en-CA", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(timestamp))}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className={`text-2xl font-bold ${scoreColor(overallScore)}`}>
              {overallScore}/12
            </span>
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
        {/* Writing/Speaking response review */}
        {Object.keys(responses).length > 0 && Object.entries(responses).map(([idx, resp]) => {
          const fb = feedbacks[idx];
          return (
            <Card key={`resp-${idx}`} className="border-2 border-purple-200 rounded-2xl overflow-hidden">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-purple-100 text-purple-700">
                    {Number(idx) + 1}
                  </span>
                  <Badge className="text-[10px] border bg-purple-100 text-purple-700 border-purple-200">
                    {quizSection === "writing" ? "Writing" : "Speaking"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{resp.title}</span>
                </div>

                <div className="bg-muted rounded-lg p-4 mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Prompt</p>
                  <p className="text-sm leading-relaxed">{resp.prompt}</p>
                </div>

                <div className="bg-white border border-[#e2ddd5] rounded-lg p-4 mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Your Response</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{resp.text || <span className="text-muted-foreground italic">No response submitted</span>}</p>
                </div>

                {fb && (
                  <div className="space-y-3">
                    {fb.scoreExplanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-blue-700 mb-1 uppercase tracking-wide">Score Explanation</p>
                        <p className="text-sm text-[#1a1a2e]">{fb.scoreExplanation}</p>
                      </div>
                    )}
                    {fb.strengths && fb.strengths.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-green-700 mb-1 uppercase tracking-wide">Strengths</p>
                        <ul className="text-sm text-[#1a1a2e] list-disc list-inside space-y-1">
                          {fb.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {fb.improvements && fb.improvements.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-amber-700 mb-1 uppercase tracking-wide">Areas to Improve</p>
                        <ul className="text-sm text-[#1a1a2e] list-disc list-inside space-y-1">
                          {fb.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {fb.exampleResponse && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-purple-700 mb-1 uppercase tracking-wide">Example High-Score Response</p>
                        <p className="text-sm text-[#1a1a2e] whitespace-pre-line">{fb.exampleResponse}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Multiple-choice question review */}
        {reviewQuestions.map((rq, idx) => {
          const isCorrect = rq.userAnswer === rq.question.correctAnswer;
          const wasSkipped = rq.userAnswer === -1;
          const isListening = rq.contextLabel === "Transcript";

          return (
            <Card
              key={idx}
              className={`border-2 rounded-2xl overflow-hidden ${
                isCorrect ? "border-green-200" : wasSkipped ? "border-amber-200" : "border-red-200"
              }`}
            >
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCorrect
                        ? "bg-green-100 text-green-700"
                        : wasSkipped
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <Badge
                    className={`text-[10px] border ${
                      isCorrect
                        ? "bg-green-100 text-green-700 border-green-200"
                        : wasSkipped
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}
                  >
                    {isCorrect ? "Correct" : wasSkipped ? "Skipped" : "Wrong"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{rq.partTitle}</span>
                </div>

                <p className="text-sm font-medium text-[#1a1a2e] mb-3">{rq.question.question}</p>

                <div className="space-y-1.5">
                  {rq.question.options.map((opt, optIdx) => {
                    let cls = "border-[#e2ddd5] bg-white";
                    if (optIdx === rq.question.correctAnswer) {
                      cls = "border-green-300 bg-green-50";
                    } else if (optIdx === rq.userAnswer && !isCorrect) {
                      cls = "border-red-300 bg-red-50";
                    }
                    return (
                      <div key={optIdx} className={`flex items-center gap-2 p-2.5 rounded-lg border ${cls}`}>
                        <span className="text-xs font-bold w-5 text-center text-muted-foreground">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-sm flex-1">{opt}</span>
                        {optIdx === rq.question.correctAnswer && (
                          <span className="text-green-600 text-xs font-semibold">Correct</span>
                        )}
                        {optIdx === rq.userAnswer && !isCorrect && optIdx !== rq.question.correctAnswer && (
                          <span className="text-red-600 text-xs font-semibold">Your answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isListening && rq.context && (
                  <div className="mt-4">
                    <TranscriptAudioPlayer
                      transcript={rq.context}
                      mode="text"
                      highlightAnswer={rq.question.options[rq.question.correctAnswer]}
                    />
                  </div>
                )}

                {!isListening && rq.context && (
                  <div className="mt-4 bg-muted rounded-lg p-4 max-h-48 overflow-y-auto">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Passage
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{rq.context}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
