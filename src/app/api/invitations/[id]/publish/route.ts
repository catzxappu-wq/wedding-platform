import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { invitationStore } from "@/lib/invitationStore";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["DRAFT", "PUBLISHED", "UNPUBLISHED", "ARCHIVED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Update backup store
    const storeItem = invitationStore.getInvitationById(params.id);
    if (storeItem) {
      storeItem.status = status as any;
      invitationStore.saveInvitation(storeItem);
    }

    let updatedStatus = status;
    try {
      const updated = await prisma.invitation.update({
        where: { id: params.id },
        data: { status },
        include: { couple: true },
      });
      updatedStatus = updated.status;
    } catch (dbErr) {
      console.warn("DB publish status update skipped/failed:", dbErr);
    }

    return NextResponse.json({
      success: true,
      status: updatedStatus,
      message: `Invitation status updated to ${status}`,
    });
  } catch (error: any) {
    console.error("POST publish status error:", error);
    return NextResponse.json({ error: "Failed to update publish status" }, { status: 500 });
  }
}
