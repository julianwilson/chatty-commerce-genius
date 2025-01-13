import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TopSellersCardProps {
  products: Product[];
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export function TopSellersCard({ products, dateRange, onDateRangeChange }: TopSellersCardProps) {
  const navigate = useNavigate();

  const getCompressedImageUrl = (url: string) => {
    if (!url) return '';
    const [pathPart, queryPart] = url.split('?');
    const extension = pathPart.match(/\.[^.]+$/)?.[0] || '';
    const basePath = pathPart.slice(0, -extension.length);
    return `${basePath}_200x200${extension}?${queryPart}`;
  };

  if (!products?.length) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Top Sellers</CardTitle>
            <CardDescription>Best performing products by sales</CardDescription>
          </div>
          <Select value={dateRange} onValueChange={onDateRangeChange}>
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
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No top sellers available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Top Sellers</CardTitle>
          <CardDescription>Best performing products by sales</CardDescription>
        </div>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 5).map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
            >
              {product.variants[0]?.src && (
                <img
                  src={getCompressedImageUrl(product.variants[0].src)}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-medium">{product.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}