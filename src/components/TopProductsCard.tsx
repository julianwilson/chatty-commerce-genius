import { useState } from "react";
import { Product } from "@/types/product";
import { ProductDetailsDrawer } from "@/components/ProductDetailsDrawer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export function TopProductsCard() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/products.json");
      const data = await response.json();
      // For demo purposes, we'll just take the first 5 products
      return data.products.slice(0, 5) as Product[];
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Top Products Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products?.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <img
                  src={product.images[0]?.src}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
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

      {selectedProduct && (
        <ProductDetailsDrawer
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}