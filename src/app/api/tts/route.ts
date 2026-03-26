import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const ELEVENLABS_VOICES_URL = "https://api.elevenlabs.io/v1/voices";

// Cache resolved voice IDs so we only fetch once per server lifecycle
let resolvedVoices: { female: string; male: string } | null = null;

/** Fetch available voices from the user's account and pick two distinct ones. */
async function getVoiceIds(apiKey: string): Promise<{ female: string; male: string }> {
  if (resolvedVoices) return resolvedVoices;

  console.log("Using API key ending in:", apiKey.slice(-6));
  const res = await fetch(ELEVENLABS_VOICES_URL, {
    headers: { "xi-api-key": apiKey },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch voices: ${res.status} - ${body}`);
  }

  const data = await res.json();
  const voices: { voice_id: string; name: string; labels?: Record<string, string> }[] =
    data.voices || [];

  // Strictly find one female and one male voice by gender label
  const femaleVoice = voices.find((v) => v.labels?.gender === "female");
  const maleVoice = voices.find((v) => v.labels?.gender === "male");

  const v1 = femaleVoice || voices[0];
  const v2 = maleVoice || voices.find((v) => v.voice_id !== v1?.voice_id) || v1;

  if (!v1) {
    throw new Error("No voices available on this account");
  }

  resolvedVoices = { female: v1.voice_id, male: (v2 || v1).voice_id };
  console.log(
    `ElevenLabs voices: female="${v1.name}" (${v1.voice_id}), male="${(v2 || v1).name}" (${(v2 || v1).voice_id})`
  );
  return resolvedVoices;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY not configured" },
      { status: 500 }
    );
  }

  // --- Auth & usage limit ---
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // --- End auth & usage limit ---

  const { text, voice } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  let voiceIds: { female: string; male: string };
  try {
    voiceIds = await getVoiceIds(apiKey);
  } catch (e) {
    console.error("Failed to resolve voices:", e);
    return NextResponse.json({ error: "Failed to resolve voices" }, { status: 500 });
  }

  const voiceId = voice === "male" ? voiceIds.male : voiceIds.female;

  const res = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
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
    console.error("ElevenLabs error:", res.status, errText);

    // If voice failed, clear cache so next request retries voice resolution
    if (res.status === 402 || res.status === 403) {
      resolvedVoices = null;
    }

    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: res.status }
    );
  }

  const audioBuffer = await res.arrayBuffer();

  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
