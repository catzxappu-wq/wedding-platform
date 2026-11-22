import React from "react";
import prisma from "@/lib/prisma";
import { invitationStore } from "@/lib/invitationStore";
import Link from "next/link";
import { AlertCircle, ArrowLeft, PlusCircle } from "lucide-react";
import InvitationBuilderWizard from "@/components/admin/InvitationBuilderWizard";

interface EditPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditInvitationPage({ params }: EditPageProps) {
  let invitation: any = null;
  try {
    invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: {
        couple: true,
        venue: true,
        events: { orderBy: { sortOrder: "asc" } },
        gallery: { orderBy: { sortOrder: "asc" } },
      },
    });
  } catch (err) {
    console.warn("Failed to fetch invitation for edit:", err);
  }

  if (!invitation) {
    invitation = invitationStore.getInvitationById(params.id) || invitationStore.getInvitationBySlug(params.id);
  }

  if (!invitation) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-[#161D2E] border border-amber-500/20 p-8 space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif text-white font-bold">Invitation Not Found</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            The requested invitation ID could not be loaded from the database. It may have been created in another session or database storage is initializing.
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

  return (
    <InvitationBuilderWizard
      initialData={JSON.parse(JSON.stringify(invitation))}
      isEditing={true}
      invitationId={params.id}
    />
  );
}
