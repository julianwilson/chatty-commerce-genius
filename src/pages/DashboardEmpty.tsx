import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricTooltip } from "@/components/MetricTooltip";
import { MetricsGraph } from "@/components/dashboard/MetricsGraph";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { ShippingBreakdownChart } from "@/components/dashboard/ShippingBreakdownChart";
import { ShippingAOVChart } from "@/components/dashboard/ShippingAOVChart";

// Mock empty recommendations
const emptyRecommendations = [
  {
    type: 'seasonality' as const,
    title: 'Get Started with Experiments',
    description: 'Start your first experiment to optimize pricing, shipping, or product images.',
    action: {
      label: 'Create Experiment',
      path: '/experiments/create'
    }
  },
  {
    type: 'sales' as const,
    title: 'Launch a Promotion',
    description: 'Create your first promotion to boost sales and engage customers.',
    action: {
      label: 'Create Promotion',
      path: '/promotions/create'
    }
  },
  {
    type: 'alert' as const,
    title: 'Set Up Analytics',
    description: 'Configure your analytics to start tracking performance metrics.',
    action: {
      label: 'View Analytics',
      path: '/analytics/summary'
    }
  }
];

const DashboardEmpty = () => {
  return (
    <div className="p-8 space-y-6">
      {/* Experiment and Promotion Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <MetricTooltip metric="Experiment Sales">
                Experiment Sales
              </MetricTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">--</div>
            <div className="text-sm text-muted-foreground mt-2">0 of 0 experiments completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <MetricTooltip metric="Promotional Sales">
                Promotional Sales
              </MetricTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">--</div>
            <div className="text-sm text-muted-foreground mt-2">0 of 0 promotions completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Graph */}
      <Card>
        <CardHeader>
          <CardTitle>
            <MetricTooltip metric="App Attributed Sales">
              App Attributed Sales Generated
            </MetricTooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-muted-foreground mb-4">--</div>
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No data available yet
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emptyRecommendations.map((recommendation, index) => (
            <RecommendationCard key={index} recommendation={recommendation} />
          ))}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                No shipping data available
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipping AOV Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                No AOV data available
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Activity Feed</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No activity data available
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardEmpty;
