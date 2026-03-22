"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ShuffleMap } from "@/lib/shuffle-options";
import { shuffledOptions, toOriginalIndex, toShuffledIndex } from "@/lib/shuffle-options";

interface QuestionCardProps {
  questionNumber: number;
  questionId: string;
  question: string;
  options: string[];
  selectedAnswer?: number;
  onAnswer: (originalIndex: number) => void;
  shuffleMap?: ShuffleMap;
}

export default function QuestionCard({
  questionNumber,
  questionId,
  question,
  options,
  selectedAnswer,
  onAnswer,
  shuffleMap,
}: QuestionCardProps) {
  const displayOptions = shuffleMap
    ? shuffledOptions({ id: questionId, options, question: "", correctAnswer: 0 } as any, shuffleMap)
    : options;

  const displaySelected =
    selectedAnswer !== undefined && shuffleMap
      ? toShuffledIndex(questionId, selectedAnswer, shuffleMap)
      : selectedAnswer;

  const handleChange = (val: string) => {
    const shuffledIdx = Number(val);
    if (shuffleMap) {
      onAnswer(toOriginalIndex(questionId, shuffledIdx, shuffleMap));
    } else {
      onAnswer(shuffledIdx);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Question {questionNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm leading-relaxed">{question}</p>
        <RadioGroup
          key={questionNumber}
          value={displaySelected !== undefined ? String(displaySelected) : ""}
          onValueChange={handleChange}
        >
          {displayOptions.map((option, idx) => (
            <div key={idx} className="flex items-center space-x-3 py-2">
              <RadioGroupItem value={String(idx)} id={`q${questionNumber}-${idx}`} />
              <Label
                htmlFor={`q${questionNumber}-${idx}`}
                className="cursor-pointer text-sm leading-relaxed"
              >
                {String.fromCharCode(65 + idx)}. {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
