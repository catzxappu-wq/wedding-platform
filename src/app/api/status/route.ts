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
  let dbInvitations: any[] = [];

  try {
    const list = await prisma.invitation.findMany({
      select: { id: true, slug: true, title: true, status: true },
    });
    dbConnected = true;
    dbInvitations = list;
  } catch (err: any) {
    dbError = err?.message || "Could not query database";
  }

  const memoryInvitations = invitationStore.getAllInvitations().map((i) => ({
    id: i.id,
    slug: i.slug,
    title: i.title,
    status: i.status,
  }));

  const dbUrl = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
  const rawDbUrlPrefix = dbUrl.slice(0, 15);
  const rawDbUrlLength = dbUrl.length;

  return NextResponse.json({
    hasDbUrl,
    rawDbUrlPrefix,
    rawDbUrlLength,
    dbConnected,
    dbError,
    dbCount: dbInvitations.length,
    dbInvitations,
    memoryCount: memoryInvitations.length,
    memoryInvitations,
    timestamp: new Date().toISOString(),
  });
}
