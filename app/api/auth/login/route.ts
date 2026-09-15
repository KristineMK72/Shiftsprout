import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";
import {
  checkPassword,
  hashPassword,
  sessionCookieOptions,
  signSession,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "shiftsprout";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await ensureDemoData();

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.passwordHash) {
      if (password !== DEMO_PASSWORD) {
        return NextResponse.json(
          {
            error: "Invalid email or password",
            hint: "Default demo password is: shiftsprout",
          },
          { status: 401 }
        );
      }
      const passwordHash = await hashPassword(password);
      user = await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });
    } else {
      const ok = await checkPassword(password, user.passwordHash);
      if (!ok) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
    }

    const token = signSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    const opts = sessionCookieOptions(token);
    res.cookies.set(opts);
    return res;
  } catch (err) {
    console.error("login", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Login failed" },
      { status: 500 }
    );
  }
}
