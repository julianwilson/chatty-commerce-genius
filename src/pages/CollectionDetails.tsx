import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateMockSalesData } from "@/lib/mockData";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HotNewArrivalsCard } from "@/components/collection/HotNewArrivalsCard";
import { SlowSellersCard } from "@/components/collection/SlowSellersCard";
import { TopSellersCard } from "@/components/collection/TopSellersCard";
import { useState } from "react";

const generateSalesPercentageData = () => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    
    const monthYear = date.toLocaleDateString('en-US', { 
      month: 'short',
      year: 'numeric'
    });
    
    // Generate a random percentage between 7 and 12
    const salesPercentage = (Math.random() * (12 - 7) + 7).toFixed(1);
    
    data.push({
      month: monthYear,
      salesPercentage: parseFloat(salesPercentage)
    });
  }
  
  return data;
};

const monthlySalesData = generateSalesPercentageData();

// Generate last 30 days of sales and units data
const generateDailySalesData = () => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(currentDate.getDate() - i);
    
    const dayMonth = date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
    
    // Generate random sales between $1000 and $5000
    const sales = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
    // Generate random units between 10 and 50
    const units = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    
    data.push({
      date: dayMonth,
      sales,
      units
    });
  }
  
  return data;
};

const CollectionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [topSellersDateRange, setTopSellersDateRange] = useState("30d");
  const dailySalesData = generateDailySalesData();

  const { data: collection, isLoading, isError } = useQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      const collectionsData = [
        {
          id: 288699203767,
          title: "All",
          active: true,
          products_count: 0,
          src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/collections/MiniDiffuserLifestyle_16x9_1bec500e-d040-450d-84a8-6a57231486bd.jpg?v=1725958098",
        },
        {
          id: 288699236535,
          title: "Best Sellers",
          active: true,
          products_count: 0,
          src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/collections/EDITION.jpg?v=1657747985",
        },
        {
          id: 288699269303,
          title: "Candles",
          active: true,
          products_count: 0,
          src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/collections/Scentiment_Diffuser_Mini_The_One_Fragrance_Oil.jpg?v=1733336485",
        }
      ];
      
      const foundCollection = collectionsData.find(c => c.id === Number(id));
      if (!foundCollection) {
        throw new Error("Collection not found");
      }
      return foundCollection;
    },
  });

  const chartOptions: Highcharts.Options = {
    title: {
      text: ''
    },
    xAxis: {
      categories: monthlySalesData.map(data => data.month),
      labels: {
        style: {
          color: 'var(--foreground)'
        }
      }
    },
    yAxis: {
      title: {
        text: '% of Sales',
        style: {
          color: 'var(--foreground)'
        }
      },
      labels: {
        format: '{value}%',
        style: {
          color: 'var(--foreground)'
        }
      }
    },
    series: [{
      type: 'line',
      name: '% of Sales',
      data: monthlySalesData.map(data => data.salesPercentage),
      color: '#10B981'
    }],
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function(this: any): string {
        return `<b>${this.x}</b><br/>${this.y}%`;
      }
    },
    legend: {
      itemStyle: {
        color: 'var(--foreground)'
      }
    }
  };

  const salesAnalysisOptions: Highcharts.Options = {
    title: {
      text: ''
    },
    xAxis: {
      categories: dailySalesData.map(data => data.date),
      labels: {
        style: {
          color: 'var(--foreground)'
        }
      }
    },
    yAxis: [{
      title: {
        text: 'Gross Sales ($)',
        style: {
          color: 'var(--foreground)'
        }
      },
      labels: {
        format: '${value}',
        style: {
          color: 'var(--foreground)'
        }
      }
    }, {
      title: {
        text: 'Units Sold',
        style: {
          color: 'var(--foreground)'
        }
      },
      opposite: true,
      labels: {
        style: {
          color: 'var(--foreground)'
        }
      }
    }],
    series: [{
      name: 'Gross Sales',
      type: 'line',
      data: dailySalesData.map(data => data.sales),
      color: '#10B981'
    }, {
      name: 'Units',
      type: 'line',
      data: dailySalesData.map(data => data.units),
      yAxis: 1,
      color: '#6366F1'
    }],
    credits: {
      enabled: false
    },
    tooltip: {
      shared: true,
      formatter: function(this: any): string {
        return `<b>${this.x}</b><br/>
                Gross Sales: $${this.points[0].y}<br/>
                Units: ${this.points[1].y}`;
      }
    },
    legend: {
      itemStyle: {
        color: 'var(--foreground)'
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-[400px] bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Collection Not Found</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The collection you're looking for could not be found. It may have been removed or the URL might be incorrect.
          </AlertDescription>
        </Alert>

        <Button onClick={() => navigate("/collections")}>
          Return to Collections
        </Button>
      </div>
    );
  }

  if (!collection) return null;

  // Mock data for the new cards
  const mockProducts = [
    {
      id: 1,
      title: "Sample Product 1",
      product_type: "Physical",
      created_at: "2024-01-01T00:00:00Z",
      variants: [{ price: "29.99" }],
      images: [{ src: "https://via.placeholder.com/150" }],
    },
    {
      id: 2,
      title: "Sample Product 2",
      product_type: "Physical",
      created_at: "2024-01-02T00:00:00Z",
      variants: [{ price: "39.99" }],
      images: [{ src: "https://via.placeholder.com/150" }],
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{collection.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Sales Analysis</CardTitle>
          <CardDescription>
            Last 30 days of sales and units performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={salesAnalysisOptions}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>% of Sales by Month</CardTitle>
          <CardDescription>
            Last 12 months of sales performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopSellersCard 
          products={mockProducts}
          dateRange={topSellersDateRange}
          onDateRangeChange={setTopSellersDateRange}
        />
        <HotNewArrivalsCard products={mockProducts} />
      </div>

      <SlowSellersCard products={mockProducts} />
    </div>
  );
};

export default CollectionDetails;
