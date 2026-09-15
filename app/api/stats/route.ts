import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDemoData();
    const now = new Date();
    
    // Fetch core internal stats alongside rural marketplace counts concurrently
    const [teamCount, openShifts, pendingPto, scheduledToday, marketplaceShifts] = await Promise.all([
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
      // Safely check if the marketplaceShift table is available in Prisma
      (prisma as any).marketplaceShift 
        ? (prisma as any).marketplaceShift.count({ where: { status: "open" } }) 
        : Promise.resolve(4), // Fallback demo count if table is pending migration
    ]);

    // Structured weekly trend data comparing internal business activity vs. regional co-op claims
    const chartData = [
      { day: "Mon", internalShifts: 12, poolShifts: 3 },
      { day: "Tue", internalShifts: 15, poolShifts: 5 },
      { day: "Wed", internalShifts: 14, poolShifts: 4 },
      { day: "Thu", internalShifts: 18, poolShifts: 7 },
      { day: "Fri", internalShifts: 20, poolShifts: 9 },
      { day: "Sat", internalShifts: 10, poolShifts: 6 },
      { day: "Sun", internalShifts: 8, poolShifts: 4 },
    ];

    return NextResponse.json({
      source: "db",
      onShiftNow: scheduledToday,
      openShifts,
      pendingPto,
      teamCount,
      marketplaceShifts,
      chartData,
    });
  } catch (err) {
    console.error("GET /api/stats", err);
    // Fallback demo payload if database connection fails
    return NextResponse.json({
      source: "demo",
      onShiftNow: 2,
      openShifts: 1,
      pendingPto: 2,
      teamCount: 3,
      marketplaceShifts: 4,
      chartData: [
        { day: "Mon", internalShifts: 10, poolShifts: 2 },
        { day: "Tue", internalShifts: 12, poolShifts: 4 },
        { day: "Wed", internalShifts: 11, poolShifts: 3 },
        { day: "Thu", internalShifts: 14, poolShifts: 5 },
        { day: "Fri", internalShifts: 16, poolShifts: 6 },
        { day: "Sat", internalShifts: 8, poolShifts: 3 },
        { day: "Sun", internalShifts: 6, poolShifts: 2 },
      ],
    });
  }
}
