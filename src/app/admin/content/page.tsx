"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Headphones, BookOpen, PenTool, Mic } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface SectionStats {
  total: number;
  published: number;
  draft: number;
}

const SECTIONS = [
  { key: "listening", label: "Listening", icon: Headphones },
  { key: "reading", label: "Reading", icon: BookOpen },
  { key: "writing", label: "Writing", icon: PenTool },
  { key: "speaking", label: "Speaking", icon: Mic },
] as const;

export default function ContentDashboardPage() {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Record<string, SectionStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== "admin")) {
      router.push("/dashboard");
      return;
    }
    if (!authLoading && currentUser?.role === "admin") {
      fetchAllStats();
    }
  }, [authLoading, currentUser, router]);

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        SECTIONS.map(async (s) => {
          const res = await fetch(`/api/admin/content/${s.key}`);
          const data = await res.json();
          const items: { status: string }[] = Array.isArray(data) ? data : (data.items ?? []);
          const published = items.filter((i) => i.status === "published").length;
          const draft = items.filter((i) => i.status === "draft").length;
          return { key: s.key, total: items.length, published, draft };
        })
      );
      const map: Record<string, SectionStats> = {};
      for (const r of results) {
        map[r.key] = { total: r.total, published: r.published, draft: r.draft };
      }
      setStats(map);
    } catch {
      // fail silently, stats will show zeros
    }
    setLoading(false);
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
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Content Management</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-6">Select a section to manage its content.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SECTIONS.map(({ key, label, icon: Icon }) => {
            const s = stats[key] ?? { total: 0, published: 0, draft: 0 };
            return (
              <button
                key={key}
                onClick={() => router.push(`/admin/content/${key}`)}
                className="text-left bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{s.total}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{s.published}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Published</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{s.draft}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Draft</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
