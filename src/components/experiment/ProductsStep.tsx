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
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductsStepProps {
  onNext: () => void;
  onBack: () => void;
  initialFilters?: FilterRule[];
}

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Collection {
  id: number;
  title: string;
}

const FIELD_OPTIONS = [
  { value: "collection", label: "Collection" },
  { value: "productTitle", label: "Product Title" },
  { value: "productPrice", label: "Product Price" },
  { value: "productTags", label: "Product Tags" },
];

const OPERATOR_OPTIONS = [
  { value: "contains", label: "Contains" },
  { value: "doesNotContain", label: "Does not contain" },
];

export function ProductsStep({ onNext, onBack, initialFilters }: ProductsStepProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [filterRules, setFilterRules] = useState<FilterRule[]>(() => 
    initialFilters || [{ id: "1", field: "", operator: "", value: "" }]
  );

  const { data: products } = useQuery({
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
      return data.collections as Collection[];
    },
  });

  const removeProduct = (productId: number) => {
    setSelectedProducts((current) =>
      current.filter((id) => id !== productId)
    );
    const productVariants = products?.find(p => p.id === productId)?.variants.map(v => v.id) || [];
    setSelectedVariants(current => 
      current.filter(id => !productVariants.includes(id))
    );
  };

  const removeVariant = (variantId: number) => {
    setSelectedVariants(current =>
      current.filter(id => id !== variantId)
    );
  };

  const toggleRow = (productId: number) => {
    setExpandedRows((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const addFilterRule = () => {
    const newRule: FilterRule = {
      id: Date.now().toString(),
      field: "",
      operator: "",
      value: "",
    };
    setFilterRules([...filterRules, newRule]);
  };

  const removeFilterRule = (id: string) => {
    setFilterRules(filterRules.filter((rule) => rule.id !== id));
  };

  const updateFilterRule = (
    id: string,
    field: keyof FilterRule,
    value: string
  ) => {
    setFilterRules(
      filterRules.map((rule) =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const renderValueInput = (rule: FilterRule) => {
    if (rule.field === "collection" && (rule.operator === "contains" || rule.operator === "doesNotContain")) {
      return (
        <Select
          value={rule.value}
          onValueChange={(value) => updateFilterRule(rule.id, "value", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select collection" />
          </SelectTrigger>
          <SelectContent>
            {collections?.map((collection) => (
              <SelectItem 
                key={collection.id} 
                value={collection.id.toString()}
              >
                {collection.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        placeholder="Value"
        value={rule.value}
        onChange={(e) => updateFilterRule(rule.id, "value", e.target.value)}
        className="w-[200px]"
      />
    );
  };

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-4 w-full">
        {filterRules.map((rule) => (
          <div key={rule.id} className="flex gap-4 items-center w-full">
            <Select
              value={rule.field}
              onValueChange={(value) => updateFilterRule(rule.id, "field", value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Product Rules" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={rule.operator}
              onValueChange={(value) =>
                updateFilterRule(rule.id, "operator", value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {OPERATOR_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {renderValueInput(rule)}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFilterRule(rule.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={addFilterRule}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Filter
        </Button>
      </div>

      <ScrollArea className="h-[500px] w-full rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Type</TableHead>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(product.id)}
                    >
                      <X className="h-4 w-4 text-destructive hover:text-destructive/90" />
                    </Button>
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.product_type}</TableCell>
                </TableRow>
                {expandedRows.includes(product.id) && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="p-4 bg-muted/50">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead>Variant</TableHead>
                              <TableHead>Test A</TableHead>
                              <TableHead>Control</TableHead>
                              <TableHead>Test B</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {product.variants.map((variant) => {
                              const originalPrice = Number(variant.price);
                              const testAPrice = originalPrice * 1.2; // 20% increase for Test A
                              const testBPrice = originalPrice * 0.8; // 20% decrease for Test B
                              
                              return (
                                <TableRow key={variant.id}>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeVariant(variant.id)}
                                    >
                                      <X className="h-4 w-4 text-destructive hover:text-destructive/90" />
                                    </Button>
                                  </TableCell>
                                  <TableCell>{variant.title}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span>${testAPrice.toFixed(2)}</span>
                                      {variant.compare_at_price && (
                                        <span className="text-sm text-muted-foreground line-through">
                                          ${Number(variant.compare_at_price).toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span>${originalPrice.toFixed(2)}</span>
                                      {variant.compare_at_price && (
                                        <span className="text-sm text-muted-foreground line-through">
                                          ${Number(variant.compare_at_price).toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span>${testBPrice.toFixed(2)}</span>
                                      {variant.compare_at_price && (
                                        <span className="text-sm text-muted-foreground line-through">
                                          ${Number(variant.compare_at_price).toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
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
        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
