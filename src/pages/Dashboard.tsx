import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { CheckCircle2 } from "lucide-react";
import { MetricsGraph } from "@/components/dashboard/MetricsGraph";
import { MetricTooltip } from "@/components/MetricTooltip";
import { AiInputWithSuggestions } from "@/components/AiInputWithSuggestions";
import { ShippingBreakdownChart } from "@/components/dashboard/ShippingBreakdownChart";

// Mock recommendations data
const recommendations = [
  {
    type: 'seasonality' as const,
    title: 'Summer Collection Opportunity',
    description: 'Historical data shows increased demand for summer dresses starting next month. Consider launching a summer collection promotion.',
    action: {
      label: 'Create Promotion',
      path: '/promotions/create'
    }
  },
  {
    type: 'sales' as const,
    title: 'Dresses Performance',
    description: 'Dress sales have increased by 25% in the last week. Consider expanding inventory.',
    action: {
      label: 'View Collection',
      path: '/collections/dresses'
    }
  },
  {
    type: 'alert' as const,
    title: 'Seasonal Inventory Alert',
    description: 'Winter collection items are showing high stock levels. Consider a clearance promotion.',
    action: {
      label: 'View Products',
      path: '/products'
    }
  }
];

// Mock activities data
const activities = [
  { type: "experiment", text: "Started Experiment (Dresses +- 5%)" },
  { type: "experiment", text: "Ended Experiment (Dresses +- 5%)" },
  { type: "experiment", text: "Started Experiment (George Foreman Grill +- 10%)" },
  { type: "experiment", text: "Started Experiment (Lower Ground Shipping to $5)" },
  { type: "promotion", text: "Started Promotion (20% off site wide)" },
];

const dashboardSuggestions = [
  "Decrease Sale products by up to 15% for the next month",
  "Show me top performing products by revenue"
];

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTests] = useState("25");
  const [aiPrompt, setAiPrompt] = useState("");
  const navigate = useNavigate();

  const handleInputClick = () => {
    if (!aiPrompt) {
      setAiPrompt("Setup an A/B test for our Best Sellers collection with a 20% price increase");
    }
  };

  const handleAiContinue = () => {
    // Handle AI prompt submission
    console.log("AI Prompt:", aiPrompt);
    navigate('/experiments/create');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
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
            <div className="text-3xl font-bold text-secondary">$194,862</div>
            <div className="text-sm text-muted-foreground mt-2">5 of 25 experiments completed</div>
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
            <div className="text-3xl font-bold text-secondary">$36,625</div>
            <div className="text-sm text-muted-foreground mt-2">1 of 2 promotions completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Graph */}
      <MetricsGraph />

      {/* AI Experiment Card */}
      <Card noShadow>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Let's get started on generating more revenue!</h2>
              <p className="text-muted-foreground text-lg">
                Get help from AI and start optimizing in no time.
              </p>
            </div>

            <AiInputWithSuggestions
              value={aiPrompt}
              onChange={setAiPrompt}
              onContinue={handleAiContinue}
              placeholder="Ask about your metrics, products, or get recommendations..."
              suggestions={dashboardSuggestions}
            />

            <div className="flex flex-col gap-3 pt-4">
              <Button size="lg" onClick={handleAiContinue} className="max-w-[500px] mx-auto">
                Start with AI
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={index} recommendation={recommendation} />
          ))}
        </div>
      </div>

      {/* Shipping Metrics */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ShippingBreakdownChart />
        </div>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 ${
                    activity.type === "collection"
                      ? "bg-blue-500"
                      : activity.type === "experiment"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                />
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