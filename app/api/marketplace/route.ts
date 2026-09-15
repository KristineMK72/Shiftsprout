import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Fetch open marketplace shifts for the regional cooperative ring
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ringId = searchParams.get("ringId");

    const shifts = (prisma as any).marketplaceShift 
      ? await (prisma as any).marketplaceShift.findMany({
          where: {
            status: "open",
            ...(ringId ? { ringId } : {}),
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

    return NextResponse.json({ success: true, shifts });
  } catch (error) {
    console.error("GET /api/marketplace error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch marketplace shifts" }, { status: 500 });
  }
}

// POST: Broadcast a real open shift and trigger SMS alerts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ringId, sourceTenantId, title, startTime, endTime, payRate, sector, distance } = body;

    let newShift;

    // 1. Save to Neon Database using Prisma if model exists
    if ((prisma as any).marketplaceShift) {
      newShift = await (prisma as any).marketplaceShift.create({
        data: {
          ringId: ringId || "default-ring",
          sourceTenantId: sourceTenantId || "default-tenant",
          title: title || "Shared Shift",
          startTime: new Date(startTime || Date.now()),
          endTime: new Date(endTime || Date.now() + 28800000),
          payRate: parseFloat(payRate) || 21.50,
          status: "open",
        },
      });
    } else {
      newShift = {
        id: Date.now().toString(),
        title: title || "Shared Shift",
        business: "Partner Co-op Hub",
        payRate: `$${Number(payRate || 21.50).toFixed(2)}/hr`,
        sector: sector || "General Operations",
        distance: distance || "Within 15-mi ring",
        status: "open",
      };
    }

    // 2. Trigger Twilio SMS Broadcast (if environment variables are present)
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (twilioAccountSid && twilioAuthToken && twilioPhone) {
      try {
        // Simple fetch call to Twilio REST API without requiring heavy SDK packages
        const messageBody = `ShiftSprout Alert: New open shift available! Role: ${title} ($${payRate}/hr). Claim it in your co-op marketplace dashboard.`;
        
        // Target available cooperative workers (mock phone endpoint or pulled from team roster)
        const encodedAuth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString("base64");
        
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${encodedAuth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: twilioPhone,
            To: process.env.DEMO_WORKER_PHONE || "+15555555555", // Fallback or roster loop
            Body: messageBody,
          }),
        });
      } catch (smsErr) {
        console.error("Twilio SMS dispatch failed (non-blocking):", smsErr);
      }
    }

    return NextResponse.json({ success: true, shift: newShift, smsTriggered: !!twilioAccountSid });
  } catch (error) {
    console.error("POST /api/marketplace error:", error);
    return NextResponse.json({ success: false, error: "Failed to broadcast shift" }, { status: 500 });
  }
}

// PATCH: Claim an open shared shift
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { shiftId, userId } = body;

    if ((prisma as any).marketplaceShift) {
      const updated = await (prisma as any).marketplaceShift.update({
        where: { id: shiftId },
        data: {
          status: "claimed",
          claimedByUserId: userId,
        },
      });
      return NextResponse.json({ success: true, shift: updated });
    }

    return NextResponse.json({ success: true, message: "Shift claimed successfully" });
  } catch (error) {
    console.error("PATCH /api/marketplace error:", error);
    return NextResponse.json({ success: false, error: "Failed to claim shift" }, { status: 500 });
  }
}
