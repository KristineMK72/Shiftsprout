import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/seed";

export const dynamic = "force-dynamic";

const DEFAULT_RATE = 22;

function periodBounds() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setDate(start.getDate() - 13);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

export async function GET() {
  try {
    await ensureDemoData();
    const { start, end } = periodBounds();
    const rate = DEFAULT_RATE;

    const punches = await prisma.punch.findMany({
      where: { timestamp: { gte: start, lte: end } },
      orderBy: { timestamp: "asc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    type Acc = {
      userId: string;
      name: string;
      email: string;
      hours: number;
      lastIn: Date | null;
    };
    const byUser = new Map<string, Acc>();

    for (const p of punches) {
      const uid = p.userId;
      if (!byUser.has(uid)) {
        byUser.set(uid, {
          userId: uid,
          name: p.user.name || p.user.email,
          email: p.user.email,
          hours: 0,
          lastIn: null,
        });
      }
      const row = byUser.get(uid)!;
      if (p.type === "clock_in") {
        row.lastIn = p.timestamp;
      } else if (p.type === "clock_out" && row.lastIn) {
        const ms = p.timestamp.getTime() - row.lastIn.getTime();
        if (ms > 0 && ms < 24 * 3600 * 1000) {
          row.hours += ms / 3600000;
        }
        row.lastIn = null;
      }
    }

    const rows = Array.from(byUser.values()).map((r) => {
      const regular = Math.min(r.hours, 40);
      const overtime = Math.max(0, r.hours - 40);
      const cost = regular * rate + overtime * rate * 1.5;
      return {
        userId: r.userId,
        name: r.name,
        email: r.email,
        hours: Math.round(r.hours * 100) / 100,
        regular: Math.round(regular * 100) / 100,
        overtime: Math.round(overtime * 100) / 100,
        cost: Math.round(cost * 100) / 100,
      };
    });

    const totals = rows.reduce(
      (a, r) => ({
        hours: a.hours + r.hours,
        overtime: a.overtime + r.overtime,
        cost: a.cost + r.cost,
      }),
      { hours: 0, overtime: 0, cost: 0 }
    );

    return NextResponse.json({
      source: "db",
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      hourlyRate: rate,
      rows,
      totals: {
        hours: Math.round(totals.hours * 100) / 100,
        overtime: Math.round(totals.overtime * 100) / 100,
        cost: Math.round(totals.cost * 100) / 100,
      },
    });
  } catch (err) {
    console.error("GET /api/payroll", err);
    return NextResponse.json({
      source: "demo",
      periodStart: new Date().toISOString(),
      periodEnd: new Date().toISOString(),
      hourlyRate: DEFAULT_RATE,
      rows: [],
      totals: { hours: 0, overtime: 0, cost: 0 },
      warning: "Could not load payroll from punches",
    });
  }
}
