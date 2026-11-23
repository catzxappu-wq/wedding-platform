import { NextResponse } from "next/server";
import { mediaStore } from "@/lib/mediaStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uploadId, chunkIndex, totalChunks, filename, mimeType, chunkData } = body;

    if (!uploadId || chunkIndex === undefined || !totalChunks || !chunkData) {
      return NextResponse.json({ error: "Invalid chunk payload" }, { status: 400 });
    }

    const result = mediaStore.addChunk(
      uploadId,
      Number(chunkIndex),
      Number(totalChunks),
      filename || "audio.mp3",
      mimeType || "audio/mpeg",
      chunkData
    );

    if (result.complete && result.media) {
      return NextResponse.json({
        success: true,
        complete: true,
        url: `/api/audio/${uploadId}`,
        title: result.media.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        sizeBytes: result.media.sizeBytes,
      });
    }

    return NextResponse.json({
      success: true,
      complete: false,
      progress: Math.round(((Number(chunkIndex) + 1) / Number(totalChunks)) * 100),
    });
  } catch (err: any) {
    console.error("Audio upload error:", err);
    return NextResponse.json({ error: err.message || "Audio upload failed" }, { status: 500 });
  }
}
