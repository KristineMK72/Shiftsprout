"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Check, X } from "lucide-react";

type Punch = {
  id: string;
  name: string;
  type: string;
  time: string;
  approved: boolean;
};

const initial: Punch[] = [
  { id: "1", name: "Jordan Lee", type: "clock_in", time: "8:02 AM", approved: false },
  { id: "2", name: "Casey Kim", type: "clock_in", time: "8:58 AM", approved: false },
  { id: "3", name: "Sam Rivera", type: "clock_out", time: "Yesterday 5:01 PM", approved: true },
];

export default function TimekeepingPage() {
  const [punches, setPunches] = useState(initial);

  function setApproved(id: string, approved: boolean) {
    setPunches((prev) =>
      prev.map((p) => (p.id === id ? { ...p, approved } : p))
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timekeeping</h1>
        <p className="text-muted-foreground mt-1">
          Clock-in / clock-out, breaks, and punch approval
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Recent punches
          </CardTitle>
          <CardDescription>Approve or reject pending time events</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border/60">
            {punches.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.type.replace("_", " ")} · {p.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {p.approved ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                      Approved
                    </span>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        className="rounded-lg"
                        onClick={() => setApproved(p.id, true)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => setApproved(p.id, false)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Dismiss
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
