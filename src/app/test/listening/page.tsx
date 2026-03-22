"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { listeningPartsOfficial as listeningParts } from "@/lib/celpip-data";
import { getTestState, saveTestState } from "@/lib/test-store";
import { useShuffleMap, shuffledOptions, toOriginalIndex, toShuffledIndex } from "@/lib/shuffle-options";
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

  const allQuestions = useMemo(() => listeningParts.flatMap((p) => p.questions), []);
  const totalQuestions = allQuestions.length;
  const shuffleMap = useShuffleMap(allQuestions);

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

  // Parts 4-6 use fill-in-blank dropdown format
  const isDropdownPart = part.questions.every(q => q.question.includes("___"));

  // For dropdown parts, check if all questions in this part are answered
  const isDropdownPartLast = isDropdownPart && currentPart === listeningParts.length - 1;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Badge className="bg-blue-500 text-white shrink-0">Listening</Badge>
            <span className="text-xs sm:text-sm text-muted-foreground truncate">
              Part {currentPart + 1}/{listeningParts.length}
              {!isDropdownPart && <> · Q {currentQuestion + 1}/{part.questions.length}</>}
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

        {isDropdownPart ? (
          /* Parts 4-6: all questions with dropdown selects */
          <>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4 italic">
                  Using the drop-down menu, choose the best option to complete each statement.
                </p>
                <div className="space-y-3">
                  {part.questions.map((q, idx) => {
                    const qFlatIndex = flatIndex - currentQuestion + idx;
                    return (
                      <div
                        key={q.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                          answers[q.id] !== undefined
                            ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                            : "border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <span className="w-7 h-7 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                          {qFlatIndex + 1}
                        </span>
                        <p className="flex-1 text-sm leading-relaxed">{q.question}</p>
                        <select
                          value={answers[q.id] !== undefined ? answers[q.id] : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = { ...answers };
                            if (val === "") {
                              delete updated[q.id];
                            } else {
                              updated[q.id] = Number(val);
                            }
                            setAnswers(updated);
                            saveTestState({ listeningAnswers: updated });
                          }}
                          className={`shrink-0 min-w-[70px] max-w-[220px] h-9 px-2 rounded-md border text-sm font-medium cursor-pointer ${
                            answers[q.id] !== undefined
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500"
                          }`}
                        >
                          <option value="">—</option>
                          {shuffledOptions(q, shuffleMap).map((opt, optIdx) => (
                            <option key={optIdx} value={toOriginalIndex(q.id, optIdx, shuffleMap)}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentPart === 0}
                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-30"
              >
                Previous Part
              </button>
              {isDropdownPartLast ? (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={() => { setCurrentPart(currentPart + 1); setCurrentQuestion(0); }}
                  className="px-5 py-2 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  Next Part
                </button>
              )}
            </div>
          </>
        ) : (
          /* Parts 1-3: one question at a time */
          <>
            <QuestionCard
              questionNumber={flatIndex + 1}
              questionId={question.id}
              question={question.question}
              options={question.options}
              selectedAnswer={answers[question.id]}
              onAnswer={handleAnswer}
              shuffleMap={shuffleMap}
            />

            <TestNavigation
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              hasPrevious={flatIndex > 0}
              hasNext={!isLast}
              isLast={isLast}
            />
          </>
        )}
      </div>
    </main>
  );
}
