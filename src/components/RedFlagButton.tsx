"use client";

import { useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Flag, Check } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface RedFlagButtonProps {
  questionId: string;
  section: string;
}

export default function RedFlagButton({ questionId, section }: RedFlagButtonProps) {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/red-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, section, comment }),
      });
      if (res.ok) {
        setSubmitted(true);
        setOpen(false);
        setComment("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!submitted) setOpen(true);
        }}
        title={submitted ? "Reported" : "Report a problem"}
        className={`ml-auto flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
          submitted
            ? "bg-green-100 text-green-600 cursor-default"
            : "bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
        }`}
      >
        {submitted ? <Check size={14} strokeWidth={2.5} /> : <Flag size={14} strokeWidth={2} />}
      </button>

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 bg-black/40 z-50 transition-opacity" />
          <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border-2 border-[#e2ddd5] bg-white p-6 shadow-xl">
            <AlertDialog.Title className="text-lg font-bold text-[#1a1a2e]">
              Report a Problem
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-[#1a1a2e]/60">
              Flag this question as incorrect or problematic. Your report helps us improve the test.
            </AlertDialog.Description>

            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-600 border border-red-200">
                {questionId}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide bg-gray-100 text-gray-600 border border-gray-200">
                {section}
              </span>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What's wrong with this question? (e.g., incorrect answer, confusing wording, typo...)"
              className="mt-4 w-full min-h-[100px] border border-[#e2ddd5] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#c4493c] transition-colors resize-y"
            />

            <div className="mt-4 flex justify-end gap-3">
              <AlertDialog.Close className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </AlertDialog.Close>
              <button
                onClick={handleSubmit}
                disabled={submitting || !comment.trim()}
                className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
