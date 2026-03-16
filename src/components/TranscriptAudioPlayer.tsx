"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface TranscriptAudioPlayerProps {
  transcript: string;
  mode: "audio" | "text";
  autoPlay?: boolean;
  partId?: string;
  /** The correct answer text — the transcript sentence containing it will be highlighted. */
  highlightAnswer?: string;
}

type PlayStatus = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

interface DialogueLine {
  speaker: string;
  text: string;
  voice: "female" | "male";
}

/** Parse transcript into speaker-labelled dialogue lines with voice assignment. */
function parseDialogue(transcript: string): DialogueLine[] {
  const lines: DialogueLine[] = [];
  const rawLines = transcript.split("\n").filter((l) => l.trim());

  let currentSpeaker = "";
  let currentText = "";

  for (const line of rawLines) {
    const match = line.match(/^([A-Za-z][A-Za-z\s.'-]{0,30}):\s*(.+)/);
    if (match) {
      if (currentSpeaker && currentText.trim()) {
        lines.push({ speaker: currentSpeaker, text: currentText.trim(), voice: "female" });
      }
      currentSpeaker = match[1].trim();
      currentText = match[2];
    } else {
      currentText += " " + line.trim();
    }
  }
  if (currentSpeaker && currentText.trim()) {
    lines.push({ speaker: currentSpeaker, text: currentText.trim(), voice: "female" });
  }

  if (lines.length === 0) {
    lines.push({ speaker: "", text: transcript, voice: "female" });
  }

  // Assign voices: alternate between speakers
  const speakers = [...new Set(lines.map((l) => l.speaker))];
  const femaleNames = ["woman", "she", "her", "sarah", "jane", "mary", "lisa", "anna", "emily", "emma", "linda", "jennifer", "susan", "jessica", "karen", "nancy", "betty", "margaret", "sandra", "ashley", "dorothy", "kimberly", "donna", "carol", "ruth", "sharon", "michelle", "laura", "megan", "rachel", "amy", "angela", "nicole", "samantha", "catherine", "stephanie"];
  const maleNames = ["man", "he", "him", "mike", "john", "james", "robert", "david", "william", "richard", "joseph", "thomas", "charles", "daniel", "matthew", "anthony", "mark", "paul", "steven", "andrew", "kevin", "brian", "george", "edward", "ronald", "timothy", "jason", "jeffrey", "ryan", "jacob", "gary", "nicholas", "eric", "jonathan", "tom", "alex", "bob", "fred"];

  const speakerVoice = new Map<string, "female" | "male">();
  let nextDefault: "female" | "male" = "female";

  for (const speaker of speakers) {
    const lower = speaker.toLowerCase();
    if (femaleNames.some((n) => lower.includes(n))) {
      speakerVoice.set(speaker, "female");
    } else if (maleNames.some((n) => lower.includes(n))) {
      speakerVoice.set(speaker, "male");
    } else {
      speakerVoice.set(speaker, nextDefault);
      nextDefault = nextDefault === "female" ? "male" : "female";
    }
  }

  for (const line of lines) {
    line.voice = speakerVoice.get(line.speaker) || "female";
  }

  return lines;
}

/** Audio manifest type for pre-generated files. */
interface AudioManifest {
  [partId: string]: {
    lines: { file: string; speaker: string; voice: string }[];
  };
}

let cachedManifest: AudioManifest | null = null;
let manifestLoading: Promise<AudioManifest | null> | null = null;

/** Load the pre-generated audio manifest. */
async function loadManifest(): Promise<AudioManifest | null> {
  if (cachedManifest) return cachedManifest;
  if (manifestLoading) return manifestLoading;

  manifestLoading = fetch("/audio/manifest.json")
    .then((res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .then((data) => {
      cachedManifest = data;
      return data;
    })
    .catch(() => null);

  return manifestLoading;
}

/** Fetch TTS audio from our API route (fallback for parts without pre-generated audio). */
async function fetchTTSAudio(text: string, voice: "female" | "male"): Promise<string> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });

  if (!res.ok) {
    throw new Error(`TTS request failed: ${res.status}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Extract keywords from the correct answer and find the best matching sentence
 * in the transcript. Returns the original transcript lines split for rendering
 * with a flag indicating which line(s) to highlight.
 */
function findHighlightLines(transcript: string, answerText: string): Set<number> {
  if (!answerText) return new Set();

  const lines = transcript.split("\n").filter((l) => l.trim());
  const answerLower = answerText.toLowerCase();

  // Extract meaningful keywords (skip very short/common words)
  const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "and", "or", "but", "with", "that", "this", "it", "they", "them", "their", "its", "not", "from", "by", "as", "be", "has", "have", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "can", "about"]);
  const keywords = answerLower
    .replace(/[^a-z0-9\s$%.,'-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (keywords.length === 0) return new Set();

  // Score each line by how many keywords it contains
  const matchedLines = new Set<number>();
  let bestScore = 0;
  let bestLineIdx = -1;

  lines.forEach((line, idx) => {
    const lineLower = line.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (lineLower.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestLineIdx = idx;
    }
  });

  // Only highlight if at least 1 keyword matched
  if (bestScore >= 1 && bestLineIdx >= 0) {
    matchedLines.add(bestLineIdx);
  }

  return matchedLines;
}

export default function TranscriptAudioPlayer({
  transcript,
  mode,
  autoPlay = false,
  partId,
  highlightAnswer,
}: TranscriptAudioPlayerProps) {
  const [status, setStatus] = useState<PlayStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState("");
  const dialogueRef = useRef<DialogueLine[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const cancelledRef = useRef(false);
  const playLineRef = useRef<(index: number) => void>(() => {});
  const manifestRef = useRef<AudioManifest | null>(null);
  const partIdRef = useRef(partId);
  partIdRef.current = partId;

  // Load manifest on mount
  useEffect(() => {
    loadManifest().then((m) => { manifestRef.current = m; });
  }, []);

  // Compute highlighted lines for text mode
  const highlightedLines = useMemo(() => {
    if (!highlightAnswer) return new Set<number>();
    return findHighlightLines(transcript, highlightAnswer);
  }, [transcript, highlightAnswer]);

  // Parse dialogue when transcript changes
  const dialogue = useMemo(() => parseDialogue(transcript), [transcript]);
  useEffect(() => {
    dialogueRef.current = dialogue;
  }, [dialogue]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
      audioCacheRef.current.forEach((url) => URL.revokeObjectURL(url));
      audioCacheRef.current.clear();
    };
  }, [cancel]);

  // Use a ref for recursive playLine to avoid declaration-order issues
  const playLine = useCallback(
    async (index: number) => {
      const lines = dialogueRef.current;
      if (index >= lines.length || cancelledRef.current) {
        if (!cancelledRef.current) {
          setStatus("ended");
          setProgress(100);
        }
        return;
      }

      const line = lines[index];
      setCurrentSpeaker(line.speaker);
      setProgress(Math.round((index / lines.length) * 100));

      // Check for pre-generated static audio file
      const currentPartId = partIdRef.current;
      const manifest = manifestRef.current;
      const staticEntry = currentPartId && manifest?.[currentPartId]?.lines[index];
      const hasStatic = staticEntry && staticEntry.file;

      let audioUrl: string | undefined;

      if (hasStatic) {
        // Use pre-generated static file — no API call needed
        audioUrl = `/audio/${staticEntry.file}`;
      } else {
        // Fallback: call ElevenLabs API at runtime
        const cacheKey = `${line.voice}:${line.text}`;
        audioUrl = audioCacheRef.current.get(cacheKey);

        if (!audioUrl) {
          setStatus("loading");
          try {
            audioUrl = await fetchTTSAudio(line.text, line.voice);
            audioCacheRef.current.set(cacheKey, audioUrl);
          } catch {
            setStatus("error");
            return;
          }
        }
      }

      if (cancelledRef.current) return;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setStatus("playing");

      audio.onended = () => {
        playLineRef.current(index + 1);
      };

      audio.onerror = () => {
        if (!cancelledRef.current) {
          setStatus("error");
        }
      };

      audio.play().catch(() => {
        if (!cancelledRef.current) setStatus("error");
      });
    },
    []
  );

  // Keep the ref in sync
  useEffect(() => {
    playLineRef.current = playLine;
  }, [playLine]);

  const play = useCallback(() => {
    cancelledRef.current = false;

    if (status === "paused" && audioRef.current) {
      audioRef.current.play();
      setStatus("playing");
      return;
    }

    cancel();
    cancelledRef.current = false;
    dialogueRef.current = parseDialogue(transcript);
    setProgress(0);
    playLine(0);
  }, [status, transcript, cancel, playLine]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
    }
  }, []);

  const stop = useCallback(() => {
    cancel();
    cancelledRef.current = false;
    setStatus("idle");
    setProgress(0);
    setCurrentSpeaker("");
  }, [cancel]);

  // Auto-play on part change
  useEffect(() => {
    if (autoPlay && mode === "audio") {
      cancelledRef.current = false;
      const timer = setTimeout(() => {
        dialogueRef.current = parseDialogue(transcript);
        playLine(0);
      }, 300);
      return () => {
        clearTimeout(timer);
        cancel();
        cancelledRef.current = false;
      };
    }
  }, [partId, autoPlay, mode, transcript, playLine, cancel]);

  // Text mode — with optional answer highlighting
  if (mode === "text") {
    const lines = transcript.split("\n").filter((l) => l.trim());

    return (
      <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Transcript
        </p>
        <div className="text-sm leading-relaxed space-y-1.5">
          {lines.map((line, idx) => {
            const isHighlighted = highlightedLines.has(idx);
            return (
              <p
                key={idx}
                className={
                  isHighlighted
                    ? "bg-yellow-100 border-l-4 border-yellow-400 pl-2 py-0.5 rounded-r"
                    : ""
                }
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback if no audio support needed for text-only — skip to audio mode below

  const statusLabel =
    status === "loading"
      ? "Loading audio..."
      : status === "playing"
      ? `Playing${currentSpeaker ? ` — ${currentSpeaker}` : ""}...`
      : status === "paused"
      ? "Paused"
      : status === "ended"
      ? "Audio ended"
      : status === "error"
      ? "Audio failed — try again"
      : "Ready to play";

  return (
    <div className="bg-muted rounded-lg p-4">
      <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
        Audio
      </p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === "playing" || status === "loading" ? (
            <Button variant="outline" size="sm" onClick={pause} disabled={status === "loading"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              <span className="ml-1">{status === "loading" ? "Loading..." : "Pause"}</span>
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={play}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              <span className="ml-1">{status === "ended" || status === "error" ? "Replay" : "Play"}</span>
            </Button>
          )}
          {status !== "idle" && (
            <Button variant="ghost" size="sm" onClick={stop}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
              <span className="ml-1">Stop</span>
            </Button>
          )}
        </div>

        <span className="text-xs text-muted-foreground">{statusLabel}</span>
      </div>
    </div>
  );
}
