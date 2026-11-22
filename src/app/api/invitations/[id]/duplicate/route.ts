import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { invitationStore } from "@/lib/invitationStore";

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

    let source: any = null;
    try {
      source = await prisma.invitation.findUnique({
        where: { id: params.id },
        include: {
          couple: true,
          venue: true,
          events: true,
          gallery: true,
          settings: true,
        },
      });
    } catch (dbErr) {
      console.warn("DB lookup error in duplicate:", dbErr);
    }

    if (!source) {
      source = invitationStore.getInvitationById(params.id);
    }

    if (!source) {
      return NextResponse.json({ error: "Original invitation not found" }, { status: 404 });
    }

    // Generate unique slug for duplicated invitation
    const baseSlug = `${source.slug}-copy`;
    let newSlug = baseSlug;

    // Immediately duplicate into backup store
    const duplicateData = {
      ...source,
      id: `inv-${Date.now()}`,
      title: `${source.title} (Copy)`,
      slug: newSlug,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      rsvps: [],
    };
    const storeDuplicate = invitationStore.saveInvitation(duplicateData);

    let duplicate: any = null;
    try {
      let counter = 1;
      while (await prisma.invitation.findUnique({ where: { slug: newSlug } })) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Ensure valid userId
      let userId = session.id;
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        const anyUser = await prisma.user.findFirst();
        if (anyUser) userId = anyUser.id;
      }

      duplicate = await prisma.invitation.create({
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
          weddingDate: source.weddingDate ? new Date(source.weddingDate) : null,
          startTime: source.startTime,
          endTime: source.endTime,
          timeZone: source.timeZone,
          userId,
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
                create: source.events.map((ev: any) => ({
                  name: ev.name,
                  date: new Date(ev.date),
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
                create: source.gallery.map((g: any) => ({
                  imageUrl: g.imageUrl,
                  caption: g.caption,
                  sortOrder: g.sortOrder,
                  isCover: g.isCover,
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

      invitationStore.saveInvitation({ ...duplicate, id: duplicate.id, slug: duplicate.slug });
    } catch (dbErr: any) {
      console.warn("DB duplicate failed, using store duplicate:", dbErr?.message);
      duplicate = storeDuplicate;
    }

    return NextResponse.json({
      success: true,
      invitation: duplicate || storeDuplicate,
      message: "Invitation duplicated successfully as Draft",
    });
  } catch (error: any) {
    console.error("POST duplicate invitation error:", error);
    return NextResponse.json({ error: error.message || "Failed to duplicate invitation" }, { status: 500 });
  }
}
