"use client";

import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Utensils,
  Download,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface RsvpItem {
  id: string;
  invitationId: string;
  guestName: string;
  phone: string;
  email?: string | null;
  guestsCount: number;
  attending: boolean;
  foodPreference: string;
  message?: string | null;
  createdAt: string;
  invitation?: {
    title: string;
    slug: string;
    couple?: {
      groomName: string;
      brideName: string;
    } | null;
  } | null;
}

interface InvitationOption {
  id: string;
  title: string;
  slug: string;
}

interface RsvpManagerProps {
  initialRsvps: RsvpItem[];
  invitations: InvitationOption[];
}

export default function RsvpManager({ initialRsvps, invitations }: RsvpManagerProps) {
  const [rsvps, setRsvps] = useState<RsvpItem[]>(initialRsvps);
  const [selectedInvitation, setSelectedInvitation] = useState<string>("ALL");
  const [attendingFilter, setAttendingFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const handleExportCSV = () => {
    let url = "/api/rsvp?export=csv";
    if (selectedInvitation !== "ALL") {
      url += `&invitationId=${selectedInvitation}`;
    }
    if (attendingFilter !== "ALL") {
      url += `&attending=${attendingFilter === "YES"}`;
    }
    window.open(url, "_blank");
  };

  const filtered = rsvps.filter((r) => {
    const matchesInv =
      selectedInvitation === "ALL" || r.invitationId === selectedInvitation;
    const matchesAttending =
      attendingFilter === "ALL" ||
      (attendingFilter === "YES" && r.attending) ||
      (attendingFilter === "NO" && !r.attending);
    const query = search.toLowerCase();
    const matchesSearch =
      r.guestName.toLowerCase().includes(query) ||
      r.phone.includes(query) ||
      (r.email && r.email.toLowerCase().includes(query)) ||
      (r.message && r.message.toLowerCase().includes(query));

    return matchesInv && matchesAttending && matchesSearch;
  });

  const totalResponses = filtered.length;
  const attendingCount = filtered.filter((r) => r.attending).length;
  const notAttendingCount = totalResponses - attendingCount;
  const totalHeadcount = filtered
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + (r.guestsCount || 1), 0);

  const vegCount = filtered.filter((r) => r.attending && r.foodPreference === "veg").length;
  const nonVegCount = filtered.filter((r) => r.attending && r.foodPreference === "non-veg").length;
  const jainCount = filtered.filter((r) => r.attending && r.foodPreference === "jain").length;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111726] border border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase font-medium">Total Responses</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {totalResponses}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111726] border border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400 uppercase font-medium">Attending</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {attendingCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111726] border border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-400 uppercase font-medium">Declined</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {notAttendingCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
            <UserX className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111726] border border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-400 uppercase font-medium">Total Headcount</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {totalHeadcount} <span className="text-xs text-gray-400 font-sans font-normal">guests</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Food Preference Breakdown Pill */}
      <div className="p-4 rounded-2xl bg-[#111726] border border-gray-800 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white">Meal Preferences Breakdown:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Vegetarian: {vegCount}
          </span>
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Non-Veg: {nonVegCount}
          </span>
          <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            Jain: {jainCount}
          </span>
        </div>
      </div>

      {/* Filter & Export Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#111726] border border-gray-800">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guest or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
            />
          </div>

          {/* Invitation Filter */}
          <select
            value={selectedInvitation}
            onChange={(e) => setSelectedInvitation(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
          >
            <option value="ALL">All Wedding Invitations</option>
            {invitations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.title}
              </option>
            ))}
          </select>

          {/* Attending Filter */}
          <select
            value={attendingFilter}
            onChange={(e) => setAttendingFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
          >
            <option value="ALL">All Status</option>
            <option value="YES">Attending</option>
            <option value="NO">Declined</option>
          </select>
        </div>

        {/* Export to CSV */}
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 cursor-pointer shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* RSVP Table */}
      <div className="rounded-2xl bg-[#111726] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D121F] text-gray-400 uppercase tracking-wider text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Guest Name</th>
                <th className="py-3.5 px-4 font-semibold">Invitation</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Headcount</th>
                <th className="py-3.5 px-4 font-semibold">Meal</th>
                <th className="py-3.5 px-4 font-semibold">Contact</th>
                <th className="py-3.5 px-4 font-semibold">Message</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    No RSVP records found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">
                      {r.guestName}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {r.invitation?.title || r.invitationId}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.attending ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px] uppercase">
                          Attending
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold text-[10px] uppercase">
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {r.guestsCount}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-gray-300">
                      {r.foodPreference}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5 font-mono text-[11px]">
                      <div className="flex items-center gap-1 text-gray-300">
                        <Phone className="w-3 h-3 text-amber-500/70" />
                        <span>{r.phone}</span>
                      </div>
                      {r.email && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <span>{r.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-gray-400 italic" title={r.message || ""}>
                      {r.message || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
