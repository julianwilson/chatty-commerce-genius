import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Wrench } from "lucide-react";

export const InstallationSection = () => {
  const { toast } = useToast();

  const handleRequestInstallation = () => {
    toast({
      title: "Installation Request Sent",
      description: "Our team will contact you shortly to assist with the installation.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Installation Guide</CardTitle>
          <CardDescription>Follow these steps to install our Shopify app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted">1</div>
              <div className="space-y-1.5">
                <p className="font-medium">Log into your Shopify Admin</p>
                <p className="text-sm text-muted-foreground">
                  Access your Shopify store's admin panel at yourstorename.myshopify.com/admin
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted">2</div>
              <div className="space-y-1.5">
                <p className="font-medium">Navigate to Apps</p>
                <p className="text-sm text-muted-foreground">
                  Click on "Apps" in the left sidebar of your Shopify admin
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted">3</div>
              <div className="space-y-1.5">
                <p className="font-medium">Visit Shopify App Store</p>
                <p className="text-sm text-muted-foreground">
                  Click "Visit Shopify App Store" and search for our app
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted">4</div>
              <div className="space-y-1.5">
                <p className="font-medium">Add App</p>
                <p className="text-sm text-muted-foreground">
                  Click "Add app" and follow the installation prompts
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted">5</div>
              <div className="space-y-1.5">
                <p className="font-medium">Configure Settings</p>
                <p className="text-sm text-muted-foreground">
                  Once installed, configure your app settings and preferences
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleRequestInstallation} className="w-full">
            <Wrench className="mr-2 h-4 w-4" />
            Request Pro Installation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};