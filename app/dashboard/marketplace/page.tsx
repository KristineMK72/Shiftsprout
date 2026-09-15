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
import { Globe, PlusCircle, MapPin, Building2, CheckCircle2, Layers } from "lucide-react";

const initialShifts = [
  {
    id: "1",
    business: "Northwoods Agricultural Co-op",
    title: "Harvest Line Assistant",
    date: "Tomorrow, 8:00 AM - 4:00 PM",
    payRate: "$22.00/hr",
    distance: "3.2 miles away",
    sector: "Agriculture",
  },
  {
    id: "2",
    business: "Pine Ridge Diner",
    title: "Weekend Prep Cook",
    date: "Saturday, 6:00 AM - 2:00 PM",
    payRate: "$19.50/hr",
    distance: "5.0 miles away",
    sector: "Hospitality",
  },
];

export default function MarketplacePage() {
  const [shifts] = useState(initialShifts);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [activeRadius, setActiveRadius] = useState<number>(15);

  const handleClaim = (id: string) => {
    setClaimedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
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
            Geospatial labor sharing and cross-business shift coordination across your micro-region
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
          <PlusCircle className="h-4 w-4" />
          Broadcast Overflow Shift
        </Button>
      </div>

      {/* Spatialytics GIS Geofence Map View */}
      <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm backdrop-blur overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
          <div>
            <CardTitle className="text-lg">Regional Cooperative Geofence</CardTitle>
            <CardDescription>Live spatial cluster analysis for partner businesses</CardDescription>
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
          <div className="h-[320px] w-full bg-slate-900 relative flex items-center justify-center overflow-hidden">
            {/* Raster/Vector Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Concentric Geofence Rings */}
            <div className="absolute rounded-full border border-indigo-500/30 bg-indigo-500/5 h-64 w-64 flex items-center justify-center animate-pulse">
              <div className="absolute rounded-full border border-indigo-400/50 h-40 w-40 flex items-center justify-center">
                <div className="absolute rounded-full border border-emerald-400/80 h-20 w-20" />
              </div>
            </div>

            {/* Central Anchor Node */}
            <div className="absolute z-10 flex flex-col items-center">
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg ring-4 ring-indigo-500/30">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="mt-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                Your Business (Anchor)
              </span>
            </div>

            {/* Partner Node 1 */}
            <div className="absolute top-16 left-1/4 z-10 flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <span className="mt-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[9px] text-emerald-300 backdrop-blur">
                Northwoods Co-op (3.2 mi)
              </span>
            </div>

            {/* Partner Node 2 */}
            <div className="absolute bottom-12 right-1/4 z-10 flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <span className="mt-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[9px] text-amber-300 backdrop-blur">
                Pine Ridge Diner (5.0 mi)
              </span>
            </div>

            {/* GIS Legend Footer Overlay */}
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs text-white backdrop-blur border border-slate-700">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>Geofence: <strong className="text-indigo-300">{activeRadius} Miles</strong></span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400">3 Regional Partners Online</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Shared Shifts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {shifts.map((shift) => {
          const isClaimed = claimedIds.includes(shift.id);

          return (
            <Card key={shift.id} className="rounded-2xl border-border/60 bg-white/85 shadow-sm backdrop-blur">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <span className="inline-block mb-2 rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-200">
                    {shift.sector}
                  </span>
                  <CardTitle className="text-lg font-semibold">{shift.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {shift.business}
                  </CardDescription>
                </div>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {shift.payRate}
                </span>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-primary" />
                    <span>{shift.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-amber-600" />
                    <span>{shift.distance} (Within active geofence)</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/60">
                  <span className="text-xs text-muted-foreground">FLSA Overtime Audit Active</span>
                  {isClaimed ? (
                    <Button disabled variant="outline" className="gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
                      <CheckCircle2 className="h-4 w-4" />
                      Claimed & Locked
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleClaim(shift.id)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs h-9"
                    >
                      Claim Shift
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
