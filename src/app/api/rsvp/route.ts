import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { invitationStore } from "@/lib/invitationStore";

export const dynamic = "force-dynamic";

// GET /api/rsvp - Admin list & stats
export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("invitationId");
    const attendingOnly = searchParams.get("attending");
    const exportCsv = searchParams.get("export") === "csv";

    const whereClause: any = {};
    if (invitationId && invitationId !== "ALL") {
      whereClause.invitationId = invitationId;
    }
    if (attendingOnly !== null && attendingOnly !== undefined && attendingOnly !== "ALL") {
      whereClause.attending = attendingOnly === "true";
    }

    let rsvps: any[] = [];
    try {
      rsvps = await prisma.rsvp.findMany({
        where: whereClause,
        include: {
          invitation: {
            include: { couple: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("Prisma RSVP query skipped/failed:", dbErr);
    }

    // Merge backup store RSVPs
    const allInvs = invitationStore.getAllInvitations();
    const existingRsvpIds = new Set(rsvps.map((r) => r.id));
    for (const inv of allInvs) {
      if (invitationId && invitationId !== "ALL" && inv.id !== invitationId && inv.slug !== invitationId) {
        continue;
      }
      for (const r of inv.rsvps || []) {
        if (!existingRsvpIds.has(r.id)) {
          rsvps.push({
            ...r,
            invitation: { title: inv.title, couple: inv.couple },
          });
        }
      }
    }

    // If CSV export requested:
    if (exportCsv) {
      const header = ["ID", "Invitation", "Guest Name", "Phone", "Email", "Guests Count", "Attending", "Food Preference", "Message", "Submitted At"].join(",");
      const rows = rsvps.map((r) => [
        `"${r.id}"`,
        `"${r.invitation?.title || ""}"`,
        `"${r.guestName?.replace(/"/g, '""') || ""}"`,
        `"${r.phone}"`,
        `"${r.email || ""}"`,
        r.guestsCount,
        r.attending ? "Yes" : "No",
        `"${r.foodPreference}"`,
        `"${(r.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
        `"${new Date(r.createdAt).toISOString()}"`,
      ].join(","));

      const csvContent = [header, ...rows].join("\n");
      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="wedding-rsvps-${Date.now()}.csv"`,
        },
      });
    }

    // Calculate summary statistics
    const totalResponses = rsvps.length;
    const attendingCount = rsvps.filter((r) => r.attending).length;
    const notAttendingCount = totalResponses - attendingCount;
    const totalGuests = rsvps
      .filter((r) => r.attending)
      .reduce((sum, r) => sum + (r.guestsCount || 1), 0);

    const vegCount = rsvps.filter((r) => r.attending && r.foodPreference === "veg").length;
    const nonVegCount = rsvps.filter((r) => r.attending && r.foodPreference === "non-veg").length;
    const jainCount = rsvps.filter((r) => r.attending && r.foodPreference === "jain").length;
    const veganCount = rsvps.filter((r) => r.attending && r.foodPreference === "vegan").length;

    return NextResponse.json({
      rsvps,
      stats: {
        totalResponses,
        attendingCount,
        notAttendingCount,
        totalGuests,
        foodBreakdown: {
          veg: vegCount,
          nonVeg: nonVegCount,
          jain: jainCount,
          vegan: veganCount,
        },
      },
    });
  } catch (error: any) {
    console.error("GET /api/rsvp error:", error);
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
  }
}

// POST /api/rsvp - Public RSVP submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      invitationId,
      guestName,
      phone,
      email,
      guestsCount = 1,
      attending = true,
      foodPreference = "veg",
      message,
    } = body;

    if (!invitationId) {
      return NextResponse.json({ error: "invitationId is required" }, { status: 400 });
    }
    if (!guestName || !guestName.trim()) {
      return NextResponse.json({ error: "Guest name is required" }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Always mirror to backup store
    invitationStore.addRsvp(invitationId, {
      guestName: guestName.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      guestsCount: parseInt(String(guestsCount), 10) || 1,
      attending: Boolean(attending),
      foodPreference: foodPreference || "veg",
      message: message?.trim() || null,
    });

    let rsvp: any = null;
    try {
      rsvp = await prisma.rsvp.create({
        data: {
          invitationId,
          guestName: guestName.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          guestsCount: parseInt(String(guestsCount), 10) || 1,
          attending: Boolean(attending),
          foodPreference: foodPreference || "veg",
          message: message?.trim() || null,
        },
      });
    } catch (dbErr) {
      console.warn("Prisma RSVP create skipped/failed, saved to backup store:", dbErr);
    }

    return NextResponse.json({
      success: true,
      rsvp: rsvp || { guestName, attending },
      message: attending
        ? "Thank you! Your RSVP has been confirmed. We look forward to celebrating together!"
        : "Thank you for letting us know. You will be missed!",
    });
  } catch (error: any) {
    console.error("POST /api/rsvp error:", error);
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 });
  }
}
