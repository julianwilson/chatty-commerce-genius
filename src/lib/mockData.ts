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

  // Define four price change points for AUR fluctuation
  const changePoints = [
    Math.floor(days * 0.2),  // 20% through
    Math.floor(days * 0.4),  // 40% through
    Math.floor(days * 0.6),  // 60% through
    Math.floor(days * 0.8),  // 80% through
  ];

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
    let price = basePrice;
    
    // Calculate AUR with fluctuations
    let aurMultiplier = 0.95; // Default 5% lower than price
    
    if (i < changePoints[0]) {
      aurMultiplier = 0.95;
    } else if (i < changePoints[1]) {
      aurMultiplier = 0.85; // 15% lower
    } else if (i < changePoints[2]) {
      aurMultiplier = 0.98; // 2% lower
    } else if (i < changePoints[3]) {
      aurMultiplier = 0.88; // 12% lower
    } else {
      aurMultiplier = 0.92; // 8% lower
    }
    
    const aur = price * aurMultiplier;
    
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
