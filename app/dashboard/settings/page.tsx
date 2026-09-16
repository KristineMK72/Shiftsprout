"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Globe, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    orgName: "",
    locationName: "",
    city: "",
    state: "",
    timezone: "America/Chicago",
    payPeriod: "bi-weekly",
    geofenceRadius: "15",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setSettings((prev) => ({
          ...prev,
          orgName: d.tenant?.name || prev.orgName,
          locationName: d.location?.name || prev.locationName,
          city: d.location?.city || prev.city,
          state: d.location?.state || prev.state,
          timezone: d.location?.timezone || prev.timezone,
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName: settings.orgName,
          locationName: settings.locationName,
          city: settings.city,
          state: settings.state,
          timezone: settings.timezone,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Business profile, location, and rural co-op defaults — saved to Neon
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Business & location
            </CardTitle>
            <CardDescription>Used on wallboard, schedule, and payroll exports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Organization</label>
                <input
                  type="text"
                  className="w-full rounded-xl border px-3.5 py-2 text-sm"
                  value={settings.orgName}
                  onChange={(e) => handleChange("orgName", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Facility name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border px-3.5 py-2 text-sm"
                  value={settings.locationName}
                  onChange={(e) => handleChange("locationName", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">City</label>
                <input
                  type="text"
                  className="w-full rounded-xl border px-3.5 py-2 text-sm"
                  value={settings.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">State</label>
                <input
                  type="text"
                  className="w-full rounded-xl border px-3.5 py-2 text-sm"
                  value={settings.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Timezone</label>
                <select
                  className="w-full rounded-xl border px-3.5 py-2 text-sm"
                  value={settings.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                >
                  <option value="America/Chicago">Central</option>
                  <option value="America/New_York">Eastern</option>
                  <option value="America/Denver">Mountain</option>
                  <option value="America/Los_Angeles">Pacific</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-indigo-600" />
              Cooperative ring
            </CardTitle>
            <CardDescription>Defaults for the Community Talent Pool</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Geofence radius</label>
              <select
                className="w-full rounded-xl border px-3.5 py-2 text-sm"
                value={settings.geofenceRadius}
                onChange={(e) => handleChange("geofenceRadius", e.target.value)}
              >
                <option value="10">10 miles</option>
                <option value="15">15 miles</option>
                <option value="25">25 miles</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Pay period</label>
              <select
                className="w-full rounded-xl border px-3.5 py-2 text-sm"
                value={settings.payPeriod}
                onChange={(e) => handleChange("payPeriod", e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="semi-monthly">Semi-monthly</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Labor compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-medium text-sm">FLSA 40-hour weekly OT threshold</p>
                <p className="text-xs text-muted-foreground">Tracked on Payroll and AI Insights</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {success && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Saved to database
            </span>
          )}
          <Button type="submit" disabled={saving} className="rounded-xl px-6">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save configuration"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
