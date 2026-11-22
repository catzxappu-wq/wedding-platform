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

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || "Invalid email or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: "Logged in successfully",
    });

    if (result.token) {
      response.cookies.set("wedding_admin_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error?.message || "Invalid credentials or authentication failure" },
      { status: 500 }
    );
  }
}
