"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import { Flag, ChevronLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface RedFlag {
  id: string;
  user_id: string;
  question_id: string;
  section: string;
  comment: string;
  solved: boolean;
  solved_by: string | null;
  solved_at: string | null;
  created_at: string;
  profiles: { name: string; email: string } | null;
}

type FilterTab = "all" | "open" | "solved";

function formatDate(d: string): string {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sectionColor(section: string): string {
  switch (section) {
    case "listening":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "reading":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "writing":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "speaking":
      return "bg-pink-100 text-pink-700 border-pink-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export default function RedFlagsPage() {
  const { currentUser: user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [flags, setFlags] = useState<RedFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("open");
  const [solvingId, setSolvingId] = useState<string | null>(null);

  const fetchFlags = useCallback(async () => {
    try {
      const res = await fetch("/api/admin?action=red-flags");
      if (res.ok) {
        const data = await res.json();
        setFlags(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }
    fetchFlags();
  }, [user, authLoading, router, fetchFlags]);

  const handleSolve = async (flagId: string) => {
    setSolvingId(flagId);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "solve-red-flag", flagId }),
      });
      if (res.ok) {
        setFlags((prev) =>
          prev.map((f) =>
            f.id === flagId
              ? { ...f, solved: true, solved_at: new Date().toISOString() }
              : f
          )
        );
      }
    } finally {
      setSolvingId(null);
    }
  };

  const filtered = flags.filter((f) => {
    if (filter === "open") return !f.solved;
    if (filter === "solved") return f.solved;
    return true;
  });

  const openCount = flags.filter((f) => !f.solved).length;
  const solvedCount = flags.filter((f) => f.solved).length;

  if (authLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="flex items-center gap-2 text-sm text-[#1a1a2e]/60">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e2ddd5] px-4 py-4">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-1 text-sm text-[#1a1a2e]/60 hover:text-[#1a1a2e] transition-colors"
            >
              <ChevronLeft size={16} />
              Admin
            </button>
            <div className="w-px h-5 bg-[#e2ddd5]" />
            <div className="flex items-center gap-2">
              <Flag size={18} className="text-red-500" />
              <h1 className="text-lg font-bold text-[#1a1a2e]">Red Flag Reports</h1>
            </div>
            {openCount > 0 && (
              <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs">
                {openCount} open
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "open", "solved"] as FilterTab[]).map((tab) => {
            const count =
              tab === "all" ? flags.length : tab === "open" ? openCount : solvedCount;
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-white border border-[#e2ddd5] text-[#1a1a2e]/60 hover:text-[#1a1a2e] hover:border-[#1a1a2e]/20"
                }`}
              >
                {tab === "open" && <AlertCircle size={14} />}
                {tab === "solved" && <CheckCircle size={14} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span
                  className={`ml-1 text-xs ${
                    isActive ? "text-white/70" : "text-[#1a1a2e]/30"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Flags list */}
        {filtered.length === 0 ? (
          <Card className="border-2 border-[#e2ddd5] rounded-2xl">
            <CardContent className="py-12 text-center">
              <Flag size={32} className="mx-auto text-[#e2ddd5] mb-3" />
              <p className="text-sm text-[#1a1a2e]/40">
                {filter === "open"
                  ? "No open reports. All clear!"
                  : filter === "solved"
                  ? "No solved reports yet."
                  : "No reports submitted yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((flag) => (
              <Card
                key={flag.id}
                className={`border-2 rounded-2xl transition-colors ${
                  flag.solved
                    ? "border-green-200 bg-green-50/30"
                    : "border-[#e2ddd5]"
                }`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div
                      className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        flag.solved
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {flag.solved ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Flag size={16} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                          {flag.question_id}
                        </Badge>
                        <Badge
                          className={`border text-xs ${sectionColor(
                            flag.section
                          )}`}
                        >
                          {flag.section}
                        </Badge>
                        <Badge
                          className={`border text-xs ${
                            flag.solved
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-red-100 text-red-600 border-red-200"
                          }`}
                        >
                          {flag.solved ? "Solved" : "Open"}
                        </Badge>
                      </div>

                      {/* Comment */}
                      {flag.comment && (
                        <div className="bg-white rounded-lg border border-[#e2ddd5] p-3 mb-3">
                          <p className="text-sm text-[#1a1a2e] whitespace-pre-wrap">
                            {flag.comment}
                          </p>
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-3 flex-wrap text-xs text-[#1a1a2e]/40">
                        <span>
                          Reported by{" "}
                          <span className="font-medium text-[#1a1a2e]/70">
                            {flag.profiles?.name || "Unknown"}
                          </span>{" "}
                          ({flag.profiles?.email || "—"})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(flag.created_at)}
                        </span>
                        {flag.solved && flag.solved_at && (
                          <span className="text-green-600">
                            Solved {formatDate(flag.solved_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    {!flag.solved && (
                      <Button
                        size="sm"
                        onClick={() => handleSolve(flag.id)}
                        disabled={solvingId === flag.id}
                        className="shrink-0 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs"
                      >
                        {solvingId === flag.id ? (
                          <>
                            <svg
                              className="animate-spin w-3 h-3 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Solving...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} className="mr-1" />
                            Mark Solved
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
