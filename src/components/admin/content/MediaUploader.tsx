"use client";

import { useRef, useState } from "react";
import { Upload, X, Image, Music } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

interface MediaUploaderProps {
  section: string;
  partId: string;
  currentImageUrl?: string | null;
  currentAudioUrl?: string | null;
  onImageUploaded: (url: string, mediaId: string) => void;
  onAudioUploaded: (url: string, mediaId: string) => void;
  onImageRemoved: () => void;
  onAudioRemoved: () => void;
}

export function MediaUploader({
  section,
  partId,
  currentImageUrl,
  currentAudioUrl,
  onImageUploaded,
  onAudioUploaded,
  onImageRemoved,
  onAudioRemoved,
}: MediaUploaderProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const uploadFile = async (
    file: File,
    type: "image" | "audio"
  ): Promise<{ url: string; mediaId: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", section);
    formData.append("partId", partId);

    const res = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? `Failed to upload ${type}`);
    }

    const data = await res.json();
    return { url: data.url, mediaId: data.id };
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const { url, mediaId } = await uploadFile(file, "image");
      onImageUploaded(url, mediaId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAudio(true);
    try {
      const { url, mediaId } = await uploadFile(file, "audio");
      onAudioUploaded(url, mediaId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload audio");
    } finally {
      setUploadingAudio(false);
      if (audioInputRef.current) audioInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        {currentImageUrl ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageUrl}
              alt="Content image"
              className="h-32 w-auto rounded border border-gray-200 object-cover"
            />
            <ConfirmDialog
              trigger={
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              }
              title="Remove Image"
              description="Are you sure you want to remove this image?"
              confirmLabel="Remove"
              variant="danger"
              onConfirm={onImageRemoved}
            />
          </div>
        ) : (
          <div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploadingImage}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
            >
              {uploadingImage ? (
                <span className="text-gray-500">Uploading...</span>
              ) : (
                <>
                  <Image className="h-4 w-4 text-gray-400" />
                  <Upload className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Upload Image</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Audio Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Audio
        </label>
        {currentAudioUrl ? (
          <div className="flex items-center gap-2">
            <audio controls src={currentAudioUrl} className="h-10" />
            <ConfirmDialog
              trigger={
                <button
                  type="button"
                  className="p-1 text-red-500 hover:text-red-700"
                  aria-label="Remove audio"
                >
                  <X className="h-4 w-4" />
                </button>
              }
              title="Remove Audio"
              description="Are you sure you want to remove this audio file?"
              confirmLabel="Remove"
              variant="danger"
              onConfirm={onAudioRemoved}
            />
          </div>
        ) : (
          <div>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioChange}
            />
            <button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              disabled={uploadingAudio}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
            >
              {uploadingAudio ? (
                <span className="text-gray-500">Uploading...</span>
              ) : (
                <>
                  <Music className="h-4 w-4 text-gray-400" />
                  <Upload className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Upload Audio</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
