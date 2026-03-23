"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { ContentListTable } from "@/components/admin/content/ContentListTable";

interface ContentItem {
  id: string;
  part_id?: string;
  task_id?: string;
  title: string;
  status: "draft" | "published";
  question_count?: number;
  updated_at: string;
}

export default function SpeakingListPage() {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== "admin")) {
      router.push("/dashboard");
      return;
    }
    if (!authLoading && currentUser?.role === "admin") {
      fetchItems();
    }
  }, [authLoading, currentUser, router]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content/speaking");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : (data.items ?? []));
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/content/speaking/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleTogglePublish = async (id: string) => {
    await fetch(`/api/admin/content/speaking/${id}/publish`, { method: "POST" });
    fetchItems();
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/content")}
              className="p-1.5 text-gray-500 hover:text-gray-900 rounded hover:bg-gray-100"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Speaking Tasks</h1>
          </div>
          <button
            onClick={() => router.push("/admin/content/speaking/new")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <ContentListTable
          items={items}
          section="speaking"
          showQuestionCount={false}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      </div>
    </main>
  );
}
