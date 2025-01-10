import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DiscountCode {
  code: string;
  usageCount: number;
  discountAmount: number;
}

interface TopDiscountCodesCardProps {
  discountCodes: DiscountCode[];
}

export function TopDiscountCodesCard({ discountCodes }: TopDiscountCodesCardProps) {
  if (!discountCodes?.length) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Top Discount Codes</CardTitle>
          <CardDescription>Most used discount codes in this promotion</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No discount codes available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Top Discount Codes</CardTitle>
        <CardDescription>Most used discount codes in this promotion</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discountCodes.map((code, index) => (
            <div
              key={code.code}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-muted-foreground">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="font-medium">{code.code}</h3>
                  <p className="text-sm text-muted-foreground">
                    {code.discountAmount}% off
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{code.usageCount} uses</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}