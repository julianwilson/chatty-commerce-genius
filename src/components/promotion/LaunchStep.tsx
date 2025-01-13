import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { isValidEmail } from "@/lib/utils";

interface LaunchStepProps {
  setupData: {
    name: string;
    type: string;
    startDate: Date;
    endDate: Date;
    priceAdjustmentType: string;
    priceAdjustmentPercentage: number;
    changeSlashPriceOnly: boolean;
  };
  selectedProducts: number[];
  onBack: () => void;
}

export function LaunchStep({ setupData, selectedProducts, onBack }: LaunchStepProps) {
  const [notificationEmails, setNotificationEmails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Validate emails if any are provided
    if (notificationEmails) {
      const emails = notificationEmails.split(",").map(email => email.trim());
      const invalidEmails = emails.filter(email => !isValidEmail(email));
      
      if (invalidEmails.length > 0) {
        toast({
          variant: "destructive",
          title: "Invalid email addresses",
          description: `Please check: ${invalidEmails.join(", ")}`
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Promotion launched successfully!",
        description: "All stakeholders have been notified."
      });
      
      // Here you would typically redirect to the promotions list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to launch promotion",
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Review Promotion Details</h2>
        
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {setupData.name}</p>
          <p><span className="font-medium">Type:</span> {setupData.type}</p>
          <p>
            <span className="font-medium">Duration:</span> {setupData.startDate.toLocaleDateString()} - {setupData.endDate.toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Price Adjustment:</span> {setupData.priceAdjustmentType} {setupData.priceAdjustmentPercentage}%
          </p>
          <p>
            <span className="font-medium">Affected Products:</span> {selectedProducts.length} products
          </p>
          <p>
            <span className="font-medium">Slash Price Only:</span> {setupData.changeSlashPriceOnly ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notification-emails">Notification Emails</Label>
          <Input
            id="notification-emails"
            placeholder="Enter email addresses separated by commas"
            value={notificationEmails}
            onChange={(e) => setNotificationEmails(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            These people will be notified when the promotion goes live
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Launching..." : "Launch Promotion"}
        </Button>
      </div>
    </div>
  );
}