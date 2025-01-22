import { Card } from "@/components/ui/card";
import { ShippingAOVChart } from "@/components/dashboard/ShippingAOVChart";
import { ShippingBreakdownChart } from "@/components/dashboard/ShippingBreakdownChart";

export default function AnalyticsShipping() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Shipping Analytics</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <ShippingBreakdownChart />
        <ShippingAOVChart />
        <Card className="p-6 col-span-full">
          <h2 className="text-lg font-semibold mb-4">Shipping Performance</h2>
          {/* Add shipping metrics and charts here */}
        </Card>
      </div>
    </div>
  );
}
