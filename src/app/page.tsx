import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Heart,
  Users,
  Compass,
  Palette,
  CheckCircle2,
  Lock,
  Music,
  Share2,
} from "lucide-react";
import PrivateInvitationLookup from "@/components/public/PrivateInvitationLookup";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
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
              Digital Wedding Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/login"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-amber-900/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Host Admin Portal</span>
          </Link>
        </div>
      </nav>

      {/* Main Hero & Content */}
      <main className="flex-1 py-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Private & Bespoke Digital Wedding Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            Luxury Digital <br />
            <span className="gold-gradient-text">Wedding Invitations</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Create, manage, and share bespoke, interactive wedding cards. Featuring sacred cultural invocations, 3D envelopes, audio soundtracks, and real-time RSVP management — kept strictly private for you and your guests.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admin/login"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-serif text-sm tracking-wider uppercase font-semibold shadow-xl shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Host Dashboard Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/invitations/create"
              className="px-8 py-4 rounded-full bg-[#161D2E] border border-amber-500/30 text-amber-200 font-serif text-sm tracking-wider uppercase font-semibold hover:bg-[#1E263B] transition-all flex items-center gap-2"
            >
              <span>+ Create Invitation</span>
            </Link>
          </div>
        </div>

        {/* Private Invitation Guest Lookup Box */}
        <div className="pt-2">
          <PrivateInvitationLookup />
        </div>

        {/* Platform Features Grid */}
        <div className="space-y-6 pt-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Designed For Privacy & Elegance
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Your celebration is personal. Our platform ensures your wedding details remain exclusively accessible to your loved ones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Privacy Feature */}
            <div className="p-7 rounded-3xl bg-[#111726] border border-gray-800 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                Strict Guest Privacy
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Invitations are never displayed on public listings or search pages. Only guests with your unique secret wedding link can view your celebration details.
              </p>
            </div>

            {/* Cultural Themes */}
            <div className="p-7 rounded-3xl bg-[#111726] border border-gray-800 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                Traditional Cultural Themes
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Authentic Kannada Kalyana Vaibhava, Lord Ganesha invocations, sacred Saptapadi 7 vows, Mysore silk aesthetics, and custom bilingual language toggles.
              </p>
            </div>

            {/* RSVP Management */}
            <div className="p-7 rounded-3xl bg-[#111726] border border-gray-800 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                Live RSVP & Dietary Tracking
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive real-time guest headcount, dietary preferences (veg, non-veg, vegan), and blessings in your private admin dashboard with CSV export.
              </p>
            </div>

            {/* Audio Soundtrack */}
            <div className="p-7 rounded-3xl bg-[#111726] border border-gray-800 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                10 MB Wedding Soundtrack
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Upload royal Shehnai, Sitar, or your personal romantic music track up to 10 MB with chunked streaming playback.
              </p>
            </div>

            {/* Calendar & Venue Maps */}
            <div className="p-7 rounded-3xl bg-[#111726] border border-gray-800 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                Calendar Sync & Google Maps
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Guests can save the date with one tap to Google Calendar or download standard .ICS calendar files, alongside interactive venue maps.
              </p>
            </div>

            {/* Event Customization */}
            <div className="p-7 rounded-3xl bg-[#111726] border border-gray-800 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                1-Tap Ceremony Control
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Choose exactly which rituals to feature (Muhurtham, Reception, Sangeet, Haldi) or add custom events without unwanted pre-filled items.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-20 border-t border-gray-800/80 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2 py-4 sm:py-0">
        <span>ForeverYours Digital Wedding Invitation Platform</span>
        <span>Private & Secure • Accessible Only via Direct Link</span>
      </footer>
    </div>
  );
}
