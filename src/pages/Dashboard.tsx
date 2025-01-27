import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { MetricsGraph } from "@/components/dashboard/MetricsGraph";
import { MetricTooltip } from "@/components/MetricTooltip";
import { CurrentExperiments } from "@/components/dashboard/CurrentExperiments";

// Mock recommendations data
const recommendations = [
  {
    type: 'seasonality' as const,
    title: 'Summer Price Optimization',
    description: 'Historical data shows increased demand for summer dresses starting next month. Consider running price tests to optimize margins.',
    action: {
      label: 'Create Experiment',
      path: '/experiments/create'
    }
  },
  {
    type: 'sales' as const,
    title: 'Dresses Price Sensitivity',
    description: 'Dress sales have increased by 25% in the last week. Run an A/B test to find optimal price points.',
    action: {
      label: 'Create Experiment',
      path: '/experiments/create'
    }
  },
  {
    type: 'alert' as const,
    title: 'Winter Collection Pricing',
    description: 'Winter items showing low price elasticity. Consider A/B testing higher price points to maximize revenue.',
    action: {
      label: 'Create Experiment',
      path: '/experiments/create'
    }
  }
];

// Mock activities data
const activities = [
  { type: "experiment", text: "Started Experiment (Dresses +- 5%)" },
  { type: "experiment", text: "Ended Experiment (Dresses +- 5%)" },
  { type: "experiment", text: "Started Experiment (George Foreman Grill +- 10%)" },
  { type: "experiment", text: "Started Experiment (Lower Ground Shipping to $5)" },
];

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTests] = useState("25");
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Experiment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card">
          <CardHeader>
            <CardTitle className="font-semibold text-black dark:text-white">
              <MetricTooltip metric="Experiment Sales">
                Experiment Sales
              </MetricTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#6C63FF]">$194,862</div>
            <div className="text-sm text-[#71767B]">5 of 25 experiments completed</div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="font-semibold text-black dark:text-white">
              <MetricTooltip metric="Monthly Profit Uplift">
                Monthly Profit Uplift
              </MetricTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#6C63FF]">$45,721</div>
              <div className="text-lg font-semibold text-[#6C63FF]">+12.4%</div>
            </div>
            <div className="text-sm text-[#71767B]">Based on implemented experiment results</div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Graph */}
      <MetricsGraph />

      {/* Current Experiments */}
      <CurrentExperiments />

      {/* Recommendations Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={index} recommendation={recommendation} />
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-black dark:text-white">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="w-3 h-3 rounded-full mt-1.5 bg-[#6C63FF]" />
                <p className="text-sm">{activity.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;