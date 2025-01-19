import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { SetupStep } from "@/components/promotion/SetupStep";
import { ProductsStep } from "@/components/promotion/ProductsStep";
import { LaunchStep } from "@/components/promotion/LaunchStep";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = ["Setup", "Products", "Launch"] as const;

export default function CreatePromotion() {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState({
    name: "",
    type: "",
    startDate: new Date(),
    endDate: new Date(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    priceAdjustmentType: "",
    priceAdjustmentPercentage: 0,
    changeSlashPriceOnly: false,
  });
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
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
    <div className="w-full max-w-[1024px] mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/promotions")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Promotion</h1>
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
          {currentStep === 0 && <SetupStep onNext={goToNextStep} />}
          {currentStep === 1 && (
            <ProductsStep 
              onNext={goToNextStep} 
              onBack={goToPreviousStep}
            />
          )}
          {currentStep === 2 && (
            <LaunchStep 
              onBack={goToPreviousStep}
              setupData={setupData}
              selectedProducts={selectedProducts}
              onStepChange={setCurrentStep}
            />
          )}
        </div>
      </Card>
    </div>
  );
}