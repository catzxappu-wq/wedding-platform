import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
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
    notFound();
  }

  return (
    <InvitationBuilderWizard
      initialData={JSON.parse(JSON.stringify(invitation))}
      isEditing={true}
      invitationId={params.id}
    />
  );
}
