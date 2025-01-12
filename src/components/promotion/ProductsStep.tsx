import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/types/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ProductsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ProductsStep({ onNext, onBack }: ProductsStepProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

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

  const toggleRow = (productId: number) => {
    setExpandedRows((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[500px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <>
                <TableRow key={product.id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRow(product.id)}
                    >
                      {expandedRows.includes(product.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductToggle(product.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.product_type}</TableCell>
                  <TableCell>
                    ${Number(product.variants[0]?.price || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
                {expandedRows.includes(product.id) && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="p-4 bg-muted/50">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Variant</TableHead>
                              <TableHead>Test A</TableHead>
                              <TableHead>Control</TableHead>
                              <TableHead>Test B</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {product.variants.map((variant) => (
                              <TableRow key={variant.id}>
                                <TableCell>{variant.title}</TableCell>
                                <TableCell>
                                  ${Number(variant.price).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  ${Number(variant.price).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  ${Number(variant.price).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

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