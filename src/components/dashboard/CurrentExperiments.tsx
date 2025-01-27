import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

// Mock data for current experiments
const currentExperiments = [
  {
    id: 1,
    name: "Dresses Price Test",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    status: "Running",
    description: "Testing price elasticity on summer dresses",
    progress: 45,
    estimatedRevenue: 12500,
    revenueChange: "+4.2",
    winningVariant: {
      name: "Test B (+10%)",
      confidence: 92
    }
  },
  {
    id: 2,
    name: "Free Shipping Threshold",
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    status: "Running",
    description: "Testing $50 vs $75 free shipping threshold",
    progress: 30,
    estimatedRevenue: 8750,
    revenueChange: "+2.8",
    winningVariant: {
      name: "$50 Threshold",
      confidence: 88
    }
  },
  {
    id: 3,
    name: "Accessories Bundle",
    startDate: "2024-01-22",
    endDate: "2024-02-22",
    status: "Running",
    description: "Testing bundle pricing for accessories",
    progress: 25,
    estimatedRevenue: 5200,
    revenueChange: "+1.5",
    winningVariant: {
      name: "20% Bundle Discount",
      confidence: 76
    }
  }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const CurrentExperiments = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-black dark:text-white">Current Experiments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentExperiments.map((experiment) => (
            <div key={experiment.id}>
              <div className="grid grid-cols-12 gap-6 items-center">
                {/* Name and Description */}
                <div className="col-span-3">
                  <h3 className="font-medium text-sm mb-0.5">{experiment.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{experiment.description}</p>
                </div>

                {/* Winning Variant */}
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-50 rounded-full p-1">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-green-600">{experiment.winningVariant.name}</div>
                      <div className="text-xs text-muted-foreground">{experiment.winningVariant.confidence}% confidence</div>
                    </div>
                  </div>
                </div>

                {/* Revenue Impact */}
                <div className="col-span-2">
                  <div className="text-sm font-medium text-[#6C63FF]">+${experiment.estimatedRevenue.toLocaleString()}</div>
                  <div className="text-xs text-[#6C63FF]">+{experiment.revenueChange}% Revenue</div>
                </div>

                {/* End Date */}
                <div className="col-span-2">
                  <div className="text-sm font-medium">Ends {formatDate(experiment.endDate)}</div>
                  <div className="text-xs text-muted-foreground">{experiment.progress}% Complete</div>
                </div>

                {/* Progress Bar */}
                <div className="col-span-2 flex items-center">
                  <Progress value={experiment.progress} className="h-1.5 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
