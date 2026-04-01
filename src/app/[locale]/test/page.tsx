"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const instructions = [
  {
    section: "1. Listening",
    time: "47 minutes",
    details: [
      "You will read transcripts of conversations and presentations (simulating audio).",
      "There are 6 parts with 5 questions each (30 questions total).",
      "Select the best answer for each multiple-choice question.",
      "A timer will count down. When time runs out, your answers are submitted automatically.",
    ],
    href: "/test/listening",
  },
  {
    section: "2. Reading",
    time: "55 minutes",
    details: [
      "You will read emails, schedules, articles, and opinion pieces.",
      "There are 4 parts with varying numbers of questions (27 total).",
      "Read each passage carefully before answering the questions.",
      "You may go back and change your answers within each part.",
    ],
    href: "/test/reading",
  },
  {
    section: "3. Writing",
    time: "53 minutes",
    details: [
      "Task 1: Write an email based on a given scenario (150–200 words).",
      "Task 2: Respond to a survey question (150–200 words).",
      "A word counter will help you track your response length.",
      "Both tasks share the total time allocation.",
    ],
    href: "/test/writing",
  },
  {
    section: "4. Speaking",
    time: "20 minutes",
    details: [
      "There are 8 speaking tasks with different prompts.",
      "In this mock test, type your spoken response instead of recording.",
      "Each task has a preparation period and a response period.",
      "Try to respond as naturally and fully as you would when speaking.",
    ],
    href: "/test/speaking",
  },
];

export default function TestInstructions() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Test Instructions</h1>
        <p className="text-muted-foreground mb-8">
          Please read the instructions for each section carefully before you begin.
          The test sections must be completed in order.
        </p>

        <div className="space-y-4">
          {instructions.map((item, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{item.section}</CardTitle>
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {item.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Important: Once you begin a section, the timer will start. You cannot pause the timer.
            Make sure you are in a quiet environment and ready to focus.
          </p>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="text-lg px-10 py-6"
            onClick={() => router.push("/test/listening")}
          >
            Begin Listening Test
          </Button>
        </div>
      </div>
    </main>
  );
}
