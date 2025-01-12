import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/types/product";

interface ProductsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ProductsStep({ onNext, onBack }: ProductsStepProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/products.json");
      const data = await response.json();
      return data.products as Product[];
    },
  });

  const handleProductToggle = (productId: number) => {
    setSelectedProducts((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <ScrollArea className="h-[400px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {products?.map((product) => (
              <div
                key={product.id}
                className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleProductToggle(product.id)}
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor={`product-${product.id}`}
                  className="flex-1 cursor-pointer"
                >
                  {product.title}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={selectedProducts.length === 0}>
          Next
        </Button>
      </div>
    </div>
  );
}