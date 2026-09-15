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
import { Plane, Check, X, Loader2 } from "lucide-react";

type Pto = {
  id: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  note?: string | null;
  user?: { id: string; name: string | null; email: string } | null;
};

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function PtoPage() {
  const [requests, setRequests] = useState<Pto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pto");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: "approved" | "denied") {
    setBusy(id);
    try {
      const res = await fetch("/api/pto", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PTO & Leave</h1>
        <p className="text-muted-foreground mt-1">Time-off requests, balances, and approvals</p>
      </div>

      <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plane className="h-5 w-5 text-primary" />
            Requests
          </CardTitle>
          <CardDescription>Approve or deny upcoming leave</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : requests.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No PTO requests yet</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {requests.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{r.user?.name || r.user?.email || "Employee"}</p>
                    <p className="text-sm capitalize text-muted-foreground">
                      {r.type} · {fmt(r.startDate)}
                      {r.endDate !== r.startDate ? ` → ${fmt(r.endDate)}` : ""}
                    </p>
                    {r.note && (
                      <p className="mt-1 text-xs italic text-muted-foreground">{r.note}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {r.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="rounded-lg"
                          disabled={busy === r.id}
                          onClick={() => setStatus(r.id, "approved")}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          disabled={busy === r.id}
                          onClick={() => setStatus(r.id, "denied")}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Deny
                        </Button>
                      </>
                    ) : (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          r.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {r.status}
                      </span>
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
