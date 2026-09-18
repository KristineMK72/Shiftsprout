import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Plane,
  Bot,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const ecosystem = [
  {
    name: "Spatialytics",
    role: "Home · location intelligence",
    href: "https://spatialytics-astro.vercel.app",
  },
  {
    name: "Pipeline",
    role: "CRM · deals & field jobs",
    href: "https://spatialytics-pipeline.vercel.app",
  },
  {
    name: "ShiftSprout",
    role: "Workforce · schedules & payroll",
    href: "/",
    current: true,
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-mesh">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Workforce Operating System · Spatialytics family
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Shift
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Sprout
            </span>{" "}
            <span className="text-foreground/80">OS</span>
          </h1>

          <p className="mt-5 text-xl text-muted-foreground sm:text-2xl">
            The modern alternative to ADP & UKG
          </p>

          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            Scheduling, timekeeping, payroll visibility, PTO, and AI insights —
            built for growing teams that want clarity without the enterprise
            complexity. Part of the Spatialytics stack for Greater Minnesota.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl px-8 text-base shadow-lg shadow-primary/20"
            >
              <Link href="/dashboard">
                Enter Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-xl px-8 text-base bg-white/60 backdrop-blur"
            >
              <Link href="/dashboard/schedule">View Schedule</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Calendar,
              title: "Smart Scheduling",
              desc: "Drag-and-drop, templates & coverage",
            },
            {
              icon: Clock,
              title: "Real-time Punches",
              desc: "Mobile & kiosk ready",
            },
            {
              icon: Plane,
              title: "PTO & Leave",
              desc: "Balances & approvals",
            },
            {
              icon: Bot,
              title: "AI Insights",
              desc: "Forecasting & alerts",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm backdrop-blur transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="font-semibold text-foreground">{f.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Ecosystem links */}
        <div className="mt-16 w-full max-w-3xl rounded-2xl border border-border/60 bg-white/60 p-6 backdrop-blur">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Spatialytics product family
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Place → customers & jobs → people on shifts
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {ecosystem.map((item) =>
              item.current ? (
                <div
                  key={item.name}
                  className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-center"
                >
                  <div className="font-semibold text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.role}</div>
                  <div className="mt-1 text-xs font-medium text-primary">You are here</div>
                </div>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border/80 bg-white/80 px-4 py-3 text-center transition hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-center justify-center gap-1 font-semibold text-foreground">
                    {item.name}
                    <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                  </div>
                  <div className="text-xs text-muted-foreground">{item.role}</div>
                </a>
              )
            )}
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Built for teams that outgrew spreadsheets ·{" "}
          <a
            href="https://spatialytics-astro.vercel.app"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spatialytics
          </a>
        </p>
      </div>
    </main>
  );
}
