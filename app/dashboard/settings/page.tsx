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
import { Settings, Building2, MapPin, Clock, Globe, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    orgName: "Northwoods Rural Health & Co-op Hub",
    locationName: "Main Street Facility",
    city: "Pillager",
    state: "MN",
    timezone: "America/Chicago",
    payPeriod: "bi-weekly",
    geofenceRadius: "15",
    flsaRule: "standard-40",
  });

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      // Simulate saving configuration to API / database
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
              System Configuration
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your rural business profile, location geofences, and FLSA compliance defaults
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization & Location Profile */}
        <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Business & Location Profile
            </CardTitle>
            <CardDescription>Primary identity for internal ops and regional co-op broadcasting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Organization / Business Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-sm bg-white"
                  value={settings.orgName}
                  onChange={(e) => handleChange("orgName", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Primary Facility Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-sm bg-white"
                  value={settings.locationName}
                  onChange={(e) => handleChange("locationName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">City</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-sm bg-white"
                  value={settings.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">State</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-sm bg-white"
                  value={settings.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Timezone</label>
                <select
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-sm bg-white"
                  value={settings.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                >
                  <option value="America/Chicago">Central Time (US/Central)</option>
                  <option value="America/New_York">Eastern Time (US/Eastern)</option>
                  <option value="America/Denver">Mountain Time (US/Denver)</option>
                  <option value="America/Los_Angeles">Pacific Time (US/Los_Angeles)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spatial & Cooperative Ring Settings */}
        <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-indigo-600" />
              Spatialytics & Cooperative Ring
            </CardTitle>
            <CardDescription>Configure your micro-regional labor sharing parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Default Geofence Radius</label>
                <select
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-sm bg-white"
                  value={settings.geofenceRadius}
                  onChange={(e) => handleChange("geofenceRadius", e.target.value)}
                >
                  <option value="10">10 Miles (Immediate Vicinity)</option>
                  <option value="15">15 Miles (Standard Rural Ring)</option>
                  <option value="25">25 Miles (Extended County Hub)</option>
                </select>
                <p className="mt-1 text-xs text-muted-foreground">Radius used for partner shift broadcasts and map clusters.</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Pay Period Cycle</label>
                <select
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-sm bg-white"
                  value={settings.payPeriod}
                  onChange={(e) => handleChange("payPeriod", e.target.value)}
                >
                  <option value="weekly">Weekly (Every Sunday)</option>
                  <option value="bi-weekly">Bi-Weekly (Every 2 Weeks)</option>
                  <option value="semi-monthly">Semi-Monthly (1st & 15th)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Rules */}
        <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Labor Compliance & Overtime Rules
            </CardTitle>
            <CardDescription>Automated auditing for internal and cross-employer shifts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-white/60">
              <div>
                <p className="font-medium text-sm">FLSA 40-Hour Weekly Overtime Threshold</p>
                <p className="text-xs text-muted-foreground">Automatically flag or block shift claims that exceed 40 total hours across the ring.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                Active & Enforced
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {success && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Settings updated successfully!
            </span>
          )}
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary text-white hover:bg-primary/90 px-6 py-2.5 shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving changes...
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
