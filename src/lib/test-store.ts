const STORAGE_KEY = "celpip-test-state";

export type PracticeSection = "listening" | "reading" | "writing" | "speaking" | null;

export interface TestState {
  listeningAnswers: Record<string, number>;
  readingAnswers: Record<string, number>;
  writingResponses: Record<string, string>;
  speakingResponses: Record<string, string>;
  listeningTimeLeft: number;
  readingTimeLeft: number;
  writingTimeLeft: number;
  speakingTimeLeft: number;
  currentSection: string;
  completed: boolean;
  practiceMode: PracticeSection;
  resultSaved?: boolean;
}

const defaultState: TestState = {
  listeningAnswers: {},
  readingAnswers: {},
  writingResponses: {},
  speakingResponses: {},
  listeningTimeLeft: 47 * 60,
  readingTimeLeft: 55 * 60,
  writingTimeLeft: 53 * 60,
  speakingTimeLeft: 20 * 60,
  currentSection: "",
  completed: false,
  practiceMode: null,
  resultSaved: false,
};

export function getTestState(): TestState {
  if (typeof window === "undefined") return defaultState;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...defaultState };
  try {
    return JSON.parse(saved);
  } catch {
    return { ...defaultState };
  }
}

export function saveTestState(state: Partial<TestState>) {
  if (typeof window === "undefined") return;
  const current = getTestState();
  const updated = { ...current, ...state };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function resetTestState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

