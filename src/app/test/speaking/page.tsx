"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { speakingTasksOfficial as speakingTasks } from "@/lib/celpip-data";
import { getTestState, saveTestState } from "@/lib/test-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

type Phase = "prep" | "response";

export default function SpeakingTest() {
  const router = useRouter();
  const [currentTask, setCurrentTask] = useState(0);
  const [phase, setPhase] = useState<Phase>("prep");
  const [phaseTimer, setPhaseTimer] = useState(speakingTasks[0].prepTime);
  const [responses, setResponses] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    return getTestState().speakingResponses;
  });

  const task = speakingTasks[currentTask];
  const currentText = responses[task.id] || "";

  // Timer for prep/response phases
  useEffect(() => {
    if (phaseTimer <= 0) {
      if (phase === "prep") {
        setPhase("response");
        setPhaseTimer(task.responseTime);
      }
      return;
    }

    const interval = setInterval(() => {
      setPhaseTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [phaseTimer, phase, task.responseTime]);

  const handleTextChange = useCallback(
    (text: string) => {
      const updated = { ...responses, [task.id]: text };
      setResponses(updated);
      saveTestState({ speakingResponses: updated });
    },
    [responses, task.id]
  );

  const goToTask = (index: number) => {
    setCurrentTask(index);
    setPhase("prep");
    setPhaseTimer(speakingTasks[index].prepTime);
  };

  const handleSkipPrep = () => {
    setPhase("response");
    setPhaseTimer(task.responseTime);
  };

  const handleSubmit = () => {
    saveTestState({ speakingResponses: responses, completed: true });
    router.push("/results");
  };

  const wordCount = currentText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const mins = Math.floor(phaseTimer / 60);
  const secs = phaseTimer % 60;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-500 text-white">Speaking</Badge>
            <span className="text-sm text-muted-foreground">
              Task {currentTask + 1} of {speakingTasks.length}
            </span>
          </div>
          <div
            className={`font-mono text-lg font-bold px-4 py-2 rounded-lg ${
              phase === "prep"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : phaseTimer < 15
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            }`}
          >
            {phase === "prep" ? "PREP" : "RESPOND"}{" "}
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-2">
          <Progress
            value={((currentTask + 1) / speakingTasks.length) * 100}
            className="h-2"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {task.instruction}
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm leading-relaxed">{task.prompt}</p>
            </div>
          </CardContent>
        </Card>

        {phase === "prep" ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-lg font-medium mb-2">Preparation Time</p>
              <p className="text-sm text-muted-foreground mb-4">
                Read the prompt and prepare your response. The response phase
                will begin automatically when the timer runs out.
              </p>
              <Button variant="outline" onClick={handleSkipPrep}>
                Skip to Response
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-3">
                Type what you would say (simulating spoken response):
              </p>
              <Textarea
                placeholder="Type your spoken response here..."
                className="min-h-[200px] text-sm leading-relaxed resize-y"
                value={currentText}
                onChange={(e) => handleTextChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {wordCount} words
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={() => goToTask(currentTask - 1)}
            disabled={currentTask === 0}
          >
            Previous Task
          </Button>
          {currentTask < speakingTasks.length - 1 ? (
            <Button onClick={() => goToTask(currentTask + 1)}>
              Next Task
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit & View Results
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
