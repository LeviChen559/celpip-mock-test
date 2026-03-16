"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { readingPartsOfficial as readingParts } from "@/lib/celpip-data";
import { getTestState, saveTestState } from "@/lib/test-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Timer from "@/components/Timer";
import QuestionCard from "@/components/QuestionCard";
import TestNavigation from "@/components/TestNavigation";

export default function ReadingTest() {
  const router = useRouter();
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    return getTestState().readingAnswers;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window === "undefined") return 55 * 60;
    return getTestState().readingTimeLeft;
  });

  const allQuestions = readingParts.flatMap((p) => p.questions);
  const totalQuestions = allQuestions.length;

  let flatIndex = 0;
  for (let i = 0; i < currentPart; i++) {
    flatIndex += readingParts[i].questions.length;
  }
  flatIndex += currentQuestion;

  const part = readingParts[currentPart];
  const question = part.questions[currentQuestion];

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswer = useCallback(
    (index: number) => {
      const updated = { ...answers, [question.id]: index };
      setAnswers(updated);
      saveTestState({ readingAnswers: updated });
    },
    [answers, question.id]
  );

  const handleNext = () => {
    if (currentQuestion < part.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentPart < readingParts.length - 1) {
      setCurrentPart(currentPart + 1);
      setCurrentQuestion(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentPart > 0) {
      const prevPart = currentPart - 1;
      setCurrentPart(prevPart);
      setCurrentQuestion(readingParts[prevPart].questions.length - 1);
    }
  };

  const getNextRoute = () => {
    const state = getTestState();
    return state.practiceMode ? "/results" : "/test/writing";
  };

  const handleSubmit = () => {
    saveTestState({ readingAnswers: answers, readingTimeLeft: timeLeft });
    router.push(getNextRoute());
  };

  const handleTimeUp = () => {
    saveTestState({ readingAnswers: answers, readingTimeLeft: 0 });
    router.push(getNextRoute());
  };

  const isLast =
    currentPart === readingParts.length - 1 &&
    currentQuestion === part.questions.length - 1;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500 text-white">Reading</Badge>
            <span className="text-sm text-muted-foreground">
              Part {currentPart + 1} of {readingParts.length} | Question{" "}
              {currentQuestion + 1} of {part.questions.length}
            </span>
          </div>
          <Timer
            initialSeconds={timeLeft}
            onTick={(s) => {
              setTimeLeft(s);
              saveTestState({ readingTimeLeft: s });
            }}
            onTimeUp={handleTimeUp}
          />
        </div>
        <div className="max-w-7xl mx-auto mt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {answeredCount} of {totalQuestions} answered
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Passage */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{part.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {part.instruction}
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 max-h-[calc(100vh-220px)] overflow-y-auto">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {part.passage}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Questions */}
          <div className="flex flex-col gap-4">
            <QuestionCard
              questionNumber={flatIndex + 1}
              question={question.question}
              options={question.options}
              selectedAnswer={answers[question.id]}
              onAnswer={handleAnswer}
            />

            <TestNavigation
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              hasPrevious={flatIndex > 0}
              hasNext={!isLast}
              isLast={isLast}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
