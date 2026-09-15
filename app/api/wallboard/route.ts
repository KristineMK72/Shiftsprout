import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDemoData();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const shifts = await prisma.shift.findMany({
      where: {
        startTime: { lte: end },
        endTime: { gte: start },
        status: { in: ["scheduled", "open", "in_progress"] },
      },
      orderBy: { startTime: "asc" },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        location: { select: { name: true, city: true } },
      },
    });

    const now = new Date();
    const onNow = shifts.filter(
      (s) => new Date(s.startTime) <= now && new Date(s.endTime) >= now && s.user
    );
    const upcoming = shifts.filter((s) => new Date(s.startTime) > now);
    const open = shifts.filter((s) => s.status === "open" || !s.user);

    const location = await prisma.location.findFirst();

    return NextResponse.json({
      source: "db",
      locationName: location?.name || "Main Clinic",
      city: location?.city || "",
      onNow,
      upcoming,
      open,
      generatedAt: now.toISOString(),
    });
  } catch (err) {
    console.error("wallboard", err);
    return NextResponse.json({
      source: "demo",
      locationName: "Main Clinic",
      city: "Brainerd",
      onNow: [],
      upcoming: [],
      open: [],
      generatedAt: new Date().toISOString(),
      warning: "Database unavailable",
    });
  }
}
