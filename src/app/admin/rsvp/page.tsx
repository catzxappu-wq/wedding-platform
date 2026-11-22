import React from "react";
import prisma from "@/lib/prisma";
import RsvpManager from "@/components/admin/RsvpManager";
import { Users } from "lucide-react";

export const revalidate = 0;

export default async function AdminRsvpPage() {
  const [rsvps, invitations] = await Promise.all([
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
      },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>Guest Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">
          RSVP Guest Responses
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Track attendance, dietary choices, and guest counts across all invitations.
        </p>
      </div>

      <RsvpManager
        initialRsvps={JSON.parse(JSON.stringify(rsvps))}
        invitations={invitations}
      />
    </div>
  );
}
