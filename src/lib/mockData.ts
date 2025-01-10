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
  aur: number;
  promotion?: {
    type: PromotionType;
  };
}

export const generateMockSalesData = (days: number = 30): SalesDataPoint[] => {
  const data: SalesDataPoint[] = [];
  const basePrice = 100;
  const baseSales = 1000;

  // Define two price change points
  const firstPriceChangeDay = Math.floor(days * 0.3); // Around 30% through the timeline
  const secondPriceChangeDay = Math.floor(days * 0.7); // Around 70% through the timeline

  // Define some random promotion dates
  const promotions: Array<{ day: number; type: PromotionType }> = [
    { day: 5, type: "Sitewide Markdown Sale" },
    { day: 12, type: "Collection Sale" },
    { day: 20, type: "Free Shipping Sale" },
    { day: 25, type: "Influencer" }
  ];

  for (let i = 0; i < days; i++) {
    const date = addDays(new Date(), -days + i);
    
    // Determine price based on the day
    let price;
    if (i < firstPriceChangeDay) {
      price = basePrice;
    } else if (i < secondPriceChangeDay) {
      price = basePrice * 1.15; // 15% increase
    } else {
      price = basePrice * 0.9; // 10% decrease
    }
    
    // Calculate AUR as 5% lower than price
    const aur = price * 0.95;
    
    // Sales generally go down as price goes up (negative correlation)
    const priceEffect = (basePrice - price) * 5;
    const randomVariation = (Math.random() * 200 - 100);
    const sales = Math.max(0, baseSales + priceEffect + randomVariation);

    // Check if there's a promotion on this day
    const promotion = promotions.find(p => p.day === i);

    data.push({
      date: format(date, 'MMM dd'),
      sales: Math.round(sales),
      price: Number(price.toFixed(2)),
      aur: Number(aur.toFixed(2)),
      ...(promotion && { promotion: { type: promotion.type } })
    });
  }

  return data;
};

export const generateMockSalesHistory = (days: number = 7) => {
  const data = [];
  const baseSales = Math.floor(Math.random() * 1000) + 100; // Random base between 100-1100

  for (let i = 0; i < days; i++) {
    const date = addDays(new Date(), -days + i);
    const variation = (Math.random() - 0.5) * 200; // Random variation ±100
    const sales = Math.max(0, Math.round(baseSales + variation));

    data.push({
      date: format(date, 'MMM dd'),
      sales,
    });
  }

  return data;
};
