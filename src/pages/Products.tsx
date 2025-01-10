import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface Variant {
  id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  inventory_quantity: number;
}

interface Product {
  id: number;
  title: string;
  product_type: string;
  created_at: string;
  variants: Variant[];
  images: { src: string }[];
}

const Products = () => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/products.json");
      const data = await response.json();
      return data.products as Product[];
    },
  });

  const toggleRow = (productId: number) => {
    setExpandedRows((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Slash Price</TableHead>
              <TableHead>Date Created</TableHead>
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
                    {product.images[0] && (
                      <img
                        src={product.images[0].src}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.product_type}</TableCell>
                  <TableCell>
                    ${Number(product.variants[0]?.price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {product.variants[0]?.compare_at_price
                      ? `$${Number(
                          product.variants[0].compare_at_price
                        ).toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(product.created_at), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
                {expandedRows.includes(product.id) && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="p-4 bg-muted/50">
                        <h3 className="font-semibold mb-2">Variants</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {product.variants.map((variant) => (
                            <div
                              key={variant.id}
                              className="p-3 bg-background rounded-lg border"
                            >
                              <p className="font-medium">{variant.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Price: ${Number(variant.price).toFixed(2)}
                              </p>
                              {variant.compare_at_price && (
                                <p className="text-sm text-muted-foreground">
                                  Compare at: $
                                  {Number(variant.compare_at_price).toFixed(2)}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                Stock: {variant.inventory_quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Products;