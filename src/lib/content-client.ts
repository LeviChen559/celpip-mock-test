import {
  listeningParts as hardcodedListening,
  readingParts as hardcodedReading,
  writingTasks as hardcodedWriting,
  speakingTasks as hardcodedSpeaking,
  listeningPartsOfficial as hardcodedListeningOfficial,
  readingPartsOfficial as hardcodedReadingOfficial,
  writingTasksOfficial as hardcodedWritingOfficial,
  speakingTasksOfficial as hardcodedSpeakingOfficial,
  type ListeningPart,
  type ReadingPart,
  type WritingTask,
  type SpeakingTask,
} from "./celpip-data";

const FALLBACKS = {
  listening: { all: hardcodedListening, official: hardcodedListeningOfficial },
  reading: { all: hardcodedReading, official: hardcodedReadingOfficial },
  writing: { all: hardcodedWriting, official: hardcodedWritingOfficial },
  speaking: { all: hardcodedSpeaking, official: hardcodedSpeakingOfficial },
};

// Cache to avoid refetching on every render
const cache: Record<string, { data: unknown[]; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchSection<T>(section: string): Promise<T[] | null> {
  const now = Date.now();
  const cached = cache[section];
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data as T[];
  }

  try {
    const res = await fetch(`/api/content/${section}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    cache[section] = { data, timestamp: now };
    return data as T[];
  } catch {
    return null;
  }
}

export async function getListeningPartsClient(): Promise<ListeningPart[]> {
  const data = await fetchSection<ListeningPart>("listening");
  return data || FALLBACKS.listening.all;
}

export async function getReadingPartsClient(): Promise<ReadingPart[]> {
  const data = await fetchSection<ReadingPart>("reading");
  return data || FALLBACKS.reading.all;
}

export async function getWritingTasksClient(): Promise<WritingTask[]> {
  const data = await fetchSection<WritingTask>("writing");
  return data || FALLBACKS.writing.all;
}

export async function getSpeakingTasksClient(): Promise<SpeakingTask[]> {
  const data = await fetchSection<SpeakingTask>("speaking");
  return data || FALLBACKS.speaking.all;
}
