import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage employee shifts
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Shift
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Week View
          </CardTitle>
          <CardDescription>
            Drag-and-drop scheduling, templates, and coverage tools coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-md border border-dashed text-muted-foreground">
            Schedule calendar will render here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
