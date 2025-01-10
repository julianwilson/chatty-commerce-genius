import { addDays, format } from "date-fns";

export type PromotionType = 
  | "Sitewide Markdown Sale"
  | "Sitewide Discount Code Sale"
  | "Collection Sale"
  | "Bogo Sale"
  | "Free Shipping Sale"
  | "Shipping Update"
  | "Influencer"
  | "Event"
  | "Loyalty Bonus";

export interface SalesDataPoint {
  date: string;
  sales: number;
  price: number;
  promotion?: {
    type: PromotionType;
  };
}

export const generateMockSalesData = (days: number = 30): SalesDataPoint[] => {
  const data: SalesDataPoint[] = [];
  const basePrice = 100;
  const baseSales = 1000;

  // Define some random promotion dates
  const promotions: Array<{ day: number; type: PromotionType }> = [
    { day: 5, type: "Sitewide Markdown Sale" },
    { day: 12, type: "Collection Sale" },
    { day: 20, type: "Free Shipping Sale" },
    { day: 25, type: "Influencer" }
  ];

  for (let i = 0; i < days; i++) {
    const date = addDays(new Date(), -days + i);
    // Create some price variations
    const priceVariation = Math.sin(i / 5) * 10;
    const price = basePrice + priceVariation;
    
    // Sales generally go down as price goes up (negative correlation)
    const salesVariation = (-priceVariation * 5) + (Math.random() * 200 - 100);
    const sales = Math.max(0, baseSales + salesVariation);

    // Check if there's a promotion on this day
    const promotion = promotions.find(p => p.day === i);

    data.push({
      date: format(date, 'MMM dd'),
      sales: Math.round(sales),
      price: Number(price.toFixed(2)),
      ...(promotion && { promotion: { type: promotion.type } })
    });
  }

  return data;
};