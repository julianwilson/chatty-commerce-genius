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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ReferenceDot,
} from "recharts";
import { generateMockSalesData } from "@/lib/mockData";
import { useState } from "react";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState<string>("all");
  const salesData = generateMockSalesData(30);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`https://scentiment.com/products/${id}.json`);
      if (!response.ok) {
        throw new Error(`Product not found (${response.status})`);
      }
      const data = await response.json();
      return data.product as Product;
    },
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.date}</p>
          {payload[0].payload.promotion && (
            <p className="text-xs text-muted-foreground mt-1">
              {payload[0].payload.promotion.type}
            </p>
          )}
          <div className="mt-2">
            <p className="text-sm">Sales: ${payload[0].payload.sales}</p>
            <p className="text-sm">Price: ${payload[0].payload.price}</p>
          </div>
        </div>
      );
    }
    return null;
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
            30-day view of sales volume and average unit price
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} height={60}>
                  {salesData.map((entry, index) => {
                    if (entry.promotion) {
                      return (
                        <ReferenceDot
                          key={index}
                          x={entry.date}
                          y={0}
                          r={4}
                          fill="#EF4444"
                          stroke="none"
                          isFront={true}
                        />
                      );
                    }
                    return null;
                  })}
                </XAxis>
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Sales ($)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Price ($)",
                    angle: 90,
                    position: "insideRight",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#1E3A8A"
                  name="Sales"
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="price"
                  stroke="#10B981"
                  name="Price"
                  dot={false}
                />
                <Scatter
                  yAxisId="left"
                  data={salesData.filter((d) => d.promotion)}
                  dataKey="sales"
                  fill="#EF4444"
                  name="Promotion"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;