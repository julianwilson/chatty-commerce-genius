import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export function AppSection() {
  const [autoLaunchExperiments, setAutoLaunchExperiments] = useState(false);
  const { toast } = useToast();

  const handleToggleChange = (checked: boolean) => {
    setAutoLaunchExperiments(checked);
    toast({
      title: "Setting updated",
      description: `New products will ${checked ? "now" : "no longer"} automatically launch price experiments.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
        <CardDescription>
          Configure general application settings and behaviors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="auto-launch-experiments" className="flex flex-col space-y-1">
            <span>New Products Automatically Launch Price Experiment</span>
            <span className="font-normal text-sm text-muted-foreground">
              When enabled, a price experiment will be automatically created for newly added products
            </span>
          </Label>
          <Switch
            id="auto-launch-experiments"
            checked={autoLaunchExperiments}
            onCheckedChange={handleToggleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}