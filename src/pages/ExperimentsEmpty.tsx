import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ExperimentsEmpty() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Experiments</h1>
        <Button onClick={() => navigate("/experiments/create")}>
          <Plus className="mr-2 h-4 w-4" /> New Experiment
        </Button>
      </div>
      <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                Let's try increasing prices by 10% and 20% of a few top selling products and see if we can increase gross profits
              </p>
              <Button 
                onClick={() => navigate("/experiments/create")}
                className="gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}