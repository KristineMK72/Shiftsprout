"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Plane,
  Settings,
  Bot,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
  { href: "/dashboard/timekeeping", label: "Timekeeping", icon: Clock },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/payroll", label: "Payroll", icon: DollarSign },
  { href: "/dashboard/pto", label: "PTO & Leave", icon: Plane },
  { href: "/dashboard/ai", label: "AI Insights", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))]">
      <div className="flex h-16 items-center gap-2.5 border-b border-[hsl(var(--sidebar-border))] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Sprout className="h-4 w-4" />
        </div>
        <Link href="/" className="flex items-baseline gap-1 font-bold text-lg tracking-tight">
          <span>Shift</span>
          <span className="text-primary">Sprout</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[hsl(var(--sidebar-border))] p-4">
        <div className="rounded-xl bg-primary/5 px-3 py-2.5 text-xs">
          <div className="font-medium text-foreground">Workforce OS</div>
          <div className="text-muted-foreground">v1.0 · Production</div>
        </div>
      </div>
    </aside>
  );
}
