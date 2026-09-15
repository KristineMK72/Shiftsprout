import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground mt-1">
          Predictive staffing, anomaly detection, and recommendations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            ShiftSprout AI will analyze schedules, punches, and labor costs to
            surface actionable recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Optimal staffing levels by day/hour</li>
            <li>Overtime risk prediction</li>
            <li>Coverage gap detection</li>
            <li>Labor cost forecasting</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
