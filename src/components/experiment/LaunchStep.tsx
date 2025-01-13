import { useState } from "react";
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
}

export function LaunchStep({ onBack, onClose }: LaunchStepProps) {
  const [emailInput, setEmailInput] = useState<string>("");
  const [notificationEmails, setNotificationEmails] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        
        <div className="space-y-3">
          <div>
            <span className="font-medium">Selected Products:</span>
            <p className="text-gray-600">20 products selected</p>
          </div>

          <div>
            <span className="font-medium">Test Duration:</span>
            <p className="text-gray-600">14 days</p>
          </div>

          <div>
            <span className="font-medium">Expected Sample Size:</span>
            <p className="text-gray-600">~2,000 sessions</p>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Launching..." : "Launch Experiment"}
        </Button>
      </div>
    </div>
  );
}