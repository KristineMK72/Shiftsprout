"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, AlertTriangle, CheckCircle2, TrendingUp, Loader2 } from "lucide-react";

type Stats = {
  onShiftNow: number;
  openShifts: number;
  pendingPto: number;
  teamCount: number;
};

export default function AiPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [payroll, setPayroll] = useState<{
    totals: { hours: number; overtime: number; cost: number };
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/payroll").then((r) => r.json()),
    ]).then(([s, p]) => {
      setStats(s);
      setPayroll(p);
    });
  }, []);

  const insights: {
    tone: string;
    icon: typeof Bot;
    title: string;
    body: string;
  }[] = [];

  if (stats) {
    if (stats.openShifts > 0) {
      insights.push({
        tone: "border-amber-200 bg-amber-50",
        icon: AlertTriangle,
        title: "Coverage gap",
        body: `${stats.openShifts} open shift${stats.openShifts === 1 ? "" : "s"} need an assignee. Broadcast to the Talent Pool or assign from Schedule.`,
      });
    } else {
      insights.push({
        tone: "border-emerald-200 bg-emerald-50",
        icon: CheckCircle2,
        title: "Coverage healthy",
        body: "No open shifts right now. Keep a small bench in the talent pool for call-outs.",
      });
    }
    if (stats.pendingPto > 0) {
      insights.push({
        tone: "border-sky-200 bg-sky-50",
        icon: TrendingUp,
        title: "PTO queue",
        body: `${stats.pendingPto} leave request${stats.pendingPto === 1 ? "" : "s"} waiting. Approve early so the schedule stays accurate.`,
      });
    }
    if (stats.teamCount > 0 && stats.onShiftNow === 0) {
      insights.push({
        tone: "border-slate-200 bg-slate-50",
        icon: Bot,
        title: "Quiet floor",
        body: "Nobody is in an active shift window. Confirm wallboard times match today openings.",
      });
    }
  }
  if (payroll && payroll.totals?.overtime > 0) {
    insights.push({
      tone: "border-amber-200 bg-amber-50",
      icon: AlertTriangle,
      title: "Overtime pressure",
      body: `${payroll.totals.overtime} OT hours this period. Spread shifts or add a part-timer before the next cycle.`,
    });
  }
  if (payroll && payroll.totals?.hours > 0) {
    insights.push({
      tone: "border-violet-200 bg-violet-50",
      icon: TrendingUp,
      title: "Labor snapshot",
      body: `${payroll.totals.hours} hours · est. $${Number(payroll.totals.cost).toLocaleString()} this pay window.`,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground mt-1">
          Rule-based recommendations from your live schedule, punches, and PTO
        </p>
      </div>

      {!stats ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing…
        </div>
      ) : (
        <div className="grid gap-4">
          {insights.map((i) => (
            <Card key={i.title} className={`rounded-2xl border shadow-sm ${i.tone}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <i.icon className="h-5 w-5" />
                  {i.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">{i.body}</p>
              </CardContent>
            </Card>
          ))}
          {insights.length === 0 && (
            <Card className="rounded-2xl">
              <CardContent className="py-8 text-center text-muted-foreground">
                Not enough activity yet — add shifts and punches to unlock insights.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-white">
        <CardHeader>
          <CardTitle className="text-lg">Next-level AI (roadmap)</CardTitle>
          <CardDescription>
            Preference learning, demand forecasts, and no-show prediction — same data model, more intelligence later.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
