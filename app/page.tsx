import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">
            Shift<span className="text-primary">Sprout</span> OS
          </h1>
          <p className="text-xl text-muted-foreground">
            The modern workforce operating system
          </p>
        </div>

        <p className="text-muted-foreground max-w-md mx-auto">
          Scheduling · Timekeeping · Payroll · PTO · AI intelligence.
          Built as a focused alternative to ADP and UKG for growing teams.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Enter Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard/schedule">View Schedule</Link>
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div className="rounded-lg border p-4">
            <div className="font-medium text-foreground">Smart Scheduling</div>
            <div>Drag-and-drop + templates</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-medium text-foreground">Real-time Punches</div>
            <div>Mobile + kiosk ready</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-medium text-foreground">PTO & Leave</div>
            <div>Balances & approvals</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-medium text-foreground">AI Insights</div>
            <div>Forecasting & alerts</div>
          </div>
        </div>
      </div>
    </main>
  );
}
