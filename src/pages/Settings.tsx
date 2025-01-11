import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersSection } from "@/components/settings/UsersSection";
import { IntegrationsSection } from "@/components/settings/IntegrationsSection";
import { InstallationSection } from "@/components/settings/InstallationSection";

const Settings = () => {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersSection />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsSection />
        </TabsContent>

        <TabsContent value="installation">
          <InstallationSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;