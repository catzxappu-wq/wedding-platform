import React from "react";
import prisma from "@/lib/prisma";
import { invitationStore } from "@/lib/invitationStore";
import Link from "next/link";
import {
  Mail,
  CheckCircle,
  FileText,
  Users,
  UserCheck,
  PlusCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import InvitationsTable from "@/components/admin/InvitationsTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  let totalInvs = 0;
  let publishedCount = 0;
  let draftCount = 0;
  let rsvps: any[] = [];
  let recentInvitations: any[] = [];

  try {
    const res = await Promise.all([
      prisma.invitation.count(),
      prisma.invitation.count({ where: { status: "PUBLISHED" } }),
      prisma.invitation.count({ where: { status: "DRAFT" } }),
      prisma.rsvp.findMany({ select: { guestsCount: true, attending: true } }),
      prisma.invitation.findMany({
        include: {
          couple: true,
          template: true,
          events: true,
          rsvps: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);
    totalInvs = res[0];
    publishedCount = res[1];
    draftCount = res[2];
    rsvps = res[3];
    recentInvitations = res[4];
  } catch (err) {
    console.warn("Database not accessible on dashboard load:", err);
  }

  // Fallback to backup store if DB was offline or empty
  if (recentInvitations.length === 0) {
    const storeInvs = invitationStore.getAllInvitations();
    recentInvitations = storeInvs;
    totalInvs = storeInvs.length;
    publishedCount = storeInvs.filter((i) => i.status === "PUBLISHED").length;
    draftCount = storeInvs.filter((i) => i.status === "DRAFT").length;
    for (const inv of storeInvs) {
      if (inv.rsvps?.length) {
        rsvps.push(...inv.rsvps);
      }
    }
  }

  const totalRsvpResponses = rsvps.length;
  const totalAttendingGuests = rsvps
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + (r.guestsCount || 1), 0);

  const stats = [
    {
      label: "Total Invitations",
      value: totalInvs,
      icon: Mail,
      color: "from-amber-500/20 to-amber-600/10",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/30",
    },
    {
      label: "Published Online",
      value: publishedCount,
      icon: CheckCircle,
      color: "from-emerald-500/20 to-emerald-600/10",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
    },
    {
      label: "In Draft",
      value: draftCount,
      icon: FileText,
      color: "from-blue-500/20 to-blue-600/10",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/30",
    },
    {
      label: "RSVP Responses",
      value: totalRsvpResponses,
      icon: Users,
      color: "from-purple-500/20 to-purple-600/10",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/30",
    },
    {
      label: "Confirmed Guests",
      value: totalAttendingGuests,
      icon: UserCheck,
      color: "from-rose-500/20 to-rose-600/10",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/30",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#182032] via-[#141A29] to-[#121622] border border-amber-500/20 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-Tenant Wedding Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">
            Wedding Management Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
            Create, customize, preview, and share high-converting luxury wedding invitations with instant real-time synchronization.
          </p>
        </div>

        <Link
          href="/admin/invitations/create"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white text-xs font-serif font-bold uppercase tracking-wider shadow-xl shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all shrink-0 relative z-10"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Invitation</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-gradient-to-br ${s.color} bg-[#111726] border ${s.borderColor} shadow-lg relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {s.label}
                </span>
                <div className={`p-2 rounded-xl bg-black/20 ${s.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {s.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invitations Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">
              Wedding Invitations
            </h2>
            <p className="text-xs text-gray-400">
              Manage live published links, draft concepts, and client invitations.
            </p>
          </div>
          <Link
            href="/admin/invitations"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>View All ({totalInvs})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Client Interactive Table */}
        <InvitationsTable initialInvitations={JSON.parse(JSON.stringify(recentInvitations))} />
      </div>
    </div>
  );
}
