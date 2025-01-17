import React, { useState } from "react";
import { Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(true);
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown as any);
    return () => document.removeEventListener("keydown", handleKeyDown as any);
  }, []);

  // Mock products data - in a real app, this would come from your API
  const products = [
    {
      id: 7664801349847,
      title: "Scentiment Diffuser Mini - The One Fragrance Oil",
      product_type: "Diffuser",
    },
    {
      id: 7664801382615,
      title: "Scentiment Diffuser Mini - Vanilla Bean Fragrance Oil",
      product_type: "Diffuser",
    },
    {
      id: 7664801415383,
      title: "Scentiment Diffuser Mini - Fresh Linen Fragrance Oil",
      product_type: "Diffuser",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <div className="relative w-full max-w-lg">
        <Input
          type="text"
          placeholder="Search..."
          className="w-full pl-4 pr-12"
          onClick={() => setOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <div className="flex items-center text-sm text-muted-foreground">
            <Command className="w-4 h-4 mr-1" />
            <span>K</span>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="text"
              placeholder="Type to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
              autoFocus
            />
            <div className="mt-4 space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="font-medium">{product.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.product_type}
                  </div>
                </div>
              ))}
              {search && filteredProducts.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No products found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};