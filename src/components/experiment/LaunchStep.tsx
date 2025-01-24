import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { isValidEmail } from "@/lib/utils";
import { format } from "date-fns";
import { X } from "lucide-react";

interface LaunchStepProps {
  onBack: () => void;
  onClose: () => void;
  experimentType: string;
  experimentDetails: {
    successMetric?: string;
    startDateTime?: Date;
    endDateTime?: Date;
    timezone?: string;
    selectedProducts?: number;
  };
}

export function LaunchStep({ onBack, onClose, experimentType, experimentDetails }: LaunchStepProps) {
  const [emailInput, setEmailInput] = useState<string>("");
  const [notificationEmails, setNotificationEmails] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [experimentName, setExperimentName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Generate experiment name based on details
    const metric = experimentDetails.successMetric ? 
      experimentDetails.successMetric.charAt(0).toUpperCase() + experimentDetails.successMetric.slice(1) : 
      "Optimization";
    
    const date = experimentDetails.startDateTime ? 
      format(experimentDetails.startDateTime, "MMM-dd") : 
      format(new Date(), "MMM-dd");
    
    const productCount = experimentDetails.selectedProducts ? 
      `${experimentDetails.selectedProducts}-products` : 
      "multi-product";
    
    const generatedName = `${experimentType} ${metric} Test (${productCount}) - ${date}`;
    setExperimentName(generatedName);
  }, [experimentDetails, experimentType]);

  const handleEmailInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const email = emailInput.trim();
      
      if (!email) return;
      
      if (!isValidEmail(email)) {
        toast({
          variant: "destructive",
          title: "Invalid email address",
          description: `Please check: ${email}`
        });
        return;
      }

      if (notificationEmails.includes(email)) {
        toast({
          variant: "destructive",
          title: "Duplicate email",
          description: "This email has already been added"
        });
        return;
      }

      setNotificationEmails(prev => [...prev, email]);
      setEmailInput("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setNotificationEmails(prev => prev.filter(email => email !== emailToRemove));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Experiment launched successfully!",
        description: "All stakeholders have been notified."
      });
      
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to launch experiment",
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Review Experiment Details</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="experiment-name">Experiment Name</Label>
            <Input
              id="experiment-name"
              value={experimentName}
              onChange={(e) => setExperimentName(e.target.value)}
              placeholder="Enter experiment name"
            />
          </div>

          <div>
            <span className="font-medium">Type:</span>
            <p className="text-gray-600">{experimentType}</p>
          </div>

          <div>
            <span className="font-medium">Success Metric:</span>
            <p className="text-gray-600">{experimentDetails.successMetric}</p>
          </div>

          <div>
            <span className="font-medium">Duration:</span>
            <p className="text-gray-600">
              {experimentDetails.startDateTime && experimentDetails.endDateTime ? (
                `${format(experimentDetails.startDateTime, "MMM d, yyyy")} - ${format(experimentDetails.endDateTime, "MMM d, yyyy")}`
              ) : (
                "Not specified"
              )}
            </p>
          </div>

          <div>
            <span className="font-medium">Selected Products:</span>
            <p className="text-gray-600">{experimentDetails.selectedProducts || 0} products selected</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notification-emails">Notification Emails</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {notificationEmails.map((email, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
              >
                <span>{email}</span>
                <button
                  onClick={() => removeEmail(email)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <Input
            id="notification-emails"
            placeholder="Type email and press Enter"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleEmailInputKeyDown}
          />
          <p className="text-sm text-muted-foreground">
            These people will be notified when the experiment starts and ends
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
          disabled={isSubmitting || !experimentName.trim()}
        >
          {isSubmitting ? "Launching..." : "Launch Experiment"}
        </Button>
      </div>
    </div>
  );
}