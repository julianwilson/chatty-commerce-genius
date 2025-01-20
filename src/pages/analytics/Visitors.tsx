import { Card } from "@/components/ui/card";

export default function AnalyticsVisitors() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Visitor Analytics</h1>
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Visitor Insights</h2>
          {/* Add visitor metrics and charts here */}
        </Card>
      </div>
    </div>
  );
}
