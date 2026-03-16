"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

export default function Results() {
  const router = useRouter();
  const { addRecord } = useHistory();
  const addRecordRef = useRef(addRecord);
  addRecordRef.current = addRecord;
  const [mounted, setMounted] = useState(false);
  const [practiceMode, setPracticeMode] = useState<PracticeSection>(null);
  const [sections, setSections] = useState<SectionResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);

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

    // Save to history (only once)
    if (!state.resultSaved) {
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
      addRecordRef.current(record);
      // Mark as saved in localStorage to prevent duplicate
      const raw = localStorage.getItem("celpip-test-state");
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.resultSaved = true;
        localStorage.setItem("celpip-test-state", JSON.stringify(parsed));
      }
    }

    setMounted(true);
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
              : "CELPIP Mock Test Score Report"}
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
          {sections.map((section) => (
            <Card key={section.name} className="relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-1 h-full ${section.color}`}
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{section.name}</CardTitle>
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
              </CardContent>
            </Card>
          ))}
        </div>

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

        {(sections.some((s) => s.name === "Writing") || sections.some((s) => s.name === "Speaking")) && (
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
