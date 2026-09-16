"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Globe,
  PlusCircle,
  MapPin,
  Building2,
  CheckCircle2,
  Layers,
  Loader2,
  X,
} from "lucide-react";

type Shift = {
  id: string;
  business?: string;
  title: string;
  startTime?: string;
  date?: string;
  payRate: number | string;
  distance?: string;
  sector?: string;
  status: string;
};

export default function MarketplacePage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [activeRadius, setActiveRadius] = useState(15);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "Front Desk coverage",
    startTime: "",
    endTime: "",
    payRate: "22",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketplace");
      const data = await res.json();
      if (data.shifts) setShifts(data.shifts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleClaim(id: string) {
    const res = await fetch("/api/marketplace", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId: id }),
    });
    const data = await res.json();
    if (data.success) {
      setClaimedIds((prev) => [...prev, id]);
      await load();
    }
  }

  async function broadcast(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          startTime: form.startTime,
          endTime: form.endTime,
          payRate: form.payRate,
        }),
      });
      if (res.ok) {
        setOpen(false);
        setForm({ title: "Front Desk coverage", startTime: "", endTime: "", payRate: "22" });
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
              Spatialytics GIS Active
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              {activeRadius}-Mile Geofence
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Community Talent Pool</h1>
          <p className="mt-1 text-muted-foreground">
            Broadcast open shifts and claim shared coverage across your micro-region
          </p>
        </div>
        <Button
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Broadcast Overflow Shift
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Broadcast open shift</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={broadcast} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Role / title</label>
                <input
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Start</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">End</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Pay rate ($/hr)</label>
                <input
                  type="number"
                  step="0.25"
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  value={form.payRate}
                  onChange={(e) => setForm({ ...form, payRate: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                  {saving ? "Broadcasting…" : "Broadcast"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
          <div>
            <CardTitle className="text-lg">Regional cooperative geofence</CardTitle>
            <CardDescription>Partner ring for rural labor sharing</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {[10, 15, 25].map((miles) => (
              <Button
                key={miles}
                variant={activeRadius === miles ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveRadius(miles)}
                className="rounded-xl text-xs h-8"
              >
                {miles} mi
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0 relative">
          <div className="h-[280px] w-full bg-slate-900 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute rounded-full border border-indigo-500/30 bg-indigo-500/5 h-64 w-64 flex items-center justify-center">
              <div className="absolute rounded-full border border-indigo-400/50 h-40 w-40 flex items-center justify-center">
                <div className="absolute rounded-full border border-emerald-400/80 h-20 w-20" />
              </div>
            </div>
            <div className="absolute z-10 flex flex-col items-center">
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg ring-4 ring-indigo-500/30">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="mt-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-white">
                Your business
              </span>
            </div>
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs text-white border border-slate-700">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>
                Geofence: <strong className="text-indigo-300">{activeRadius} mi</strong>
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400">{shifts.length} open in pool</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold tracking-tight">Active regional pool</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Open shifts from your schedule + partner broadcasts
        </p>

        {loading ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
          </div>
        ) : shifts.length === 0 ? (
          <Card className="rounded-2xl p-8 text-center text-muted-foreground">
            <p>No open shifts in the pool. Broadcast one or mark a schedule shift as Open.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {shifts.map((shift) => {
              const isClaimed =
                claimedIds.includes(shift.id) ||
                shift.status === "claimed" ||
                shift.status === "scheduled";
              return (
                <Card key={shift.id} className="rounded-2xl border-border/60 bg-white/85 shadow-sm">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <span className="inline-block mb-2 rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-200">
                        {shift.sector || "Co-op"}
                      </span>
                      <CardTitle className="text-lg font-semibold">{shift.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5 mt-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {shift.business || "Partner"}
                      </CardDescription>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {typeof shift.payRate === "number"
                        ? `$${shift.payRate.toFixed(2)}/hr`
                        : shift.payRate}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-primary" />
                        <span>
                          {shift.date ||
                            (shift.startTime
                              ? new Date(shift.startTime).toLocaleString()
                              : "Scheduled")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-amber-600" />
                        <span>{shift.distance || "Within active geofence"}</span>
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-border/60">
                      <span className="text-xs text-muted-foreground">Claim assigns to roster</span>
                      {isClaimed ? (
                        <Button disabled variant="outline" className="gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
                          <CheckCircle2 className="h-4 w-4" />
                          Claimed
                        </Button>
                      ) : (
                        <Button onClick={() => handleClaim(shift.id)} className="rounded-xl text-xs h-9">
                          Claim shift
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
