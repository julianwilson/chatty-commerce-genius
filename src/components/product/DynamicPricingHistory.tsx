import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface PriceChange {
  timestamp: string;
  price: number;
  compareAtPrice: number | null;
  aur: number;
  rule: string;
  reason?: string;
  units: number;
}

interface DynamicPricingHistoryProps {
  productId: string;
}

// Helper function to round to nearest 10 cents
const roundToTenCents = (price: number): number => {
  return Math.round(price * 10) / 10;
};

// Mock data generator for price changes - now with fewer, more meaningful changes
const generateMockPriceHistory = (): PriceChange[] => {
  const history: PriceChange[] = [];
  const basePrice = 29.99;
  const now = new Date();

  // Helper to generate AUR with some variance
  const calculateAUR = (price: number): number => {
    // AUR typically slightly lower than price due to discounts, promotions, etc.
    const variance = (Math.random() * 0.1) + 0.85; // Random between 85-95% of price
    return price * variance;
  };

  // Helper to generate realistic unit sales
  const generateUnits = (price: number, basePrice: number): number => {
    // Units tend to be higher when price is lower relative to base price
    const priceRatio = price / basePrice;
    const baseUnits = 50; // Base units per day
    const adjustedUnits = baseUnits * (2 - priceRatio); // Inverse relationship with price
    return Math.round(adjustedUnits * (0.8 + Math.random() * 0.4)); // Add some randomness
  };

  // Initial price
  history.push({
    timestamp: subDays(now, 30).toISOString(),
    price: basePrice,
    compareAtPrice: roundToTenCents(basePrice * 1.2),
    aur: calculateAUR(basePrice),
    rule: "Initial",
    reason: "Base price set",
    units: generateUnits(basePrice, basePrice)
  });

  // High velocity increase
  history.push({
    timestamp: subDays(now, 25).toISOString(),
    price: roundToTenCents(basePrice * 1.15),
    compareAtPrice: roundToTenCents(basePrice * 1.3),
    aur: calculateAUR(basePrice * 1.15),
    rule: "High Velocity",
    reason: "Sales velocity > 10 units/day",
    units: generateUnits(basePrice * 1.15, basePrice)
  });

  // Seasonality adjustment
  history.push({
    timestamp: subDays(now, 18).toISOString(),
    price: roundToTenCents(basePrice * 1.25),
    compareAtPrice: roundToTenCents(basePrice * 1.4),
    aur: calculateAUR(basePrice * 1.25),
    rule: "Seasonality",
    reason: "Peak season pricing",
    units: generateUnits(basePrice * 1.25, basePrice)
  });

  // Low conversion adjustment
  history.push({
    timestamp: subDays(now, 12).toISOString(),
    price: roundToTenCents(basePrice * 1.1),
    compareAtPrice: roundToTenCents(basePrice * 1.35),
    aur: calculateAUR(basePrice * 1.1),
    rule: "Low Conversion",
    reason: "Conversion rate < 2%",
    units: generateUnits(basePrice * 1.1, basePrice)
  });

  // Recent adjustment
  history.push({
    timestamp: subDays(now, 5).toISOString(),
    price: roundToTenCents(basePrice * 1.2),
    compareAtPrice: roundToTenCents(basePrice * 1.4),
    aur: calculateAUR(basePrice * 1.2),
    rule: "High Velocity",
    reason: "Sales velocity > 15 units/day",
    units: generateUnits(basePrice * 1.2, basePrice)
  });

  // Current price
  history.push({
    timestamp: now.toISOString(),
    price: roundToTenCents(basePrice * 1.3),
    compareAtPrice: roundToTenCents(basePrice * 1.5),
    aur: calculateAUR(basePrice * 1.3),
    rule: "Seasonality",
    reason: "Holiday season adjustment",
    units: generateUnits(basePrice * 1.3, basePrice)
  });

  return history;
};

export function DynamicPricingHistory({ productId }: DynamicPricingHistoryProps) {
  const priceHistory = generateMockPriceHistory();

  const formatPrice = (value: number) => {
    const dollars = Math.floor(value);
    const cents = Math.round((value - dollars) * 100);
    return `$${dollars}.${cents.toString().padStart(2, '0')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{format(new Date(label), 'MMM d, yyyy')}</p>
          <p className="text-sm text-muted-foreground">Rule: {data.rule}</p>
          {data.reason && (
            <p className="text-sm text-muted-foreground">{data.reason}</p>
          )}
          <p className="text-sm">Price: {formatPrice(data.price)}</p>
          <p className="text-sm">AUR: {formatPrice(data.aur)}</p>
          <p className="text-sm">Units Sold: {data.units}</p>
          {data.compareAtPrice && (
            <p className="text-sm">Compare at: {formatPrice(data.compareAtPrice)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pricing History</span>
          <span className="text-sm font-normal text-muted-foreground">Last 30 days</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceHistory}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
                className="text-xs"
              />
              <YAxis
                yAxisId="left"
                className="text-xs"
                tickFormatter={formatPrice}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="#2563eb"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="compareAtPrice"
                name="Compare At"
                stroke="#9333ea"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="aur"
                name="AUR"
                stroke="#16a34a"
                dot={{ r: 4 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="units"
                name="Units"
                stroke="#dc2626"
                dot={{ r: 4 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">Recent Changes</h4>
          <div className="space-y-2">
            {priceHistory.slice(-3).reverse().map((change, idx) => (
              <div key={idx} className="text-sm border-b pb-2 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {format(new Date(change.timestamp), 'MMM d, h:mm a')}
                  </span>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(change.price)}</div>
                    <div className="text-muted-foreground text-xs">
                      AUR: {formatPrice(change.aur)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Units: {change.units}
                    </div>
                  </div>
                </div>
                <div className="text-muted-foreground mt-1">
                  {change.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
