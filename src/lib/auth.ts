import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { UserSession } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "wedding-platform-secret-key-2026-antigravity";
const COOKIE_NAME = "wedding_admin_token";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(payload: UserSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

export async function setAdminSession(user: { id: string; email: string; name: string; role: string }) {
  const token = createToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAdminSession(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function authenticateAdmin(email: string, password: string):Promise<{ success: boolean; error?: string; user?: UserSession }> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Invalid email or password" };
  }

  const sessionUser: UserSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  await setAdminSession(sessionUser);

  return { success: true, user: sessionUser };
}
