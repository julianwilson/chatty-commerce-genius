import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { SetupStep } from "@/components/promotion/SetupStep";
import { ProductsStep } from "@/components/promotion/ProductsStep";
import { LaunchStep } from "@/components/promotion/LaunchStep";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const steps = ["Setup", "Products", "Launch"] as const;

export default function CreatePromotion() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 represents the welcome screen
  const [aiPrompt, setAiPrompt] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputClick = () => {
    if (!aiPrompt) {
      setAiPrompt("Setup a 20% off site wide promotion starting tomorrow for a week but exclude products in New Arrivals");
    }
  };

  const handleAiContinue = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Tell us what kind of promotion you want to create",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(1); // Go directly to Products step
  };

  if (currentStep === -1) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto mt-12">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/promotions")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Promotion</h1>
        </div>

        <div className="space-y-6 p-8 bg-white rounded-lg shadow-sm border">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Let's work on your next promotion!</h2>
            <p className="text-muted-foreground text-lg">
              Get help from AI and be done in no time.
            </p>
          </div>

          <Textarea
            placeholder="E.g. Setup a 20% off site wide promotion starting tomorrow for a week but exclude products in New Arrivals"
            className="min-h-[120px] text-lg p-4"
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/promotions")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Promotion</h1>
      </div>

      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center"
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`ml-2 ${
                index <= currentStep ? "text-primary" : "text-gray-500"
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
        {currentStep === 0 && <SetupStep onNext={goToNextStep} />}
        {currentStep === 1 && (
          <ProductsStep 
            onNext={goToNextStep} 
            onBack={goToPreviousStep}
            initialFilters={aiPrompt ? [
              {
                id: "1",
                field: "collection",
                operator: "doesNotContain",
                value: "New Arrivals"
              }
            ] : undefined}
          />
        )}
        {currentStep === 2 && <LaunchStep onBack={goToPreviousStep} />}
      </div>
    </div>
  );
}