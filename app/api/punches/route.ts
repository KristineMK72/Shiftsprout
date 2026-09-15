import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDemoData();
    const punches = await prisma.punch.findMany({
      orderBy: { timestamp: "desc" },
      take: 40,
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({ punches, source: "db" });
  } catch (err) {
    console.error("GET /api/punches", err);
    return NextResponse.json({
      source: "demo",
      punches: [],
      warning: "Database unavailable",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDemoData();
    const body = await req.json();
    let userId = body.userId as string | undefined;
    if (!userId) {
      const first = await prisma.user.findFirst({ orderBy: { name: "asc" } });
      userId = first?.id;
    }
    if (!userId) {
      return NextResponse.json({ error: "No users on roster" }, { status: 400 });
    }
    const type = body.type || "clock_in";
    const punch = await prisma.punch.create({
      data: {
        userId,
        type: String(type),
        approved: false,
        note: body.note ? String(body.note) : null,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({ punch }, { status: 201 });
  } catch (err) {
    console.error("POST /api/punches", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const punch = await prisma.punch.update({
      where: { id: String(body.id) },
      data: { approved: Boolean(body.approved) },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({ punch });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
