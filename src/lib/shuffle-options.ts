import { useMemo } from "react";
import type { Question } from "./celpip-data";

/**
 * A shuffle map: for each question ID, an array where map[shuffledIdx] = originalIdx.
 * E.g. [2, 0, 3, 1] means shuffled position 0 shows original option 2, etc.
 */
export type ShuffleMap = Record<string, number[]>;

/** Fisher-Yates shuffle (returns new array). */
function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a shuffle map for a list of questions (one random permutation per question). */
export function buildShuffleMap(questions: Question[]): ShuffleMap {
  const map: ShuffleMap = {};
  for (const q of questions) {
    map[q.id] = shuffle(q.options.map((_, i) => i));
  }
  return map;
}

/** Get options in shuffled display order. */
export function shuffledOptions(q: Question, map: ShuffleMap): string[] {
  const perm = map[q.id];
  if (!perm) return q.options;
  return perm.map((i) => q.options[i]);
}

/** Convert a shuffled display index to the original option index (for storing answers). */
export function toOriginalIndex(questionId: string, shuffledIdx: number, map: ShuffleMap): number {
  const perm = map[questionId];
  if (!perm) return shuffledIdx;
  return perm[shuffledIdx];
}

/** Convert an original option index to its shuffled display position (for highlighting selected). */
export function toShuffledIndex(questionId: string, originalIdx: number, map: ShuffleMap): number {
  const perm = map[questionId];
  if (!perm) return originalIdx;
  return perm.indexOf(originalIdx);
}

/**
 * React hook: builds a stable shuffle map once per mount for the given questions.
 * Options will be in a different random order each time the component mounts.
 */
export function useShuffleMap(questions: Question[]): ShuffleMap {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildShuffleMap(questions), [questions.length]);
}
