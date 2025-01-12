import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { SetupStep } from "@/components/promotion/SetupStep";
import { ProductsStep } from "@/components/promotion/ProductsStep";
import { LaunchStep } from "@/components/promotion/LaunchStep";

const steps = ["Setup", "Products", "Launch"] as const;

export default function CreatePromotion() {
  const [currentStep, setCurrentStep] = useState(0);
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
          <ProductsStep onNext={goToNextStep} onBack={goToPreviousStep} />
        )}
        {currentStep === 2 && <LaunchStep onBack={goToPreviousStep} />}
      </div>
    </div>
  );
}