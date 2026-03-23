"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { listeningParts as hardcodedListeningParts, readingParts as hardcodedReadingParts } from "@/lib/celpip-data";
import { getListeningPartsClient, getReadingPartsClient } from "@/lib/content-client";
import type { ListeningPart, ReadingPart } from "@/lib/celpip-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function buildQuizSections(listeningParts: ListeningPart[], readingParts: ReadingPart[]) {
  return [
    {
      key: "listening",
      title: "Listening",
      color: "bg-blue-500",
      badgeColor: "bg-blue-100 text-blue-700",
      parts: listeningParts.map((p) => ({
        id: p.id,
        title: p.title,
        questionCount: p.questions.length,
      })),
    },
    {
      key: "reading",
      title: "Reading",
      color: "bg-emerald-500",
      badgeColor: "bg-emerald-100 text-emerald-700",
      parts: readingParts.map((p) => ({
        id: p.id,
        title: p.title,
        questionCount: p.questions.length,
      })),
    },
  ];
}

export default function QuizSelect() {
  const router = useRouter();
  const [listeningParts, setListeningParts] = useState(hardcodedListeningParts);
  const [readingParts, setReadingParts] = useState(hardcodedReadingParts);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    getListeningPartsClient().then(setListeningParts);
    getReadingPartsClient().then(setReadingParts);
  }, []);

  const quizSections = buildQuizSections(listeningParts, readingParts);

  const handleStartQuiz = (sectionKey: string, partIndex: number) => {
    router.push(`/quiz/${sectionKey}?part=${partIndex}`);
  };

  const handleStartAll = (sectionKey: string) => {
    router.push(`/quiz/${sectionKey}?part=all`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Quiz Practice</h1>
            <p className="text-muted-foreground">
              Practice at your own pace with instant feedback. No timer.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>

        <div className="space-y-4">
          {quizSections.map((section) => (
            <Card key={section.key} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${section.color}`} />
              <CardHeader
                className="cursor-pointer"
                onClick={() =>
                  setSelectedSection(
                    selectedSection === section.key ? null : section.key
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {section.parts.reduce((s, p) => s + p.questionCount, 0)} questions
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {selectedSection === section.key ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
              </CardHeader>

              {selectedSection === section.key && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-3">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => handleStartAll(section.key)}
                    >
                      All Questions ({section.parts.reduce((s, p) => s + p.questionCount, 0)})
                    </Button>
                    {section.parts.map((part, idx) => (
                      <div
                        key={part.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium">{part.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {part.questionCount} questions
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartQuiz(section.key, idx)}
                        >
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
