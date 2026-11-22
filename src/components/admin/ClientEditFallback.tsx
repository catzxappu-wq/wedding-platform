"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, PlusCircle, Loader2 } from "lucide-react";
import InvitationBuilderWizard from "./InvitationBuilderWizard";

interface ClientEditFallbackProps {
  invitationId: string;
}

export default function ClientEditFallback({ invitationId }: ClientEditFallbackProps) {
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("wedding_invitations_cache");
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const found = list.find(
              (item: any) =>
                item.id === invitationId ||
                item.slug === invitationId ||
                item.slug?.toLowerCase() === invitationId?.toLowerCase()
            );
            if (found) {
              setInvitation(found);
              setLoading(false);
              return;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Client edit hydration failed:", e);
    }
    setLoading(false);
  }, [invitationId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <span className="text-sm text-gray-400">Loading invitation editor...</span>
      </div>
    );
  }

  if (invitation) {
    return (
      <InvitationBuilderWizard
        initialData={invitation}
        isEditing={true}
        invitationId={invitationId}
      />
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-3xl bg-[#161D2E] border border-amber-500/20 p-8 space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif text-white font-bold">Invitation Not Found</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          The requested invitation could not be loaded from this session or server storage.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/admin/invitations"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-semibold text-xs hover:bg-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Invitations</span>
          </Link>
          <Link
            href="/admin/invitations/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-800 text-white font-semibold text-xs hover:bg-gray-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
