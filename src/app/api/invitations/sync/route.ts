import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invitationStore } from "@/lib/invitationStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.slug) {
      return NextResponse.json({ error: "Invalid invitation payload" }, { status: 400 });
    }

    // Save into server fallback store
    invitationStore.saveInvitation(body);

    // If database connection is active, try to persist
    try {
      const existing = await prisma.invitation.findUnique({
        where: { slug: body.slug },
      });

      if (!existing && body.userId) {
        // Attempt create if user exists
        await prisma.invitation.create({
          data: {
            title: body.title,
            slug: body.slug,
            status: body.status || "PUBLISHED",
            templateId: body.templateId || "royal-gold",
            primaryColor: body.primaryColor,
            secondaryColor: body.secondaryColor,
            accentColor: body.accentColor,
            backgroundColor: body.backgroundColor,
            textColor: body.textColor,
            fontFamily: body.fontFamily,
            headingFont: body.headingFont,
            musicEnabled: body.musicEnabled ?? true,
            musicTitle: body.musicTitle,
            musicUrl: body.musicUrl,
            weddingDate: body.weddingDate ? new Date(body.weddingDate) : null,
            startTime: body.startTime,
            endTime: body.endTime,
            timeZone: body.timeZone,
            userId: body.userId,
          },
        });
      }
    } catch {
      // Prisma write non-fatal
    }

    return NextResponse.json({ success: true, message: "Invitation synchronized" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Sync failed" }, { status: 500 });
  }
}
