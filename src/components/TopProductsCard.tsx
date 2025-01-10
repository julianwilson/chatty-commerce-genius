import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types/product";

interface TopProductsCardProps {
  products: Product[];
}

export function TopProductsCard({ products }: TopProductsCardProps) {
  const navigate = useNavigate();
  
  if (!products?.length) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Top Products Sold</CardTitle>
          <CardDescription>Most popular products in this promotion</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No products available
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Top Products Sold</CardTitle>
        <CardDescription>Most popular products in this promotion</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 5).map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
            >
              {product.images[0] && (
                <img
                  src={product.images[0].src}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-medium">{product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  ${Number(product.variants[0]?.price || 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}