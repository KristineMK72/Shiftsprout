import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDemoData();
    const shifts = await prisma.shift.findMany({
      orderBy: { startTime: "asc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        location: { select: { id: true, name: true, city: true, state: true } },
      },
      take: 50,
    });
    return NextResponse.json({ shifts, source: "db" });
  } catch (err) {
    console.error("GET /api/shifts", err);
    return NextResponse.json({
      source: "demo",
      shifts: [
        {
          id: "demo-1",
          role: "Front Desk",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 8 * 3600000).toISOString(),
          status: "scheduled",
          notes: null,
          user: { id: "u1", name: "Jordan Lee", email: "jordan@example.com" },
          location: { id: "l1", name: "Main Clinic", city: "Brainerd", state: "MN" },
        },
      ],
      warning: "Database unavailable — showing demo data.",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, startTime, endTime, notes, status } = body;
    if (!role || !startTime || !endTime) {
      return NextResponse.json(
        { error: "role, startTime, and endTime are required" },
        { status: 400 }
      );
    }
    await ensureDemoData();
    const location = await prisma.location.findFirst();
    if (!location) {
      return NextResponse.json({ error: "No location found" }, { status: 400 });
    }
    const shift = await prisma.shift.create({
      data: {
        locationId: location.id,
        role: String(role),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes: notes ? String(notes) : null,
        status: status || "scheduled",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        location: { select: { id: true, name: true, city: true, state: true } },
      },
    });
    return NextResponse.json({ shift }, { status: 201 });
  } catch (err) {
    console.error("POST /api/shifts", err);
    return NextResponse.json(
      {
        error: "Could not create shift.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
