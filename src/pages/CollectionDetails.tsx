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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    
    const salesPercentage = (Math.random() * (12 - 7) + 7).toFixed(1);
    
    data.push({
      month: monthYear,
      salesPercentage: parseFloat(salesPercentage)
    });
  }
  
  return data;
};

const monthlySalesData = generateSalesPercentageData();

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
    
    const sales = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
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
  const [dateRange, setDateRange] = useState("30d");
  const dailySalesData = generateDailySalesData();
  const monthlySalesData = generateSalesPercentageData();

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

  const getFilteredSalesData = (range: string) => {
    const now = new Date();
    let filteredData = [...dailySalesData];
    
    switch(range) {
      case "7d":
        filteredData = dailySalesData.slice(-7);
        break;
      case "14d":
        filteredData = dailySalesData.slice(-14);
        break;
      case "30d":
        filteredData = dailySalesData;
        break;
    }
    
    return filteredData;
  };

  const getFilteredPercentageData = (range: string) => {
    const now = new Date();
    let filteredData = [...monthlySalesData];
    
    switch(range) {
      case "3m":
        filteredData = monthlySalesData.slice(-3);
        break;
      case "6m":
        filteredData = monthlySalesData.slice(-6);
        break;
      case "12m":
        filteredData = monthlySalesData;
        break;
    }
    
    return filteredData;
  };

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
      data: getFilteredPercentageData(dateRange).map(data => data.salesPercentage),
      color: '#10B981'
    }],
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
      data: getFilteredSalesData(dateRange).map(data => data.sales),
      color: '#10B981'
    }, {
      name: 'Units',
      type: 'line',
      data: getFilteredSalesData(dateRange).map(data => data.units),
      yAxis: 1,
      color: '#6366F1'
    }],
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

  const mockProducts = [
    {
      id: 7664801349847,
      title: "Scentiment Diffuser Mini - The One Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-01T00:00:00Z",
      variants: [{
        id: 42758461776087,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_The_One_Fragrance_Oil.jpg" }],
    },
    {
      id: 7664801382615,
      title: "Scentiment Diffuser Mini - Vanilla Bean Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-02T00:00:00Z",
      variants: [{
        id: 42758461808855,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_Vanilla_Bean_Fragrance_Oil.jpg" }],
    },
    {
      id: 7664801415383,
      title: "Scentiment Diffuser Mini - Fresh Linen Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-03T00:00:00Z",
      variants: [{
        id: 42758461841623,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_Fresh_Linen_Fragrance_Oil.jpg" }],
    },
    {
      id: 7664801448151,
      title: "Scentiment Diffuser Mini - Ocean Breeze Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-04T00:00:00Z",
      variants: [{
        id: 42758461907159,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_Ocean_Breeze_Fragrance_Oil.jpg" }],
    },
    {
      id: 7664801480919,
      title: "Scentiment Diffuser Mini - Lavender Fields Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-05T00:00:00Z",
      variants: [{
        id: 42758461939927,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_Lavender_Fields_Fragrance_Oil.jpg" }],
    },
    {
      id: 7664801513687,
      title: "Scentiment Diffuser Mini - Sweet Pea Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-06T00:00:00Z",
      variants: [{
        id: 42758461939927,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_Sweet_Pea_Fragrance_Oil.jpg" }],
    },
    {
      id: 7664801546455,
      title: "Scentiment Diffuser Mini - Citrus Burst Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-07T00:00:00Z",
      variants: [{
        id: 42758461972695,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_Citrus_Burst_Fragrance_Oil.jpg" }],
    },
    {
      id: 7664801579223,
      title: "Scentiment Diffuser Mini - Coconut Paradise Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-08T00:00:00Z",
      variants: [{
        id: 42758462005463,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_Coconut_Paradise_Fragrance_Oil.jpg" }],
    },
    {
      id: 7664801611991,
      title: "Scentiment Diffuser Mini - Apple Cinnamon Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-09T00:00:00Z",
      variants: [{
        id: 42758462038231,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_Apple_Cinnamon_Fragrance_Oil.jpg" }],
    },
    {
      id: 7664801644759,
      title: "Scentiment Diffuser Mini - Eucalyptus Mint Fragrance Oil",
      product_type: "Diffuser",
      created_at: "2024-01-10T00:00:00Z",
      variants: [{
        id: 42758462070999,
        title: "Default Title",
        price: "24.99",
        compare_at_price: null,
        inventory_quantity: 100
      }],
      images: [{ src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/files/Scentiment_Diffuser_Mini_Eucalyptus_Mint_Fragrance_Oil.jpg" }],
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
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
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Collection Sales Analysis</CardTitle>
            <CardDescription>
              Sales and units performance
            </CardDescription>
          </div>
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
          <div>
            <CardTitle>% of Sales by Month</CardTitle>
            <CardDescription>
              Sales performance over time
            </CardDescription>
          </div>
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
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <HotNewArrivalsCard 
          products={mockProducts}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <SlowSellersCard 
        products={mockProducts}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
    </div>
  );
};

export default CollectionDetails;
