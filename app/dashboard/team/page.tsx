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
import { Users, Plus, X, Loader2, MapPin } from "lucide-react";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  location?: { name: string; city?: string | null; state?: string | null } | null;
};

export default function TeamPage() {
  const [users, setUsers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "employee" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      setOpen(false);
      setForm({ name: "", email: "", role: "employee" });
      await load();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-1">Employees, roles, and locations</p>
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-xl shadow-sm shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          Add person
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add team member</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={addMember} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Role</label>
                <select
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="rounded-xl">
                  {saving ? "Saving…" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Directory
          </CardTitle>
          <CardDescription>Your workforce roster</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {users.map((u) => (
                <li key={u.id} className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{u.name || u.email}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    {u.location && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {u.location.name}
                        {u.location.city ? ` · ${u.location.city}, ${u.location.state}` : ""}
                      </p>
                    )}
                  </div>
                  <span className="mt-2 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary sm:mt-0">
                    {u.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
