import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
        <p className="text-muted-foreground mt-1">
          Labor cost, export, and pay-period summaries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Current Pay Period
          </CardTitle>
          <CardDescription>
            Hours worked, overtime, and estimated cost
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-md border border-dashed text-muted-foreground">
            Payroll summary and export tools will live here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
