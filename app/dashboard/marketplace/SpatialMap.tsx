"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Layers, Navigation, ShieldCheck } from "lucide-react";

export default function SpatialMap() {
  const [activeRadius, setActiveRadius] = useState<number>(15); // 15-mile geofence default
  const [selectedHub, setSelectedHub] = useState<string>("Main Street Hub");

  return (
    <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm backdrop-blur overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
              Spatialytics-OS Intelligence
            </span>
          </div>
          <CardTitle className="text-lg">Regional Cooperative Geofence</CardTitle>
          <CardDescription>Live spatial cluster analysis for cross-business labor sharing</CardDescription>
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
              {miles} mi Radius
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        {/* Simulated GIS Interactive Map Canvas */}
        <div className="h-[380px] w-full bg-slate-900 relative flex items-center justify-center overflow-hidden">
          {/* Background Grid Pattern simulating GIS raster/vector tiles */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Concentric Geofence Rings */}
          <div className="absolute rounded-full border border-indigo-500/30 bg-indigo-500/5 h-72 w-72 flex items-center justify-center animate-pulse">
            <div className="absolute rounded-full border border-indigo-400/50 h-48 w-48 flex items-center justify-center">
              <div className="absolute rounded-full border border-emerald-400/80 h-24 w-24" />
            </div>
          </div>

          {/* Central Hub Marker */}
          <div className="absolute z-10 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg ring-4 ring-indigo-500/30">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="mt-1.5 rounded-md bg-slate-900/80 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
              {selectedHub} (Anchor)
            </span>
          </div>

          {/* Partner Business Node 1 */}
          <div className="absolute top-20 left-1/4 z-10 flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="mt-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] text-emerald-300 backdrop-blur">
              Northwoods Co-op (3.2 mi)
            </span>
          </div>

          {/* Partner Business Node 2 */}
          <div className="absolute bottom-16 right-1/4 z-10 flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="mt-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] text-amber-300 backdrop-blur">
              Pine Ridge Diner (5.0 mi)
            </span>
          </div>

          {/* GIS Controls Overlay */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-xl bg-slate-900/90 p-2 text-xs text-white backdrop-blur border border-slate-700">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Active Geofence: <strong className="text-indigo-300">{activeRadius} Miles</strong></span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400">3 Partners Connected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
