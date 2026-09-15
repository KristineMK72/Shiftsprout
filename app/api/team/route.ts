import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDemoData();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      include: {
        location: { select: { name: true, city: true, state: true } },
      },
    });
    return NextResponse.json({ users, source: "db" });
  } catch (err) {
    console.error("GET /api/team", err);
    return NextResponse.json({
      source: "demo",
      users: [
        { id: "1", name: "Sam Rivera", email: "sam@northwoods.example", role: "manager", location: { name: "Main Clinic", city: "Brainerd", state: "MN" } },
        { id: "2", name: "Jordan Lee", email: "jordan@northwoods.example", role: "employee", location: { name: "Main Clinic", city: "Brainerd", state: "MN" } },
        { id: "3", name: "Casey Kim", email: "casey@northwoods.example", role: "employee", location: { name: "Main Clinic", city: "Brainerd", state: "MN" } },
      ],
      warning: "Database unavailable — demo roster.",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role } = body;
    if (!name || !email) {
      return NextResponse.json({ error: "name and email required" }, { status: 400 });
    }
    await ensureDemoData();
    const location = await prisma.location.findFirst();
    const tenant = await prisma.tenant.findFirst();
    const user = await prisma.user.create({
      data: {
        name: String(name),
        email: String(email).toLowerCase(),
        role: role || "employee",
        locationId: location?.id,
        tenantId: tenant?.id,
      },
      include: { location: { select: { name: true, city: true, state: true } } },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("POST /api/team", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to add team member" },
      { status: 500 }
    );
  }
}
