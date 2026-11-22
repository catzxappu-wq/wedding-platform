import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const source = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: {
        couple: true,
        venue: true,
        events: true,
        gallery: true,
        settings: true,
      },
    });

    if (!source) {
      return NextResponse.json({ error: "Original invitation not found" }, { status: 404 });
    }

    // Generate unique slug for duplicated invitation
    const baseSlug = `${source.slug}-copy`;
    let newSlug = baseSlug;
    let counter = 1;
    while (await prisma.invitation.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create duplicate with DRAFT status, copied design theme, template, layout
    const duplicate = await prisma.invitation.create({
      data: {
        title: `${source.title} (Copy)`,
        slug: newSlug,
        status: "DRAFT",
        templateId: source.templateId,
        primaryColor: source.primaryColor,
        secondaryColor: source.secondaryColor,
        accentColor: source.accentColor,
        backgroundColor: source.backgroundColor,
        textColor: source.textColor,
        fontFamily: source.fontFamily,
        headingFont: source.headingFont,
        musicEnabled: source.musicEnabled,
        musicTitle: source.musicTitle,
        musicUrl: source.musicUrl,
        weddingDate: source.weddingDate,
        startTime: source.startTime,
        endTime: source.endTime,
        timeZone: source.timeZone,
        userId: session.id,
        couple: source.couple
          ? {
              create: {
                groomName: source.couple.groomName,
                brideName: source.couple.brideName,
                groomPhoto: source.couple.groomPhoto,
                bridePhoto: source.couple.bridePhoto,
                couplePhoto: source.couple.couplePhoto,
                introduction: source.couple.introduction,
                story: source.couple.story,
                familyMessage: source.couple.familyMessage,
                familyNames: source.couple.familyNames,
              },
            }
          : undefined,
        venue: source.venue
          ? {
              create: {
                venueName: source.venue.venueName,
                fullAddress: source.venue.fullAddress,
                city: source.venue.city,
                state: source.venue.state,
                country: source.venue.country,
                latitude: source.venue.latitude,
                longitude: source.venue.longitude,
                googleMapsUrl: source.venue.googleMapsUrl,
              },
            }
          : undefined,
        events: source.events?.length
          ? {
              create: source.events.map((ev) => ({
                name: ev.name,
                date: ev.date,
                startTime: ev.startTime,
                endTime: ev.endTime,
                venueName: ev.venueName,
                address: ev.address,
                description: ev.description,
                icon: ev.icon,
                imageUrl: ev.imageUrl,
                sortOrder: ev.sortOrder,
              })),
            }
          : undefined,
        gallery: source.gallery?.length
          ? {
              create: source.gallery.map((g) => ({
                imageUrl: g.imageUrl,
                caption: g.caption,
                sortOrder: g.sortOrder,
                isCover: g.isCover,
              })),
            }
          : undefined,
        settings: source.settings?.length
          ? {
              create: source.settings.map((s) => ({
                section: s.section,
                key: s.key,
                value: s.value,
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
        template: true,
      },
    });

    return NextResponse.json({
      success: true,
      invitation: duplicate,
      message: "Invitation duplicated successfully as Draft",
    });
  } catch (error: any) {
    console.error("POST duplicate invitation error:", error);
    return NextResponse.json({ error: error.message || "Failed to duplicate invitation" }, { status: 500 });
  }
}
