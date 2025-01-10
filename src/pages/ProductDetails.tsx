import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateMockSalesData } from "@/lib/mockData";
import { useState } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { parse, isWithinInterval } from 'date-fns';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [selectedVariant, setSelectedVariant] = useState<string>("all");
  
  const promotionStartDate = location.state?.startDate;
  const promotionEndDate = location.state?.endDate;

  const allSalesData = generateMockSalesData(30);
  const salesData = promotionStartDate && promotionEndDate
    ? allSalesData.filter(dataPoint => {
        const currentDate = parse(dataPoint.date, 'MMM dd', new Date());
        const startDate = parse(promotionStartDate, 'MMM dd yyyy', new Date());
        const endDate = parse(promotionEndDate, 'MMM dd yyyy', new Date());
        
        return isWithinInterval(currentDate, { start: startDate, end: endDate });
      })
    : allSalesData;

  const salesChartOptions: Highcharts.Options = {
    title: { text: '' },
    xAxis: {
      categories: salesData.map(d => d.date)
    },
    yAxis: {
      title: { text: 'Sales ($)' }
    },
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
      color: '#1E3A8A'
    }]
  };

  const performanceChartOptions: Highcharts.Options = {
    title: { text: '' },
    xAxis: {
      categories: salesData.map(d => d.date)
    },
    yAxis: [{
      title: { text: 'Average Unit Retail ($)' }
    }, {
      title: { text: 'Units' },
      opposite: true
    }],
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function(): string {
        const points = (this as any).points;
        if (!points) return '';
        return `<div style="padding: 8px;">
          <p style="font-weight: bold; margin-bottom: 4px;">${points[0].key}</p>
          <div style="margin-top: 8px;">
            ${points.map((point: any) => `
              <p style="margin: 2px 0;">
                ${point.series.name}: ${point.series.name === 'Units' ? point.y : '$' + point.y.toFixed(2)}
              </p>
            `).join('')}
          </div>
        </div>`;
      }
    },
    series: [{
      name: 'AUR',
      type: 'line',
      data: salesData.map(d => d.aur),
      color: '#8B5CF6',
      yAxis: 0
    }, {
      name: 'Units',
      type: 'line',
      data: salesData.map(d => d.units),
      color: '#10B981',
      yAxis: 1
    }]
  };

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
          <CardTitle>Units & Average Unit Retail (AUR)</CardTitle>
          <CardDescription>
            {promotionStartDate && promotionEndDate 
              ? `Performance data from ${promotionStartDate} to ${promotionEndDate}`
              : '30-day view of units sold and AUR'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={performanceChartOptions}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Analysis</CardTitle>
          <CardDescription>
            {promotionStartDate && promotionEndDate 
              ? `Sales data from ${promotionStartDate} to ${promotionEndDate}`
              : '30-day view of sales'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={salesChartOptions}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
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
              {salesData.map((row) => (
                <TableRow key={row.date}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.units}</TableCell>
                  <TableCell>${row.sales.toFixed(2)}</TableCell>
                  <TableCell>${row.aur.toFixed(2)}</TableCell>
                  <TableCell>{row.markdown}%</TableCell>
                  <TableCell>{row.sessions}</TableCell>
                  <TableCell>{row.impressions}</TableCell>
                  <TableCell>${(row.sales / row.units).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;