import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Mock data for recipes
const recipes = [
  {
    id: 1,
    description: "Increase Compare At Price 25% Site Wide + Test Best Sellers Collection +- 10%",
    successMetric: "Revenue",
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
    successMetric: "Orders",
    createdAt: "2024-03-18",
  },
];

const successMetrics = ["Revenue", "Orders", "Conversion Rate", "AOV", "Units per Transaction"];

const getRandomSuccessMetric = () => {
  const randomIndex = Math.floor(Math.random() * successMetrics.length);
  return successMetrics[randomIndex];
};

const Recipes = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Button onClick={() => navigate("/recipes/create")}>
          <Plus className="mr-2 h-4 w-4" /> New Recipe
        </Button>
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
                  <span>Created {recipe.createdAt}</span>
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