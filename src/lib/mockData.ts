import { addDays, format } from "date-fns";

export interface SalesDataPoint {
  date: string;
  sales: number;
  price: number;
}

export const generateMockSalesData = (days: number = 30): SalesDataPoint[] => {
  const data: SalesDataPoint[] = [];
  const basePrice = 100;
  const baseSales = 1000;

  for (let i = 0; i < days; i++) {
    const date = addDays(new Date(), -days + i);
    // Create some price variations
    const priceVariation = Math.sin(i / 5) * 10;
    const price = basePrice + priceVariation;
    
    // Sales generally go down as price goes up (negative correlation)
    const salesVariation = (-priceVariation * 5) + (Math.random() * 200 - 100);
    const sales = Math.max(0, baseSales + salesVariation);

    data.push({
      date: format(date, 'MMM dd'),
      sales: Math.round(sales),
      price: Number(price.toFixed(2))
    });
  }

  return data;
};