import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDemoData();
    const now = new Date();
    const [teamCount, openShifts, pendingPto, scheduledToday] = await Promise.all([
      prisma.user.count(),
      prisma.shift.count({ where: { status: "open" } }),
      prisma.ptoRequest.count({ where: { status: "pending" } }),
      prisma.shift.count({
        where: {
          status: "scheduled",
          startTime: { lte: now },
          endTime: { gte: now },
        },
      }),
    ]);
    return NextResponse.json({
      source: "db",
      onShiftNow: scheduledToday,
      openShifts,
      pendingPto,
      teamCount,
    });
  } catch (err) {
    console.error("GET /api/stats", err);
    return NextResponse.json({
      source: "demo",
      onShiftNow: 2,
      openShifts: 1,
      pendingPto: 2,
      teamCount: 3,
    });
  }
}
