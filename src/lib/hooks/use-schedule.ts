"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./use-auth";

export interface ScheduleItem {
  id: string;
  date: string;
  section: string;
  label: string;
  completed: boolean;
}

interface ScheduleHook {
  targetDate: string;
  items: ScheduleItem[];
  loading: boolean;
  setTargetDate: (date: string) => Promise<void>;
  addItem: (item: Omit<ScheduleItem, "id">) => Promise<void>;
  addItems: (items: Omit<ScheduleItem, "id">[]) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useSchedule(): ScheduleHook {
  const { currentUser } = useAuth();
  const [targetDate, setTargetDateState] = useState("");
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch schedule and target date
  useEffect(() => {
    if (!currentUser) {
      setItems([]);
      setTargetDateState("");
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      supabase
        .from("schedule_items")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("date", { ascending: true }),
      supabase
        .from("profiles")
        .select("target_date")
        .eq("id", currentUser.id)
        .single(),
    ]).then(([{ data: scheduleData }, { data: profileData }]: [{ data: ScheduleItem[] | null }, { data: { target_date: string } | null }]) => {
      setItems(
        (scheduleData || []).map((row: ScheduleItem) => ({
          id: row.id,
          date: row.date,
          section: row.section,
          label: row.label,
          completed: row.completed,
        }))
      );
      setTargetDateState(profileData?.target_date || "");
      setLoading(false);
    });
  }, [currentUser, supabase]);

  const setTargetDate = useCallback(
    async (date: string) => {
      if (!currentUser) return;
      await supabase
        .from("profiles")
        .update({ target_date: date })
        .eq("id", currentUser.id);
      setTargetDateState(date);
    },
    [currentUser, supabase]
  );

  const addItem = useCallback(
    async (item: Omit<ScheduleItem, "id">) => {
      if (!currentUser) return;
      const { data } = await supabase
        .from("schedule_items")
        .insert({ user_id: currentUser.id, ...item })
        .select()
        .single();
      if (data) {
        setItems((prev) =>
          [...prev, { id: data.id, date: data.date, section: data.section, label: data.label, completed: data.completed }]
            .sort((a, b) => a.date.localeCompare(b.date))
        );
      }
    },
    [currentUser, supabase]
  );

  const addItems = useCallback(
    async (newItems: Omit<ScheduleItem, "id">[]) => {
      if (!currentUser || newItems.length === 0) return;
      const rows = newItems.map((item) => ({ user_id: currentUser.id, ...item }));
      const { data } = await supabase.from("schedule_items").insert(rows).select();
      if (data) {
        const mapped = data.map((row: ScheduleItem) => ({
          id: row.id,
          date: row.date,
          section: row.section,
          label: row.label,
          completed: row.completed,
        }));
        setItems((prev) =>
          [...prev, ...mapped].sort((a, b) => a.date.localeCompare(b.date))
        );
      }
    },
    [currentUser, supabase]
  );

  const toggleItem = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      await supabase
        .from("schedule_items")
        .update({ completed: !item.completed })
        .eq("id", id);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
      );
    },
    [items, supabase]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      await supabase.from("schedule_items").delete().eq("id", id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [supabase]
  );

  const clearAll = useCallback(async () => {
    if (!currentUser) return;
    await supabase.from("schedule_items").delete().eq("user_id", currentUser.id);
    setItems([]);
  }, [currentUser, supabase]);

  return { targetDate, items, loading, setTargetDate, addItem, addItems, toggleItem, deleteItem, clearAll };
}
