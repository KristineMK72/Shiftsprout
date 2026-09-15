import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function ensureDemoData() {
  const count = await prisma.location.count();
  if (count > 0) return;

  const tenant = await prisma.tenant.create({
    data: {
      name: "Northwoods Clinic",
      slug: "northwoods-clinic",
      plan: "sprout",
    },
  });

  const location = await prisma.location.create({
    data: {
      tenantId: tenant.id,
      name: "Main Clinic",
      city: "Brainerd",
      state: "MN",
      timezone: "America/Chicago",
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        locationId: location.id,
        email: "sam@northwoods.example",
        name: "Sam Rivera",
        role: "manager",
      },
    }),
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        locationId: location.id,
        email: "jordan@northwoods.example",
        name: "Jordan Lee",
        role: "employee",
      },
    }),
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        locationId: location.id,
        email: "casey@northwoods.example",
        name: "Casey Kim",
        role: "employee",
      },
    }),
  ]);

  const now = new Date();
  const day = (offset: number, hour: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  await prisma.shift.createMany({
    data: [
      {
        locationId: location.id,
        userId: users[1].id,
        role: "Front Desk",
        startTime: day(0, 8),
        endTime: day(0, 16),
        status: "scheduled",
      },
      {
        locationId: location.id,
        userId: users[2].id,
        role: "Nurse",
        startTime: day(0, 9),
        endTime: day(0, 17),
        status: "scheduled",
      },
      {
        locationId: location.id,
        userId: null,
        role: "Front Desk",
        startTime: day(1, 16),
        endTime: day(1, 22),
        status: "open",
        notes: "Evening coverage needed",
      },
    ],
  });
}

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
        {
          id: "demo-2",
          role: "Nurse",
          startTime: new Date(Date.now() + 86400000).toISOString(),
          endTime: new Date(Date.now() + 86400000 + 8 * 3600000).toISOString(),
          status: "open",
          notes: "Open shift — needs coverage",
          user: null,
          location: { id: "l1", name: "Main Clinic", city: "Brainerd", state: "MN" },
        },
      ],
      warning: "Database unavailable — showing demo data. Check DATABASE_URL.",
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
    let location = await prisma.location.findFirst();
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
        error: "Could not create shift. Is DATABASE_URL set and schema pushed?",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
