import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [aiPrompt, setAiPrompt] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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
    navigate("/experiments/create");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-white p-8">
          <div className="container mx-auto">
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
                    onClick={() => navigate("/experiments/create")}
                  >
                    Setup without AI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}