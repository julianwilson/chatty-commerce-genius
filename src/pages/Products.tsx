import React from "react";
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

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Classic Perfume",
    product_type: "Fragrance",
    created_at: "2024-01-15T00:00:00Z",
    variants: [
      {
        id: 1,
        title: "30ml",
        price: "59.99",
        compare_at_price: "69.99",
        inventory_quantity: 100
      }
    ],
    images: [{ src: "/placeholder.svg" }]
  },
  {
    id: 2,
    title: "Luxury Cologne",
    product_type: "Fragrance",
    created_at: "2024-02-01T00:00:00Z",
    variants: [
      {
        id: 2,
        title: "50ml",
        price: "89.99",
        compare_at_price: "99.99",
        inventory_quantity: 75
      }
    ],
    images: [{ src: "/placeholder.svg" }]
  }
];

const mockCollections = [
  { id: "1", title: "Summer Collection" },
  { id: "2", title: "Winter Collection" }
];

const Products = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

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

  const filteredProducts = mockProducts.filter((product) => {
    if (activeFilters.length === 0 && !selectedCollection) return true;
    
    let matchesFilter = true;
    if (activeFilters.length > 0) {
      if (activeFilters.includes("Hot New Arrivals")) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchesFilter = matchesFilter && new Date(product.created_at) >= thirtyDaysAgo;
      }
      if (activeFilters.includes("Slow Sellers")) {
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
            {mockCollections.map((collection) => (
              <SelectItem key={collection.id} value={collection.id}>
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
                <TableHead>Slash Price</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Last 7 Days Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
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
