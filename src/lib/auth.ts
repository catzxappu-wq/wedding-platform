import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { UserSession } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "wedding-platform-secret-key-2026-antigravity";
const COOKIE_NAME = "wedding_admin_token";

const DEFAULT_ADMIN_EMAIL = (process.env.ADMIN_DEFAULT_EMAIL || "admin@weddingplatform.com").toLowerCase().trim();
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@Wedding2026!";

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

export async function setAdminSession(user: { id: string; email: string; name: string; role: string }): Promise<string> {
  const token = createToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  try {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (e) {
    // In environments where cookies() cannot set headers, fallback to response cookies
  }

  return token;
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

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: UserSession; token?: string }> {
  const cleanEmail = email.toLowerCase().trim();
  const isDefaultCredentials =
    cleanEmail === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD;

  try {
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // If user not in DB but matches default admin credentials, auto-provision
    if (!user && isDefaultCredentials) {
      try {
        const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
        user = await prisma.user.create({
          data: {
            name: "Platform Administrator",
            email: DEFAULT_ADMIN_EMAIL,
            passwordHash,
            role: "ADMIN",
          },
        });
      } catch (createErr) {
        console.warn("Could not auto-create admin in DB (will use session fallback):", createErr);
      }
    }

    if (user) {
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

      const token = await setAdminSession(sessionUser);
      return { success: true, user: sessionUser, token };
    }

    // If user record wasn't found or DB is empty but credentials match default
    if (isDefaultCredentials) {
      const fallbackUser: UserSession = {
        id: "admin-default-id",
        email: DEFAULT_ADMIN_EMAIL,
        name: "Platform Administrator",
        role: "ADMIN",
      };
      const token = await setAdminSession(fallbackUser);
      return { success: true, user: fallbackUser, token };
    }

    return { success: false, error: "Invalid email or password" };
  } catch (dbErr: any) {
    console.error("Database error during authentication:", dbErr);

    // If DB is unreachable on Vercel (e.g. DATABASE_URL not yet configured),
    // allow the admin to log in with default credentials so they can access the console
    if (isDefaultCredentials) {
      console.log("Database unreachable. Logging in with default admin session...");
      const fallbackUser: UserSession = {
        id: "admin-default-id",
        email: DEFAULT_ADMIN_EMAIL,
        name: "Platform Administrator",
        role: "ADMIN",
      };
      const token = await setAdminSession(fallbackUser);
      return { success: true, user: fallbackUser, token };
    }

    return {
      success: false,
      error: "Invalid email or password. (Check DATABASE_URL connection if database is active)",
    };
  }
}
