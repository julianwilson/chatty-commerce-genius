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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface PriceEditorState {
  variantId: number | null;
  column: "testA" | "control" | "testB" | null;
  price: string;
  compareAtPrice: string;
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

export function ProductsStep({ onNext, onBack }: ProductsStepProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([
    { id: "1", field: "", operator: "", value: "" },
  ]);
  const [priceEditor, setPriceEditor] = useState<PriceEditorState>({
    variantId: null,
    column: null,
    price: "",
    compareAtPrice: "",
  });

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

  const openPriceEditor = (
    variantId: number,
    column: "testA" | "control" | "testB",
    currentPrice: string,
    currentCompareAtPrice: string = ""
  ) => {
    setPriceEditor({
      variantId,
      column,
      price: currentPrice,
      compareAtPrice: currentCompareAtPrice,
    });
  };

  const closePriceEditor = () => {
    setPriceEditor({
      variantId: null,
      column: null,
      price: "",
      compareAtPrice: "",
    });
  };

  const handlePriceChange = (value: string) => {
    setPriceEditor((prev) => ({
      ...prev,
      price: value,
    }));
  };

  const handleCompareAtPriceChange = (value: string) => {
    setPriceEditor((prev) => ({
      ...prev,
      compareAtPrice: value,
    }));
  };

  const renderValueInput = (rule: FilterRule) => {
    if (rule.field === "collection" && rule.operator === "contains") {
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
    <div className="space-y-6">
      <div className="space-y-4">
        {filterRules.map((rule) => (
          <div key={rule.id} className="flex gap-4 items-center">
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
        <Table>
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
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductToggle(product.id)}
                      className="rounded border-gray-300"
                    />
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
                                  <Button
                                    variant="ghost"
                                    onClick={() => openPriceEditor(variant.id, "testA", variant.price, variant.compare_at_price || "")}
                                  >
                                    ${Number(variant.price).toFixed(2)}
                                    {variant.compare_at_price && (
                                      <span className="ml-2 text-sm text-muted-foreground line-through">
                                        ${Number(variant.compare_at_price).toFixed(2)}
                                      </span>
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    onClick={() => openPriceEditor(variant.id, "control", variant.price, variant.compare_at_price || "")}
                                  >
                                    ${Number(variant.price).toFixed(2)}
                                    {variant.compare_at_price && (
                                      <span className="ml-2 text-sm text-muted-foreground line-through">
                                        ${Number(variant.compare_at_price).toFixed(2)}
                                      </span>
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    onClick={() => openPriceEditor(variant.id, "testB", variant.price, variant.compare_at_price || "")}
                                  >
                                    ${Number(variant.price).toFixed(2)}
                                    {variant.compare_at_price && (
                                      <span className="ml-2 text-sm text-muted-foreground line-through">
                                        ${Number(variant.compare_at_price).toFixed(2)}
                                      </span>
                                    )}
                                  </Button>
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

      <Dialog
        open={priceEditor.variantId !== null}
        onOpenChange={() => closePriceEditor()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Price</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={priceEditor.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="Enter price"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="compareAtPrice" className="text-sm font-medium">
                Compare at Price
              </label>
              <Input
                id="compareAtPrice"
                type="number"
                step="0.01"
                value={priceEditor.compareAtPrice}
                onChange={(e) => handleCompareAtPriceChange(e.target.value)}
                placeholder="Enter compare at price"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
