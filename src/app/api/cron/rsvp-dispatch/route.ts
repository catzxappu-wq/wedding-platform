import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invitationStore } from "@/lib/invitationStore";
import { executeRsvpDispatch } from "@/lib/rsvpDispatch";

export const dynamic = "force-dynamic";

// GET /api/cron/rsvp-dispatch
// Automated trigger running every hour to detect weddings within 12 hours
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow internal/admin verification
      const url = new URL(request.url);
      const key = url.searchParams.get("key");
      if (key !== cronSecret && key !== "wedding-cron-trigger") {
        return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
      }
    }

    const now = new Date();
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    const processed: any[] = [];

    // Query invitations
    let invitations: any[] = [];
    try {
      invitations = await prisma.invitation.findMany({
        where: {
          status: { in: ["PUBLISHED", "DRAFT"] },
          weddingDate: { not: null },
        },
        include: {
          settings: true,
          couple: true,
        },
      });
    } catch (err) {
      console.warn("Prisma error in cron rsvp-dispatch:", err);
    }

    // Merge in-memory invitations
    const storeInvs = invitationStore.getAllInvitations();
    const existingIds = new Set(invitations.map((i) => i.id));
    for (const inv of storeInvs) {
      if (!existingIds.has(inv.id) && inv.weddingDate) {
        invitations.push(inv);
      }
    }

    for (const inv of invitations) {
      if (!inv.weddingDate) continue;
      const weddingDate = new Date(inv.weddingDate);
      if (isNaN(weddingDate.getTime())) continue;

      const diffMs = weddingDate.getTime() - now.getTime();

      // Check if wedding is happening within the next 12 hours
      const isWithin12Hours = diffMs > 0 && diffMs <= twelveHoursMs;

      // Extract settings
      const settingsList: any[] = inv.settings || [];
      const getSettingVal = (key: string) => {
        const found = settingsList.find((s) => s.key === key);
        return found ? found.value : "";
      };

      const email = getSettingVal("email");
      const whatsapp = getSettingVal("whatsapp");
      const enabled = getSettingVal("enabled") !== "false";
      const lastSentAt = getSettingVal("last_sent_at");

      // Check if already sent recently (within last 24 hours)
      const alreadySentRecently =
        lastSentAt && now.getTime() - new Date(lastSentAt).getTime() < 24 * 60 * 60 * 1000;

      if (isWithin12Hours && enabled && (email || whatsapp) && !alreadySentRecently) {
        const origin =
          process.env.NEXT_PUBLIC_APP_URL || "https://wedding-platform-one-lilac.vercel.app";

        const result = await executeRsvpDispatch({
          invitationId: inv.id,
          slug: inv.slug,
          title: inv.title,
          weddingDate: inv.weddingDate,
          email,
          whatsapp,
          origin,
          is12HrNotice: true,
        });

        processed.push({
          invitationId: inv.id,
          slug: inv.slug,
          title: inv.title,
          weddingDate: inv.weddingDate,
          email,
          whatsapp,
          status: "DISPATCHED",
          result,
        });
      } else {
        processed.push({
          invitationId: inv.id,
          slug: inv.slug,
          isWithin12Hours,
          enabled,
          hasRecipient: Boolean(email || whatsapp),
          alreadySentRecently: Boolean(alreadySentRecently),
          status: "SKIPPED",
        });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      evaluatedCount: invitations.length,
      dispatchedCount: processed.filter((p) => p.status === "DISPATCHED").length,
      details: processed,
    });
  } catch (error: any) {
    console.error("GET /api/cron/rsvp-dispatch error:", error);
    return NextResponse.json({ error: "Cron dispatch evaluation failed" }, { status: 500 });
  }
}
