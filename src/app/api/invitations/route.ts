import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// GET /api/invitations
export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const status = searchParams.get("status");

    const whereClause: any = {};
    if (status && status !== "ALL") {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { slug: { contains: search } },
        {
          couple: {
            OR: [
              { groomName: { contains: search } },
              { brideName: { contains: search } },
            ],
          },
        },
      ];
    }

    const invitations = await prisma.invitation.findMany({
      where: whereClause,
      include: {
        couple: true,
        venue: true,
        events: {
          orderBy: { sortOrder: "asc" },
        },
        gallery: {
          orderBy: { sortOrder: "asc" },
        },
        rsvps: true,
        template: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invitations });
  } catch (error: any) {
    console.error("GET /api/invitations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

// POST /api/invitations
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug: requestedSlug,
      templateId = "royal-gold",
      primaryColor = "#B8972E",
      secondaryColor = "#58111A",
      accentColor = "#D4AF37",
      backgroundColor = "#FAF7F2",
      textColor = "#1F2937",
      fontFamily = "Cinzel",
      headingFont = "Cinzel",
      musicEnabled = true,
      musicTitle = "Royal Shehnai & Sitar Harmony",
      musicUrl,
      weddingDate,
      startTime = "10:00 AM",
      endTime = "09:00 PM",
      timeZone = "Asia/Kolkata",
      status = "DRAFT",
      couple,
      venue,
      events = [],
      gallery = [],
    } = body;

    // Generate and ensure unique slug
    let baseSlug = requestedSlug
      ? slugify(requestedSlug)
      : couple?.groomName && couple?.brideName
      ? slugify(`${couple.groomName} ${couple.brideName}`)
      : slugify(title || `wedding-${Date.now()}`);

    if (!baseSlug) baseSlug = `wedding-${Date.now()}`;

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.invitation.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newInvitation = await prisma.invitation.create({
      data: {
        title: title || `${couple?.groomName || "Groom"} & ${couple?.brideName || "Bride"}'s Wedding`,
        slug,
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
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        startTime,
        endTime,
        timeZone,
        userId: session.id,
        couple: couple
          ? {
              create: {
                groomName: couple.groomName || "Groom",
                brideName: couple.brideName || "Bride",
                groomPhoto: couple.groomPhoto || null,
                bridePhoto: couple.bridePhoto || null,
                couplePhoto: couple.couplePhoto || null,
                introduction: couple.introduction || "Two hearts, one beautiful journey.",
                story: couple.story || null,
                familyMessage: couple.familyMessage || null,
                familyNames: couple.familyNames || null,
              },
            }
          : undefined,
        venue: venue
          ? {
              create: {
                venueName: venue.venueName || "Grand Ballroom",
                fullAddress: venue.fullAddress || "Bengaluru, Karnataka, India",
                city: venue.city || "Bengaluru",
                state: venue.state || "Karnataka",
                country: venue.country || "India",
                latitude: venue.latitude ? parseFloat(venue.latitude) : null,
                longitude: venue.longitude ? parseFloat(venue.longitude) : null,
                googleMapsUrl: venue.googleMapsUrl || "https://maps.google.com",
              },
            }
          : undefined,
        events: events?.length
          ? {
              create: events.map((ev: any, index: number) => ({
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
            }
          : undefined,
        gallery: gallery?.length
          ? {
              create: gallery.map((g: any, index: number) => ({
                imageUrl: g.imageUrl,
                caption: g.caption || null,
                sortOrder: g.sortOrder ?? index,
                isCover: g.isCover || index === 0,
              })),
            }
          : undefined,
      },
      include: {
        couple: true,
        venue: true,
        events: true,
        gallery: true,
        rsvps: true,
      },
    });

    return NextResponse.json({
      success: true,
      invitation: newInvitation,
      message: "Invitation created successfully",
    });
  } catch (error: any) {
    console.error("POST /api/invitations error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create invitation" },
      { status: 500 }
    );
  }
}
