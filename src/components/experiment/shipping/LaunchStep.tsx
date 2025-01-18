import { Button } from "@/components/ui/button";

interface LaunchStepProps {
  onBack: () => void;
  onClose: () => void;
}

export function LaunchStep({ onBack, onClose }: LaunchStepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Launch Experiment</h2>
        <p className="text-muted-foreground">
          Review and launch your shipping experiment
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button onClick={onClose}>
          Launch
        </Button>
      </div>
    </div>
  );
}
