import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plane } from "lucide-react";

export default function PtoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PTO & Leave</h1>
        <p className="text-muted-foreground mt-1">
          Time-off requests, balances, and policies
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Requests
          </CardTitle>
          <CardDescription>
            Approve or deny upcoming leave
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-md border border-dashed text-muted-foreground">
            PTO request queue and balance tracker coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
