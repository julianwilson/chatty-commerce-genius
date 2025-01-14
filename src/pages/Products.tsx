import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
import { Product } from "@/types/product";
import { MiniBarChart } from "@/components/MiniBarChart";
import { generateMockSalesData } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Products = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/products.json");
      const data = await response.json();
      return data.products as Product[];
    },
  });

  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/collections.json");
      const data = await response.json();
      return data.collections;
    },
  });

  const toggleRow = (productId: number) => {
    setExpandedRows((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredProducts = products?.filter((product) => {
    if (activeFilters.length === 0 && !selectedCollection) return true;
    
    let matchesFilter = true;
    if (activeFilters.length > 0) {
      if (activeFilters.includes("Hot New Arrivals")) {
        // Example logic: products created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchesFilter = matchesFilter && new Date(product.created_at) >= thirtyDaysAgo;
      }
      if (activeFilters.includes("Slow Sellers")) {
        // Example logic: products with low sales
        const salesData = generateMockSalesData(7);
        const averageSales = salesData.reduce((acc, curr) => acc + curr.value, 0) / salesData.length;
        matchesFilter = matchesFilter && averageSales < 5;
      }
    }

    if (selectedCollection) {
      matchesFilter = matchesFilter && product.collections?.includes(selectedCollection);
    }

    return matchesFilter;
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {["Hot New Arrivals", "Slow Sellers"].map((filter) => (
            <Badge
              key={filter}
              variant={activeFilters.includes(filter) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
        
        <Select
          value={selectedCollection}
          onValueChange={setSelectedCollection}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collections</SelectItem>
            {collections?.map((collection: any) => (
              <SelectItem key={collection.id} value={collection.id.toString()}>
                {collection.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Compare At Price</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Last 7 Days Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts?.map((product) => (
                <React.Fragment key={product.id}>
                  <TableRow>
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
                    <TableCell>
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {product.title}
                      </button>
                    </TableCell>
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
                    <TableCell>
                      <MiniBarChart data={generateMockSalesData(7)} />
                    </TableCell>
                  </TableRow>
                  {expandedRows.includes(product.id) && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="p-4 bg-muted/50">
                          <h3 className="font-semibold mb-2">Variants</h3>
                          <div className="grid grid-cols-3 gap-4">
                            {product.variants.map((variant) => (
                              <div
                                key={variant.id}
                                className="p-3 bg-background rounded-lg border"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{variant.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Price: ${Number(variant.price).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Slash Price:{" "}
                                      {variant.compare_at_price
                                        ? `$${Number(
                                            variant.compare_at_price
                                          ).toFixed(2)}`
                                        : "-"}
                                    </p>
                                  </div>
                                  <MiniBarChart data={generateMockSalesData(7)} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Products;
