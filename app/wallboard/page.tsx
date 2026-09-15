"use client";

import { useCallback, useEffect, useState } from "react";
import { Sprout, RefreshCw } from "lucide-react";
import Link from "next/link";

type ShiftRow = {
  id: string;
  role: string;
  startTime: string;
  endTime: string;
  status: string;
  user?: { name: string | null; email: string } | null;
};

function timeRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  return `${new Date(start).toLocaleTimeString(undefined, opts)} – ${new Date(end).toLocaleTimeString(undefined, opts)}`;
}

export default function WallboardPage() {
  const [data, setData] = useState<{
    locationName: string;
    city: string;
    onNow: ShiftRow[];
    upcoming: ShiftRow[];
    open: ShiftRow[];
    generatedAt: string;
  } | null>(null);
  const [clock, setClock] = useState(new Date());

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/wallboard");
      const json = await res.json();
      setData(json);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
    const a = setInterval(load, 30000);
    const b = setInterval(() => setClock(new Date()), 1000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, [load]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">
              {data?.locationName || "ShiftSprout"}
              {data?.city ? ` · ${data.city}` : ""}
            </div>
            <div className="text-xs text-white/50">Who is on today</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums md:text-4xl">
            {clock.toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="text-sm text-white/50">
            {clock.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-6 md:grid-cols-3 md:p-10">
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-400">
            On shift now
          </h2>
          <div className="space-y-3">
            {(data?.onNow || []).length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/40">
                No one in an active shift window
              </p>
            ) : (
              data!.onNow.map((s) => (
                <div key={s.id} className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                  <div className="text-2xl font-semibold">{s.user?.name || s.user?.email}</div>
                  <div className="mt-1 text-lg text-emerald-200/80">{s.role}</div>
                  <div className="mt-2 text-sm text-white/50">{timeRange(s.startTime, s.endTime)}</div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sky-400">
            Coming up
          </h2>
          <div className="space-y-3">
            {(data?.upcoming || []).length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/40">
                No more shifts today
              </p>
            ) : (
              data!.upcoming.map((s) => (
                <div key={s.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xl font-medium">{s.user?.name || "Open"}</div>
                  <div className="text-white/70">{s.role}</div>
                  <div className="mt-1 text-sm text-white/45">{timeRange(s.startTime, s.endTime)}</div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-400">
            Needs coverage
          </h2>
          <div className="space-y-3">
            {(data?.open || []).length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/40">
                All covered
              </p>
            ) : (
              data!.open.map((s) => (
                <div key={s.id} className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                  <div className="text-xl font-medium text-amber-100">{s.role}</div>
                  <div className="mt-1 text-sm text-white/50">{timeRange(s.startTime, s.endTime)}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <footer className="fixed bottom-0 inset-x-0 flex items-center justify-between border-t border-white/10 bg-slate-950/90 px-6 py-3 text-xs text-white/40 backdrop-blur">
        <button type="button" onClick={load} className="inline-flex items-center gap-1 hover:text-white/70">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
        <span>Auto-refreshes every 30s · ShiftSprout OS</span>
        <Link href="/login" className="hover:text-white/70">
          Manager login
        </Link>
      </footer>
    </main>
  );
}
