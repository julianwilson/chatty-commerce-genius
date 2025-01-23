import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Calendar, AlertTriangle } from "lucide-react";

interface Recommendation {
  type: 'seasonality' | 'sales' | 'alert';
  title: string;
  description: string;
  action?: {
    label: string;
    path: string;
  };
}

export const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (recommendation.type) {
      case 'seasonality':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'sales':
        return recommendation.description.includes('increase') ? 
          <TrendingUp className="h-5 w-5 text-green-500" /> : 
          <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-[#1D9BF0]" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getIcon()}
          {recommendation.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>
        {recommendation.action && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(recommendation.action!.path)}
          >
            {recommendation.action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};