export const generateMockSalesData = (days: number) => {
  const data = [];
  const baseDate = new Date();
  
  // Pre-define 3 different AUR levels
  const aurLevels = [45, 35, 55];
  const changePoints = [Math.floor(days * 0.25), Math.floor(days * 0.6), Math.floor(days * 0.9)];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    
    // Determine which AUR level to use based on the day
    let currentAUR;
    if (i < changePoints[0]) {
      currentAUR = aurLevels[0];
    } else if (i < changePoints[1]) {
      currentAUR = aurLevels[1];
    } else {
      currentAUR = aurLevels[2];
    }
    
    const units = Math.floor(Math.random() * 100) + 20;
    const sales = units * currentAUR;
    const sessions = Math.floor(Math.random() * 1000) + 200;
    const impressions = sessions * (Math.floor(Math.random() * 3) + 2);
    const markdown = Math.floor(Math.random() * 30);
    
    data.unshift({
      date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      sales: sales,
      units: units,
      aur: currentAUR,
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