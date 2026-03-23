"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { MediaUploader } from "@/components/admin/content/MediaUploader";
import {
  QuestionEditor,
  type QuestionData,
} from "@/components/admin/content/QuestionEditor";
import { ConfirmDialog } from "@/components/admin/content/ConfirmDialog";

export default function NewReadingPage() {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    part_id: "",
    title: "",
    instruction: "",
    passage: "",
    image_url: null as string | null,
    status: "draft" as "draft" | "published",
    sort_order: 0,
    paid: false,
  });
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [saving, setSaving] = useState(false);

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </main>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create reading part");
      }
      const newItem = await res.json();
      const newId = newItem.id ?? newItem.data?.id;

      for (const question of questions) {
        await fetch(`/api/admin/content/reading/${newId}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(question),
        });
      }

      router.push("/admin/content/reading");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create reading part");
    } finally {
      setSaving(false);
    }
  };

  const isDisabled = saving || !form.part_id || !form.title;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/content/reading")}
              className="p-1.5 text-gray-500 hover:text-gray-900 rounded hover:bg-gray-100"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">New Reading Part</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/content/reading")}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <ConfirmDialog
              trigger={
                <button
                  type="button"
                  disabled={isDisabled}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Creating..." : "Create"}
                </button>
              }
              title="Create Reading Part"
              description="Are you sure you want to create this reading part?"
              confirmLabel="Create"
              onConfirm={handleCreate}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-6">
        {/* Part ID + Sort Order */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Part ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.part_id}
                onChange={(e) => setForm((f) => ({ ...f, part_id: e.target.value }))}
                placeholder="e.g. Reading-Part1-01"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Enter title..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Instruction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instruction
            </label>
            <textarea
              value={form.instruction}
              onChange={(e) => setForm((f) => ({ ...f, instruction: e.target.value }))}
              rows={3}
              placeholder="Enter instruction..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Passage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passage
            </label>
            <textarea
              value={form.passage}
              onChange={(e) => setForm((f) => ({ ...f, passage: e.target.value }))}
              rows={8}
              placeholder="Enter passage..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as "draft" | "published",
                }))
              }
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Paid Content */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="paid"
              checked={form.paid}
              onChange={(e) => setForm(f => ({ ...f, paid: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="paid" className="text-sm font-medium text-gray-700">Paid Content</label>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Media</h2>
          <MediaUploader
            section="reading"
            partId={form.part_id || "new"}
            currentImageUrl={form.image_url}
            currentAudioUrl={null}
            onImageUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
            onImageRemoved={() => setForm((f) => ({ ...f, image_url: null }))}
          />
        </div>

        {/* Questions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <QuestionEditor
            questions={questions}
            section="reading"
            parentId=""
            partId={form.part_id || "NEW"}
            onQuestionsChange={setQuestions}
          />
        </div>
      </div>
    </main>
  );
}
