export const generateMockSalesData = (days: number) => {
  const data = [];
  const baseDate = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    
    const units = Math.floor(Math.random() * 100) + 20;
    const price = Math.floor(Math.random() * 50) + 30;
    const markdown = Math.floor(Math.random() * 30);
    const sales = units * (price * (1 - markdown / 100));
    const sessions = Math.floor(Math.random() * 1000) + 200;
    const impressions = sessions * (Math.floor(Math.random() * 3) + 2);
    
    data.unshift({
      date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      sales: sales,
      price: price,
      units: units,
      aur: sales / units,
      markdown: markdown,
      sessions: sessions,
      impressions: impressions,
      promotion: Math.random() > 0.8 ? {
        type: Math.random() > 0.5 ? '20% Off' : 'BOGO'
      } : null
    });
  }
  
  return data;
};