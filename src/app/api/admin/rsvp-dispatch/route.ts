import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { invitationStore } from "@/lib/invitationStore";
import { executeRsvpDispatch, getRsvpsForInvitation } from "@/lib/rsvpDispatch";

export const dynamic = "force-dynamic";

// GET /api/admin/rsvp-dispatch?invitationId=...
export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("invitationId");

    if (!invitationId) {
      return NextResponse.json({ error: "Missing invitationId" }, { status: 400 });
    }

    // Lookup invitation
    let invitation: any = null;
    try {
      invitation = await prisma.invitation.findFirst({
        where: {
          OR: [{ id: invitationId }, { slug: invitationId }],
        },
        include: {
          settings: true,
          couple: true,
        },
      });
    } catch (err) {
      console.warn("Prisma error in GET /api/admin/rsvp-dispatch:", err);
    }

    if (!invitation) {
      invitation = invitationStore.getInvitationById(invitationId) ||
        invitationStore.getInvitationBySlug(invitationId);
    }

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Extract settings
    const settingsList: any[] = invitation.settings || [];
    const getSettingVal = (key: string) => {
      const found = settingsList.find((s) => s.key === key && (s.section === "rsvp_dispatch" || !s.section));
      return found ? found.value : "";
    };

    const email = getSettingVal("email") || "";
    const whatsapp = getSettingVal("whatsapp") || "";
    const enabled = getSettingVal("enabled") !== "false";
    const lastSentAt = getSettingVal("last_sent_at") || null;

    // Calculate 12-hour trigger time
    const weddingDate = invitation.weddingDate ? new Date(invitation.weddingDate) : null;
    let dispatchScheduledAt: string | null = null;
    let hoursUntilDispatch: number | null = null;
    let isWithin12Hours = false;

    if (weddingDate && !isNaN(weddingDate.getTime())) {
      const scheduledTimeMs = weddingDate.getTime() - 12 * 60 * 60 * 1000;
      dispatchScheduledAt = new Date(scheduledTimeMs).toISOString();

      const diffMs = scheduledTimeMs - Date.now();
      hoursUntilDispatch = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
      isWithin12Hours = diffMs <= 0 && weddingDate.getTime() > Date.now();
    }

    const rsvps = await getRsvpsForInvitation(invitation.id);

    return NextResponse.json({
      invitationId: invitation.id,
      title: invitation.title,
      slug: invitation.slug,
      weddingDate: weddingDate ? weddingDate.toISOString() : null,
      email,
      whatsapp,
      enabled,
      dispatchScheduledAt,
      hoursUntilDispatch,
      isWithin12Hours,
      lastSentAt,
      rsvpCount: rsvps.length,
    });
  } catch (error: any) {
    console.error("GET /api/admin/rsvp-dispatch error:", error);
    return NextResponse.json({ error: "Failed to fetch dispatch config" }, { status: 500 });
  }
}

// POST /api/admin/rsvp-dispatch
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { invitationId, email, whatsapp, enabled = true, action = "save" } = body;

    if (!invitationId) {
      return NextResponse.json({ error: "Missing invitationId" }, { status: 400 });
    }

    // Lookup invitation
    let invitation: any = null;
    try {
      invitation = await prisma.invitation.findFirst({
        where: {
          OR: [{ id: invitationId }, { slug: invitationId }],
        },
        include: {
          couple: true,
          settings: true,
        },
      });
    } catch (err) {
      console.warn("Prisma error in POST /api/admin/rsvp-dispatch:", err);
    }

    if (!invitation) {
      invitation = invitationStore.getInvitationById(invitationId) ||
        invitationStore.getInvitationBySlug(invitationId);
    }

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Save contact configuration to DB
    const settingsToSave = [
      { key: "email", value: (email || "").trim() },
      { key: "whatsapp", value: (whatsapp || "").trim() },
      { key: "enabled", value: String(enabled) },
    ];

    for (const item of settingsToSave) {
      try {
        const settingId = `cfg-${invitation.id}-${item.key}`;
        await prisma.setting.upsert({
          where: { id: settingId },
          update: { value: item.value, section: "rsvp_dispatch" },
          create: {
            id: settingId,
            invitationId: invitation.id,
            section: "rsvp_dispatch",
            key: item.key,
            value: item.value,
          },
        });
      } catch (saveErr) {
        console.warn(`Could not save setting ${item.key}:`, saveErr);
      }
    }

    // Also update in-memory store
    const existingSettings = invitation.settings || [];
    for (const item of settingsToSave) {
      const idx = existingSettings.findIndex((s: any) => s.key === item.key);
      if (idx >= 0) {
        existingSettings[idx].value = item.value;
      } else {
        existingSettings.push({
          id: `cfg-${invitation.id}-${item.key}`,
          invitationId: invitation.id,
          section: "rsvp_dispatch",
          key: item.key,
          value: item.value,
        });
      }
    }

    invitationStore.saveInvitation({
      ...invitation,
      settings: existingSettings,
    });

    // If action is "send_now", execute instant test dispatch
    if (action === "send_now") {
      const origin = request.headers.get("origin") || "https://wedding-platform-one-lilac.vercel.app";
      const result = await executeRsvpDispatch({
        invitationId: invitation.id,
        slug: invitation.slug,
        title: invitation.title,
        weddingDate: invitation.weddingDate,
        email: (email || "").trim(),
        whatsapp: (whatsapp || "").trim(),
        origin,
        is12HrNotice: false,
      });

      return NextResponse.json({
        ...result,
        message: "RSVP CSV report successfully prepared and dispatched!",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Notification preferences saved successfully. CSV will automatically dispatch 12 hours prior to the wedding.",
      email: (email || "").trim(),
      whatsapp: (whatsapp || "").trim(),
      enabled,
    });
  } catch (error: any) {
    console.error("POST /api/admin/rsvp-dispatch error:", error);
    return NextResponse.json({ error: "Failed to save or dispatch settings" }, { status: 500 });
  }
}
