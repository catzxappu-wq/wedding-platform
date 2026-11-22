import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/invitations/[id]
export async function GET(request: Request, { params }: Params) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: {
        couple: true,
        venue: true,
        events: { orderBy: { sortOrder: "asc" } },
        gallery: { orderBy: { sortOrder: "asc" } },
        rsvps: { orderBy: { createdAt: "desc" } },
        template: true,
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    return NextResponse.json({ invitation });
  } catch (error: any) {
    console.error("GET /api/invitations/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch invitation" }, { status: 500 });
  }
}

// PUT /api/invitations/[id]
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug: newSlug,
      status,
      templateId,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      fontFamily,
      headingFont,
      musicEnabled,
      musicTitle,
      musicUrl,
      weddingDate,
      startTime,
      endTime,
      timeZone,
      couple,
      venue,
      events,
      gallery,
    } = body;

    // Check if new slug is taken by another invitation
    if (newSlug) {
      const cleanSlug = slugify(newSlug);
      const existing = await prisma.invitation.findFirst({
        where: {
          slug: cleanSlug,
          NOT: { id: params.id },
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: `The URL slug "${cleanSlug}" is already in use by another invitation.` },
          { status: 400 }
        );
      }
    }

    // Update main invitation
    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: {
        title,
        ...(newSlug ? { slug: slugify(newSlug) } : {}),
        status,
        templateId,
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        textColor,
        fontFamily,
        headingFont,
        musicEnabled,
        musicTitle,
        musicUrl,
        weddingDate: weddingDate ? new Date(weddingDate) : undefined,
        startTime,
        endTime,
        timeZone,
        couple: couple
          ? {
              upsert: {
                create: {
                  groomName: couple.groomName || "Groom",
                  brideName: couple.brideName || "Bride",
                  groomPhoto: couple.groomPhoto || null,
                  bridePhoto: couple.bridePhoto || null,
                  couplePhoto: couple.couplePhoto || null,
                  introduction: couple.introduction || null,
                  story: couple.story || null,
                  familyMessage: couple.familyMessage || null,
                  familyNames: couple.familyNames || null,
                },
                update: {
                  groomName: couple.groomName,
                  brideName: couple.brideName,
                  groomPhoto: couple.groomPhoto,
                  bridePhoto: couple.bridePhoto,
                  couplePhoto: couple.couplePhoto,
                  introduction: couple.introduction,
                  story: couple.story,
                  familyMessage: couple.familyMessage,
                  familyNames: couple.familyNames,
                },
              },
            }
          : undefined,
        venue: venue
          ? {
              upsert: {
                create: {
                  venueName: venue.venueName || "Venue",
                  fullAddress: venue.fullAddress || "",
                  city: venue.city || "",
                  state: venue.state || "",
                  country: venue.country || "India",
                  latitude: venue.latitude ? parseFloat(venue.latitude) : null,
                  longitude: venue.longitude ? parseFloat(venue.longitude) : null,
                  googleMapsUrl: venue.googleMapsUrl || "https://maps.google.com",
                },
                update: {
                  venueName: venue.venueName,
                  fullAddress: venue.fullAddress,
                  city: venue.city,
                  state: venue.state,
                  country: venue.country,
                  latitude: venue.latitude ? parseFloat(venue.latitude) : null,
                  longitude: venue.longitude ? parseFloat(venue.longitude) : null,
                  googleMapsUrl: venue.googleMapsUrl,
                },
              },
            }
          : undefined,
      },
    });

    // Replace events if provided
    if (events && Array.isArray(events)) {
      await prisma.event.deleteMany({ where: { invitationId: params.id } });
      await prisma.event.createMany({
        data: events.map((ev: any, index: number) => ({
          invitationId: params.id,
          name: ev.name,
          date: new Date(ev.date || weddingDate || new Date()),
          startTime: ev.startTime || "10:00 AM",
          endTime: ev.endTime || null,
          venueName: ev.venueName || venue?.venueName || "Wedding Venue",
          address: ev.address || venue?.fullAddress || "",
          description: ev.description || "",
          icon: ev.icon || "Sparkles",
          imageUrl: ev.imageUrl || null,
          sortOrder: ev.sortOrder ?? index,
        })),
      });
    }

    // Replace gallery if provided
    if (gallery && Array.isArray(gallery)) {
      await prisma.gallery.deleteMany({ where: { invitationId: params.id } });
      await prisma.gallery.createMany({
        data: gallery.map((g: any, index: number) => ({
          invitationId: params.id,
          imageUrl: g.imageUrl,
          caption: g.caption || null,
          sortOrder: g.sortOrder ?? index,
          isCover: g.isCover || index === 0,
        })),
      });
    }

    const fullUpdated = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: {
        couple: true,
        venue: true,
        events: { orderBy: { sortOrder: "asc" } },
        gallery: { orderBy: { sortOrder: "asc" } },
        rsvps: true,
        template: true,
      },
    });

    return NextResponse.json({
      success: true,
      invitation: fullUpdated,
      message: "Invitation updated successfully",
    });
  } catch (error: any) {
    console.error("PUT /api/invitations/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update invitation" }, { status: 500 });
  }
}

// DELETE /api/invitations/[id]
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.invitation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Invitation deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/invitations/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete invitation" }, { status: 500 });
  }
}
