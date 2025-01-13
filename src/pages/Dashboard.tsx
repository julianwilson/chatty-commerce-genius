import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";

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
  { type: "collection", text: "Created New Collections (Summer Dresses, Going out dresses)" },
  { type: "experiment", text: "Started Experiment (Dresses +- 5%)" },
  { type: "experiment", text: "Ended Experiment (Dresses +- 5%)" },
  { type: "experiment", text: "Started Experiment (George Foreman Grill +- 10%)" },
  { type: "experiment", text: "Started Experiment (Lower Ground Shipping to $5)" },
  { type: "promotion", text: "Started Promotion (20% off site wide)" },
];

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [targetRevenue, setTargetRevenue] = useState("25M");

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Target Revenue Goal and Incremental Revenue */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Target Revenue Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold">${targetRevenue}</div>
              <Dialog>
                <DialogTrigger>
                  <Pencil className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Target Revenue</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="text"
                    value={targetRevenue}
                    onChange={(e) => setTargetRevenue(e.target.value)}
                    className="mt-4"
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-sm text-muted-foreground mt-2">85% to goal</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Revenue from Jeff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">$1.25M</div>
          </CardContent>
        </Card>
      </div>

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