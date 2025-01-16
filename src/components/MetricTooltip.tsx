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
  "Revenue Per View": {
    title: "Revenue Per View",
    abbreviation: "RPV",
    description: "The average amount of revenue generated from each impression to a website, calculated by dividing total revenue by the number of impressions.",
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
  "Compare At Price": {
    title: "Compare At Price",
    description: "The original or higher price of a product displayed alongside the current sale price to highlight savings and encourage purchases.",
  },
  "Test Group": {
    title: "Test Group",
    description: "The set of metrics and customers exposed to a new variation in an experiment to assess its impact compared to the control group.",
  },
};

interface MetricTooltipProps {
  metric: string;
  children: React.ReactNode;
}

export function MetricTooltip({ metric, children }: MetricTooltipProps) {
  const definition = metricDefinitions[metric];
  
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
