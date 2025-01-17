import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { MoneyDisplay } from "./MoneyDisplay";

interface MetricCardProps {
  title: ReactNode;
  percentage: number;
  currentValue: number;
  previousValue: number;
  format?: "currency" | "percentage" | "number";
  disabled?: boolean;
}

export const MetricCard = ({
  title,
  percentage,
  currentValue,
  previousValue,
  format = "number",
  disabled = false,
}: MetricCardProps) => {
  const formatValue = (value: number) => {
    switch (format) {
      case "currency":
        return <MoneyDisplay value={value} />;
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('en-US');
    }
  };

  return (
    <Card className={disabled ? "opacity-50 cursor-not-allowed" : ""}>
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