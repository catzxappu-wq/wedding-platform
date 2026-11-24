import React from "react";
import prisma from "@/lib/prisma";
import { invitationStore } from "@/lib/invitationStore";
import RsvpManager from "@/components/admin/RsvpManager";
import RsvpDispatchConfig from "@/components/admin/RsvpDispatchConfig";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminRsvpPage() {
  let rsvps: any[] = [];
  let invitations: any[] = [];
  try {
    const res = await Promise.all([
      prisma.rsvp.findMany({
        include: {
          invitation: {
            select: {
              title: true,
              slug: true,
              couple: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.invitation.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          weddingDate: true,
        },
        orderBy: { title: "asc" },
      }),
    ]);
    rsvps = res[0] || [];
    invitations = res[1] || [];
  } catch (err) {
    console.warn("Database not accessible on rsvp page:", err);
  }

  // Backup store merge so invitations & RSVPs are always available
  const allStoreInvs = invitationStore.getAllInvitations();
  const existingInvIds = new Set(invitations.map((i) => i.id));
  for (const inv of allStoreInvs) {
    if (!existingInvIds.has(inv.id)) {
      invitations.push({
        id: inv.id,
        title: inv.title,
        slug: inv.slug,
        weddingDate: inv.weddingDate,
      });
    }
  }

  const existingRsvpIds = new Set(rsvps.map((r) => r.id));
  for (const inv of allStoreInvs) {
    for (const r of inv.rsvps || []) {
      if (!existingRsvpIds.has(r.id)) {
        rsvps.push({
          ...r,
          invitation: { title: inv.title, slug: inv.slug, couple: inv.couple },
        });
      }
    }
  }

  const serializedInvs = invitations.map((inv) => ({
    ...inv,
    weddingDate: inv.weddingDate ? new Date(inv.weddingDate).toISOString() : null,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>Guest Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">
          RSVP Guest Responses & Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Track attendance, configure 12-hour pre-wedding CSV dispatch to Email & WhatsApp, and manage guest headcounts.
        </p>
      </div>

      {/* 12-Hour Automated Pre-Wedding RSVP Dispatch Section */}
      <RsvpDispatchConfig invitations={serializedInvs} />

      {/* Guest Attendance & Dietary Overview Manager */}
      <RsvpManager
        initialRsvps={JSON.parse(JSON.stringify(rsvps))}
        invitations={serializedInvs}
      />
    </div>
  );
}
