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
import { Clock, Check, Loader2, LogIn, LogOut, AlertTriangle, ShieldCheck } from "lucide-react";

type Punch = {
  id: string;
  type: string;
  timestamp: string;
  approved: boolean;
  user?: { id: string; name: string | null; email: string } | null;
};

type Member = { id: string; name: string | null; email: string };

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function TimekeepingPage() {
  const [punches, setPunches] = useState<Punch[]>([]);
  const [team, setTeam] = useState<Member[]>([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([fetch("/api/punches"), fetch("/api/team")]);
      const pData = await pRes.json();
      const tData = await tRes.json();
      setPunches(pData.punches || []);
      const users = tData.users || [];
      setTeam(users);
      if (!userId && users[0]) setUserId(users[0].id);
    } catch {
      setPunches([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function punch(type: "clock_in" | "clock_out") {
    setBusy(true);
    try {
      await fetch("/api/punches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, userId: userId || undefined }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function approve(id: string) {
    await fetch("/api/punches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: true }),
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Engine 1: Internal Timekeeping
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Timekeeping & Compliance</h1>
          <p className="text-muted-foreground mt-1">Clock in/out events and automated labor rule validation</p>
        </div>
      </div>

      <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Quick punch</CardTitle>
          <CardDescription>Record a clock event for someone on the roster</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Person</label>
            <select
              className="w-full rounded-xl border px-3 py-2 text-sm bg-white"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name || m.email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button className="rounded-xl" disabled={busy || !userId} onClick={() => punch("clock_in")}>
              <LogIn className="mr-2 h-4 w-4" />
              Clock in
            </Button>
            <Button variant="outline" className="rounded-xl" disabled={busy || !userId} onClick={() => punch("clock_out")}>
              <LogOut className="mr-2 h-4 w-4" />
              Clock out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent punches & audits
            </span>
            <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> FLSA Rule Check Active
            </span>
          </CardTitle>
          <CardDescription>Approve pending time events and review compliance</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : punches.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No punches yet — clock someone in</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {punches.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{p.user?.name || p.user?.email || "Employee"}</p>
                    </div>
                    <p className="text-sm capitalize text-muted-foreground">
                      {p.type.replace("_", " ")} · {fmt(p.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.approved ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                        Approved & Validated
                      </span>
                    ) : (
                      <Button size="sm" className="rounded-lg bg-primary text-white" onClick={() => approve(p.id)}>
                        <Check className="mr-1 h-4 w-4" />
                        Approve Punch
                      </Button>
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
