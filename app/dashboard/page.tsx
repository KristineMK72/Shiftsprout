"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  Globe,
} from "lucide-react";
import Link from "next/link";

type ChartItem = {
  day: string;
  internalShifts: number;
  poolShifts: number;
};

type Stats = {
  onShiftNow: number;
  openShifts: number;
  pendingPto: number;
  teamCount: number;
  marketplaceShifts: number;
  chartData: ChartItem[];
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    onShiftNow: 0,
    openShifts: 0,
    pendingPto: 0,
    teamCount: 0,
    marketplaceShifts: 0,
    chartData: [],
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) =>
        setStats({
          onShiftNow: d.onShiftNow ?? 0,
          openShifts: d.openShifts ?? 0,
          pendingPto: d.pendingPto ?? 0,
          teamCount: d.teamCount ?? 0,
          marketplaceShifts: d.marketplaceShifts ?? 0,
          chartData: d.chartData ?? [],
        })
      )
      .catch(() => {});
  }, []);

  const cards = [
    {
      title: "On shift now",
      value: String(stats.onShiftNow),
      change: "Active right now",
      icon: Users,
      tone: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Internal open shifts",
      value: String(stats.openShifts),
      change: "Need local coverage",
      icon: Calendar,
      tone: "text-amber-600 bg-amber-50",
    },
    {
      title: "Community pool",
      value: String(stats.marketplaceShifts),
      change: "Shared regional shifts",
      icon: Globe,
      tone: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Team size",
      value: String(stats.teamCount),
      change: "Local roster size",
      icon: TrendingUp,
      tone: "text-violet-600 bg-violet-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Dual-Engine Badges */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
              Dual-Engine Operations
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Rural Co-op Ring Active
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Overview of internal timekeeping, scheduling, and regional labor sharing
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Today ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s) => (
          <Card
            key={s.title}
            className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur transition-all hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${s.tone}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Bar Chart: Weekly Shift Volume & Regional Activity */}
      <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Shift Volume & Regional Pool Activity</CardTitle>
          <CardDescription>Comparing internal business shifts vs. shared cooperative pool claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-end justify-between gap-2 pt-6 px-2">
            {stats.chartData.map((item) => {
              const maxHeight = 25; // Scale height baseline helper
              const internalHeight = Math.min(100, (item.internalShifts / maxHeight) * 100);
              const poolHeight = Math.min(100, (item.poolShifts / maxHeight) * 100);

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    {/* Internal Shifts Bar */}
                    <div 
                      style={{ height: `${internalHeight}%` }} 
                      className="w-3 bg-emerald-500 rounded-t-md transition-all duration-500 hover:bg-emerald-600"
                      title={`Internal: ${item.internalShifts}`}
                    />
                    {/* Community Pool Shifts Bar */}
                    <div 
                      style={{ height: `${poolHeight}%` }} 
                      className="w-3 bg-indigo-500 rounded-t-md transition-all duration-500 hover:bg-indigo-600"
                      title={`Community Pool: ${item.poolShifts}`}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.day}</span>
                </div>
              );
            })}
          </div>
          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground font-medium">Internal Shifts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-500" />
              <span className="text-muted-foreground font-medium">Community Co-op Pool</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Sections Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Quick actions</CardTitle>
            <CardDescription>Internal tools & community marketplace</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {[
              { href: "/dashboard/schedule", icon: Calendar, label: "Build / edit internal schedule" },
              { href: "/dashboard/marketplace", icon: Globe, label: "Browse community talent pool" },
              { href: "/dashboard/timekeeping", icon: Clock, label: "Review time punches & payroll" },
              { href: "/dashboard/pto", icon: CheckCircle2, label: `Approve PTO requests (${stats.pendingPto} pending)` },
              { href: "/dashboard/team", icon: Users, label: "Manage local team roster" },
            ].map((a) => (
              <Button
                key={a.href}
                asChild
                variant="outline"
                className="h-11 justify-between rounded-xl border-border/80 bg-white hover:bg-accent"
              >
                <Link href={a.href}>
                  <span className="flex items-center gap-2">
                    <a.icon className="h-4 w-4 text-primary" />
                    {a.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Dual-Engine Focus Areas */}
        <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-indigo-500" />
              Dual-Engine Insights
            </CardTitle>
            <CardDescription>Internal operations vs. regional pool status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                color: "bg-indigo-500",
                title:
                  stats.marketplaceShifts > 0
                    ? `${stats.marketplaceShifts} shared shift${stats.marketplaceShifts === 1 ? "" : "s"} available nearby`
                    : "No active shared shifts in ring",
                desc: "Collaborative labor pool across neighboring businesses",
              },
              {
                color: "bg-amber-500",
                title:
                  stats.openShifts > 0
                    ? `${stats.openShifts} internal open shift${stats.openShifts === 1 ? "" : "s"}`
                    : "Internal schedule fully covered",
                desc: "Shifts needing your local team's attention",
              },
              {
                color: "bg-emerald-500",
                title: `${stats.teamCount} local workers on roster`,
                desc: "Active staff ready for internal shifts or ring sharing",
              },
            ].map((a) => (
              <div
                key={a.title}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-white/60 p-3.5 transition-colors hover:bg-white/90"
              >
                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.color}`} />
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
