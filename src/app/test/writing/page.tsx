"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { writingTasksOfficial as writingTasks } from "@/lib/celpip-data";
import { getTestState, saveTestState } from "@/lib/test-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Timer from "@/components/Timer";

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export default function WritingTest() {
  const router = useRouter();
  const [currentTask, setCurrentTask] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    return getTestState().writingResponses;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window === "undefined") return 53 * 60;
    return getTestState().writingTimeLeft;
  });

  const task = writingTasks[currentTask];
  const currentText = responses[task.id] || "";
  const wordCount = countWords(currentText);

  const handleTextChange = useCallback(
    (text: string) => {
      const updated = { ...responses, [task.id]: text };
      setResponses(updated);
      saveTestState({ writingResponses: updated });
    },
    [responses, task.id]
  );

  const getNextRoute = () => {
    const state = getTestState();
    return state.practiceMode ? "/results" : "/test/speaking";
  };

  const handleSubmit = () => {
    saveTestState({ writingResponses: responses, writingTimeLeft: timeLeft });
    router.push(getNextRoute());
  };

  const handleTimeUp = () => {
    saveTestState({ writingResponses: responses, writingTimeLeft: 0 });
    router.push(getNextRoute());
  };

  const wordCountColor =
    wordCount < task.minWords
      ? "text-yellow-600"
      : wordCount > task.maxWords
      ? "text-red-600"
      : "text-green-600";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-500 text-white">Writing</Badge>
            <span className="text-sm text-muted-foreground">
              Task {currentTask + 1} of {writingTasks.length}
            </span>
          </div>
          <Timer
            initialSeconds={timeLeft}
            onTick={(s) => {
              setTimeLeft(s);
              saveTestState({ writingTimeLeft: s });
            }}
            onTimeUp={handleTimeUp}
          />
        </div>
        <div className="max-w-4xl mx-auto mt-2">
          <Progress value={((currentTask + 1) / writingTasks.length) * 100} className="h-2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {task.instruction}
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm leading-relaxed">{task.prompt}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Type your response here..."
              className="min-h-[300px] text-sm leading-relaxed resize-y"
              value={currentText}
              onChange={(e) => handleTextChange(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3">
              <p className={`text-sm font-medium ${wordCountColor}`}>
                {wordCount} words
                <span className="text-muted-foreground font-normal">
                  {" "}
                  (target: {task.minWords}–{task.maxWords})
                </span>
              </p>
              {wordCount >= task.minWords && wordCount <= task.maxWords && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Good length
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentTask(currentTask - 1)}
            disabled={currentTask === 0}
          >
            Previous Task
          </Button>
          {currentTask < writingTasks.length - 1 ? (
            <Button onClick={() => setCurrentTask(currentTask + 1)}>
              Next Task
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit & Continue
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
