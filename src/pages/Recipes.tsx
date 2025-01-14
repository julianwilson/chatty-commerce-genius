import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for recipes
const recipes = [
  {
    id: 1,
    description: "Increase Compare At Price 25% Site Wide + Test Best Sellers Collection +- 10%",
    successMetric: "Revenue Per Visitor",
    createdAt: "2024-03-20",
  },
  {
    id: 2,
    description: "BOGO on Spring Collection + Test Product Description Length",
    successMetric: "Conversion Rate",
    createdAt: "2024-03-19",
  },
  {
    id: 3,
    description: "30% Off Winter Items + Test Email Subject Lines",
    successMetric: "Click-Through Rate",
    createdAt: "2024-03-18",
  },
];

const successMetrics = [
  "Conversion Rate",
  "Revenue Per Visitor",
  "Click-Through Rate",
  "Gross Margin"
];

const getRandomSuccessMetric = () => {
  const randomIndex = Math.floor(Math.random() * successMetrics.length);
  return successMetrics[randomIndex];
};

const Recipes = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Recipes</h1>
      </div>

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <Card 
            key={recipe.id}
            className="p-6 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{recipe.description}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Success Metric: {recipe.successMetric}</span>
                </div>
              </div>
              <Button 
                variant="secondary"
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                Get Started
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Recipes;