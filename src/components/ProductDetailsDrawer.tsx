import { Product } from "@/types/product";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "recharts";
import { generateMockSalesData } from "@/lib/mockData";
import { useState } from "react";

interface ProductDetailsDrawerProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailsDrawer({ product, open, onClose }: ProductDetailsDrawerProps) {
  const salesData = generateMockSalesData(30);
  const [selectedVariant, setSelectedVariant] = useState<string>("all");

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

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <DrawerTitle>{product.title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <div className="w-full max-w-xs">
            <Select
              value={selectedVariant}
              onValueChange={setSelectedVariant}
            >
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
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      label={{ 
                        value: 'Sales ($)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      label={{ 
                        value: 'Price ($)', 
                        angle: 90, 
                        position: 'insideRight',
                        style: { textAnchor: 'middle' }
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
                      data={salesData.filter(d => d.promotion)}
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
      </DrawerContent>
    </Drawer>
  );
}