import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: "Logged in successfully",
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
