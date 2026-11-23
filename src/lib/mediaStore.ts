import prisma from "./prisma";

interface ChunkSession {
  chunks: string[];
  total: number;
  filename: string;
  mimeType: string;
}

interface StoredMedia {
  id: string;
  filename: string;
  mimeType: string;
  data: string;
  sizeBytes: number;
}

// Global cache for sessions & completed media to survive within process
declare global {
  // eslint-disable-next-line no-var
  var __chunkSessions: Map<string, ChunkSession> | undefined;
  // eslint-disable-next-line no-var
  var __mediaCache: Map<string, StoredMedia> | undefined;
}

const sessions = global.__chunkSessions || new Map<string, ChunkSession>();
if (!global.__chunkSessions) global.__chunkSessions = sessions;

const mediaCache = global.__mediaCache || new Map<string, StoredMedia>();
if (!global.__mediaCache) global.__mediaCache = mediaCache;

export const mediaStore = {
  addChunk(
    uploadId: string,
    chunkIndex: number,
    totalChunks: number,
    filename: string,
    mimeType: string,
    chunkData: string
  ): { complete: boolean; media?: StoredMedia } {
    let session = sessions.get(uploadId);
    if (!session) {
      session = {
        chunks: new Array(totalChunks).fill(""),
        total: totalChunks,
        filename,
        mimeType: mimeType || "audio/mpeg",
      };
      sessions.set(uploadId, session);
    }

    session.chunks[chunkIndex] = chunkData;

    // Check if all chunks received
    const isComplete =
      session.chunks.length === totalChunks &&
      session.chunks.every((c) => Boolean(c && c.length > 0));

    if (isComplete) {
      const fullData = session.chunks.join("");
      const approxSizeBytes = Math.round((fullData.length * 3) / 4);

      const media: StoredMedia = {
        id: uploadId,
        filename: session.filename,
        mimeType: session.mimeType,
        data: fullData,
        sizeBytes: approxSizeBytes,
      };

      mediaCache.set(uploadId, media);
      sessions.delete(uploadId);

      // Async persist to Prisma MediaUpload if table exists
      (async () => {
        try {
          if ((prisma as any).mediaUpload) {
            await (prisma as any).mediaUpload.upsert({
              where: { id: uploadId },
              update: {
                data: fullData,
                sizeBytes: approxSizeBytes,
              },
              create: {
                id: uploadId,
                filename: media.filename,
                mimeType: media.mimeType,
                data: fullData,
                sizeBytes: approxSizeBytes,
              },
            });
          }
        } catch (e: any) {
          console.warn("Could not write audio to prisma.mediaUpload:", e.message);
        }
      })();

      return { complete: true, media };
    }

    return { complete: false };
  },

  async getMedia(uploadId: string): Promise<StoredMedia | null> {
    // 1. Check in-memory cache
    if (mediaCache.has(uploadId)) {
      return mediaCache.get(uploadId) || null;
    }

    // 2. Check Prisma
    try {
      if ((prisma as any).mediaUpload) {
        const found = await (prisma as any).mediaUpload.findUnique({
          where: { id: uploadId },
        });
        if (found) {
          const media: StoredMedia = {
            id: found.id,
            filename: found.filename,
            mimeType: found.mimeType,
            data: found.data,
            sizeBytes: found.sizeBytes,
          };
          mediaCache.set(uploadId, media);
          return media;
        }
      }
    } catch (e: any) {
      console.warn("Prisma media read error:", e.message);
    }

    return null;
  },
};
