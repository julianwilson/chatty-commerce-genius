import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { TopProductsCard } from "@/components/TopProductsCard";
import { TopDiscountCodesCard } from "@/components/TopDiscountCodesCard";
import { FrequentlyPurchasedCard } from "@/components/FrequentlyPurchasedCard";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PromotionAISummary } from "@/components/promotion/PromotionAISummary";

type PromotionType = 'Site Wide' | 'By Product' | 'By Collection';

const dailyData = [
  {
    date: "2025-01-01",
    sales: 5200,
    unitsSold: 104,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1200,
    impressions: 3600,
    aov: 150,
    adSpend: 1000,
  },
  {
    date: "2025-01-02",
    sales: 6100,
    unitsSold: 122,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1300,
    impressions: 3900,
    aov: 160,
    adSpend: 1200,
  },
  {
    date: "2025-01-03",
    sales: 5800,
    unitsSold: 116,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1250,
    impressions: 3750,
    aov: 155,
    adSpend: 1100,
  },
  {
    date: "2025-01-04",
    sales: 7200,
    unitsSold: 144,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1400,
    impressions: 4200,
    aov: 170,
    adSpend: 1400,
  },
  {
    date: "2025-01-05",
    sales: 6500,
    unitsSold: 130,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1350,
    impressions: 4050,
    aov: 165,
    adSpend: 1300,
  },
];

const previousPeriodData = [
  {
    date: "2025-01-01",
    sales: 4100,
    unitsSold: 82,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1000,
    impressions: 3000,
    aov: 140,
    adSpend: 900,
  },
  {
    date: "2025-01-02",
    sales: 4800,
    unitsSold: 96,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1100,
    impressions: 3300,
    aov: 145,
    adSpend: 1000,
  },
  {
    date: "2025-01-03",
    sales: 4600,
    unitsSold: 92,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1050,
    impressions: 3150,
    aov: 142,
    adSpend: 950,
  },
  {
    date: "2025-01-04",
    sales: 5700,
    unitsSold: 114,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1200,
    impressions: 3600,
    aov: 155,
    adSpend: 1150,
  },
  {
    date: "2025-01-05",
    sales: 5200,
    unitsSold: 104,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1150,
    impressions: 3450,
    aov: 150,
    adSpend: 1050,
  },
];

const PromotionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<PromotionType>('Site Wide');
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/products.json");
      const data = await response.json();
      return data.products as Product[];
    },
  });

  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/collections.json");
      const data = await response.json();
      return data.collections;
    },
  });

  const calculateMetrics = (type: PromotionType, itemId: string) => {
    if (type === 'Site Wide') {
      return {
        percentage: 0,
        currentValue: 0,
        previousValue: 0
      };
    }

    if (type === 'By Product') {
      return {
        percentage: itemId ? 15.5 : 8.2,
        currentValue: itemId ? 25000 : 12000,
        previousValue: itemId ? 21645 : 11090
      };
    }

    return {
      percentage: itemId ? 22.3 : 10.5,
      currentValue: itemId ? 45000 : 18000,
      previousValue: itemId ? 36795 : 16290
    };
  };

  const metrics = calculateMetrics(selectedType, selectedItemId);

  // Mock data for the new cards
  const mockDiscountCodes = [
    { code: "SUMMER25", usageCount: 156, discountAmount: 25 },
    { code: "FLASH15", usageCount: 89, discountAmount: 15 },
    { code: "SPECIAL20", usageCount: 67, discountAmount: 20 },
  ];

  const mockProductPairs = products ? [
    {
      product1: products[0],
      product2: products[1],
      purchaseCount: 45
    },
    {
      product1: products[2],
      product2: products[3],
      purchaseCount: 32
    },
  ] : [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <main className="flex-1 bg-background p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/promotions')}
              >
                ← Back
              </Button>
              <h1 className="text-2xl font-bold">Promotion Details</h1>
            </div>

            <div className="flex items-center gap-4 mb-8">
              {(['Site Wide', 'By Product', 'By Collection'] as PromotionType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => {
                    setSelectedType(type);
                    if (type === 'Site Wide') {
                      setSelectedItemId('');
                    }
                  }}
                >
                  {type}
                </Button>
              ))}

              {selectedType !== 'Site Wide' && (
                <Select
                  value={selectedItemId}
                  onValueChange={setSelectedItemId}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={`Select ${selectedType === 'By Product' ? 'product' : 'collection'}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedType === 'By Product' ? (
                      products?.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.title}
                        </SelectItem>
                      ))
                    ) : (
                      collections?.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id.toString()}>
                          {collection.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <MetricCard
                title="% of Total Sales"
                percentage={metrics.percentage}
                currentValue={metrics.currentValue}
                previousValue={metrics.previousValue}
                format="currency"
                disabled={selectedType === 'Site Wide'}
              />
            </div>

            <div className="mb-8">
              <PromotionAISummary
                dailyData={dailyData}
                previousPeriodData={previousPeriodData}
              />
            </div>

            <div className="bg-background rounded-lg shadow-sm border p-4 mb-8">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    type: 'line',
                    style: {
                      fontFamily: 'inherit'
                    }
                  },
                  title: {
                    text: 'Daily Sales & Ad Spend',
                    style: {
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }
                  },
                  xAxis: {
                    categories: dailyData.map(day => new Date(day.date).toLocaleDateString()),
                    labels: {
                      style: {
                        fontSize: '12px'
                      }
                    }
                  },
                  yAxis: [{
                    title: {
                      text: 'Sales ($)',
                      style: {
                        fontSize: '12px'
                      }
                    }
                  }, {
                    title: {
                      text: 'Ad Spend ($)',
                      style: {
                        fontSize: '12px'
                      }
                    },
                    opposite: true
                  }],
                  series: [
                    {
                      name: 'Current Period Sales',
                      data: dailyData.map(day => day.sales),
                      color: '#1D9BF0',
                      yAxis: 0
                    },
                    {
                      name: 'Same Period LY Sales',
                      data: previousPeriodData.map(day => day.sales),
                      color: '#71767B',
                      dashStyle: 'ShortDash',
                      yAxis: 0
                    },
                    {
                      name: 'Ad Spend',
                      data: dailyData.map(day => day.adSpend),
                      color: '#047857',
                      yAxis: 1
                    }
                  ],
                  tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>${point.y:,.2f}</b><br/>' +
                      'Units Sold: <b>{point.units}</b><br/>' +
                      'Average Unit Retail: <b>${point.aur}</b><br/>' +
                      'Average Markdown: <b>{point.markdown}%</b><br/>' +
                      'ROAS: <b>{point.roas}x</b>',
                    shared: true,
                    useHTML: true
                  },
                  plotOptions: {
                    series: {
                      point: {
                        events: {
                          mouseOver: function() {
                            const data = this.series.name.includes('Current Period') ? dailyData : previousPeriodData;
                            this.units = data[this.index].unitsSold;
                            this.aur = data[this.index].averageUnitRetail;
                            this.markdown = data[this.index].averageMarkdown;
                            this.roas = (data[this.index].sales / data[this.index].adSpend).toFixed(2);
                          }
                        }
                      }
                    }
                  },
                  credits: {
                    enabled: false
                  }
                }}
              />
            </div>

            <div className="bg-background rounded-lg shadow-sm border p-4 mb-8">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    type: 'line',
                    style: {
                      fontFamily: 'inherit'
                    }
                  },
                  title: {
                    text: 'Average Unit Retail & Units Sold',
                    style: {
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }
                  },
                  xAxis: {
                    categories: dailyData.map(day => new Date(day.date).toLocaleDateString()),
                    labels: {
                      style: {
                        fontSize: '12px'
                      }
                    }
                  },
                  yAxis: [{
                    title: {
                      text: 'Price ($)',
                      style: {
                        color: '#047857',
                        fontSize: '12px'
                      }
                    },
                    labels: {
                      style: {
                        color: '#047857'
                      }
                    }
                  }, {
                    title: {
                      text: 'Units Sold',
                      style: {
                        color: '#7C3AED',
                        fontSize: '12px'
                      }
                    },
                    opposite: true,
                    labels: {
                      style: {
                        color: '#7C3AED'
                      }
                    }
                  }],
                  series: [
                    {
                      name: 'Average Unit Retail',
                      data: dailyData.map(day => day.averageUnitRetail),
                      color: '#047857',
                      yAxis: 0
                    },
                    {
                      name: 'Units Sold',
                      data: dailyData.map(day => day.unitsSold),
                      color: '#7C3AED',
                      yAxis: 1
                    }
                  ],
                  tooltip: {
                    shared: true,
                    useHTML: true
                  },
                  credits: {
                    enabled: false
                  }
                }}
              />
            </div>

            <div className="bg-background rounded-lg shadow-sm border mb-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Sales ($)</TableHead>
                    <TableHead>Avg Unit Retail</TableHead>
                    <TableHead>Avg Markdown %</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>AOV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyData.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                      <TableCell>{day.unitsSold}</TableCell>
                      <TableCell>${day.sales.toLocaleString()}</TableCell>
                      <TableCell>${day.averageUnitRetail}</TableCell>
                      <TableCell>{day.averageMarkdown}%</TableCell>
                      <TableCell>{day.sessions.toLocaleString()}</TableCell>
                      <TableCell>{day.impressions.toLocaleString()}</TableCell>
                      <TableCell>${day.aov}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <TopProductsCard products={products || []} />
              <TopDiscountCodesCard discountCodes={mockDiscountCodes} />
            </div>

            <div className="max-w-2xl mx-auto">
              <FrequentlyPurchasedCard productPairs={mockProductPairs} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PromotionDetails;
