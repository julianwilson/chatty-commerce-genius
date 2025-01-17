import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricCardProps {
  title: ReactNode;
  percentage: number;
  currentValue: number;
  previousValue: number;
  format?: "currency" | "percentage" | "number";
}

export const MetricCard = ({
  title,
  percentage,
  currentValue,
  previousValue,
  format = "number",
}: MetricCardProps) => {
  const formatValue = (value: number) => {
    switch (format) {
      case "currency":
        return `$${value.toFixed(2)}`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toFixed(0);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{title}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-3xl font-bold">
            {formatValue(currentValue)}
          </span>
          <span className={`text-sm ${percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
            {percentage >= 0 ? "+" : ""}{percentage}%
          </span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          vs {formatValue(previousValue)}
        </div>
      </CardContent>
    </Card>
  );
};