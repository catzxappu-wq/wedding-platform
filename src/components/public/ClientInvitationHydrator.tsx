"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Heart, Sparkles, RefreshCw } from "lucide-react";
import { InvitationWithRelations } from "@/types";
import InvitationExperience from "./InvitationExperience";

interface ClientInvitationHydratorProps {
  slug: string;
}

export default function ClientInvitationHydrator({ slug }: ClientInvitationHydratorProps) {
  const [invitation, setInvitation] = useState<InvitationWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [allCached, setAllCached] = useState<any[]>([]);

  const loadData = async (cleanSlug: string) => {
    try {
      if (typeof window !== "undefined") {
        // 1. Check URL hash for embedded data if present
        if (window.location.hash && window.location.hash.startsWith("#d=")) {
          try {
            const rawBase64 = window.location.hash.substring(3);
            const decoded = JSON.parse(decodeURIComponent(atob(rawBase64)));
            if (decoded) {
              setInvitation(formatInvitation(decoded));
              setLoading(false);
              return;
            }
          } catch (hashErr) {
            console.warn("Could not parse hash payload:", hashErr);
          }
        }

        // 2. Check localStorage cache
        const cacheKey = "wedding_invitations_cache";
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
          try {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              setAllCached(list);
              const found = list.find((item: any) => {
                const itemSlug = (item.slug || "").toLowerCase().trim();
                if (itemSlug === cleanSlug) return true;

                const coupleSlug = `${item.couple?.groomName || ""}-${item.couple?.brideName || ""}`
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");
                if (coupleSlug === cleanSlug) return true;

                if (item.title && item.title.toLowerCase().includes(cleanSlug)) return true;
                return false;
              });

              if (found) {
                const formatted = formatInvitation(found);
                setInvitation(formatted);
                setLoading(false);

                // Auto-sync back to server in background so other requests find it
                fetch("/api/invitations/sync", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formatted),
                }).catch(() => {});

                return;
              }
            }
          } catch (jsonErr) {
            console.warn("Local storage parse error:", jsonErr);
          }
        }

        // 3. Fallback: Network fetch from public API endpoint
        try {
          const res = await fetch(`/api/invitations/public/${encodeURIComponent(cleanSlug)}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.invitation) {
              const formatted = formatInvitation(data.invitation);
              setInvitation(formatted);

              // Cache locally on this device as well
              try {
                const existing = JSON.parse(localStorage.getItem(cacheKey) || "[]");
                if (Array.isArray(existing)) {
                  const filtered = existing.filter((x: any) => x.id !== formatted.id && x.slug !== formatted.slug);
                  filtered.unshift(formatted);
                  localStorage.setItem(cacheKey, JSON.stringify(filtered.slice(0, 10)));
                }
              } catch (_) {}

              setLoading(false);
              return;
            }
          }
        } catch (netErr) {
          console.warn("Public API fetch error in hydrator:", netErr);
        }
      }
    } catch (err) {
      console.warn("Client hydration check failed:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const cleanSlug = (slug || "").toLowerCase().trim();
    loadData(cleanSlug);
  }, [slug]);

  const handleRetry = async () => {
    setRetrying(true);
    const cleanSlug = (slug || "").toLowerCase().trim();
    await loadData(cleanSlug);
    setRetrying(false);
  };

  function formatInvitation(raw: any): InvitationWithRelations {
    const toDateStr = (val: any) => {
      if (!val) return null;
      if (typeof val === "string") return val;
      if (val instanceof Date) return val.toISOString();
      return new Date(val).toISOString();
    };

    return {
      ...raw,
      id: raw.id || `inv-${Date.now()}`,
      slug: raw.slug || slug,
      title: raw.title || `${raw.couple?.groomName || "Groom"} & ${raw.couple?.brideName || "Bride"}'s Wedding`,
      status: (raw.status || "PUBLISHED") as any,
      templateId: raw.templateId || "royal-gold",
      primaryColor: raw.primaryColor || "#B8972E",
      secondaryColor: raw.secondaryColor || "#58111A",
      accentColor: raw.accentColor || "#D4AF37",
      backgroundColor: raw.backgroundColor || "#FAF7F2",
      textColor: raw.textColor || "#1F2937",
      fontFamily: raw.fontFamily || "Cinzel",
      headingFont: raw.headingFont || "Cinzel",
      musicEnabled: raw.musicEnabled ?? true,
      musicTitle: raw.musicTitle || "Royal Shehnai & Sitar Melody",
      musicUrl:
        raw.musicUrl ||
        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=indian-flute-and-sitar-10492.mp3",
      weddingDate: toDateStr(raw.weddingDate) || new Date().toISOString(),
      startTime: raw.startTime || "10:30 AM",
      endTime: raw.endTime || "10:00 PM",
      timeZone: raw.timeZone || "Asia/Kolkata",
      createdAt: toDateStr(raw.createdAt) || new Date().toISOString(),
      updatedAt: toDateStr(raw.updatedAt) || new Date().toISOString(),
      couple: {
        id: raw.couple?.id || `couple-${Date.now()}`,
        groomName: raw.couple?.groomName || "Groom",
        brideName: raw.couple?.brideName || "Bride",
        groomPhoto: raw.couple?.groomPhoto || null,
        bridePhoto: raw.couple?.bridePhoto || null,
        couplePhoto: raw.couple?.couplePhoto || null,
        introduction: raw.couple?.introduction || "Two hearts, one beautiful journey.",
        story: raw.couple?.story || null,
        familyMessage: raw.couple?.familyMessage || null,
        familyNames: raw.couple?.familyNames || null,
      },
      venue: {
        id: raw.venue?.id || `venue-${Date.now()}`,
        venueName: raw.venue?.venueName || "Grand Wedding Venue",
        fullAddress: raw.venue?.fullAddress || "Bengaluru, Karnataka, India",
        city: raw.venue?.city || "Bengaluru",
        state: raw.venue?.state || "Karnataka",
        country: raw.venue?.country || "India",
        latitude: raw.venue?.latitude || 12.9606,
        longitude: raw.venue?.longitude || 77.6484,
        googleMapsUrl: raw.venue?.googleMapsUrl || "https://maps.google.com",
      },
      events: (raw.events || []).map((e: any, i: number) => ({
        ...e,
        id: e.id || `ev-${i + 1}`,
        date: toDateStr(e.date) || new Date().toISOString(),
      })),
      gallery: (raw.gallery || []).map((g: any, i: number) => ({
        ...g,
        id: g.id || `gal-${i + 1}`,
        imageUrl: g.imageUrl,
        caption: g.caption || null,
        sortOrder: g.sortOrder ?? i + 1,
        isCover: g.isCover ?? i === 0,
      })),
      rsvps: raw.rsvps || [],
      settings: raw.settings || [],
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner mb-4">
          <Heart className="w-8 h-8 text-amber-600 fill-amber-500 animate-pulse" />
        </div>
        <h2 className="text-xl font-serif text-gray-800 font-bold">
          Opening Wedding Celebration...
        </h2>
        <p className="text-xs text-gray-500 mt-2">
          Retrieving invitation details
        </p>
      </div>
    );
  }

  if (invitation) {
    return <InvitationExperience invitation={invitation} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-3xl bg-white p-8 sm:p-10 shadow-2xl border border-amber-300/40 space-y-5">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 font-bold">
          Invitation Not Found
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          We couldn't find a wedding invitation at{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-amber-800 font-mono">
            /invite/{slug}
          </code>
          .
        </p>

        {allCached.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs space-y-1">
            <span className="font-semibold text-amber-900 block">
              Found on this device:
            </span>
            {allCached.map((item, idx) => (
              <Link
                key={idx}
                href={`/invite/${item.slug}`}
                className="text-amber-700 underline block hover:text-amber-900"
              >
                • {item.title || item.slug} (/invite/{item.slug})
              </Link>
            ))}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold text-xs tracking-wider uppercase transition-colors shadow"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} />
            <span>{retrying ? "Checking..." : "Refresh Invitation"}</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/admin/invitations/create"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Invitation</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
