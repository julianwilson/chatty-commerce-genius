import { useState } from "react";
import { SetupStep } from "@/components/experiment/SetupStep";
import { RulesStep } from "@/components/experiment/RulesStep";
import { ProductsStep } from "@/components/experiment/ProductsStep";
import { LaunchStep } from "@/components/experiment/LaunchStep";
import { TypeStep } from "@/components/experiment/TypeStep";
import { ProfilesStep } from "@/components/experiment/shipping/ProfilesStep";
import { RatesStep } from "@/components/experiment/shipping/RatesStep";
import { RulesStep as ShippingRulesStep } from "@/components/experiment/shipping/RulesStep";
import { LaunchStep as ShippingLaunchStep } from "@/components/experiment/shipping/LaunchStep";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const regularSteps = ["Setup", "Rules", "Products", "Launch"] as const;
const shippingSteps = ["Profiles", "Rates", "Rules", "Launch"] as const;

export default function CreateExperiment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [experimentType, setExperimentType] = useState<string>("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [experimentDetails, setExperimentDetails] = useState<{
    successMetric?: string;
    startDateTime?: Date;
    endDateTime?: Date;
    timezone?: string;
    selectedProducts?: number;
  }>({});
  const navigate = useNavigate();

  const steps = experimentType === "Shipping Testing" ? shippingSteps : regularSteps;

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTypeSelection = (type: string) => {
    setExperimentType(type);
    setCurrentStep(0);
  };

  return (
    <div className="w-full max-w-[1024px] mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/experiments")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Experiment</h1>
      </div>

      <Card className="p-8">
        {experimentType && (
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
              <div
                key={step}
                className={cn(
                  "flex items-center gap-2",
                  currentStep >= index ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    currentStep >= index ? "bg-primary text-white" : "bg-muted"
                  )}
                >
                  {index + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        <div className={cn("mt-8", !experimentType && "pt-0 px-8 pb-8")}>
          {!experimentType && (
            <TypeStep onNext={handleTypeSelection} />
          )}
          {experimentType === "Shipping Testing" ? (
            <>
              {currentStep === 0 && (
                <ProfilesStep 
                  onNext={goToNextStep} 
                  onBack={() => setExperimentType("")}
                  onProfileSelect={setSelectedZones}
                />
              )}
              {currentStep === 1 && (
                <RatesStep
                  onNext={goToNextStep}
                  onBack={goToPreviousStep}
                />
              )}
              {currentStep === 2 && (
                <ShippingRulesStep
                  onNext={goToNextStep}
                  onBack={goToPreviousStep}
                />
              )}
              {currentStep === 3 && (
                <ShippingLaunchStep
                  onBack={goToPreviousStep}
                  onClose={() => navigate("/experiments")}
                />
              )}
            </>
          ) : (
            <>
              {currentStep === 0 && experimentType && (
                <SetupStep
                  onNext={(details) => {
                    setExperimentDetails(prev => ({
                      ...prev,
                      ...details
                    }));
                    goToNextStep();
                  }}
                  onBack={() => setExperimentType("")}
                  experimentType={experimentType}
                />
              )}
              {currentStep === 1 && experimentType && (
                <RulesStep 
                  onNext={goToNextStep} 
                  onBack={goToPreviousStep} 
                  experimentType={experimentType} 
                />
              )}
              {currentStep === 2 && experimentType && (
                <ProductsStep 
                  onNext={(count) => {
                    setExperimentDetails(prev => ({
                      ...prev,
                      selectedProducts: count
                    }));
                    goToNextStep();
                  }}
                  onBack={goToPreviousStep} 
                />
              )}
              {currentStep === 3 && experimentType && (
                <LaunchStep
                  experimentType={experimentType}
                  experimentDetails={experimentDetails}
                  onBack={goToPreviousStep}
                  onClose={() => navigate("/experiments")}
                />
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}