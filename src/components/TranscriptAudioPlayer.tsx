"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface TranscriptAudioPlayerProps {
  transcript: string;
  mode: "audio" | "text";
  autoPlay?: boolean;
  partId?: string;
}

type PlayStatus = "idle" | "playing" | "paused" | "ended";

interface DialogueLine {
  speaker: string;
  text: string;
}

/** Parse transcript into speaker-labelled dialogue lines. */
function parseDialogue(transcript: string): DialogueLine[] {
  const lines: DialogueLine[] = [];
  // Match lines like "Speaker Name: dialogue text"
  // Split on newlines, then detect speaker labels
  const rawLines = transcript.split("\n").filter((l) => l.trim());

  let currentSpeaker = "";
  let currentText = "";

  for (const line of rawLines) {
    const match = line.match(/^([A-Za-z][A-Za-z\s.'-]{0,30}):\s*(.+)/);
    if (match) {
      // Save previous line if any
      if (currentSpeaker && currentText.trim()) {
        lines.push({ speaker: currentSpeaker, text: currentText.trim() });
      }
      currentSpeaker = match[1].trim();
      currentText = match[2];
    } else {
      // Continuation of previous speaker's line
      currentText += " " + line.trim();
    }
  }
  // Push last line
  if (currentSpeaker && currentText.trim()) {
    lines.push({ speaker: currentSpeaker, text: currentText.trim() });
  }

  // Fallback: if no speakers detected, treat as single narrator
  if (lines.length === 0) {
    lines.push({ speaker: "", text: transcript });
  }

  return lines;
}

/** Split a long line into sentence-based chunks to avoid Chrome's ~15s TTS cutoff. */
function splitIntoSentenceChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > 200) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

interface SpeechSegment {
  speaker: string;
  text: string;
}

/** Build flat list of speech segments (each ≤200 chars) with speaker info preserved. */
function buildSegments(dialogue: DialogueLine[]): SpeechSegment[] {
  const segments: SpeechSegment[] = [];
  for (const line of dialogue) {
    const chunks = splitIntoSentenceChunks(line.text);
    for (const chunk of chunks) {
      segments.push({ speaker: line.speaker, text: chunk });
    }
  }
  return segments;
}

/** Pick two distinct voices, preferring one that sounds female and one male. */
function pickVoices(): Map<string, SpeechSynthesisVoice> {
  const voices = window.speechSynthesis.getVoices();
  const enVoices = voices.filter(
    (v) => v.lang.startsWith("en") && !v.name.includes("Novelty")
  );
  if (enVoices.length === 0) return new Map();

  // Try to find voices with gendered names
  const femaleHints = ["female", "woman", "samantha", "karen", "victoria", "fiona", "moira", "tessa", "zira"];
  const maleHints = ["male", "daniel", "alex", "tom", "david", "james", "fred", "gordon"];

  const femaleVoice = enVoices.find((v) =>
    femaleHints.some((h) => v.name.toLowerCase().includes(h))
  );
  const maleVoice = enVoices.find((v) =>
    maleHints.some((h) => v.name.toLowerCase().includes(h))
  );

  const voiceMap = new Map<string, SpeechSynthesisVoice>();
  if (femaleVoice) voiceMap.set("female", femaleVoice);
  if (maleVoice) voiceMap.set("male", maleVoice);

  // Fallback: just pick first two distinct voices
  if (voiceMap.size < 2 && enVoices.length >= 2) {
    voiceMap.set("voice1", enVoices[0]);
    voiceMap.set("voice2", enVoices[1]);
  } else if (voiceMap.size === 0 && enVoices.length >= 1) {
    voiceMap.set("voice1", enVoices[0]);
  }

  return voiceMap;
}

/** Guess gender from speaker name for voice assignment. */
function guessSpeakerGender(name: string): "female" | "male" | "unknown" {
  const lower = name.toLowerCase();
  const femaleNames = ["woman", "she", "her", "sarah", "jane", "mary", "lisa", "anna", "emily", "emma", "linda", "jennifer", "susan", "jessica", "karen", "nancy", "betty", "margaret", "sandra", "ashley", "dorothy", "kimberly", "donna", "carol", "ruth", "sharon", "michelle", "laura", "megan", "rachel", "amy", "angela", "nicole", "samantha", "catherine", "stephanie"];
  const maleNames = ["man", "he", "him", "mike", "john", "james", "robert", "david", "william", "richard", "joseph", "thomas", "charles", "daniel", "matthew", "anthony", "mark", "paul", "steven", "andrew", "kevin", "brian", "george", "edward", "ronald", "timothy", "jason", "jeffrey", "ryan", "jacob", "gary", "nicholas", "eric", "jonathan", "tom", "alex", "bob", "fred"];

  if (femaleNames.some((n) => lower.includes(n))) return "female";
  if (maleNames.some((n) => lower.includes(n))) return "male";
  return "unknown";
}

export default function TranscriptAudioPlayer({
  transcript,
  mode,
  autoPlay = false,
  partId,
}: TranscriptAudioPlayerProps) {
  const [status, setStatus] = useState<PlayStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [supported, setSupported] = useState(true);
  const segmentsRef = useRef<SpeechSegment[]>([]);
  const currentSegmentRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceMapRef = useRef<Map<string, SpeechSynthesisVoice>>(new Map());
  const speakerVoiceAssignmentRef = useRef<Map<string, { voice?: SpeechSynthesisVoice; pitch: number }>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    // Voices may load asynchronously
    const loadVoices = () => {
      voiceMapRef.current = pickVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    currentSegmentRef.current = 0;
  }, []);

  // Assign voices/pitch to speakers
  const assignVoices = useCallback((segments: SpeechSegment[]) => {
    const speakers = [...new Set(segments.map((s) => s.speaker).filter(Boolean))];
    const assignment = new Map<string, { voice?: SpeechSynthesisVoice; pitch: number }>();
    const voiceMap = voiceMapRef.current;

    const femaleVoice = voiceMap.get("female");
    const maleVoice = voiceMap.get("male");
    const voice1 = voiceMap.get("voice1");
    const voice2 = voiceMap.get("voice2");

    speakers.forEach((speaker, idx) => {
      const gender = guessSpeakerGender(speaker);

      if (femaleVoice && maleVoice) {
        // Best case: we have gendered voices
        if (gender === "female") {
          assignment.set(speaker, { voice: femaleVoice, pitch: 1.1 });
        } else if (gender === "male") {
          assignment.set(speaker, { voice: maleVoice, pitch: 0.9 });
        } else {
          // Alternate assignment
          assignment.set(speaker, idx % 2 === 0
            ? { voice: femaleVoice, pitch: 1.1 }
            : { voice: maleVoice, pitch: 0.9 });
        }
      } else if (voice1 && voice2) {
        // Fallback: two different voices with pitch variation
        assignment.set(speaker, idx % 2 === 0
          ? { voice: voice1, pitch: 1.15 }
          : { voice: voice2, pitch: 0.85 });
      } else {
        // Last resort: only pitch differentiation
        assignment.set(speaker, { pitch: idx % 2 === 0 ? 1.15 : 0.85 });
      }
    });

    speakerVoiceAssignmentRef.current = assignment;
  }, []);

  // Reset when part changes
  useEffect(() => {
    cancel();
    setStatus("idle");
    setProgress(0);
    const dialogue = parseDialogue(transcript);
    const segments = buildSegments(dialogue);
    segmentsRef.current = segments;
    currentSegmentRef.current = 0;
    assignVoices(segments);
  }, [partId, transcript, cancel, assignVoices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  const speakSegment = useCallback(
    (index: number) => {
      const segments = segmentsRef.current;
      if (index >= segments.length) {
        setStatus("ended");
        setProgress(100);
        return;
      }

      const segment = segments[index];
      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.rate = 0.95;

      // Apply speaker-specific voice and pitch
      const voiceConfig = speakerVoiceAssignmentRef.current.get(segment.speaker);
      if (voiceConfig) {
        if (voiceConfig.voice) utterance.voice = voiceConfig.voice;
        utterance.pitch = voiceConfig.pitch;
      } else {
        utterance.pitch = 1;
      }

      utteranceRef.current = utterance;
      currentSegmentRef.current = index;

      utterance.onstart = () => {
        setStatus("playing");
      };

      utterance.onboundary = (e) => {
        const charsBefore = segments.slice(0, index).reduce((sum, s) => sum + s.text.length, 0);
        const totalLen = segments.reduce((sum, s) => sum + s.text.length, 0);
        const currentProgress = ((charsBefore + e.charIndex) / totalLen) * 100;
        setProgress(Math.min(currentProgress, 100));
      };

      utterance.onend = () => {
        speakSegment(index + 1);
      };

      utterance.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") {
          setStatus("ended");
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const play = useCallback(() => {
    if (!window.speechSynthesis) return;

    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }

    cancel();
    const dialogue = parseDialogue(transcript);
    const segments = buildSegments(dialogue);
    segmentsRef.current = segments;
    assignVoices(segments);
    setProgress(0);
    speakSegment(0);
  }, [status, transcript, cancel, speakSegment, assignVoices]);

  const pause = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  const stop = useCallback(() => {
    cancel();
    setStatus("idle");
    setProgress(0);
  }, [cancel]);

  // Auto-play on part change
  useEffect(() => {
    if (autoPlay && mode === "audio" && supported) {
      const timer = setTimeout(() => {
        const dialogue = parseDialogue(transcript);
        const segments = buildSegments(dialogue);
        segmentsRef.current = segments;
        assignVoices(segments);
        speakSegment(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [partId, autoPlay, mode, supported, transcript, speakSegment, assignVoices]);

  // Text mode: just show the transcript
  if (mode === "text") {
    return (
      <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Transcript
        </p>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {transcript}
        </p>
      </div>
    );
  }

  // Fallback if TTS not supported
  if (!supported) {
    return (
      <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
        <p className="text-xs font-medium text-amber-600 mb-2 uppercase tracking-wide">
          Audio not supported in this browser — showing transcript
        </p>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {transcript}
        </p>
      </div>
    );
  }

  // Audio mode
  const statusLabel =
    status === "playing"
      ? "Playing audio..."
      : status === "paused"
      ? "Paused"
      : status === "ended"
      ? "Audio ended"
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
          {status === "playing" ? (
            <Button variant="outline" size="sm" onClick={pause}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              <span className="ml-1">Pause</span>
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={play}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              <span className="ml-1">{status === "ended" ? "Replay" : "Play"}</span>
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
