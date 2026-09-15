import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const COOKIE = "ss_session";
const SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "shiftsprout-dev-secret-change-me";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export function signSession(user: SessionUser) {
  return jwt.sign(user, SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string): SessionUser | null {
  try {
    return jwt.verify(token, SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export function getSession(): SessionUser | null {
  const jar = cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function checkPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export { COOKIE };
