import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PromotionAISummaryProps {
  dailyData: {
    date: string;
    sales: number;
    unitsSold: number;
    averageUnitRetail: number;
    price: number;
    averageMarkdown: number;
    sessions: number;
    impressions: number;
    aov: number;
  }[];
  previousPeriodData: {
    date: string;
    sales: number;
    unitsSold: number;
    averageUnitRetail: number;
    price: number;
    averageMarkdown: number;
    sessions: number;
    impressions: number;
    aov: number;
  }[];
}

export function PromotionAISummary({ dailyData, previousPeriodData }: PromotionAISummaryProps) {
  // Calculate metrics for the mock summary
  const totalCurrentSales = dailyData.reduce((sum, day) => sum + day.sales, 0);
  const totalPreviousSales = previousPeriodData.reduce((sum, day) => sum + day.sales, 0);
  const salesGrowth = ((totalCurrentSales - totalPreviousSales) / totalPreviousSales) * 100;

  const totalCurrentUnits = dailyData.reduce((sum, day) => sum + day.unitsSold, 0);
  const totalPreviousUnits = previousPeriodData.reduce((sum, day) => sum + day.unitsSold, 0);
  const unitsGrowth = ((totalCurrentUnits - totalPreviousUnits) / totalPreviousUnits) * 100;

  const avgCurrentAOV = dailyData.reduce((sum, day) => sum + day.aov, 0) / dailyData.length;
  const avgPreviousAOV = previousPeriodData.reduce((sum, day) => sum + day.aov, 0) / previousPeriodData.length;
  const aovGrowth = ((avgCurrentAOV - avgPreviousAOV) / avgPreviousAOV) * 100;

  // Mock summary based on the calculated metrics
  const mockSummary = `The promotion has demonstrated strong performance with a ${salesGrowth.toFixed(1)}% increase in sales compared to the previous period, reaching a total of $${totalCurrentSales.toLocaleString()}. This significant growth was driven by both increased transaction volume and higher average order values, indicating effective promotional strategies and strong customer engagement.

Unit sales showed remarkable growth of ${unitsGrowth.toFixed(1)}%, increasing from ${totalPreviousUnits} to ${totalCurrentUnits} units. This substantial increase in volume suggests that the promotion successfully attracted customer interest and effectively converted browsing activity into purchases. The average markdown of ${dailyData[0].averageMarkdown}% proved to be an optimal balance between maintaining margins and driving sales velocity.

The average order value (AOV) experienced a ${aovGrowth.toFixed(1)}% improvement, rising from $${avgPreviousAOV.toFixed(2)} to $${avgCurrentAOV.toFixed(2)}. This increase in AOV, combined with higher transaction volumes, indicates successful upselling and cross-selling strategies during the promotion. For future promotions, consider maintaining similar discount levels while focusing on bundle offers and targeted marketing to sustain this positive momentum.`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Summary</CardTitle>
        <CardDescription>
          Analysis of your promotion's performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-sm text-muted-foreground">
          {mockSummary}
        </div>
      </CardContent>
    </Card>
  );
}