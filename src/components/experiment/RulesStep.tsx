import { ImageTestingRules } from "./ImageTestingRules";
import { PriceTestingRules } from "./PriceTestingRules";

interface RulesStepProps {
  onNext: () => void;
  onBack: () => void;
  experimentType: string;
  successMetric?: string;
}

export function RulesStep({ onNext, onBack, experimentType, successMetric }: RulesStepProps) {
  if (experimentType === "Image Testing") {
    return (
      <div className="space-y-8 w-full">
        <ImageTestingRules onNext={onNext} onBack={onBack} successMetric={successMetric} />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <PriceTestingRules onNext={onNext} onBack={onBack} successMetric={successMetric} />
    </div>
  );
}