"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionCardProps {
  questionNumber: number;
  question: string;
  options: string[];
  selectedAnswer?: number;
  onAnswer: (index: number) => void;
}

export default function QuestionCard({
  questionNumber,
  question,
  options,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) {
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
          value={selectedAnswer !== undefined ? String(selectedAnswer) : ""}
          onValueChange={(val) => onAnswer(Number(val))}
        >
          {options.map((option, idx) => (
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
