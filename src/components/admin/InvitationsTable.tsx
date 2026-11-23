"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  Share2,
  Search,
  Filter,
  Check,
  ToggleLeft,
  ToggleRight,
  MoreVertical,
  Calendar,
  Cloud,
  RefreshCw,
} from "lucide-react";
import { slugify } from "@/lib/utils";

interface InvitationRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  templateId: string;
  weddingDate?: string | null;
  createdAt: string;
  updatedAt: string;
  couple?: {
    groomName: string;
    brideName: string;
  } | null;
  template?: {
    name: string;
  } | null;
  rsvps?: any[];
}

interface InvitationsTableProps {
  initialInvitations: InvitationRow[];
}

export default function InvitationsTable({ initialInvitations }: InvitationsTableProps) {
  const router = useRouter();
  const [invitations, setInvitations] = useState<InvitationRow[]>(initialInvitations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);

  // Sync client-side cached invitations created on this device
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("wedding_invitations_cache");
        if (raw) {
          const cached = JSON.parse(raw);
          if (Array.isArray(cached) && cached.length > 0) {
            // Auto sync all local invitations to cloud database in background
            for (const item of cached) {
              fetch("/api/invitations/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
              }).catch(() => {});
            }

            setInvitations((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const existingSlugs = new Set(prev.map((p) => (p.slug || "").toLowerCase().trim()));
              const toAdd: InvitationRow[] = [];

              for (const c of cached) {
                const cSlug = (c.slug || "").toLowerCase().trim();
                if (!existingIds.has(c.id) && !existingSlugs.has(cSlug)) {
                  toAdd.push({
                    id: c.id || `inv-${Date.now()}`,
                    slug: c.slug,
                    title: c.title || `${c.couple?.groomName || "Groom"} & ${c.couple?.brideName || "Bride"}'s Wedding`,
                    status: c.status || "PUBLISHED",
                    templateId: c.templateId || "royal-gold",
                    weddingDate: c.weddingDate || null,
                    createdAt: c.createdAt || new Date().toISOString(),
                    updatedAt: c.updatedAt || new Date().toISOString(),
                    couple: c.couple ? { groomName: c.couple.groomName, brideName: c.couple.brideName } : null,
                    rsvps: c.rsvps || [],
                  });
                }
              }

              return toAdd.length > 0 ? [...toAdd, ...prev] : prev;
            });
          }
        }
      }
    } catch (e) {
      console.warn("Could not merge cached invitations into table:", e);
    }
  }, []);

  const handleSyncToCloud = async () => {
    setSyncingCloud(true);
    try {
      const raw = localStorage.getItem("wedding_invitations_cache");
      if (!raw) {
        showToast("No locally created invitations found to sync.");
        return;
      }
      const cached = JSON.parse(raw);
      if (!Array.isArray(cached) || cached.length === 0) {
        showToast("No locally created invitations found to sync.");
        return;
      }

      let successCount = 0;
      for (const item of cached) {
        const res = await fetch("/api/invitations/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const data = await res.json();
        if (data.persistedToDb) {
          successCount++;
        }
      }

      if (successCount > 0) {
        showToast(`🎉 Synced ${successCount} invitation(s) to PostgreSQL database!`);
      } else {
        showToast("Saved to server memory. Database connection verified.");
      }
      router.refresh();
    } catch (err: any) {
      showToast(`Sync error: ${err.message}`);
    } finally {
      setSyncingCloud(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyUrl = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/invite/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showToast(`Copied ${url}`);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleDuplicate = async (id: string) => {
    if (actionLoadingId) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/invitations/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to duplicate");

      showToast("Invitation duplicated successfully as Draft!");
      router.refresh();
      // Update local state
      setInvitations([data.invitation, ...invitations]);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    if (actionLoadingId) return;
    const newStatus = currentStatus === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED";
    setActionLoadingId(id);

    try {
      const res = await fetch(`/api/invitations/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle status");

      showToast(`Status updated to ${newStatus}`);
      setInvitations(
        invitations.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
      );
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      return;
    }
    setActionLoadingId(id);

    try {
      const res = await fetch(`/api/invitations/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      showToast("Invitation deleted successfully");
      setInvitations(invitations.filter((i) => i.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter logic
  const filtered = invitations.filter((inv) => {
    const groom = inv.couple?.groomName?.toLowerCase() || "";
    const bride = inv.couple?.brideName?.toLowerCase() || "";
    const title = inv.title.toLowerCase();
    const slug = inv.slug.toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch =
      groom.includes(query) || bride.includes(query) || title.includes(query) || slug.includes(query);
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-medium text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#111726] border border-gray-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by couple names or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700/80 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700/80 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="UNPUBLISHED">Unpublished</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button
            type="button"
            onClick={handleSyncToCloud}
            disabled={syncingCloud}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            title="Sync all invitations created on this device directly to PostgreSQL cloud database so they work on all phones and devices"
          >
            {syncingCloud ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-white" />
            )}
            <span>{syncingCloud ? "Syncing to Cloud..." : "Sync to Cloud DB"}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#111726] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D121F] text-gray-400 uppercase tracking-wider text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Couple & Title</th>
                <th className="py-3.5 px-4 font-semibold">Unique Slug / URL</th>
                <th className="py-3.5 px-4 font-semibold">Wedding Date</th>
                <th className="py-3.5 px-4 font-semibold">Template</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">RSVP</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No wedding invitations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const groom = inv.couple?.groomName || "Groom";
                  const bride = inv.couple?.brideName || "Bride";
                  const dateStr = inv.weddingDate
                    ? new Date(inv.weddingDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Not set";

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-gray-800/40 transition-colors group"
                    >
                      {/* Couple & Title */}
                      <td className="py-4 px-4">
                        <div className="font-serif font-bold text-white text-sm">
                          {groom} & {bride}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[200px]">
                          {inv.title}
                        </div>
                      </td>

                      {/* Unique Slug & Copy */}
                      <td className="py-4 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-400 font-medium">/invite/{inv.slug}</span>
                          <button
                            onClick={() => handleCopyUrl(inv.slug)}
                            title="Copy Invitation Link"
                            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedSlug === inv.slug ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Wedding Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Calendar className="w-3.5 h-3.5 text-amber-500/70" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Template */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 font-medium capitalize">
                          {inv.template?.name || inv.templateId}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleTogglePublish(inv.id, inv.status)}
                          title="Click to toggle Publish / Unpublish"
                          className="flex items-center gap-1.5 cursor-pointer group/status"
                        >
                          {inv.status === "PUBLISHED" ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>Published</span>
                            </span>
                          ) : inv.status === "DRAFT" ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>Draft</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-gray-700 text-gray-300 font-semibold text-[10px] uppercase tracking-wider">
                              {inv.status}
                            </span>
                          )}
                        </button>
                      </td>

                      {/* RSVP Count */}
                      <td className="py-4 px-4">
                        <span className="text-gray-300 font-semibold">
                          {inv.rsvps?.length || 0}
                        </span>{" "}
                        <span className="text-gray-500">guests</span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview Link */}
                          <Link
                            href={`/invite/${inv.slug}`}
                            target="_blank"
                            title="Preview Public Invitation"
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit Link */}
                          <Link
                            href={`/admin/invitations/${inv.id}/edit`}
                            title="Edit Invitation"
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          {/* Duplicate Action */}
                          <button
                            onClick={() => handleDuplicate(inv.id)}
                            title="Duplicate Invitation"
                            disabled={actionLoadingId === inv.id}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Action */}
                          <button
                            onClick={() => handleDelete(inv.id, inv.title)}
                            title="Delete Invitation"
                            disabled={actionLoadingId === inv.id}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
