import { Product, ExperimentMetric } from "@/types/experiment";

export const generateExperimentData = (product: Product): ExperimentMetric[] => {
  const price = parseFloat(product.price.replace("$", ""));
  const controlCOGS = price * 0.5;
  const testAPrice = price * 0.9;
  const testBPrice = price * 1.1;

  // Use the same COGS for all variants
  const COGS = controlCOGS;

  // Define units sold for each variant
  const controlUnits = 1200;
  const testAUnits = 1450;
  const testBUnits = 980;

  // Calculate gross sales
  const controlGrossSales = controlUnits * price;
  const testAGrossSales = testAUnits * testAPrice;
  const testBGrossSales = testBUnits * testBPrice;

  // Calculate net sales (gross sales - (COGS * units))
  const controlNetSales = controlGrossSales - (COGS * controlUnits);
  const testANetSales = testAGrossSales - (COGS * testAUnits);
  const testBNetSales = testBGrossSales - (COGS * testBUnits);

  // Generate random impressions between 25000-26500
  const controlImpressions = Math.floor(Math.random() * (26500 - 25000 + 1)) + 25000;
  const testAImpressions = Math.floor(Math.random() * (26500 - 25000 + 1)) + 25000;
  const testBImpressions = Math.floor(Math.random() * (26500 - 25000 + 1)) + 25000;

  // Calculate revenue per view (Gross Sales / Impressions)
  const controlRPV = controlGrossSales / controlImpressions;
  const testARPV = testAGrossSales / testAImpressions;
  const testBRPV = testBGrossSales / testBImpressions;

  // Calculate conversion rate (Total Orders / Impressions * 100)
  const controlConvRate = (controlUnits / controlImpressions) * 100;
  const testAConvRate = (testAUnits / testAImpressions) * 100;
  const testBConvRate = (testBUnits / testBImpressions) * 100;

  // Calculate gross margin percentage (net sales / gross sales * 100)
  const controlGrossMargin = (controlNetSales / controlGrossSales * 100).toFixed(1);
  const testAGrossMargin = (testANetSales / testAGrossSales * 100).toFixed(1);
  const testBGrossMargin = (testBNetSales / testBGrossSales * 100).toFixed(1);

  const compareAtPrice = (price * 1.2).toFixed(2); // Single compare at price for all variants

  return [
    {
      metric: "Price",
      control: `$${price.toFixed(2)}`,
      testA: `$${testAPrice.toFixed(2)}`,
      testB: `$${testBPrice.toFixed(2)}`,
    },
    {
      metric: "Price Change %",
      control: "0%",
      testA: "-10%",
      testB: "+10%",
    },
    {
      metric: "Compare At Price",
      control: `$${compareAtPrice}`,
      testA: `$${compareAtPrice}`,
      testB: `$${compareAtPrice}`,
    },
    {
      metric: "Units Sold",
      control: controlUnits,
      testA: testAUnits,
      testB: testBUnits,
    },
    {
      metric: "COGS",
      control: `$${COGS.toFixed(2)}`,
      testA: `$${COGS.toFixed(2)}`,
      testB: `$${COGS.toFixed(2)}`,
    },
    {
      metric: "Contribution Margin",
      control: `$${(price - COGS).toFixed(2)}`,
      testA: `$${(testAPrice - COGS).toFixed(2)}`,
      testB: `$${(testBPrice - COGS).toFixed(2)}`,
    },
    {
      metric: "Gross Sales $",
      control: `$${controlGrossSales.toFixed(2)}`,
      testA: `$${testAGrossSales.toFixed(2)}`,
      testB: `$${testBGrossSales.toFixed(2)}`,
    },
    {
      metric: "Net Sales $",
      control: `$${controlNetSales.toFixed(2)}`,
      testA: `$${testANetSales.toFixed(2)}`,
      testB: `$${testBNetSales.toFixed(2)}`,
    },
    {
      metric: "Gross Margin %",
      control: `${controlGrossMargin}%`,
      testA: `${testAGrossMargin}%`,
      testB: `${testBGrossMargin}%`,
    },
    {
      metric: "AOV",
      control: `$${(controlGrossSales / controlUnits).toFixed(2)}`,
      testA: `$${(testAGrossSales / testAUnits).toFixed(2)}`,
      testB: `$${(testBGrossSales / testBUnits).toFixed(2)}`,
    },
    {
      metric: "Total Cart Sales $",
      control: `$${(controlGrossSales * 1.15).toFixed(2)}`,
      testA: `$${(testAGrossSales * 1.15).toFixed(2)}`,
      testB: `$${(testBGrossSales * 1.15).toFixed(2)}`,
    },
    {
      metric: "Units Per Transaction",
      control: (controlUnits / (controlUnits * 0.85)).toFixed(2),
      testA: (testAUnits / (testAUnits * 0.85)).toFixed(2),
      testB: (testBUnits / (testBUnits * 0.85)).toFixed(2),
    },
    {
      metric: "Total Orders",
      control: controlUnits,
      testA: testAUnits,
      testB: testBUnits,
    },
    {
      metric: "Conversion Rate",
      control: `${controlConvRate.toFixed(1)}%`,
      testA: `${testAConvRate.toFixed(1)}%`,
      testB: `${testBConvRate.toFixed(1)}%`,
    },
    {
      metric: "Impressions",
      control: controlImpressions,
      testA: testAImpressions,
      testB: testBImpressions,
    },
    {
      metric: "Revenue Per View",
      control: `$${controlRPV.toFixed(2)}`,
      testA: `$${testARPV.toFixed(2)}`,
      testB: `$${testBRPV.toFixed(2)}`,
    },
    {
      metric: "% of Traffic",
      control: "33.33%",
      testA: "33.33%",
      testB: "33.33%",
    },
  ];
};