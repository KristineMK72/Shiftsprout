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
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "On Shift Now",
    value: "24",
    change: "+3 from yesterday",
    icon: Users,
    tone: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Open Shifts",
    value: "7",
    change: "Need coverage",
    icon: Calendar,
    tone: "text-amber-600 bg-amber-50",
  },
  {
    title: "Pending Punches",
    value: "12",
    change: "Awaiting approval",
    icon: Clock,
    tone: "text-sky-600 bg-sky-50",
  },
  {
    title: "Labor Cost (MTD)",
    value: "$48.2k",
    change: "On budget",
    icon: TrendingUp,
    tone: "text-violet-600 bg-violet-50",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your workforce operations
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Today · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card
            key={s.title}
            className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur card-hover"
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
              <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions + Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common workforce tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {[
              { href: "/dashboard/schedule", icon: Calendar, label: "Build / edit schedule" },
              { href: "/dashboard/timekeeping", icon: Clock, label: "Review time punches" },
              { href: "/dashboard/pto", icon: CheckCircle2, label: "Approve PTO requests" },
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

        <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Alerts
            </CardTitle>
            <CardDescription>Items that need attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                color: "bg-amber-500",
                title: "3 coverage requests open",
                desc: "Front desk · closing shift tonight",
              },
              {
                color: "bg-red-500",
                title: "Overtime risk this week",
                desc: "2 employees approaching 40h",
              },
              {
                color: "bg-sky-500",
                title: "PTO balance low",
                desc: "4 team members under 8 hours remaining",
              },
            ].map((a) => (
              <div
                key={a.title}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-white/60 p-3.5"
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

      {/* AI teaser */}
      <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 via-white to-teal-50/50 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">AI Workforce Insights</CardTitle>
          <CardDescription>
            Predictive scheduling, labor forecasting, and anomaly detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground max-w-2xl">
            ShiftSprout OS will surface recommendations for optimal staffing,
            overtime reduction, and coverage gaps using your real-time
            timekeeping and schedule data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
