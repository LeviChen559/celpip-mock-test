"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

export interface QuestionData {
  id?: string;
  question_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  passage?: string;
  sort_order: number;
}

interface QuestionEditorProps {
  questions: QuestionData[];
  section: string;
  parentId: string;
  partId: string;
  onQuestionsChange: (questions: QuestionData[]) => void;
}

export function QuestionEditor({
  questions,
  section,
  parentId,
  partId,
  onQuestionsChange,
}: QuestionEditorProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const addQuestion = () => {
    const n = questions.length + 1;
    const newQuestion: QuestionData = {
      question_id: `${partId}Q${n}`,
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      sort_order: n,
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<QuestionData>) => {
    const updated = questions.map((q, i) =>
      i === index ? { ...q, ...updates } : q
    );
    onQuestionsChange(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q;
      const options = [...q.options];
      options[oIndex] = value;
      return { ...q, options };
    });
    onQuestionsChange(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q;
      return { ...q, options: [...q.options, ""] };
    });
    onQuestionsChange(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q;
      const options = q.options.filter((_, oi) => oi !== oIndex);
      const correct_answer =
        q.correct_answer >= oIndex && q.correct_answer > 0
          ? q.correct_answer - 1
          : q.correct_answer;
      return { ...q, options, correct_answer };
    });
    onQuestionsChange(updated);
  };

  const deleteQuestion = async (index: number) => {
    const q = questions[index];
    if (q.id) {
      const res = await fetch(
        `/api/admin/content/${section}/${parentId}/questions/${q.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete question");
      }
    }
    const updated = questions
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, sort_order: i + 1 }));
    onQuestionsChange(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const updated = [...questions];
    const [moved] = updated.splice(draggingIndex, 1);
    updated.splice(index, 0, moved);
    const reordered = updated.map((q, i) => ({ ...q, sort_order: i + 1 }));
    onQuestionsChange(reordered);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1a1a2e]">
          Questions ({questions.length})
        </h3>
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#6b4c9a] text-white rounded-full hover:bg-[#5a3d85]"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, qIndex) => (
          <div
            key={q.question_id}
            draggable
            onDragStart={() => handleDragStart(qIndex)}
            onDragOver={(e) => handleDragOver(e, qIndex)}
            onDragEnd={handleDragEnd}
            className={`border border-[#e2ddd5] rounded-lg p-4 bg-white ${
              draggingIndex === qIndex ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start gap-2">
              <button
                type="button"
                className="mt-1 cursor-grab text-[#1a1a2e]/60 hover:text-[#1a1a2e]"
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-4 w-4" />
              </button>

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#1a1a2e]/60">
                    {q.question_id}
                  </span>
                  <ConfirmDialog
                    trigger={
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    }
                    title="Delete Question"
                    description={`Are you sure you want to delete question ${q.question_id}? This cannot be undone.`}
                    confirmLabel="Delete"
                    variant="danger"
                    onConfirm={() => deleteQuestion(qIndex)}
                  />
                </div>

                {/* Passage (optional) */}
                <div>
                  <label className="block text-xs font-medium text-[#1a1a2e]/60 mb-1">
                    Passage (optional)
                  </label>
                  <textarea
                    value={q.passage ?? ""}
                    onChange={(e) =>
                      updateQuestion(qIndex, { passage: e.target.value })
                    }
                    rows={2}
                    placeholder="Optional reading passage..."
                    className="w-full text-sm border border-[#e2ddd5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
                  />
                </div>

                {/* Question text */}
                <div>
                  <label className="block text-xs font-medium text-[#1a1a2e]/60 mb-1">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(qIndex, { question: e.target.value })
                    }
                    rows={2}
                    placeholder="Enter question text..."
                    className="w-full text-sm border border-[#e2ddd5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-xs font-medium text-[#1a1a2e]/60 mb-1">
                    Options (select correct answer)
                  </label>
                  <div className="space-y-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.question_id}`}
                          checked={q.correct_answer === oIndex}
                          onChange={() =>
                            updateQuestion(qIndex, { correct_answer: oIndex })
                          }
                          className="h-4 w-4 text-[#6b4c9a]"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, e.target.value)
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1 text-sm border border-[#e2ddd5] rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
                        />
                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-[#1a1a2e]/60 hover:text-red-500"
                            aria-label="Remove option"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="mt-2 flex items-center gap-1 text-xs text-[#6b4c9a] hover:text-[#5a3d85]"
                  >
                    <Plus className="h-3 w-3" />
                    Add Option
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-sm text-[#1a1a2e]/60 border border-dashed border-[#e2ddd5] rounded-lg">
          No questions yet. Click &quot;Add Question&quot; to get started.
        </div>
      )}
    </div>
  );
}
