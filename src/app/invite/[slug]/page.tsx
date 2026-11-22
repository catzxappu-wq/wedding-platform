import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { InvitationWithRelations } from "@/types";
import InvitationExperience from "@/components/public/InvitationExperience";
import { AlertCircle, Lock, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { slug: params.slug },
      include: { couple: true, gallery: true },
    });

    if (!invitation) {
      return {
        title: "Wedding Invitation Not Found",
        description: "The requested wedding invitation could not be found.",
      };
    }

    const groom = invitation.couple?.groomName || "Groom";
    const bride = invitation.couple?.brideName || "Bride";
    const title = `${groom} & ${bride} | Wedding Invitation`;
    const description =
      invitation.couple?.introduction ||
      `Join ${groom} and ${bride} as they celebrate their joyous wedding celebration.`;

    const coverImage =
      invitation.couple?.couplePhoto ||
      invitation.gallery?.[0]?.imageUrl ||
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: coverImage,
            width: 1200,
            height: 630,
            alt: `${groom} & ${bride} Wedding`,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [coverImage],
      },
    };
  } catch {
    return {
      title: "Wedding Invitation",
      description: "ForeverYours Wedding Celebration",
    };
  }
}

export default async function PublicInvitationPage({ params }: PageProps) {
  let rawInvitation: any = null;
  try {
    rawInvitation = await prisma.invitation.findUnique({
      where: { slug: params.slug },
      include: {
        couple: true,
        venue: true,
        events: { orderBy: { sortOrder: "asc" } },
        gallery: { orderBy: { sortOrder: "asc" } },
        rsvps: { orderBy: { createdAt: "desc" } },
        template: true,
        settings: true,
      },
    });
  } catch (err) {
    console.warn("Failed to fetch invitation from database:", err);
  }

  // 1. Not Found Page
  if (!rawInvitation) {
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
            We couldn't find a wedding invitation at <code className="bg-gray-100 px-2 py-0.5 rounded text-amber-800">/invite/{params.slug}</code>. Please verify the link or contact the host.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back To Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cast raw invitation with serialized dates for client component
  const invitation: InvitationWithRelations = {
    ...rawInvitation,
    status: rawInvitation.status as any,
    weddingDate: rawInvitation.weddingDate ? rawInvitation.weddingDate.toISOString() : null,
    createdAt: rawInvitation.createdAt.toISOString(),
    updatedAt: rawInvitation.updatedAt.toISOString(),
    events: rawInvitation.events.map((e: any) => ({
      ...e,
      date: typeof e.date === "string" ? e.date : e.date.toISOString(),
    })),
    rsvps: rawInvitation.rsvps.map((r: any) => ({
      ...r,
      createdAt: typeof r.createdAt === "string" ? r.createdAt : r.createdAt.toISOString(),
    })),
  };

  // 2. Status check: Unpublished or Archived
  if (invitation.status === "UNPUBLISHED" || invitation.status === "ARCHIVED") {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 sm:p-10 shadow-2xl border border-amber-300/40 space-y-5">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 font-bold">
            Invitation Currently Private
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            This wedding celebration card has not been published yet or has been archived by the hosts.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              <span>Admin Access</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Draft Preview Notice Bar if status is DRAFT */}
      {invitation.status === "DRAFT" && (
        <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 font-medium px-4 py-2 text-xs text-center flex items-center justify-center gap-2 shadow-md">
          <span className="font-bold uppercase tracking-wider bg-amber-900 text-amber-100 px-2 py-0.5 rounded text-[10px]">
            Preview Mode
          </span>
          <span>This invitation is currently in Draft status. Guests cannot see it until published.</span>
          <Link
            href={`/admin/invitations/${invitation.id}/edit`}
            className="underline font-bold hover:text-black ml-2"
          >
            Edit In Admin
          </Link>
        </div>
      )}

      {/* Render the full interactive invitation */}
      <InvitationExperience invitation={invitation} />
    </>
  );
}
