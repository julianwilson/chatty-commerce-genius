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
  const controlGrossMargin = (controlNetSales / controlGrossSales * 100);
  const testAGrossMargin = (testANetSales / testAGrossSales * 100);
  const testBGrossMargin = (testBNetSales / testBGrossSales * 100);

  const compareAtPrice = price * 1.2;

  return [
    {
      metric: "Price",
      control: price,
      testA: testAPrice,
      testB: testBPrice,
      format: "money"
    },
    {
      metric: "Price Change %",
      control: 0,
      testA: -10,
      testB: 10,
      format: "percentage"
    },
    {
      metric: "Compare At Price",
      control: compareAtPrice,
      testA: compareAtPrice,
      testB: compareAtPrice,
      format: "money"
    },
    {
      metric: "Units Sold",
      control: controlUnits,
      testA: testAUnits,
      testB: testBUnits,
      format: "number"
    },
    {
      metric: "COGS",
      control: COGS,
      testA: COGS,
      testB: COGS,
      format: "money"
    },
    {
      metric: "Contribution Margin",
      control: price - COGS,
      testA: testAPrice - COGS,
      testB: testBPrice - COGS,
      format: "money"
    },
    {
      metric: "Gross Sales",
      control: controlGrossSales,
      testA: testAGrossSales,
      testB: testBGrossSales,
      format: "money"
    },
    {
      metric: "Net Sales",
      control: controlNetSales,
      testA: testANetSales,
      testB: testBNetSales,
      format: "money"
    },
    {
      metric: "Gross Margin %",
      control: controlGrossMargin,
      testA: testAGrossMargin,
      testB: testBGrossMargin,
      format: "percentage"
    },
    {
      metric: "AOV",
      control: controlGrossSales / controlUnits,
      testA: testAGrossSales / testAUnits,
      testB: testBGrossSales / testBUnits,
      format: "money"
    },
    {
      metric: "Total Cart Sales",
      control: controlGrossSales * 1.15,
      testA: testAGrossSales * 1.15,
      testB: testBGrossSales * 1.15,
      format: "money"
    },
    {
      metric: "Units Per Transaction",
      control: controlUnits / (controlUnits * 0.85),
      testA: testAUnits / (testAUnits * 0.85),
      testB: testBUnits / (testBUnits * 0.85),
      format: "decimal"
    },
    {
      metric: "Total Orders",
      control: controlUnits,
      testA: testAUnits,
      testB: testBUnits,
      format: "number"
    },
    {
      metric: "Conversion Rate",
      control: controlConvRate,
      testA: testAConvRate,
      testB: testBConvRate,
      format: "percentage"
    },
    {
      metric: "Impressions",
      control: controlImpressions,
      testA: testAImpressions,
      testB: testBImpressions,
      format: "number"
    },
    {
      metric: "Revenue Per View",
      control: controlRPV,
      testA: testARPV,
      testB: testBRPV,
      format: "money"
    },
    {
      metric: "% of Traffic",
      control: 33.33,
      testA: 33.33,
      testB: 33.33,
      format: "percentage"
    },
  ];
};