import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Heart,
  ExternalLink,
  Users,
  Compass,
  Palette,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let invitations: any[] = [];
  try {
    invitations = await prisma.invitation.findMany({
      include: {
        couple: true,
        template: true,
        events: true,
        rsvps: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("Database not reachable during page load:", err);
  }

  return (
    <div className="min-h-screen bg-[#0A0E17] text-gray-100 flex flex-col justify-between selection:bg-amber-400 selection:text-amber-950">
      {/* Navigation Header */}
      <nav className="h-20 px-6 sm:px-12 border-b border-gray-800/80 bg-[#0E131F]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-600/20 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-[#0A0E17] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-white tracking-wide block">
              ForeverYours
            </span>
            <span className="text-[10px] text-amber-400/80 tracking-widest uppercase font-sans font-semibold">
              Wedding Invitation Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/login"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-amber-900/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 py-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Database-Driven Scalable Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            The Production Digital <br />
            <span className="gold-gradient-text">Wedding Invitation Platform</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Create, customize, preview, and publish hundreds of bespoke digital wedding invitations from one unified Admin Dashboard. Powered by Next.js, PostgreSQL, and Prisma ORM.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admin/dashboard"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-serif text-sm tracking-wider uppercase font-semibold shadow-xl shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Explore Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/invite/rahul-priya"
              className="px-8 py-4 rounded-full bg-[#161D2E] border border-amber-500/30 text-amber-200 font-serif text-sm tracking-wider uppercase font-semibold hover:bg-[#1E263B] transition-all flex items-center gap-2"
            >
              <span>View Sample Invitation (Live)</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Database Invitations Showcase */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-400" />
                <span>Live Database Invitations</span>
              </h2>
              <p className="text-xs text-gray-400">
                Each invitation is loaded dynamically from PostgreSQL/Prisma using its unique URL slug.
              </p>
            </div>
            <Link
              href="/admin/invitations/create"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              + Create Another Invitation
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invitations.map((inv) => {
              const groom = inv.couple?.groomName || "Groom";
              const bride = inv.couple?.brideName || "Bride";
              const dateStr = inv.weddingDate
                ? new Date(inv.weddingDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Date to be announced";

              const coverPhoto =
                inv.couple?.couplePhoto ||
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={inv.id}
                  className="rounded-3xl bg-[#111726] border border-gray-800 p-6 shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden relative bg-gray-900">
                      <img
                        src={coverPhoto}
                        alt={`${groom} & ${bride}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md border border-white/10 bg-black/70">
                        {inv.status === "PUBLISHED" ? (
                          <span className="text-emerald-400">● Published</span>
                        ) : (
                          <span className="text-amber-400">● Draft</span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white">
                        Template: {inv.template?.name || inv.templateId}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-2xl text-white group-hover:text-amber-400 transition-colors">
                        {groom} & {bride}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{dateStr}</span>
                      </p>
                      <p className="text-xs text-gray-400 italic mt-2 line-clamp-2">
                        "{inv.couple?.introduction || "Two hearts, one beautiful journey."}"
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-800/80">
                      <span>Events: {inv.events.length}</span>
                      <span>RSVP Responses: {inv.rsvps.length}</span>
                    </div>
                  </div>

                  <div className="pt-5 flex items-center gap-3">
                    <Link
                      href={`/invite/${inv.slug}`}
                      target="_blank"
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Invitation URL</span>
                    </Link>
                    <Link
                      href={`/admin/invitations/${inv.id}/edit`}
                      className="py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-3xl bg-[#111726] border border-gray-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white">
              10 Reusable Templates
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Decoupled layout engine supporting Royal Gold, Black & Gold, Floral, Minimal, Vedic Vermilion, South Indian Temple, and more.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111726] border border-gray-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white">
              Real-Time RSVP & CSV Export
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Guests submit attendance, headcount, and dietary preferences with confetti celebrations. Admin can download instant CSV reports.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111726] border border-gray-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white">
              .ICS Calendar & Google Maps
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Dynamic standard .ics RFC 5545 calendar files for Apple / Outlook and 1-click Google Calendar sync, plus interactive Google Maps.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-20 border-t border-gray-800/80 px-6 sm:px-12 flex items-center justify-between text-xs text-gray-500">
        <span>ForeverYours Digital Wedding Invitation Platform</span>
        <span>Ready for Vercel & Supabase/Neon PostgreSQL</span>
      </footer>
    </div>
  );
}
