import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invitationStore } from "@/lib/invitationStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDbUrl = Boolean(
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL
  );

  let dbConnected = false;
  let dbError: string | null = null;
  let dbCount = 0;

  try {
    dbCount = await prisma.invitation.count();
    dbConnected = true;
  } catch (err: any) {
    dbError = err?.message || "Could not query database";
  }

  const memoryCount = invitationStore.getAllInvitations().length;

  const dbUrl = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
  const match = dbUrl.match(/postgres(?:ql)?:\/\/[^\s'"<>]+/);
  const parsedDbUrl = match ? match[0].trim().replace(/[;'")]+$/, "") : "";
  const rawDbUrlPrefix = dbUrl.slice(0, 20);
  const rawDbUrlLength = dbUrl.length;

  return NextResponse.json({
    hasDbUrl,
    rawDbUrlPrefix,
    rawDbUrlLength,
    parsedDbUrlFound: Boolean(parsedDbUrl),
    parsedDbUrlPrefix: parsedDbUrl.slice(0, 25),
    dbConnected,
    dbError,
    dbCount,
    memoryCount,
    timestamp: new Date().toISOString(),
  });
}
