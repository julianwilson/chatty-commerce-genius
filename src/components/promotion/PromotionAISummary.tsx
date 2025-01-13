import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PromotionAISummaryProps {
  dailyData: {
    date: string;
    sales: number;
    unitsSold: number;
    averageUnitRetail: number;
    price: number;
    averageMarkdown: number;
    sessions: number;
    impressions: number;
    aov: number;
  }[];
  previousPeriodData: {
    date: string;
    sales: number;
    unitsSold: number;
    averageUnitRetail: number;
    price: number;
    averageMarkdown: number;
    sessions: number;
    impressions: number;
    aov: number;
  }[];
}

export function PromotionAISummary({ dailyData, previousPeriodData }: PromotionAISummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSummary = async () => {
    if (!localStorage.getItem('PERPLEXITY_API_KEY')) {
      const apiKey = prompt('Please enter your Perplexity API key:');
      if (apiKey) {
        localStorage.setItem('PERPLEXITY_API_KEY', apiKey);
      } else {
        toast({
          title: "API Key Required",
          description: "Please provide a Perplexity API key to use the AI summary feature.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const totalCurrentSales = dailyData.reduce((sum, day) => sum + day.sales, 0);
      const totalPreviousSales = previousPeriodData.reduce((sum, day) => sum + day.sales, 0);
      const salesGrowth = ((totalCurrentSales - totalPreviousSales) / totalPreviousSales) * 100;

      const totalCurrentUnits = dailyData.reduce((sum, day) => sum + day.unitsSold, 0);
      const totalPreviousUnits = previousPeriodData.reduce((sum, day) => sum + day.unitsSold, 0);
      const unitsGrowth = ((totalCurrentUnits - totalPreviousUnits) / totalPreviousUnits) * 100;

      const avgCurrentAOV = dailyData.reduce((sum, day) => sum + day.aov, 0) / dailyData.length;
      const avgPreviousAOV = previousPeriodData.reduce((sum, day) => sum + day.aov, 0) / previousPeriodData.length;
      const aovGrowth = ((avgCurrentAOV - avgPreviousAOV) / avgPreviousAOV) * 100;

      const message = `Please analyze this promotion's performance and provide a 3-paragraph summary. Here are the key metrics:
        - Sales growth: ${salesGrowth.toFixed(1)}% (Current: $${totalCurrentSales.toLocaleString()}, Previous: $${totalPreviousSales.toLocaleString()})
        - Units sold growth: ${unitsGrowth.toFixed(1)}% (Current: ${totalCurrentUnits}, Previous: ${totalPreviousUnits})
        - Average order value growth: ${aovGrowth.toFixed(1)}% (Current: $${avgCurrentAOV.toFixed(2)}, Previous: $${avgPreviousAOV.toFixed(2)})
        - Average markdown: ${dailyData[0].averageMarkdown}%
        
        Focus on the performance trends, potential factors contributing to the results, and recommendations for future promotions.`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('PERPLEXITY_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a retail analytics expert. Be precise and data-driven in your analysis.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      setSummary(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          AI Summary
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your promotion's performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {summary}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">
            Click generate to create an AI summary of your promotion's performance
          </p>
        )}
      </CardContent>
    </Card>
  );
}