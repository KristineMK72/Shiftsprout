import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDemoData();
    const requests = await prisma.ptoRequest.findMany({
      orderBy: { startDate: "asc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({ requests, source: "db" });
  } catch (err) {
    console.error("GET /api/pto", err);
    return NextResponse.json({
      source: "demo",
      requests: [
        {
          id: "p1",
          type: "vacation",
          status: "pending",
          startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 9 * 86400000).toISOString(),
          note: "Family visit",
          user: { id: "u1", name: "Jordan Lee", email: "jordan@example.com" },
        },
      ],
      warning: "Database unavailable — demo PTO.",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !["approved", "denied", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "id and valid status required" }, { status: 400 });
    }
    const updated = await prisma.ptoRequest.update({
      where: { id: String(id) },
      data: { status: String(status) },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({ request: updated });
  } catch (err) {
    console.error("PATCH /api/pto", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    );
  }
}
