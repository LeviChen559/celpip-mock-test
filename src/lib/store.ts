import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Auth Store ───────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

interface AuthState {
  users: User[];
  currentUser: Omit<User, "passwordHash"> | null;
  register: (name: string, email: string, password: string) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
}

// Simple hash for client-side demo (NOT production-secure)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      register: (name, email, password) => {
        const { users } = get();
        if (users.some((u) => u.email === email)) {
          return "An account with this email already exists.";
        }
        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          passwordHash: simpleHash(password),
          createdAt: Date.now(),
        };
        set({
          users: [...users, newUser],
          currentUser: { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt },
        });
        return null;
      },
      login: (email, password) => {
        const { users } = get();
        const user = users.find((u) => u.email === email);
        if (!user) return "No account found with this email.";
        if (user.passwordHash !== simpleHash(password)) return "Incorrect password.";
        set({ currentUser: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } });
        return null;
      },
      logout: () => set({ currentUser: null }),
    }),
    { name: "celpip-auth" }
  )
);

// ─── Types ─────────────────────────────────────────────

export type PracticeSection = "listening" | "reading" | "writing" | "speaking" | null;
export type TestType = "full" | "section" | "quiz";

export interface TestRecord {
  id: string;
  timestamp: number;
  type: TestType;
  section?: PracticeSection;
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

export interface ScheduleItem {
  id: string;
  date: string;
  section: string;
  label: string;
  completed: boolean;
}

// ─── Test State Store ──────────────────────────────────

interface TestState {
  listeningAnswers: Record<string, number>;
  readingAnswers: Record<string, number>;
  writingResponses: Record<string, string>;
  speakingResponses: Record<string, string>;
  listeningTimeLeft: number;
  readingTimeLeft: number;
  writingTimeLeft: number;
  speakingTimeLeft: number;
  practiceMode: PracticeSection;
  resultSaved: boolean;

  update: (partial: Partial<Omit<TestState, "update" | "reset">>) => void;
  reset: () => void;
}

const testDefaults = {
  listeningAnswers: {} as Record<string, number>,
  readingAnswers: {} as Record<string, number>,
  writingResponses: {} as Record<string, string>,
  speakingResponses: {} as Record<string, string>,
  listeningTimeLeft: 47 * 60,
  readingTimeLeft: 55 * 60,
  writingTimeLeft: 53 * 60,
  speakingTimeLeft: 20 * 60,
  practiceMode: null as PracticeSection,
  resultSaved: false,
};

export const useTestStore = create<TestState>()(
  persist(
    (set) => ({
      ...testDefaults,
      update: (partial) => set(partial),
      reset: () => set(testDefaults),
    }),
    { name: "celpip-test-state" }
  )
);

// ─── History Store ─────────────────────────────────────

interface HistoryState {
  records: TestRecord[];
  addRecord: (record: TestRecord) => void;
  deleteRecord: (id: string) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({ records: [record, ...state.records] })),
      deleteRecord: (id) =>
        set((state) => ({ records: state.records.filter((r) => r.id !== id) })),
      clearAll: () => set({ records: [] }),
    }),
    { name: "celpip-test-history" }
  )
);

// ─── Schedule Store ────────────────────────────────────

interface ScheduleState {
  targetDate: string;
  items: ScheduleItem[];
  setTargetDate: (date: string) => void;
  addItem: (item: ScheduleItem) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      targetDate: "",
      items: [],
      setTargetDate: (date) => set({ targetDate: date }),
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item].sort((a, b) => a.date.localeCompare(b.date)),
        })),
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, completed: !i.completed } : i
          ),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
    }),
    { name: "celpip-study-schedule" }
  )
);
