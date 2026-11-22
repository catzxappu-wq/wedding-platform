import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Sparkles, Mail } from "lucide-react";
import InvitationsTable from "@/components/admin/InvitationsTable";

export const revalidate = 0;

export default async function AdminInvitationsPage() {
  const invitations = await prisma.invitation.findMany({
    include: {
      couple: true,
      template: true,
      events: true,
      rsvps: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-Tenant Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">
            All Wedding Invitations
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            You have {invitations.length} wedding invitations configured in the database.
          </p>
        </div>

        <Link
          href="/admin/invitations/create"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-amber-900/30 hover:scale-105 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Invitation</span>
        </Link>
      </div>

      {/* Invitations Table */}
      <InvitationsTable initialInvitations={JSON.parse(JSON.stringify(invitations))} />
    </div>
  );
}
