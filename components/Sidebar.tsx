"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Globe, 
  DollarSign, 
  Users, 
  CalendarOff, 
  MonitorPlay, 
  Sparkles,
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { name: "Timekeeping", href: "/dashboard/timekeeping", icon: Clock },
  { name: "Co-op Marketplace", href: "/dashboard/marketplace", icon: Globe },
  { name: "Payroll", href: "/dashboard/payroll", icon: DollarSign },
  { name: "Team Roster", href: "/dashboard/team", icon: Users },
  { name: "PTO Requests", href: "/dashboard/pto", icon: CalendarOff },
  { name: "Wallboard Kiosk", href: "/dashboard/wallboard", icon: MonitorPlay },
  { name: "AI Insights", href: "/dashboard/insights", icon: Sparkles },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/60 bg-white/80 backdrop-blur p-4 space-y-6">
      <div className="px-3 py-2">
        <h2 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
          <span>🌱 ShiftSprout</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Dual-Engine Rural Labor OS</p>
      </div>

      <nav className="space-y-1 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
