import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const integrations = [
  {
    name: "Supabase",
    description: "Database and authentication provider",
    connected: true,
  },
  {
    name: "Stripe",
    description: "Payment processing platform",
    connected: false,
  },
  {
    name: "SendGrid",
    description: "Email delivery service",
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