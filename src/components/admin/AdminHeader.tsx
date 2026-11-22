"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, ExternalLink, ShieldCheck, Heart } from "lucide-react";
import { UserSession } from "@/types";

interface AdminHeaderProps {
  session: UserSession;
}

export default function AdminHeader({ session }: AdminHeaderProps) {
  return (
    <header className="h-16 px-4 sm:px-8 border-b border-gray-800 bg-[#0E1422]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Online</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin/invitations/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold tracking-wider uppercase shadow-md shadow-amber-900/30 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Create Invitation</span>
        </Link>
      </div>
    </header>
  );
}
