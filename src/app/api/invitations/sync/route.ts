import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invitationStore } from "@/lib/invitationStore";
import { hashPassword } from "@/lib/auth";
import { getTemplateById } from "@/data/templates";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.slug) {
      return NextResponse.json({ error: "Invalid invitation payload" }, { status: 400 });
    }

    const cleanSlug = body.slug.toLowerCase().trim();

    // 1. Always save into in-memory/backup store
    invitationStore.saveInvitation({ ...body, slug: cleanSlug });

    // 2. Persist to PostgreSQL database
    try {
      // Ensure admin user exists
      let adminUser = await prisma.user.findFirst();
      if (!adminUser) {
        const passwordHash = await hashPassword(process.env.ADMIN_DEFAULT_PASSWORD || "Admin@Wedding2026!");
        adminUser = await prisma.user.create({
          data: {
            name: "Platform Administrator",
            email: "admin@weddingplatform.com",
            passwordHash,
            role: "ADMIN",
          },
        });
      }
      const userId = adminUser?.id;

      // Ensure template exists in DB so foreign key never fails
      const templateId = body.templateId || "royal-gold";
      const tmplDef = getTemplateById(templateId);
      await prisma.template.upsert({
        where: { id: templateId },
        update: {},
        create: {
          id: templateId,
          name: tmplDef.name,
          description: tmplDef.description,
          previewImage: tmplDef.previewImage,
          category: tmplDef.category,
          configuration: JSON.stringify(tmplDef.theme),
        },
      });

      // Prepare date objects safely
      const weddingDate = body.weddingDate ? new Date(body.weddingDate) : null;

      // Check if invitation already exists
      const existing = await prisma.invitation.findUnique({
        where: { slug: cleanSlug },
        include: { couple: true, venue: true, events: true, gallery: true },
      });

      if (existing) {
        // Update existing invitation
        await prisma.invitation.update({
          where: { id: existing.id },
          data: {
            title: body.title || existing.title,
            status: body.status || "PUBLISHED",
            templateId,
            primaryColor: body.primaryColor || existing.primaryColor,
            secondaryColor: body.secondaryColor || existing.secondaryColor,
            accentColor: body.accentColor || existing.accentColor,
            backgroundColor: body.backgroundColor || existing.backgroundColor,
            textColor: body.textColor || existing.textColor,
            fontFamily: body.fontFamily || existing.fontFamily,
            headingFont: body.headingFont || existing.headingFont,
            musicEnabled: body.musicEnabled ?? existing.musicEnabled,
            musicTitle: body.musicTitle || existing.musicTitle,
            musicUrl: body.musicUrl || existing.musicUrl,
            weddingDate,
            startTime: body.startTime || existing.startTime,
            endTime: body.endTime || existing.endTime,
            timeZone: body.timeZone || existing.timeZone,
            userId,
          },
        });

        // Update couple if provided
        if (body.couple) {
          if (existing.couple) {
            await prisma.couple.update({
              where: { id: existing.couple.id },
              data: {
                groomName: body.couple.groomName || existing.couple.groomName,
                brideName: body.couple.brideName || existing.couple.brideName,
                groomPhoto: body.couple.groomPhoto ?? existing.couple.groomPhoto,
                bridePhoto: body.couple.bridePhoto ?? existing.couple.bridePhoto,
                couplePhoto: body.couple.couplePhoto ?? existing.couple.couplePhoto,
                introduction: body.couple.introduction ?? existing.couple.introduction,
                story: body.couple.story ?? existing.couple.story,
                familyMessage: body.couple.familyMessage ?? existing.couple.familyMessage,
                familyNames: body.couple.familyNames ?? existing.couple.familyNames,
              },
            });
          } else {
            await prisma.couple.create({
              data: {
                invitationId: existing.id,
                groomName: body.couple.groomName || "Groom",
                brideName: body.couple.brideName || "Bride",
                groomPhoto: body.couple.groomPhoto || null,
                bridePhoto: body.couple.bridePhoto || null,
                couplePhoto: body.couple.couplePhoto || null,
                introduction: body.couple.introduction || null,
                story: body.couple.story || null,
                familyMessage: body.couple.familyMessage || null,
                familyNames: body.couple.familyNames || null,
              },
            });
          }
        }

        // Update venue if provided
        if (body.venue) {
          if (existing.venue) {
            await prisma.venue.update({
              where: { id: existing.venue.id },
              data: {
                venueName: body.venue.venueName || existing.venue.venueName,
                fullAddress: body.venue.fullAddress || existing.venue.fullAddress,
                city: body.venue.city || existing.venue.city,
                state: body.venue.state || existing.venue.state,
                country: body.venue.country || existing.venue.country,
                latitude: body.venue.latitude ? parseFloat(body.venue.latitude) : existing.venue.latitude,
                longitude: body.venue.longitude ? parseFloat(body.venue.longitude) : existing.venue.longitude,
                googleMapsUrl: body.venue.googleMapsUrl || existing.venue.googleMapsUrl,
              },
            });
          } else {
            await prisma.venue.create({
              data: {
                invitationId: existing.id,
                venueName: body.venue.venueName || "Wedding Venue",
                fullAddress: body.venue.fullAddress || "",
                city: body.venue.city || "",
                state: body.venue.state || "",
                country: body.venue.country || "India",
                latitude: body.venue.latitude ? parseFloat(body.venue.latitude) : null,
                longitude: body.venue.longitude ? parseFloat(body.venue.longitude) : null,
                googleMapsUrl: body.venue.googleMapsUrl || "https://maps.google.com",
              },
            });
          }
        }

        // Replace events if provided
        if (Array.isArray(body.events) && body.events.length > 0) {
          await prisma.event.deleteMany({ where: { invitationId: existing.id } });
          await prisma.event.createMany({
            data: body.events.map((ev: any, idx: number) => ({
              invitationId: existing.id,
              name: ev.name || `Event ${idx + 1}`,
              date: new Date(ev.date || weddingDate || new Date()),
              startTime: ev.startTime || "10:00 AM",
              endTime: ev.endTime || null,
              venueName: ev.venueName || body.venue?.venueName || "Wedding Venue",
              address: ev.address || body.venue?.fullAddress || "",
              description: ev.description || "",
              icon: ev.icon || "Sparkles",
              imageUrl: ev.imageUrl || null,
              sortOrder: ev.sortOrder ?? idx,
            })),
          });
        }

        // Replace gallery if provided
        if (Array.isArray(body.gallery) && body.gallery.length > 0) {
          await prisma.gallery.deleteMany({ where: { invitationId: existing.id } });
          await prisma.gallery.createMany({
            data: body.gallery.map((g: any, idx: number) => ({
              invitationId: existing.id,
              imageUrl: g.imageUrl,
              caption: g.caption || null,
              sortOrder: g.sortOrder ?? idx,
              isCover: g.isCover ?? idx === 0,
            })),
          });
        }
      } else {
        // Create brand new invitation with all relations
        await prisma.invitation.create({
          data: {
            slug: cleanSlug,
            title: body.title || `${body.couple?.groomName || "Groom"} & ${body.couple?.brideName || "Bride"}'s Wedding`,
            status: body.status || "PUBLISHED",
            templateId,
            primaryColor: body.primaryColor || "#B8972E",
            secondaryColor: body.secondaryColor || "#58111A",
            accentColor: body.accentColor || "#D4AF37",
            backgroundColor: body.backgroundColor || "#FAF7F2",
            textColor: body.textColor || "#1F2937",
            fontFamily: body.fontFamily || "Cinzel",
            headingFont: body.headingFont || "Cinzel",
            musicEnabled: body.musicEnabled ?? true,
            musicTitle: body.musicTitle || "Royal Shehnai & Sitar Harmony",
            musicUrl: body.musicUrl || null,
            weddingDate,
            startTime: body.startTime || "10:30 AM",
            endTime: body.endTime || "10:00 PM",
            timeZone: body.timeZone || "Asia/Kolkata",
            userId,
            couple: body.couple
              ? {
                  create: {
                    groomName: body.couple.groomName || "Groom",
                    brideName: body.couple.brideName || "Bride",
                    groomPhoto: body.couple.groomPhoto || null,
                    bridePhoto: body.couple.bridePhoto || null,
                    couplePhoto: body.couple.couplePhoto || null,
                    introduction: body.couple.introduction || null,
                    story: body.couple.story || null,
                    familyMessage: body.couple.familyMessage || null,
                    familyNames: body.couple.familyNames || null,
                  },
                }
              : undefined,
            venue: body.venue
              ? {
                  create: {
                    venueName: body.venue.venueName || "Grand Ballroom",
                    fullAddress: body.venue.fullAddress || "Bengaluru, Karnataka, India",
                    city: body.venue.city || "Bengaluru",
                    state: body.venue.state || "Karnataka",
                    country: body.venue.country || "India",
                    latitude: body.venue.latitude ? parseFloat(body.venue.latitude) : null,
                    longitude: body.venue.longitude ? parseFloat(body.venue.longitude) : null,
                    googleMapsUrl: body.venue.googleMapsUrl || "https://maps.google.com",
                  },
                }
              : undefined,
            events: Array.isArray(body.events) && body.events.length > 0
              ? {
                  create: body.events.map((ev: any, idx: number) => ({
                    name: ev.name || `Event ${idx + 1}`,
                    date: new Date(ev.date || weddingDate || new Date()),
                    startTime: ev.startTime || "10:00 AM",
                    endTime: ev.endTime || null,
                    venueName: ev.venueName || body.venue?.venueName || "Wedding Venue",
                    address: ev.address || body.venue?.fullAddress || "",
                    description: ev.description || "",
                    icon: ev.icon || "Sparkles",
                    imageUrl: ev.imageUrl || null,
                    sortOrder: ev.sortOrder ?? idx,
                  })),
                }
              : undefined,
            gallery: Array.isArray(body.gallery) && body.gallery.length > 0
              ? {
                  create: body.gallery.map((g: any, idx: number) => ({
                    imageUrl: g.imageUrl,
                    caption: g.caption || null,
                    sortOrder: g.sortOrder ?? idx,
                    isCover: g.isCover ?? idx === 0,
                  })),
                }
              : undefined,
          },
        });
      }

      console.log(`Successfully synced invitation "${cleanSlug}" to PostgreSQL database!`);
      return NextResponse.json({
        success: true,
        persistedToDb: true,
        message: "Invitation saved and synced to database successfully",
      });
    } catch (dbErr: any) {
      console.warn("Prisma sync warning (in-memory store fallback active):", dbErr?.message);
      return NextResponse.json({
        success: true,
        persistedToDb: false,
        warning: dbErr?.message,
        message: "Saved to memory backup store",
      });
    }
  } catch (err: any) {
    console.error("POST /api/invitations/sync error:", err);
    return NextResponse.json({ error: err.message || "Sync failed" }, { status: 500 });
  }
}
