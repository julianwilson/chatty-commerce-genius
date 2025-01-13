import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";

interface HotNewArrivalsCardProps {
  products: Product[];
}

export function HotNewArrivalsCard({ products }: HotNewArrivalsCardProps) {
  const navigate = useNavigate();

  if (!products?.length) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Hot New Arrivals</CardTitle>
          <CardDescription>Recently added products with high sales velocity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No new arrivals available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Hot New Arrivals</CardTitle>
        <CardDescription>Recently added products with high sales velocity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
