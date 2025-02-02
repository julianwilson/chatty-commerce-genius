import React from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const Recipes: React.FC = () => {
  const recipes = [
    {
      experimentName: "Increase Prices of Best Sellers Collection Test (10% vs. 20%)",
      hypothesis: "Best-selling products, given their high demand, might sustain a moderate price increase without a significant drop in sales, potentially increasing profit margins.",
      successMetric: "Comparison of conversion rate, average order value (AOV), and revenue per visitor between a 10% and a 20% price increase."
    },
    {
      experimentName: "Reduce Sale Items Prices Test (10% vs. 20%)",
      hypothesis: "Lowering prices on sale items by 10% or 20% could improve perceived value and drive more impulse purchases during promotions.",
      successMetric: "Increase in conversion rate for sale items, higher add-to-cart rates, and overall revenue lift."
    },
    {
      experimentName: "Price Anchoring & Discount Display Test",
      hypothesis: "Showing the original price alongside an increased price will enhance perceived value, thereby encouraging more purchases.",
      successMetric: "Increased conversion rate and add-to-cart events."
    },
    {
      experimentName: "Limited-Time Offers & Urgency Test",
      hypothesis: "Implementing countdown timers and urgency messaging will create a fear-of-missing-out (FOMO) effect, prompting quicker purchase decisions.",
      successMetric: "Increased conversion rate"
    },
    {
      experimentName: "Multiple Images vs. Single Image Display",
      hypothesis: "Displaying multiple images on the collection page is more distracting than a single static image.",
      successMetric: "Increased click-through rate to product pages and higher overall conversion rates."
    },
    {
      experimentName: "Variant Selector Displayed vs. Hidden",
      hypothesis: "Showing variant selectors (e.g., color swatches or size options) directly on the collection page will allow customers to quickly see available options, reducing friction and leading to more add-to-cart events.",
      successMetric: "Higher add-to-cart events and conversion rates from the collection page."
    },
    {
      experimentName: "Ratings & Reviews Display vs. No Ratings",
      hypothesis: "Displaying product ratings and review counts on the collection page will build trust and help users make quicker decisions, leading to a higher likelihood of clicking through to product pages.",
      successMetric: "Increased Click-Through Rate to product pages and higher conversion rates."
    },
    {
      experimentName: "Increase Free Shipping Threshold",
      hypothesis: "Raising the free shipping threshold 20% above AOV may incentivize customers to add more items to their carts to qualify, thus increasing the basket size without significantly deterring conversions.",
      successMetric: "Increase in AOV while maintaining Conversion Rate"
    },
    {
      experimentName: "Always Free Shipping (No Threshold)",
      hypothesis: "Eliminating the free shipping threshold entirely (i.e., offering free shipping on all orders) may remove any purchase hesitation among price-sensitive customers, leading to higher conversions overall.",
      successMetric: "Increased conversion rate, improved customer acquisition metrics, and tracking of profit margins to assess any adverse financial impacts."
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Recipes</h1>
      <div className="bg-background rounded-lg shadow overflow-hidden border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Experiment Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Hypothesis
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Success Metric
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recipes.map((recipe, index) => (
              <tr key={index} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-normal text-sm">{recipe.experimentName}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-muted-foreground">{recipe.hypothesis}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-muted-foreground">{recipe.successMetric}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    onClick={() => alert('Experiment created!')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Experiment
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recipes;
