import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateICSContent } from "@/lib/ics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("invitationId");
    const eventId = searchParams.get("eventId");

    if (!invitationId && !eventId) {
      return NextResponse.json({ error: "Missing invitationId or eventId" }, { status: 400 });
    }

    if (eventId) {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          invitation: {
            include: { couple: true, venue: true },
          },
        },
      });

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }

      const groom = event.invitation.couple?.groomName || "Groom";
      const bride = event.invitation.couple?.brideName || "Bride";
      const title = `${event.name} | ${groom} & ${bride}'s Wedding`;
      const description = `${event.description || ""}\n\nJoin us for ${event.name}.\nVenue: ${event.venueName}, ${event.address}`;
      const location = `${event.venueName}, ${event.address}`;

      const ics = generateICSContent({
        title,
        description,
        location,
        startDate: new Date(event.date),
      });

      return new Response(ics, {
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": `attachment; filename="${event.name.toLowerCase().replace(/\s+/g, "-")}.ics"`,
        },
      });
    }

    // Main wedding calendar file
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId! },
      include: { couple: true, venue: true, events: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const groom = invitation.couple?.groomName || "Groom";
    const bride = invitation.couple?.brideName || "Bride";
    const title = `${groom} & ${bride}'s Wedding Celebration`;
    const venueName = invitation.venue?.venueName || "Wedding Venue";
    const fullAddress = invitation.venue?.fullAddress || "";
    const description = `Wedding celebration of ${groom} & ${bride}.\n\nTime: ${invitation.startTime || "All Day"}\nVenue: ${venueName}, ${fullAddress}\n\nWe look forward to celebrating with you!`;

    const weddingDate = invitation.weddingDate ? new Date(invitation.weddingDate) : new Date();

    const ics = generateICSContent({
      title,
      description,
      location: `${venueName}, ${fullAddress}`,
      startDate: weddingDate,
    });

    return new Response(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${invitation.slug}-wedding.ics"`,
      },
    });
  } catch (error: any) {
    console.error("GET /api/calendar error:", error);
    return NextResponse.json({ error: "Failed to generate calendar file" }, { status: 500 });
  }
}
