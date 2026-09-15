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
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your workforce operations
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Shift Now</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Need coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Punches</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor Cost (MTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$48.2k</div>
            <p className="text-xs text-muted-foreground">On budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common workforce tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/schedule">
                <Calendar className="mr-2 h-4 w-4" />
                Build / edit schedule
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/timekeeping">
                <Clock className="mr-2 h-4 w-4" />
                Review time punches
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/pto">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve PTO requests
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Alerts
            </CardTitle>
            <CardDescription>Items that need attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-md border p-3">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-amber-500" />
              <div>
                <p className="text-sm font-medium">3 coverage requests open</p>
                <p className="text-xs text-muted-foreground">
                  Front desk · closing shift tonight
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border p-3">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-red-500" />
              <div>
                <p className="text-sm font-medium">Overtime risk this week</p>
                <p className="text-xs text-muted-foreground">
                  2 employees approaching 40h
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border p-3">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">PTO balance low</p>
                <p className="text-xs text-muted-foreground">
                  4 team members under 8 hours remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for future AI / insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Workforce Insights</CardTitle>
          <CardDescription>
            Coming soon — predictive scheduling, labor forecasting, and anomaly
            detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ShiftSprout OS will surface recommendations for optimal staffing,
            overtime reduction, and coverage gaps using your real-time
            timekeeping and schedule data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
