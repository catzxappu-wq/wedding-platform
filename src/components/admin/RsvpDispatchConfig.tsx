"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Clock,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Sparkles,
  RefreshCw,
  Bell,
  ShieldCheck,
} from "lucide-react";

interface InvitationOption {
  id: string;
  title: string;
  slug: string;
  weddingDate?: string | null;
}

interface RsvpDispatchConfigProps {
  invitations: InvitationOption[];
  currentInvitationId?: string;
  onRefreshRsvps?: () => void;
}

export default function RsvpDispatchConfig({
  invitations,
  currentInvitationId,
  onRefreshRsvps,
}: RsvpDispatchConfigProps) {
  const [selectedInvId, setSelectedInvId] = useState<string>(
    currentInvitationId || (invitations[0]?.id ?? "")
  );

  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [enabled, setEnabled] = useState(true);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const [dispatchInfo, setDispatchInfo] = useState<{
    weddingDate: string | null;
    dispatchScheduledAt: string | null;
    hoursUntilDispatch: number | null;
    isWithin12Hours: boolean;
    lastSentAt: string | null;
    rsvpCount: number;
    title?: string;
  } | null>(null);

  const [lastResult, setLastResult] = useState<{
    whatsappUrl?: string;
    downloadUrl?: string;
    stats?: any;
    sentAt?: string;
  } | null>(null);

  // Fetch current config whenever selected invitation changes
  const fetchConfig = async (invId: string) => {
    if (!invId) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/rsvp-dispatch?invitationId=${invId}`);
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email || "");
        setWhatsapp(data.whatsapp || "");
        setEnabled(data.enabled !== false);
        setDispatchInfo({
          weddingDate: data.weddingDate,
          dispatchScheduledAt: data.dispatchScheduledAt,
          hoursUntilDispatch: data.hoursUntilDispatch,
          isWithin12Hours: data.isWithin12Hours,
          lastSentAt: data.lastSentAt,
          rsvpCount: data.rsvpCount || 0,
          title: data.title,
        });
      }
    } catch (err) {
      console.warn("Could not fetch dispatch config:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedInvId) {
      fetchConfig(selectedInvId);
    }
  }, [selectedInvId]);

  // Handle Save
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedInvId) return;

    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/rsvp-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: selectedInvId,
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          enabled,
          action: "save",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: "Notification contacts saved successfully! The RSVP CSV will be dispatched 12 hours prior to the wedding.",
        });
        fetchConfig(selectedInvId);
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to save contacts. Please try again.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error while saving contacts.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle Send RSVP CSV Now (Test Trigger)
  const handleSendNow = async () => {
    if (!selectedInvId) return;
    if (!email && !whatsapp) {
      setStatusMessage({
        type: "error",
        text: "Please provide either an Email address or WhatsApp phone number before triggering dispatch.",
      });
      return;
    }

    setDispatching(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/rsvp-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: selectedInvId,
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          enabled,
          action: "send_now",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLastResult({
          whatsappUrl: data.whatsappUrl,
          downloadUrl: data.downloadUrl,
          stats: data.stats,
          sentAt: data.sentAt,
        });

        setStatusMessage({
          type: "success",
          text: `Success! RSVP CSV generated with ${data.stats?.totalResponses || 0} responses (${data.stats?.totalHeadcount || 0} guests). Dispatched to ${email || "email"} and prepared for WhatsApp.`,
        });

        if (onRefreshRsvps) onRefreshRsvps();
        fetchConfig(selectedInvId);
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to dispatch RSVP report.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error while dispatching report.",
      });
    } finally {
      setDispatching(false);
    }
  };

  // Format Helper
  const formatDateNice = (isoStr: string | null | undefined) => {
    if (!isoStr) return "Not Scheduled";
    try {
      const d = new Date(isoStr);
      return d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#1E1B18] via-[#161412] to-[#0F0E0D] border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-900/40 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Automated Pre-Wedding Dispatch</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-amber-100 font-bold flex items-center gap-2">
            <span>12-Hour Pre-Wedding RSVP CSV Dispatch</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/70 mt-1 max-w-2xl">
            Save your Email and WhatsApp number below. The platform will automatically compile the full guest list, attendance headcounts, and dietary preferences into a clean CSV spreadsheet and deliver it directly to you <strong>12 hours before the wedding</strong>.
          </p>
        </div>

        {/* Invitation Selector if multiple invitations */}
        {invitations.length > 1 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs text-amber-300/80 font-medium">Invitation:</span>
            <select
              value={selectedInvId}
              onChange={(e) => setSelectedInvId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/40 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
            >
              {invitations.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.title || inv.slug}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Timing & Schedule Info Banner */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Wedding Date</span>
          </div>
          <div className="mt-2 text-sm sm:text-base font-serif font-bold text-amber-100">
            {formatDateNice(dispatchInfo?.weddingDate)}
          </div>
          <div className="text-[11px] text-amber-300/60 mt-1">
            Indian Standard Time (IST)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>12-Hour Trigger Scheduled</span>
          </div>
          <div className="mt-2 text-sm sm:text-base font-serif font-bold text-amber-200">
            {formatDateNice(dispatchInfo?.dispatchScheduledAt)}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {dispatchInfo?.hoursUntilDispatch !== null && dispatchInfo?.hoursUntilDispatch !== undefined
                ? dispatchInfo.hoursUntilDispatch > 0
                  ? `Triggering in ~${dispatchInfo.hoursUntilDispatch} hours`
                  : "Within 12-hour dispatch window"
                : "Awaiting date setup"}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Current RSVPs Ready</span>
          </div>
          <div className="mt-2 text-sm sm:text-base font-serif font-bold text-emerald-300">
            {dispatchInfo?.rsvpCount || 0} Responses Recorded
          </div>
          <div className="text-[11px] text-amber-300/60 mt-1">
            {dispatchInfo?.lastSentAt
              ? `Last dispatched: ${formatDateNice(dispatchInfo.lastSentAt)}`
              : "Not yet dispatched"}
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Notification Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Notification Email Address</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. host@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-amber-500/30 text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all shadow-inner"
              />
            </div>
            <p className="text-[11px] text-amber-300/60">
              The full CSV spreadsheet with guest details and meal choices will be emailed here.
            </p>
          </div>

          {/* WhatsApp Phone Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Host WhatsApp Number</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-amber-500/30 text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm transition-all shadow-inner"
              />
            </div>
            <p className="text-[11px] text-amber-300/60">
              Include country code (e.g. +91). The report summary and 1-tap CSV download link will be prepared for WhatsApp.
            </p>
          </div>
        </div>

        {/* Enable Toggle */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="enable-dispatch"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-amber-500 bg-black/60 border-amber-500/40 focus:ring-amber-400 focus:ring-offset-black cursor-pointer"
          />
          <label
            htmlFor="enable-dispatch"
            className="text-xs sm:text-sm text-amber-200/90 font-medium cursor-pointer select-none"
          >
            Enable automated dispatch (triggers automatically 12 hours before wedding date)
          </label>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm ${
              statusMessage.type === "success"
                ? "bg-emerald-950/60 border border-emerald-500/50 text-emerald-200"
                : statusMessage.type === "error"
                ? "bg-red-950/60 border border-red-500/50 text-red-200"
                : "bg-amber-950/60 border border-amber-500/50 text-amber-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">{statusMessage.text}</div>
          </div>
        )}

        {/* Buttons Row */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            <span>{saving ? "Saving Preferences..." : "Save Contact Details"}</span>
          </button>

          {/* Instant Test Dispatch Button */}
          <button
            type="button"
            onClick={handleSendNow}
            disabled={dispatching || (!email && !whatsapp)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50"
          >
            <Send className={`w-4 h-4 ${dispatching ? "animate-spin" : ""}`} />
            <span>{dispatching ? "Sending Report..." : "⚡ Send RSVP CSV Now"}</span>
          </button>

          {/* Direct Download Button */}
          <a
            href={`/api/rsvp?export=csv&invitationId=${selectedInvId}`}
            download
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-amber-200 text-xs font-semibold uppercase tracking-wider border border-amber-500/20 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download CSV</span>
          </a>

          {/* WhatsApp Direct Action if generated or configured */}
          {whatsapp && (
            <button
              type="button"
              onClick={() => {
                if (lastResult?.whatsappUrl) {
                  window.open(lastResult.whatsappUrl, "_blank");
                } else {
                  handleSendNow();
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          )}
        </div>
      </form>

      {/* Immediate Dispatch Result Card (if test triggered) */}
      {lastResult && (
        <div className="mt-6 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Latest Dispatch Summary</span>
            </span>
            <span className="text-[11px] text-amber-300/60">
              {formatDateNice(lastResult.sentAt)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/10">
              <div className="text-[10px] uppercase text-amber-300/70">Responses</div>
              <div className="text-lg font-bold text-amber-100 font-serif">
                {lastResult.stats?.totalResponses || 0}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/10">
              <div className="text-[10px] uppercase text-emerald-400/80">Attending</div>
              <div className="text-lg font-bold text-emerald-300 font-serif">
                {lastResult.stats?.attendingCount || 0}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/10">
              <div className="text-[10px] uppercase text-amber-300/70">Total Guests</div>
              <div className="text-lg font-bold text-amber-200 font-serif">
                {lastResult.stats?.totalHeadcount || 0}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/10">
              <div className="text-[10px] uppercase text-amber-300/70">Veg / Non-Veg</div>
              <div className="text-sm font-bold text-amber-100 mt-1">
                {lastResult.stats?.vegCount || 0}V / {lastResult.stats?.nonVegCount || 0}NV
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {lastResult.whatsappUrl && (
              <a
                href={lastResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-black font-bold text-xs transition-colors shadow"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Open Pre-filled WhatsApp Chat</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
            {lastResult.downloadUrl && (
              <a
                href={lastResult.downloadUrl}
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Generated CSV</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
