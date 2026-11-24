"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Lock } from "lucide-react";

export default function PrivateInvitationLookup() {
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let cleaned = slug.trim().toLowerCase();
    if (!cleaned) {
      setError("Please enter a wedding link or code.");
      return;
    }

    // If user pasted a full URL like https://.../invite/couple-name or /invite/couple-name
    if (cleaned.includes("/invite/")) {
      const parts = cleaned.split("/invite/");
      cleaned = parts[parts.length - 1].split("/")[0].split("?")[0].split("#")[0];
    } else {
      cleaned = cleaned.replace(/^https?:\/\/[^\/]+\/?/, "").replace(/^\//, "");
    }

    if (!cleaned) {
      setError("Please enter a valid wedding invitation name.");
      return;
    }

    router.push(`/invite/${cleaned}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#111726]/90 border border-amber-500/30 backdrop-blur-md shadow-2xl space-y-4">
      <div className="flex items-center gap-2.5 text-amber-400">
        <Lock className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-semibold font-sans">
          Private Guest Access
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
          Looking for a Wedding Invitation?
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Invitations are private and accessible only via direct link or wedding code. Enter your couple's celebration name to view their card.
        </p>
      </div>

      <form onSubmit={handleLookup} className="space-y-3 pt-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. shrinivas-meghashree"
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-[#0A0E17] border border-gray-700 focus:border-amber-400 text-sm text-white placeholder-gray-500 outline-none transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {error && <p className="text-xs text-rose-400 pl-1">{error}</p>}

        <p className="text-[11px] text-gray-500 text-center pt-1">
          🔒 Celebrations remain strictly private to invited guests and family.
        </p>
      </form>
    </div>
  );
}
