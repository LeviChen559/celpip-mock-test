"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { listeningPartsOfficial as listeningParts } from "@/lib/celpip-data";
import { getTestState, saveTestState } from "@/lib/test-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Timer from "@/components/Timer";
import QuestionCard from "@/components/QuestionCard";
import TestNavigation from "@/components/TestNavigation";
import TranscriptAudioPlayer from "@/components/TranscriptAudioPlayer";

export default function ListeningTest() {
  const router = useRouter();
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    return getTestState().listeningAnswers;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window === "undefined") return 47 * 60;
    return getTestState().listeningTimeLeft;
  });

  const allQuestions = listeningParts.flatMap((p) => p.questions);
  const totalQuestions = allQuestions.length;

  // Compute flat index
  let flatIndex = 0;
  for (let i = 0; i < currentPart; i++) {
    flatIndex += listeningParts[i].questions.length;
  }
  flatIndex += currentQuestion;

  const part = listeningParts[currentPart];
  const question = part.questions[currentQuestion];

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswer = useCallback(
    (index: number) => {
      const updated = { ...answers, [question.id]: index };
      setAnswers(updated);
      saveTestState({ listeningAnswers: updated });
    },
    [answers, question.id]
  );

  const handleNext = () => {
    if (currentQuestion < part.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentPart < listeningParts.length - 1) {
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
      setCurrentQuestion(listeningParts[prevPart].questions.length - 1);
    }
  };

  const getNextRoute = () => {
    const state = getTestState();
    return state.practiceMode ? "/results" : "/test/reading";
  };

  const handleSubmit = () => {
    saveTestState({ listeningAnswers: answers, listeningTimeLeft: timeLeft });
    router.push(getNextRoute());
  };

  const handleTimeUp = () => {
    saveTestState({ listeningAnswers: answers, listeningTimeLeft: 0 });
    router.push(getNextRoute());
  };

  const isLast =
    currentPart === listeningParts.length - 1 &&
    currentQuestion === part.questions.length - 1;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Badge className="bg-blue-500 text-white shrink-0">Listening</Badge>
            <span className="text-xs sm:text-sm text-muted-foreground truncate">
              Part {currentPart + 1}/{listeningParts.length} · Q{" "}
              {currentQuestion + 1}/{part.questions.length}
            </span>
          </div>
          <Timer
            initialSeconds={timeLeft}
            onTick={(s) => {
              setTimeLeft(s);
              saveTestState({ listeningTimeLeft: s });
            }}
            onTimeUp={handleTimeUp}
          />
        </div>
        <div className="max-w-4xl mx-auto mt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {answeredCount} of {totalQuestions} answered
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{part.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {part.instruction}
            </p>
            <TranscriptAudioPlayer
              transcript={part.transcript}
              mode="audio"
              autoPlay
              partId={part.id}
            />
          </CardContent>
        </Card>

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
    </main>
  );
}
