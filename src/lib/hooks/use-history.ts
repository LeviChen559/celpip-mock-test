"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./use-auth";

export interface TestRecord {
  id: string;
  timestamp: number;
  type: "full" | "section" | "quiz";
  section?: "listening" | "reading" | "writing" | "speaking" | null;
  quizSection?: string;
  quizPart?: string;
  scores: {
    listening?: number;
    reading?: number;
    writing?: number;
    speaking?: number;
  };
  details: {
    listening?: { correct: number; total: number };
    reading?: { correct: number; total: number };
    quiz?: { correct: number; total: number };
  };
  overallScore: number;
}

interface HistoryHook {
  records: TestRecord[];
  loading: boolean;
  addRecord: (record: Omit<TestRecord, "id"> & { id?: string }) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

function toDbRecord(record: Omit<TestRecord, "id"> & { id?: string }, userId: string) {
  return {
    ...(record.id ? { id: record.id } : {}),
    user_id: userId,
    timestamp: record.timestamp,
    type: record.type,
    section: record.section || null,
    quiz_section: record.quizSection || null,
    quiz_part: record.quizPart || null,
    scores: record.scores,
    details: record.details,
    overall_score: record.overallScore,
  };
}

function fromDbRecord(row: Record<string, unknown>): TestRecord {
  return {
    id: row.id as string,
    timestamp: row.timestamp as number,
    type: row.type as TestRecord["type"],
    section: (row.section as TestRecord["section"]) || undefined,
    quizSection: (row.quiz_section as string) || undefined,
    quizPart: (row.quiz_part as string) || undefined,
    scores: (row.scores as TestRecord["scores"]) || {},
    details: (row.details as TestRecord["details"]) || {},
    overallScore: row.overall_score as number,
  };
}

export function useHistory(): HistoryHook {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch records
  useEffect(() => {
    if (!currentUser) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("test_records")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("timestamp", { ascending: false })
      .then(({ data }: { data: Record<string, unknown>[] | null }) => {
        setRecords((data || []).map(fromDbRecord));
        setLoading(false);
      });
  }, [currentUser, supabase]);

  const addRecord = useCallback(
    async (record: Omit<TestRecord, "id"> & { id?: string }) => {
      if (!currentUser) return;
      const dbRow = toDbRecord(record, currentUser.id);
      const { data } = await supabase
        .from("test_records")
        .insert(dbRow)
        .select()
        .single();
      if (data) {
        setRecords((prev) => [fromDbRecord(data), ...prev]);
      }
    },
    [currentUser, supabase]
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      await supabase.from("test_records").delete().eq("id", id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    },
    [supabase]
  );

  const clearAll = useCallback(async () => {
    if (!currentUser) return;
    await supabase.from("test_records").delete().eq("user_id", currentUser.id);
    setRecords([]);
  }, [currentUser, supabase]);

  return { records, loading, addRecord, deleteRecord, clearAll };
}
