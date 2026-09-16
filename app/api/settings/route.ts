import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDemoData();
    const tenant = await prisma.tenant.findFirst();
    const location = await prisma.location.findFirst();
    return NextResponse.json({
      tenant: tenant
        ? { id: tenant.id, name: tenant.name, slug: tenant.slug, plan: tenant.plan }
        : null,
      location: location
        ? {
            id: location.id,
            name: location.name,
            city: location.city,
            state: location.state,
            timezone: location.timezone,
            address: location.address,
          }
        : null,
    });
  } catch (err) {
    console.error("GET /api/settings", err);
    return NextResponse.json({
      tenant: { name: "Northwoods Clinic", slug: "northwoods-clinic", plan: "sprout" },
      location: {
        name: "Main Clinic",
        city: "Brainerd",
        state: "MN",
        timezone: "America/Chicago",
      },
      warning: "Demo settings",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureDemoData();
    const body = await req.json();
    const tenant = await prisma.tenant.findFirst();
    const location = await prisma.location.findFirst();

    if (tenant && body.tenantName) {
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { name: String(body.tenantName) },
      });
    }
    if (location) {
      await prisma.location.update({
        where: { id: location.id },
        data: {
          ...(body.locationName ? { name: String(body.locationName) } : {}),
          ...(body.city !== undefined ? { city: String(body.city) } : {}),
          ...(body.state !== undefined ? { state: String(body.state) } : {}),
          ...(body.timezone ? { timezone: String(body.timezone) } : {}),
          ...(body.address !== undefined ? { address: String(body.address) } : {}),
        },
      });
    }

    const t = await prisma.tenant.findFirst();
    const l = await prisma.location.findFirst();
    return NextResponse.json({ tenant: t, location: l, ok: true });
  } catch (err) {
    console.error("PATCH /api/settings", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed" },
      { status: 500 }
    );
  }
}
