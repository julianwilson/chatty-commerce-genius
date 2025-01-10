import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Product } from "@/types/product";
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
import { useState } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState<string>("all");
  const salesData = generateMockSalesData(30);

  // Find dates where promotions start or end
  const promotionDates = salesData.reduce((acc: { date: string; type: string }[], curr, index, array) => {
    if (curr.promotion) {
      // Check if this is the start of a promotion
      if (index === 0 || !array[index - 1].promotion) {
        acc.push({ date: curr.date, type: 'Start: ' + curr.promotion.type });
      }
      // Check if this is the end of a promotion
      if (index === array.length - 1 || !array[index + 1].promotion) {
        acc.push({ date: curr.date, type: 'End: ' + curr.promotion.type });
      }
    }
    return acc;
  }, []);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/products.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`);
      }
      const data = await response.json();
      const foundProduct = data.products.find((p: Product) => p.id === Number(id));
      if (!foundProduct) {
        throw new Error("Product not found");
      }
      return foundProduct;
    },
  });

  const chartOptions: Highcharts.Options = {
    title: {
      text: ''
    },
    xAxis: {
      categories: salesData.map(d => d.date),
      plotLines: promotionDates.map((date, index) => ({
        value: salesData.findIndex(d => d.date === date.date),
        color: '#8884d8',
        dashStyle: 'Dash',
        width: 2,
        label: {
          text: date.type,
          rotation: 90,
          y: 10,
          style: {
            fontSize: '10px'
          }
        }
      }))
    },
    yAxis: [{
      title: {
        text: 'Sales ($)'
      }
    }, {
      title: {
        text: 'Price ($)'
      },
      opposite: true
    }],
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function(): string {
        const points = (this as any).points;
        if (!points) return '';
        
        const date = points[0].key;
        const dataPoint = salesData.find(d => d.date === date);
        
        let html = `<div style="padding: 8px;">
          <p style="font-weight: bold; margin-bottom: 4px;">${date}</p>`;
        
        if (dataPoint?.promotion) {
          html += `<p style="color: #666; font-size: 12px; margin-bottom: 4px;">
            ${dataPoint.promotion.type}
          </p>`;
        }
        
        html += `<div style="margin-top: 8px;">`;
        points.forEach((point: any) => {
          html += `<p style="margin: 2px 0;">
            ${point.series.name}: $${point.y.toFixed(2)}
          </p>`;
        });
        html += `</div></div>`;
        
        return html;
      }
    },
    series: [{
      name: 'Sales',
      type: 'line',
      data: salesData.map(d => d.sales),
      yAxis: 0,
      color: '#1E3A8A'
    }, {
      name: 'Price',
      type: 'line',
      data: salesData.map(d => d.price),
      yAxis: 1,
      color: '#10B981'
    }, {
      name: 'Avg Unit Retail',
      type: 'line',
      data: salesData.map(d => d.aur),
      yAxis: 1,
      color: '#8B5CF6'
    }, {
      name: 'Promotion',
      type: 'scatter',
      data: salesData.filter(d => d.promotion).map(d => ({
        x: salesData.findIndex(sd => sd.date === d.date),
        y: d.sales
      })),
      yAxis: 0,
      color: '#EF4444'
    }]
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
          <h1 className="text-2xl font-bold">Product Not Found</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The product you're looking for could not be found. It may have been removed or the URL might be incorrect.
          </AlertDescription>
        </Alert>

        <Button onClick={() => navigate("/products")}>
          Return to Products
        </Button>
      </div>
    );
  }

  if (!product) return null;

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
        <h1 className="text-2xl font-bold">{product.title}</h1>
      </div>

      <div className="w-full max-w-xs">
        <Select value={selectedVariant} onValueChange={setSelectedVariant}>
          <SelectTrigger>
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Variants</SelectItem>
            {product.variants.map((variant) => (
              <SelectItem key={variant.id} value={variant.id.toString()}>
                {variant.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales & Price Analysis</CardTitle>
          <CardDescription>
            30-day view of sales volume, price, and average unit retail
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
    </div>
  );
};

export default ProductDetails;