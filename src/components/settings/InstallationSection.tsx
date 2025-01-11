import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw } from "lucide-react";

export const InstallationSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>View and manage your installation details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="font-medium">Version</p>
              <p className="text-sm text-muted-foreground">Current system version</p>
            </div>
            <Badge>v1.0.0</Badge>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground">Latest system update</p>
            </div>
            <p className="text-sm">March 10, 2024</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Environment</p>
              <p className="text-sm text-muted-foreground">Current running environment</p>
            </div>
            <Badge variant="outline">Production</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Updates</CardTitle>
          <CardDescription>Manage system updates and backups.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Check for Updates
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Backup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};