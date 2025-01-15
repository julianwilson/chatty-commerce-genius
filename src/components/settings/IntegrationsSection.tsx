import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const integrations = [
  {
    name: "Meta Ads",
    description: "Facebook and Instagram advertising platform",
    connected: false,
  },
  {
    name: "Google Ads",
    description: "Google advertising platform",
    connected: false,
  },
  {
    name: "TikTok Ads",
    description: "TikTok advertising platform",
    connected: false,
  },
  {
    name: "SnapChat Ads",
    description: "Snapchat advertising platform",
    connected: false,
  },
  {
    name: "Google Analytics 4",
    description: "Web analytics service by Google",
    connected: false,
  },
];

export const IntegrationsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Manage your connected services and APIs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex items-center justify-between space-x-4 rounded-lg border p-4"
          >
            <div>
              <h3 className="font-medium">{integration.name}</h3>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </div>
            <Switch checked={integration.connected} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};