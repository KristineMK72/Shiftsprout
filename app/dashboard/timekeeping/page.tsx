import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function TimekeepingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timekeeping</h1>
        <p className="text-muted-foreground mt-1">
          Clock-in / clock-out, breaks, and punch approval
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Punches
          </CardTitle>
          <CardDescription>
            Live feed of employee clock events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-md border border-dashed text-muted-foreground">
            Punch list and approval workflow will appear here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
