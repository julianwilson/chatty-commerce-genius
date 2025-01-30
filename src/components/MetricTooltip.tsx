import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricDefinition {
  title: string;
  abbreviation?: string;
  description: string;
}

const metricDefinitions: Record<string, MetricDefinition> = {
  "Units Per Transaction": {
    title: "Units Per Transaction",
    abbreviation: "UPT",
    description: "The average number of items that customers purchase in a single transaction, calculated by dividing the total units sold by the total number of orders.",
  },
  "Cost of Goods Sold": {
    title: "Cost of Goods Sold",
    abbreviation: "COGS",
    description: "The direct costs attributable to the production of the goods sold.",
  },
  "Control": {
    title: "Control",
    description: "The baseline group in an experiment that does not receive the experimental treatment, used for comparison against the test group. For example if Test A did $5,000 in sales and Control did $2,500 that is +100% of Test A from Control.",
  },
  "Revenue Per Visitor": {
    title: "Revenue Per Visitor",
    abbreviation: "RPV",
    description: "The total amount of revenue generated from each impression to a website, calculated by dividing gross sales by impressions.",
  },
  "Conversion Rate": {
    title: "Conversion Rate",
    abbreviation: "CVR",
    description: "The percentage of visitors who complete a desired action (like making a purchase), calculated by dividing the number of conversions by the total number of visitors.",
  },
  "AOV": {
    title: "Average Order Value",
    abbreviation: "AOV",
    description: "The average amount spent each time a customer places an order, calculated by dividing total revenue by number of orders.",
  },
  "Total Orders": {
    title: "Total Orders",
    description: "The total number of completed purchases during the experiment period.",
  },
  "Unit Sales": {
    title: "Unit Sales",
    description: "The total number of individual items sold across all orders during the experiment period.",
  },
  "Visitors": {
    title: "Visitors",
    description: "The total number of unique users who viewed the tested variants during the experiment period.",
  },
  "Gross Margin %": {
    title: "Gross Margin %",
    abbreviation: "GM %",
    description: "The percentage of revenue remaining after subtracting COGS, indicating the profitability of sales before operating expenses.",
  },
  "Gross Margin $": {
    title: "Gross Margin $",
    abbreviation: "GM $",
    description: "The dollar amount remaining after subtracting COGS from total revenue, representing the gross profit.",
  },
  "Gross Margin": {
    title: "Gross Margin",
    description: "The dollar amount remaining after subtracting COGS from total revenue, representing the gross profit.",
  },
  "Average Unit Retail": {
    title: "Average Unit Retail",
    abbreviation: "AUR",
    description: "The average selling price per unit of a product or all products, calculated by dividing total gross margin $ (after discounts) by the number of units sold.",
  },
  "Compare At Price": {
    title: "Compare At Price",
    description: "The original or higher price of a product displayed alongside the current sale price to highlight savings and encourage purchases.",
  },
  "Test Group": {
    title: "Test Group",
    description: "The set of metrics and customers exposed to a new variation in an experiment to assess its impact compared to the control group.",
  },
  "Incremental Revenue": {
    title: "Incremental Revenue",
    description: "Revenue in addition to all Control tests in an experiment. For example if the experiment only has 1 product, Control gross sales is $20,000, and Test A is $26,000, the Incremental Revenue is $6,000. If there are multiple products in the experiment you calculate this for every product and sum the total.",
  },
  "Variant Change": {
    title: "Variant Change",
    abbreviation: "Avg. Variant Change",
    description: "The average percentage change between Control and winning variant in all tests in the experiment. For example if there are 3 tests, and the winning variant of each is has a 10%, 12%, and 25% higher success metric. The Incremental Change is 15.67%.",
  },
  "Click-Through Rate": {
    title: "Click-Through Rate",
    abbreviation: "CTR",
    description: "The percentage of people who click on a specific link or image out of the total number of viewers, indicating the effectiveness of the content.",
  },
  "Average Markdown %": {
    title: "Average Markdown %",
    abbreviation: "Avg. Markdown %",
    description: "The average percentage reduction from the original price of products, reflecting discounts and promotions offered. E.g. if the Shoes collection sold $20,000 with $4,000 in discounts, the Average Markdown % is 20%.",
  },
  "App Attributed Sales Generated": {
    title: "App Attributed Sales Generated",
    description: "Total gross sales above control in experiments generated over date range. Include total additional contribution margin of all winning experiments that have been pushed live.",
  },
  "Experiment Sales": {
    title: "Experiment Sales",
    description: "Total gross sales generated from all experiments created in app over date range.",
  },
  "Promotional Sales": {
    title: "Promotional Sales",
    description: "Total gross sales measured during promotions created in app over date range.",
  },
  "Contribution Margin": {
    title: "Contribution Margin",
    description: "The amount of revenue left after subtracting COGS from the current price. E.g. $30 price with $10 COGS is a $20 contribution margin.",
  },
  "Last Year Comp": {
    title: "Last Year Comp",
    description: "Gross sales in comparison to the same period last year. Typically used for YoY gross sales comparison.",
  },
};

interface MetricTooltipProps {
  metric: string;
  children: React.ReactNode;
}

export function MetricTooltip({ metric, children }: MetricTooltipProps) {
  // First try to find by exact match
  let definition = metricDefinitions[metric];
  
  if (!definition) {
    // If not found, try to find by abbreviation
    definition = Object.values(metricDefinitions).find(
      def => def.abbreviation === metric
    );
  }
  
  if (!definition) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{children}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4">
          <div className="flex flex-col gap-1">
            <div className="font-semibold">
              {definition.title}
              {definition.abbreviation && ` (${definition.abbreviation})`}
            </div>
            <p className="text-sm text-muted-foreground">{definition.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
