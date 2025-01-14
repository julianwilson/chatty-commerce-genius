import { useState } from "react";
import { SetupStep } from "@/components/experiment/SetupStep";
import { RulesStep } from "@/components/experiment/RulesStep";
import { ProductsStep } from "@/components/experiment/ProductsStep";
import { LaunchStep } from "@/components/experiment/LaunchStep";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const steps = ["1. Setup", "2. Rules", "3. Products", "4. Launch"] as const;

export default function CreateExperiment() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [aiPrompt, setAiPrompt] = useState("");
  const [experimentType, setExperimentType] = useState<string>("");
  const { toast } = useToast();

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

  const handleInputClick = () => {
    if (!aiPrompt) {
      setAiPrompt("Setup an A/B test for our Best Sellers collection with a 20% price increase");
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

  if (currentStep === -1) {
    return (
      <div className="max-w-[500px] mx-auto pt-8">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Let's work on your next experiment!</h2>
            <p className="text-muted-foreground text-lg">
              Get help from AI and be done in no time.
            </p>
          </div>

          <Textarea
            placeholder="E.g. Setup an A/B test for our Best Sellers collection with a 20% price increase"
            className="min-h-[120px] text-lg p-4 border-2 border-gray-400"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onClick={handleInputClick}
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
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto pt-8">
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center"
          >
            <div
              className={`px-4 py-2 rounded-full ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-4 ${
                  index < currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        {currentStep === 0 && (
          <SetupStep 
            onNext={goToNextStep} 
            onTypeChange={setExperimentType}
          />
        )}
        {currentStep === 1 && (
          <RulesStep 
            onNext={goToNextStep} 
            onBack={goToPreviousStep}
            experimentType={experimentType}
          />
        )}
        {currentStep === 2 && (
          <ProductsStep 
            onNext={goToNextStep} 
            onBack={goToPreviousStep}
            initialFilters={aiPrompt ? [
              {
                id: "1",
                field: "collection",
                operator: "contains",
                value: "Best Sellers"
              }
            ] : undefined}
          />
        )}
        {currentStep === 3 && (
          <LaunchStep 
            onBack={goToPreviousStep}
            onClose={() => {}}
          />
        )}
      </div>
    </div>
  );
}