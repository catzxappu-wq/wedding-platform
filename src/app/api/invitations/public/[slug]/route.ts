import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invitationStore } from "@/lib/invitationStore";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    slug: string;
  };
}

// GET /api/invitations/public/[slug]
// Public endpoint for wedding guests and client hydrators to retrieve published invitation details
export async function GET(request: Request, { params }: Params) {
  try {
    const cleanSlug = (params.slug || "").toLowerCase().trim();
    if (!cleanSlug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
    }

    let invitation: any = null;

    try {
      invitation = await prisma.invitation.findUnique({
        where: { slug: cleanSlug },
        include: {
          couple: true,
          venue: true,
          events: { orderBy: { sortOrder: "asc" } },
          gallery: { orderBy: { sortOrder: "asc" } },
          rsvps: { orderBy: { createdAt: "desc" } },
          template: true,
          settings: true,
        },
      });
    } catch (dbErr) {
      console.warn("DB lookup error in GET /api/invitations/public/[slug]:", dbErr);
    }

    if (!invitation) {
      invitation = invitationStore.getInvitationBySlug(cleanSlug);
    }

    if (!invitation) {
      // Also try matching by id or couple names
      const all = invitationStore.getAllInvitations();
      invitation = all.find((item) => {
        if (item.id === cleanSlug || item.slug.toLowerCase() === cleanSlug) return true;
        const coupleSlug = `${item.couple?.groomName || ""}-${item.couple?.brideName || ""}`
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        return coupleSlug === cleanSlug;
      });
    }

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found", slug: cleanSlug }, { status: 404 });
    }

    // Only return if not deleted or unpublish-blocked
    if (invitation.status === "UNPUBLISHED" || invitation.status === "ARCHIVED") {
      return NextResponse.json(
        { error: "Invitation is currently private or archived", status: invitation.status },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { invitation },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/invitations/public/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
