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
    return <ImageTestingRules onNext={onNext} onBack={onBack} />;
  }

  // For all other types, show the original price testing form
  return <PriceTestingRules onNext={onNext} onBack={onBack} />;
}