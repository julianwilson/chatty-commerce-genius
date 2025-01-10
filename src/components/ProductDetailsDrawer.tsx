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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generateMockSalesData } from "@/lib/mockData";

interface ProductDetailsDrawerProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailsDrawer({ product, open, onClose }: ProductDetailsDrawerProps) {
  const salesData = generateMockSalesData(30);

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
        <div className="px-4">
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
                    <Tooltip />
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