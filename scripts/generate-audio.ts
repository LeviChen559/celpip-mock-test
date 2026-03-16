/**
 * Pre-generate ElevenLabs TTS audio for all listening transcripts.
 *
 * Usage:
 *   npx tsx scripts/generate-audio.ts
 *
 * Requires ELEVENLABS_API_KEY in .env.local
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY in .env.local");
  process.exit(1);
}

const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const ELEVENLABS_VOICES_URL = "https://api.elevenlabs.io/v1/voices";
const OUTPUT_DIR = path.resolve(__dirname, "../public/audio");
const MANIFEST_PATH = path.resolve(OUTPUT_DIR, "manifest.json");

// ── Import listening data ──────────────────────────────
// We need to handle TypeScript imports from the src directory.
// Instead, we'll inline the transcript parsing and read from the compiled data.

interface DialogueLine {
  speaker: string;
  text: string;
  voice: "female" | "male";
}

interface AudioManifest {
  [partId: string]: {
    lines: { file: string; speaker: string; voice: string }[];
  };
}

const FEMALE_NAMES = ["woman", "she", "her", "sarah", "jane", "mary", "lisa", "anna", "emily", "emma", "linda", "jennifer", "susan", "jessica", "karen", "nancy", "betty", "margaret", "sandra", "ashley", "dorothy", "kimberly", "donna", "carol", "ruth", "sharon", "michelle", "laura", "megan", "rachel", "amy", "angela", "nicole", "samantha", "catherine", "stephanie"];
const MALE_NAMES = ["man", "he", "him", "mike", "john", "james", "robert", "david", "william", "richard", "joseph", "thomas", "charles", "daniel", "matthew", "anthony", "mark", "paul", "steven", "andrew", "kevin", "brian", "george", "edward", "ronald", "timothy", "jason", "jeffrey", "ryan", "jacob", "gary", "nicholas", "eric", "jonathan", "tom", "alex", "bob", "fred"];

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

  // Assign voices
  const speakers = [...new Set(lines.map((l) => l.speaker))];
  const speakerVoice = new Map<string, "female" | "male">();
  let nextDefault: "female" | "male" = "female";

  for (const speaker of speakers) {
    const lower = speaker.toLowerCase();
    if (FEMALE_NAMES.some((n) => lower.includes(n))) {
      speakerVoice.set(speaker, "female");
    } else if (MALE_NAMES.some((n) => lower.includes(n))) {
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

// ── Extract transcripts from source files ──────────────
function extractListeningParts(): { id: string; transcript: string }[] {
  // Read and parse the data files to extract transcripts
  const dataPath = path.resolve(__dirname, "../src/lib/celpip-data.ts");
  const extraPath = path.resolve(__dirname, "../src/lib/listening-data-extra.ts");

  const parts: { id: string; transcript: string }[] = [];

  for (const filePath of [dataPath, extraPath]) {
    const content = fs.readFileSync(filePath, "utf-8");

    // Match id and transcript pairs using regex
    const idRegex = /id:\s*"(L\d+)"/g;
    const transcriptRegex = /transcript:\s*`([\s\S]*?)`/g;

    const ids: string[] = [];
    let match;
    while ((match = idRegex.exec(content)) !== null) {
      ids.push(match[1]);
    }

    const transcripts: string[] = [];
    while ((match = transcriptRegex.exec(content)) !== null) {
      transcripts.push(match[1]);
    }

    for (let i = 0; i < Math.min(ids.length, transcripts.length); i++) {
      parts.push({ id: ids[i], transcript: transcripts[i] });
    }
  }

  return parts;
}

// ── Resolve voices ─────────────────────────────────────
async function resolveVoices(): Promise<{ female: string; male: string }> {
  const res = await fetch(ELEVENLABS_VOICES_URL, {
    headers: { "xi-api-key": API_KEY! },
  });
  if (!res.ok) throw new Error(`Failed to fetch voices: ${res.status}`);

  const data = await res.json();
  const voices: { voice_id: string; name: string; labels?: Record<string, string> }[] = data.voices || [];

  const femaleVoice = voices.find((v) => v.labels?.gender === "female");
  const maleVoice = voices.find((v) => v.labels?.gender === "male");

  const v1 = femaleVoice || voices[0];
  const v2 = maleVoice || voices.find((v) => v.voice_id !== v1?.voice_id) || v1;

  if (!v1) throw new Error("No voices available");

  console.log(`Voices: female="${v1.name}", male="${(v2 || v1).name}"`);
  return { female: v1.voice_id, male: (v2 || v1).voice_id };
}

// ── Generate TTS audio ─────────────────────────────────
async function generateAudio(text: string, voiceId: string, outputPath: string): Promise<void> {
  const res = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.4,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`TTS failed for "${text.slice(0, 50)}...": ${res.status} ${errText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

// ── Main ───────────────────────────────────────────────
async function main() {
  console.log("Extracting listening parts...");
  const parts = extractListeningParts();
  console.log(`Found ${parts.length} listening parts`);

  console.log("Resolving voices...");
  const voiceIds = await resolveVoices();

  // Load existing manifest to skip already-generated files
  let manifest: AudioManifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (const part of parts) {
    console.log(`\nProcessing ${part.id}...`);
    const dialogue = parseDialogue(part.transcript);

    // Check if all files for this part already exist
    const existingPart = manifest[part.id];
    if (existingPart && existingPart.lines.length === dialogue.length) {
      const allExist = existingPart.lines.every((l) =>
        fs.existsSync(path.resolve(OUTPUT_DIR, l.file))
      );
      if (allExist) {
        console.log(`  Skipping ${part.id} — all ${dialogue.length} files exist`);
        skipped += dialogue.length;
        continue;
      }
    }

    manifest[part.id] = { lines: [] };

    for (let i = 0; i < dialogue.length; i++) {
      const line = dialogue[i];
      const fileName = `${part.id}-${i}.mp3`;
      const filePath = path.resolve(OUTPUT_DIR, fileName);

      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        console.log(`  [${i + 1}/${dialogue.length}] Skipping "${line.speaker}" — file exists`);
        manifest[part.id].lines.push({ file: fileName, speaker: line.speaker, voice: line.voice });
        skipped++;
        continue;
      }

      const voiceId = line.voice === "male" ? voiceIds.male : voiceIds.female;
      console.log(`  [${i + 1}/${dialogue.length}] Generating "${line.speaker}": "${line.text.slice(0, 40)}..."`);

      await generateAudio(line.text, voiceId, filePath);
      manifest[part.id].lines.push({ file: fileName, speaker: line.speaker, voice: line.voice });
      generated++;

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}`);
  console.log(`Manifest written to ${MANIFEST_PATH}`);
  console.log(`Audio files in ${OUTPUT_DIR}`);
}

main().catch(async (err) => {
  console.error("\nFatal error:", err.message || err);
  // Write partial manifest so generated files aren't wasted
  if (fs.existsSync(OUTPUT_DIR)) {
    const partialManifest: AudioManifest = {};
    const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".mp3"));
    for (const file of files) {
      const match = file.match(/^(L\d+)-(\d+)\.mp3$/);
      if (match) {
        const partId = match[1];
        if (!partialManifest[partId]) partialManifest[partId] = { lines: [] };
        partialManifest[partId].lines.push({ file, speaker: "", voice: "female" });
      }
    }
    // Sort lines within each part
    for (const partId of Object.keys(partialManifest)) {
      partialManifest[partId].lines.sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
    }
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(partialManifest, null, 2));
    console.log(`Partial manifest saved with ${files.length} files`);
  }
  process.exit(1);
});
