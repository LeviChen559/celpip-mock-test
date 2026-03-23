"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useState } from "react";

interface ConfirmDialogProps {
  trigger: React.ReactElement;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger render={trigger} />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50">
          <AlertDialog.Title className="text-lg font-semibold">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-[#1a1a2e]/60">
            {description}
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end gap-3">
            <AlertDialog.Close className="px-4 py-2 text-sm rounded-full border border-[#e2ddd5] hover:bg-[#f3efe8]">
              {cancelLabel}
            </AlertDialog.Close>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-full text-white ${
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#6b4c9a] hover:bg-[#5a3d85]"
              } disabled:opacity-50`}
            >
              {loading ? "..." : confirmLabel}
            </button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
