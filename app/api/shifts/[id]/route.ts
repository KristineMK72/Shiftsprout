import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.userId !== undefined) data.userId = body.userId || null;
    if (body.status) data.status = String(body.status);
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.userId && !body.status) data.status = "scheduled";

    const shift = await prisma.shift.update({
      where: { id: params.id },
      data,
      include: {
        user: { select: { id: true, name: true, email: true } },
        location: { select: { id: true, name: true, city: true, state: true } },
      },
    });
    return NextResponse.json({ shift });
  } catch (err) {
    console.error("PATCH /api/shifts/[id]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    );
  }
}
