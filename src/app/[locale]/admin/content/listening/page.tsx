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

export default function ListeningListPage() {
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
      const res = await fetch("/api/admin/content/listening");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : (data.items ?? []));
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/content/listening/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleTogglePublish = async (id: string) => {
    await fetch(`/api/admin/content/listening/${id}/publish`, { method: "POST" });
    fetchItems();
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4c9a]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="sticky top-0 z-10 bg-white border-b border-[#e2ddd5] px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/content")}
              className="p-1.5 text-[#1a1a2e]/60 hover:text-[#1a1a2e] rounded hover:bg-[#f3efe8]"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[#1a1a2e]">Listening Parts</h1>
          </div>
          <button
            onClick={() => router.push("/admin/content/listening/new")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6b4c9a] rounded-full hover:bg-[#5a3d85]"
          >
            <Plus className="w-4 h-4" />
            New Part
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <ContentListTable
          items={items}
          section="listening"
          showQuestionCount={true}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      </div>
    </main>
  );
}
