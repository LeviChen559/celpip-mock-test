"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { MediaUploader } from "@/components/admin/content/MediaUploader";
import {
  QuestionEditor,
  type QuestionData,
} from "@/components/admin/content/QuestionEditor";
import { ConfirmDialog } from "@/components/admin/content/ConfirmDialog";
import { StatusBadge } from "@/components/admin/content/StatusBadge";

export default function EditListeningPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { currentUser, loading: authLoading } = useAuth();

  const [form, setForm] = useState<Record<string, unknown>>({
    part_id: "",
    title: "",
    instruction: "",
    transcript: "",
    audio_url: null,
    image_url: null,
    status: "draft",
    sort_order: 0,
  });
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/content/listening/${id}`);
        if (!res.ok) throw new Error("Failed to fetch listening part");
        const data = await res.json();
        const item = data.item ?? data;
        setForm({
          part_id: item.part_id ?? "",
          title: item.title ?? "",
          instruction: item.instruction ?? "",
          transcript: item.transcript ?? "",
          audio_url: item.audio_url ?? null,
          image_url: item.image_url ?? null,
          status: item.status ?? "draft",
          sort_order: item.sort_order ?? 0,
          ...item,
        });
        setQuestions(Array.isArray(item.questions) ? item.questions : []);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, currentUser, id, router]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4c9a]" />
      </main>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/listening/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save listening part");
      }

      for (const question of questions) {
        if (question.id) {
          await fetch(`/api/admin/content/listening/${id}/questions/${question.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(question),
          });
        } else {
          await fetch(`/api/admin/content/listening/${id}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(question),
          });
        }
      }

      router.push("/admin/content/listening");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save listening part");
    } finally {
      setSaving(false);
    }
  };

  const currentStatus = (form.status ?? "draft") as "draft" | "published";
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
            <h1 className="text-xl font-bold text-[#1a1a2e]">Edit Listening Part</h1>
            <StatusBadge status={currentStatus} />
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
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              }
              title="Save Changes"
              description="Are you sure you want to save these changes?"
              confirmLabel="Save"
              onConfirm={handleSave}
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
                value={(form.part_id as string) ?? ""}
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
                value={(form.sort_order as number) ?? 0}
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
              value={(form.title as string) ?? ""}
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
              value={(form.instruction as string) ?? ""}
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
              value={(form.transcript as string) ?? ""}
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
              value={(form.status as string) ?? "draft"}
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
            partId={(form.part_id as string) || id}
            currentImageUrl={(form.image_url as string | null) ?? null}
            currentAudioUrl={(form.audio_url as string | null) ?? null}
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
            parentId={id}
            partId={(form.part_id as string) || id}
            onQuestionsChange={setQuestions}
          />
        </div>
      </div>
    </main>
  );
}
