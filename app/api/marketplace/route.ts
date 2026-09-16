import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDemoData();
    const open = await prisma.shift.findMany({
      where: { status: "open" },
      orderBy: { startTime: "asc" },
      include: {
        location: { select: { name: true, city: true, state: true } },
        user: { select: { name: true, email: true } },
      },
      take: 40,
    });

    const shifts = open.map((s) => ({
      id: s.id,
      title: s.role,
      business: s.location?.name || "Partner site",
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      date: s.startTime.toLocaleString(),
      payRate: 22,
      distance: s.location?.city
        ? `${s.location.city}${s.location.state ? `, ${s.location.state}` : ""}`
        : "Local ring",
      sector: "Healthcare / Ops",
      status: s.status,
      notes: s.notes,
    }));

    return NextResponse.json({ success: true, shifts });
  } catch (error) {
    console.error("GET /api/marketplace", error);
    return NextResponse.json({ success: true, shifts: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDemoData();
    const body = await request.json();
    const location = await prisma.location.findFirst();
    if (!location) {
      return NextResponse.json({ success: false, error: "No location" }, { status: 400 });
    }

    const startTime = body.startTime ? new Date(body.startTime) : new Date(Date.now() + 3600000);
    const endTime = body.endTime ? new Date(body.endTime) : new Date(startTime.getTime() + 8 * 3600000);

    const shift = await prisma.shift.create({
      data: {
        locationId: location.id,
        role: String(body.title || body.role || "Shared coverage"),
        startTime,
        endTime,
        status: "open",
        notes: body.notes
          ? String(body.notes)
          : `Marketplace broadcast · $${Number(body.payRate || 22)}/hr`,
        userId: null,
      },
      include: { location: { select: { name: true, city: true } } },
    });

    return NextResponse.json({
      success: true,
      shift: {
        id: shift.id,
        title: shift.role,
        business: shift.location?.name,
        startTime: shift.startTime.toISOString(),
        payRate: Number(body.payRate || 22),
        status: "open",
      },
    });
  } catch (error) {
    console.error("POST /api/marketplace", error);
    return NextResponse.json({ success: false, error: "Failed to broadcast" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { shiftId } = body;
    if (!shiftId) {
      return NextResponse.json({ success: false, error: "shiftId required" }, { status: 400 });
    }

    let userId = body.userId as string | undefined;
    if (!userId) {
      const session = getSession();
      userId = session?.id;
    }
    if (!userId) {
      const first = await prisma.user.findFirst();
      userId = first?.id;
    }

    const updated = await prisma.shift.update({
      where: { id: String(shiftId) },
      data: {
        status: "scheduled",
        userId: userId || null,
        notes: "Claimed via Community Talent Pool",
      },
    });

    return NextResponse.json({ success: true, shift: updated });
  } catch (error) {
    console.error("PATCH /api/marketplace", error);
    return NextResponse.json({ success: false, error: "Failed to claim" }, { status: 500 });
  }
}
