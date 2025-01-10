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

const CollectionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const salesData = generateMockSalesData(30);

  const { data: collection, isLoading, isError } = useQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      // For now, we'll use the mock data from Collections page
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
      categories: salesData.map(d => d.date)
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
      formatter: function() {
        if (!this.points) return '';
        
        const date = this.points[0].key;
        let html = `<div style="padding: 8px;">
          <p style="font-weight: bold; margin-bottom: 4px;">${date}</p>`;
        
        html += `<div style="margin-top: 8px;">`;
        this.points.forEach(point => {
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
            30-day view of collection sales performance
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

export default CollectionDetails;