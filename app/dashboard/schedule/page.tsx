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
import { Calendar, Plus, X, Loader2, MapPin, User } from "lucide-react";

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

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function SchedulePage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    role: "Front Desk",
    startTime: "",
    endTime: "",
    notes: "",
    status: "scheduled",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setWarning(null);
    try {
      const res = await fetch("/api/shifts");
      const data = await res.json();
      setShifts(data.shifts || []);
      if (data.warning) setWarning(data.warning);
    } catch {
      setWarning("Could not load shifts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
      if (!res.ok) {
        setError(data.error || data.detail || "Failed to create shift");
        return;
      }
      setOpen(false);
      setForm({ role: "Front Desk", startTime: "", endTime: "", notes: "", status: "scheduled" });
      await load();
    } catch {
      setError("Network error creating shift");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage employee shifts
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-xl shadow-sm shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          New Shift
        </Button>
      </div>

      {warning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {warning}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Shift</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={createShift} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Role</label>
                <input
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                  placeholder="e.g. Front Desk, Nurse"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Start</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">End</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <select
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="open">Open (needs coverage)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Notes</label>
                <textarea
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="rounded-xl">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Create shift"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming shifts
          </CardTitle>
          <CardDescription>
            Live from your database when connected; demo data otherwise
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading…
            </div>
          ) : shifts.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
              <p>No shifts yet</p>
              <Button size="sm" onClick={() => setOpen(true)} className="rounded-lg">
                <Plus className="mr-1 h-4 w-4" /> Add first shift
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {shifts.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{s.role}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          s.status === "open"
                            ? "bg-amber-100 text-amber-800"
                            : s.status === "scheduled"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatWhen(s.startTime)} → {formatWhen(s.endTime)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {s.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {s.location.name}
                          {s.location.city ? ` · ${s.location.city}` : ""}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {s.user?.name || "Unassigned"}
                      </span>
                    </div>
                    {s.notes && (
                      <p className="mt-1 text-xs text-muted-foreground italic">{s.notes}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
