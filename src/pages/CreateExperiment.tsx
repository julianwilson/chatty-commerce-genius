import { useState } from "react";
import { SetupStep } from "@/components/experiment/SetupStep";
import { RulesStep } from "@/components/experiment/RulesStep";
import { ProductsStep } from "@/components/experiment/ProductsStep";
import { LaunchStep } from "@/components/experiment/LaunchStep";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "@/components/icons/chevron-left";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const steps = ["1. Setup", "2. Rules", "3. Products", "4. Launch"] as const;

export default function CreateExperiment() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [aiPrompt, setAiPrompt] = useState("");
  const [experimentType, setExperimentType] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

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
      <div className="w-full max-w-7xl mx-auto pt-8">
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
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Let's work on your next experiment!</h2>
              <p className="text-muted-foreground text-lg">
                Get help from AI and start optimizing in no time.
              </p>
            </div>

            <Textarea
              placeholder="E.g. Setup an A/B test for our Best Sellers collection with a 20% price increase"
              className="min-h-[120px] text-lg p-4 border-2 border-gray-400 w-full"
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

        <div className="mt-8">
          {currentStep === 0 && (
            <SetupStep onNext={goToNextStep} onTypeChange={setExperimentType} />
          )}
          {currentStep === 1 && (
            <RulesStep onNext={goToNextStep} onBack={goToPreviousStep} experimentType={experimentType} />
          )}
          {currentStep === 2 && (
            <ProductsStep onNext={goToNextStep} onBack={goToPreviousStep} initialFilters={aiPrompt ? [
              {
                id: "1",
                field: "collection",
                operator: "contains",
                value: "Best Sellers"
              }
            ] : undefined} />
          )}
          {currentStep === 3 && (
            <LaunchStep onBack={goToPreviousStep} onClose={() => {}} />
          )}
        </div>
      </Card>
    </div>
  );
}