import { NextResponse } from "next/server";
import { mediaStore } from "@/lib/mediaStore";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const uploadId = params.id;
    if (!uploadId) {
      return new NextResponse("Audio ID required", { status: 400 });
    }

    const media = await mediaStore.getMedia(uploadId);
    if (!media || !media.data) {
      return new NextResponse("Audio file not found", { status: 404 });
    }

    // Convert base64 (or data URL) to binary Buffer
    let base64String = media.data;
    if (base64String.includes(",")) {
      base64String = base64String.split(",")[1];
    }

    const buffer = Buffer.from(base64String, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": media.mimeType || "audio/mpeg",
        "Content-Length": buffer.length.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("GET /api/audio/[id] error:", err);
    return new NextResponse("Failed to load audio", { status: 500 });
  }
}
