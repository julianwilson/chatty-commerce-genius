import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types/product";

interface ProductPair {
  product1: Product;
  product2: Product;
  purchaseCount: number;
}

interface FrequentlyPurchasedCardProps {
  productPairs: ProductPair[];
}

export function FrequentlyPurchasedCard({ productPairs }: FrequentlyPurchasedCardProps) {
  const navigate = useNavigate();

  if (!productPairs?.length) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Most Frequently Purchased Together</CardTitle>
          <CardDescription>Products commonly bought together in this promotion</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No product pairs available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Most Frequently Purchased Together</CardTitle>
        <CardDescription>Products commonly bought together in this promotion</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productPairs.map((pair, index) => (
            <div
              key={`${pair.product1.id}-${pair.product2.id}`}
              className="p-3 rounded-lg border hover:bg-muted/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="text-sm text-muted-foreground">
                  {pair.purchaseCount} times together
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[pair.product1, pair.product2].map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {product.images[0] && (
                      <img
                        src={product.images[0].src}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium line-clamp-1">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${Number(product.variants[0]?.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}