"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, X, Loader2, MapPin, User, Globe, CheckCircle2 } from "lucide-react";

type Shift = {
  id: string;
  role: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string | null;
  user?: { id: string; name: string | null; email: string } | null;
  location?: { id: string; name: string; city?: string | null; state?: string | null } | null;
};
type Member = { id: string; name: string | null; email: string };

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    });
  } catch { return iso; }
}

export default function SchedulePage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [team, setTeam] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);
  const [broadcastSuccessId, setBroadcastSuccessId] = useState<string | null>(null);
  const [form, setForm] = useState({
    role: "Front Desk", startTime: "", endTime: "", notes: "", status: "scheduled",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setWarning(null);
    try {
      const [sRes, tRes] = await Promise.all([fetch("/api/shifts"), fetch("/api/team")]);
      const sData = await sRes.json();
      const tData = await tRes.json();
      setShifts(sData.shifts || []);
      setTeam(tData.users || []);
      if (sData.warning) setWarning(sData.warning);
    } catch {
      setWarning("Could not load shifts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const weekDays = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, []);

  async function createShift(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || data.detail || "Failed"); return; }
      setOpen(false);
      setForm({ role: "Front Desk", startTime: "", endTime: "", notes: "", status: "scheduled" });
      await load();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function assignShift(shiftId: string, userId: string) {
    setAssigning(shiftId);
    try {
      await fetch(`/api/shifts/${shiftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: "scheduled" }),
      });
      await load();
    } finally {
      setAssigning(null);
    }
  }

  // Broadcast an open internal shift to the Regional Cooperative Marketplace
  async function broadcastToMarketplace(shift: Shift) {
    setBroadcastingId(shift.id);
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: shift.role,
          startTime: shift.startTime,
          endTime: shift.endTime,
          payRate: 21.50, // Standard regional co-op tier rate
          sector: "General Operations",
          distance: "Within 15-mi ring",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBroadcastSuccessId(shift.id);
        setTimeout(() => setBroadcastSuccessId(null), 4000);
      }
    } catch (err) {
      console.error("Failed to broadcast shift to pool", err);
    } finally {
      setBroadcastingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Engine 1: Scheduling & Roster
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule & Coverage</h1>
          <p className="text-muted-foreground mt-1">Create internal shifts, assign local staff, or broadcast to the regional co-op pool</p>
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-xl shadow-sm shadow-primary/20 bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> New Shift
        </Button>
      </div>

      {warning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{warning}</div>
      )}

      {/* Weekly Visual Summary Strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {weekDays.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const count = shifts.filter((s) => s.startTime.slice(0, 10) === key).length;
          const isToday = key === new Date().toISOString().slice(0, 10);
          return (
            <div key={key} className={`rounded-xl border p-3 text-center transition-all ${isToday ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border/60 bg-white/70"}`}>
              <div className="text-xs font-medium text-muted-foreground">{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
              <div className="text-lg font-semibold">{d.getDate()}</div>
              <div className="mt-1 text-xs text-muted-foreground">{count} shift{count === 1 ? "" : "s"}</div>
            </div>
          );
        })}
      </div>

      {/* New Shift Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create New Shift</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={createShift} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Role / Title</label>
                <input className="w-full rounded-xl border px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Start Time</label>
                  <input type="datetime-local" className="w-full rounded-xl border px-3 py-2 text-sm" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">End Time</label>
                  <input type="datetime-local" className="w-full rounded-xl border px-3 py-2 text-sm" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Initial Status</label>
                <select className="w-full rounded-xl border px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="scheduled">Scheduled</option>
                  <option value="open">Open (Needs Local Coverage)</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="rounded-xl">{saving ? "Saving…" : "Create shift"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shifts List Card */}
      <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" /> Upcoming Shifts & Pool Bridge
          </CardTitle>
          <CardDescription>Assign local roster staff or broadcast open shifts to neighboring businesses</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading schedule…</div>
          ) : shifts.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
              <p>No shifts scheduled yet</p>
              <Button size="sm" onClick={() => setOpen(true)} className="rounded-lg"><Plus className="mr-1 h-4 w-4" /> Add first shift</Button>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {shifts.map((s) => {
                const isOpen = !s.user || s.status === "open";
                const isBroadcasting = broadcastingId === s.id;
                const isBroadcasted = broadcastSuccessId === s.id;

                return (
                  <li key={s.id} className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-base">{s.role}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${isOpen ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                          {isOpen ? "Open / Unassigned" : "Assigned"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{formatWhen(s.startTime)} → {formatWhen(s.endTime)}</p>
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {s.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{s.location.name}</span>}
                        <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{s.user?.name || s.user?.email || "Unassigned"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Local Roster Assignment Dropdown */}
                      {isOpen && team.length > 0 && (
                        <select 
                          className="rounded-xl border px-3 py-1.5 text-sm bg-white" 
                          defaultValue="" 
                          disabled={assigning === s.id}
                          onChange={(e) => { if (e.target.value) assignShift(s.id, e.target.value); }}
                        >
                          <option value="">Assign local worker…</option>
                          {team.map((m) => <option key={m.id} value={m.id}>{m.name || m.email}</option>)}
                        </select>
                      )}

                      {/* Engine 2: Broadcast to Community Marketplace */}
                      {isOpen && (
                        isBroadcasted ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Broadcasted to Pool
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isBroadcasting}
                            onClick={() => broadcastToMarketplace(s)}
                            className="rounded-xl border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 gap-1.5 text-xs h-9"
                          >
                            {isBroadcasting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
                            Broadcast to Co-op Pool
                          </Button>
                        )
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
