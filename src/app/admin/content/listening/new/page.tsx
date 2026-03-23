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

export default function NewListeningPage() {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    part_id: "",
    title: "",
    instruction: "",
    transcript: "",
    audio_url: null as string | null,
    image_url: null as string | null,
    status: "draft" as "draft" | "published",
    sort_order: 0,
  });
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [saving, setSaving] = useState(false);

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4c9a]" />
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
      const res = await fetch("/api/admin/content/listening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create listening part");
      }
      const newItem = await res.json();
      const newId = newItem.id ?? newItem.data?.id;

      for (const question of questions) {
        await fetch(`/api/admin/content/listening/${newId}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(question),
        });
      }

      router.push("/admin/content/listening");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create listening part");
    } finally {
      setSaving(false);
    }
  };

  const isDisabled = saving || !form.part_id || !form.title;

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e2ddd5] px-4 py-3">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/content/listening")}
              className="p-1.5 text-[#1a1a2e]/60 hover:text-[#1a1a2e] rounded hover:bg-[#f3efe8]"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[#1a1a2e]">New Listening Part</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/content/listening")}
              className="px-4 py-2 text-sm font-medium text-[#1a1a2e]/60 border border-[#e2ddd5] rounded-full hover:bg-[#f3efe8]"
            >
              Cancel
            </button>
            <ConfirmDialog
              trigger={
                <button
                  type="button"
                  disabled={isDisabled}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#6b4c9a] rounded-full hover:bg-[#5a3d85] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Creating..." : "Create"}
                </button>
              }
              title="Create Listening Part"
              description="Are you sure you want to create this listening part?"
              confirmLabel="Create"
              onConfirm={handleCreate}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-6">
        {/* Part ID + Sort Order */}
        <div className="bg-white border border-[#e2ddd5] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                Part ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.part_id}
                onChange={(e) => setForm((f) => ({ ...f, part_id: e.target.value }))}
                placeholder="e.g. L1"
                className="w-full border border-[#e2ddd5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full border border-[#e2ddd5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Enter title..."
              className="w-full border border-[#e2ddd5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
            />
          </div>

          {/* Instruction */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
              Instruction
            </label>
            <textarea
              value={form.instruction}
              onChange={(e) => setForm((f) => ({ ...f, instruction: e.target.value }))}
              rows={3}
              placeholder="Enter instruction..."
              className="w-full border border-[#e2ddd5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
            />
          </div>

          {/* Transcript */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
              Transcript
            </label>
            <textarea
              value={form.transcript}
              onChange={(e) => setForm((f) => ({ ...f, transcript: e.target.value }))}
              rows={8}
              placeholder="Enter transcript..."
              className="w-full border border-[#e2ddd5] rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
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
              className="border border-[#e2ddd5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white border border-[#e2ddd5] rounded-lg p-6">
          <h2 className="text-sm font-semibold text-[#1a1a2e] mb-4">Media</h2>
          <MediaUploader
            section="listening"
            partId={form.part_id || "new"}
            currentImageUrl={form.image_url}
            currentAudioUrl={form.audio_url}
            onImageUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
            onAudioUploaded={(url) => setForm((f) => ({ ...f, audio_url: url }))}
            onImageRemoved={() => setForm((f) => ({ ...f, image_url: null }))}
            onAudioRemoved={() => setForm((f) => ({ ...f, audio_url: null }))}
          />
        </div>

        {/* Questions */}
        <div className="bg-white border border-[#e2ddd5] rounded-lg p-6">
          <QuestionEditor
            questions={questions}
            section="listening"
            parentId=""
            partId={form.part_id || "NEW"}
            onQuestionsChange={setQuestions}
          />
        </div>
      </div>
    </main>
  );
}
