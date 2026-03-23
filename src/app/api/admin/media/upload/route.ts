import { isAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const section = formData.get("section") as string | null;
  const partId = formData.get("partId") as string | null;

  if (!file || !section || !partId) {
    return NextResponse.json(
      { error: "file, section, and partId are required" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size exceeds 50MB limit" },
      { status: 400 }
    );
  }

  const mimeType = file.type;
  if (!mimeType.startsWith("image/") && !mimeType.startsWith("audio/")) {
    return NextResponse.json(
      { error: "Only image or audio files are allowed" },
      { status: 400 }
    );
  }

  const isImage = mimeType.startsWith("image/");
  const bucket = isImage ? "test-images" : "test-audio";
  const fileType = isImage ? "image" : "audio";
  const filePath = `${section}/${partId}/${file.name}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, arrayBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
  const publicUrl = urlData.publicUrl;

  const { data: { user } } = await supabase.auth.getUser();

  const { data: media, error: insertError } = await supabase
    .from("media")
    .insert({
      file_name: file.name,
      file_path: filePath,
      file_type: fileType,
      mime_type: mimeType,
      file_size: file.size,
      uploaded_by: user!.id,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ...media, publicUrl }, { status: 201 });
}
