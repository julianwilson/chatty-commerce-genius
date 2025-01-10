import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  percentage: number | null;
  currentValue: number | null;
  previousValue: number | null;
  format?: "currency" | "number";
  disabled?: boolean;
}

export const MetricCard = ({
  title,
  percentage,
  currentValue,
  previousValue,
  format = "currency",
  disabled = false,
}: MetricCardProps) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: format === "currency" ? "currency" : "decimal",
    currency: "USD",
  });

  return (
    <Card className={cn(disabled && "opacity-50")}>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        <div className="flex flex-col gap-1">
          <p className={cn(
            "text-2xl font-bold",
            percentage === null ? "text-muted-foreground" : percentage >= 0 ? "text-secondary" : "text-destructive"
          )}>
            {percentage === null ? "-" : `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`}
          </p>
          <div className="text-sm text-muted-foreground">
            {currentValue === null || previousValue === null ? (
              "-"
            ) : (
              <>
                <span className="font-medium">{formatter.format(currentValue)}</span>
                {" vs "}
                <span>{formatter.format(previousValue)}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};