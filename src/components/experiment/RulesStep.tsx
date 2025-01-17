import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImageTestingRules } from "./ImageTestingRules";
import { PriceTestingRules } from "./PriceTestingRules";

interface RulesStepProps {
  onNext: () => void;
  onBack: () => void;
  experimentType: string;
}

export function RulesStep({ onNext, onBack, experimentType }: RulesStepProps) {
  if (experimentType === "Image Testing") {
    return (
      <div className="space-y-8 w-full">
        <ImageTestingRules onNext={onNext} onBack={onBack} />
      </div>
    );
  }

  // For all other types, show the original price testing form
  return (
    <div className="space-y-8 w-full">
      <PriceTestingRules onNext={onNext} onBack={onBack} />
    </div>
  );
}