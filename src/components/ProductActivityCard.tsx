import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";

interface ActivityItem {
  date: string;
  type: "experiment_started" | "experiment_ended" | "promotion_started" | "promotion_ended";
  title: string;
  details?: string;
}

interface ProductActivityCardProps {
  activities: ActivityItem[];
}

export function ProductActivityCard({ activities }: ProductActivityCardProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    return <Activity className="h-4 w-4" />;
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "experiment_started":
        return `Experiment Started: ${activity.title}`;
      case "experiment_ended":
        return `Experiment Ended: ${activity.title} ${activity.details ? `(${activity.details})` : ""}`;
      case "promotion_started":
        return `Promotion Started: ${activity.title}`;
      case "promotion_ended":
        return `Promotion Ended: ${activity.title}`;
      default:
        return activity.title;
    }
  };

  if (!activities?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Activity</CardTitle>
          <CardDescription>Recent events related to this product</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No activity found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Activity</CardTitle>
        <CardDescription>Recent events related to this product</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={`${activity.date}-${index}`}
              className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50"
            >
              <div className="mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <p className="font-medium">{getActivityText(activity)}</p>
                <p className="text-sm text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}