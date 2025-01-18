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
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AiInputWithSuggestions } from "@/components/AiInputWithSuggestions";

const regularSteps = ["Type", "Setup", "Rules", "Products", "Launch"] as const;
const shippingSteps = ["Type", "Profiles", "Rates", "Rules", "Launch"] as const;

const experimentSuggestions = [
  "Test 10%/15%/20% lower price points for New Arrivals",
  "Test 20% lower for slow sellers"
];

export default function CreateExperiment() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [aiPrompt, setAiPrompt] = useState("");
  const [experimentType, setExperimentType] = useState<string>("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps = experimentType === "Shipping Testing" ? shippingSteps : regularSteps;

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAiContinue = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Tell us what kind of experiment you want to create",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(0);
  };

  const handleTypeSelection = (type: string) => {
    setExperimentType(type);
    goToNextStep();
  };

  if (currentStep === -1) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto mt-12">
        <div className="flex items-center gap-4">
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
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Let's work on your next experiment!</h2>
              <p className="text-muted-foreground text-lg">
                Get help from AI and start optimizing in no time.
              </p>
            </div>

            <AiInputWithSuggestions
              value={aiPrompt}
              onChange={setAiPrompt}
              onContinue={handleAiContinue}
              placeholder="Describe the experiment you want to create..."
              suggestions={experimentSuggestions}
            />

            <div className="flex flex-col gap-3 pt-4">
              <Button size="lg" onClick={handleAiContinue}>
                Continue with AI
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentStep(0)}
              >
                Setup without AI
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
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
        <div className="flex justify-between items-center mb-8">
          {currentStep === 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white">
                1
              </div>
              <span className="text-primary">Type</span>
            </div>
          ) : (
            steps.slice(1).map((step, index) => (
              <div
                key={step}
                className={cn(
                  "flex items-center gap-2",
                  currentStep > index ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    currentStep > index ? "bg-primary text-white" : "bg-muted"
                  )}
                >
                  {index + 1}
                </div>
                <span>{step}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          {currentStep === 0 && (
            <TypeStep onNext={handleTypeSelection} />
          )}
          {experimentType === "Shipping Testing" ? (
            <>
              {currentStep === 1 && (
                <ProfilesStep 
                  onNext={goToNextStep} 
                  onBack={goToPreviousStep}
                  onProfileSelect={setSelectedZones}
                />
              )}
              {currentStep === 2 && (
                <RatesStep
                  onNext={goToNextStep}
                  onBack={goToPreviousStep}
                />
              )}
              {currentStep === 3 && (
                <ShippingRulesStep
                  onNext={goToNextStep}
                  onBack={goToPreviousStep}
                />
              )}
              {currentStep === 4 && (
                <ShippingLaunchStep
                  onBack={goToPreviousStep}
                  onClose={() => navigate("/experiments")}
                />
              )}
            </>
          ) : (
            <>
              {currentStep === 1 && experimentType && (
                <SetupStep 
                  onNext={goToNextStep} 
                  onBack={() => setCurrentStep(0)}
                />
              )}
              {currentStep === 2 && experimentType && (
                <RulesStep onNext={goToNextStep} onBack={goToPreviousStep} experimentType={experimentType} />
              )}
              {currentStep === 3 && experimentType && (
                <ProductsStep onNext={goToNextStep} onBack={goToPreviousStep} initialFilters={aiPrompt ? [
                  {
                    id: "1",
                    field: "collection",
                    operator: "contains",
                    value: "Best Sellers"
                  }
                ] : undefined} />
              )}
              {currentStep === 4 && experimentType && (
                <LaunchStep onBack={goToPreviousStep} onClose={() => {}} />
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}