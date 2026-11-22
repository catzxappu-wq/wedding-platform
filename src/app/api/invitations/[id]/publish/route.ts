import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

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

    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: { status },
      include: { couple: true },
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
      message: `Invitation status updated to ${status}`,
    });
  } catch (error: any) {
    console.error("POST publish status error:", error);
    return NextResponse.json({ error: "Failed to update publish status" }, { status: 500 });
  }
}
