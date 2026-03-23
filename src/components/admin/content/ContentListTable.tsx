"use client";

import { useRouter } from "next/navigation";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";

interface ContentItem {
  id: string;
  part_id?: string;
  task_id?: string;
  title: string;
  status: "draft" | "published";
  question_count?: number;
  updated_at: string;
}

interface ContentListTableProps {
  items: ContentItem[];
  section: string;
  showQuestionCount?: boolean;
  onDelete: (id: string) => void | Promise<void>;
  onTogglePublish: (id: string) => void | Promise<void>;
}

export function ContentListTable({
  items,
  section,
  showQuestionCount = false,
  onDelete,
  onTogglePublish,
}: ContentListTableProps) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-[#e2ddd5]">
      <table className="min-w-full divide-y divide-[#e2ddd5] bg-white">
        <thead className="bg-[#faf8f5]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a2e]/60 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a2e]/60 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a2e]/60 uppercase tracking-wider">
              Status
            </th>
            {showQuestionCount && (
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a2e]/60 uppercase tracking-wider">
                Questions
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a2e]/60 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#1a1a2e]/60 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e2ddd5]">
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={showQuestionCount ? 6 : 5}
                className="px-4 py-8 text-center text-sm text-[#1a1a2e]/60"
              >
                No items found. Create your first one!
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const itemId = item.part_id ?? item.task_id ?? item.id;
              return (
                <tr key={item.id} className="hover:bg-[#f3efe8]">
                  <td className="px-4 py-3 text-sm font-mono text-[#1a1a2e]/60 whitespace-nowrap">
                    {itemId}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1a1a2e]">
                    {item.title}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  {showQuestionCount && (
                    <td className="px-4 py-3 text-sm text-[#1a1a2e]/60">
                      {item.question_count ?? 0}
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-[#1a1a2e]/60 whitespace-nowrap">
                    {formatDate(item.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/admin/content/${section}/${item.id}/edit`
                          )
                        }
                        className="p-1 text-[#1a1a2e]/60 hover:text-[#6b4c9a]"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* Publish / Unpublish */}
                      <ConfirmDialog
                        trigger={
                          <button
                            type="button"
                            className="p-1 text-[#1a1a2e]/60 hover:text-green-600"
                            aria-label={
                              item.status === "published"
                                ? "Unpublish"
                                : "Publish"
                            }
                          >
                            {item.status === "published" ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                        title={
                          item.status === "published"
                            ? "Unpublish Content"
                            : "Publish Content"
                        }
                        description={
                          item.status === "published"
                            ? `Are you sure you want to unpublish "${item.title}"? It will no longer be visible to users.`
                            : `Are you sure you want to publish "${item.title}"? It will become visible to users.`
                        }
                        confirmLabel={
                          item.status === "published" ? "Unpublish" : "Publish"
                        }
                        onConfirm={() => onTogglePublish(item.id)}
                      />

                      {/* Delete */}
                      <ConfirmDialog
                        trigger={
                          <button
                            type="button"
                            className="p-1 text-[#1a1a2e]/60 hover:text-red-600"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        }
                        title="Delete Content"
                        description={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
                        confirmLabel="Delete"
                        variant="danger"
                        onConfirm={() => onDelete(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
