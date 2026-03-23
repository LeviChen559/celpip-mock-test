"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { MediaUploader } from "@/components/admin/content/MediaUploader";
import { ConfirmDialog } from "@/components/admin/content/ConfirmDialog";

export default function NewSpeakingPage() {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    task_id: "",
    title: "",
    instruction: "",
    prompt: "",
    prep_time: 30,
    response_time: 60,
    image_url: null as string | null,
    audio_url: null as string | null,
    status: "draft" as "draft" | "published",
    sort_order: 0,
  });
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
      const res = await fetch("/api/admin/content/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create speaking task");
      }

      router.push("/admin/content/speaking");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create speaking task");
    } finally {
      setSaving(false);
    }
  };

  const isDisabled = saving || !form.task_id || !form.title;

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e2ddd5] px-4 py-3">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/content/speaking")}
              className="p-1.5 text-[#1a1a2e]/60 hover:text-[#1a1a2e] rounded hover:bg-[#f3efe8]"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[#1a1a2e]">New Speaking Task</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/content/speaking")}
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
              title="Create Speaking Task"
              description="Are you sure you want to create this speaking task?"
              confirmLabel="Create"
              onConfirm={handleCreate}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-6">
        <div className="bg-white border border-[#e2ddd5] rounded-lg p-6 space-y-4">
          {/* Task ID + Sort Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                Task ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.task_id}
                onChange={(e) => setForm((f) => ({ ...f, task_id: e.target.value }))}
                placeholder="e.g. S1"
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

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
              Prompt
            </label>
            <textarea
              value={form.prompt}
              onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
              rows={8}
              placeholder="Enter prompt..."
              className="w-full border border-[#e2ddd5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
            />
          </div>

          {/* Prep Time + Response Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                Prep Time (seconds)
              </label>
              <input
                type="number"
                value={form.prep_time}
                onChange={(e) =>
                  setForm((f) => ({ ...f, prep_time: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full border border-[#e2ddd5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                Response Time (seconds)
              </label>
              <input
                type="number"
                value={form.response_time}
                onChange={(e) =>
                  setForm((f) => ({ ...f, response_time: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full border border-[#e2ddd5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4c9a] focus:border-[#6b4c9a]"
              />
            </div>
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
            section="speaking"
            partId={form.task_id || "new"}
            currentImageUrl={form.image_url}
            currentAudioUrl={form.audio_url}
            onImageUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
            onAudioUploaded={(url) => setForm((f) => ({ ...f, audio_url: url }))}
            onImageRemoved={() => setForm((f) => ({ ...f, image_url: null }))}
            onAudioRemoved={() => setForm((f) => ({ ...f, audio_url: null }))}
          />
        </div>
      </div>
    </main>
  );
}
