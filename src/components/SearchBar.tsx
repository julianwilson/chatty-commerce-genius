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

  // Mock data - in a real app, this would come from your API
  const products = [
    {
      id: 7664801349847,
      title: "Scentiment Diffuser Mini - The One Fragrance Oil",
      product_type: "Diffuser",
      type: "product"
    },
    {
      id: 7664801382615,
      title: "Scentiment Diffuser Mini - Vanilla Bean Fragrance Oil",
      product_type: "Diffuser",
      type: "product"
    },
    {
      id: 7664801415383,
      title: "Scentiment Diffuser Mini - Fresh Linen Fragrance Oil",
      product_type: "Diffuser",
      type: "product"
    },
  ];

  const experiments = [
    { id: 1, title: "Dresses price test", type: "experiment" },
    { id: 2, title: "Free shipping threshold", type: "experiment" },
    { id: 3, title: "Product description length", type: "experiment" },
  ];

  const promotions = [
    { id: 1, title: "Summer dresses sale", type: "promotion" },
    { id: 2, title: "Winter clearance", type: "promotion" },
    { id: 3, title: "Valentine's special", type: "promotion" },
  ];

  const recipes = [
    { id: 1, title: "Increase Compare At Price 25% Site Wide", type: "recipe" },
    { id: 2, title: "BOGO on Spring Collection", type: "recipe" },
    { id: 3, title: "30% Off Winter Items", type: "recipe" },
  ];

  const allItems = [
    ...products.map(p => ({ ...p, title: p.title, id: p.id })),
    ...experiments.map(e => ({ ...e, title: e.title, id: e.id })),
    ...promotions.map(p => ({ ...p, title: p.title, id: p.id })),
    ...recipes.map(r => ({ ...r, title: r.title, id: r.id }))
  ];

  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleItemClick = (item: any) => {
    switch (item.type) {
      case "product":
        navigate(`/products/${item.id}`);
        break;
      case "experiment":
        navigate(`/experiments/${item.id}`);
        break;
      case "promotion":
        navigate(`/promotions/${item.id}`);
        break;
      case "recipe":
        navigate(`/recipes/${item.id}`);
        break;
    }
    setOpen(false);
    setSearch("");
  };

  const getItemSubtext = (item: any) => {
    switch (item.type) {
      case "product":
        return item.product_type;
      case "experiment":
        return "Experiment";
      case "promotion":
        return "Promotion";
      case "recipe":
        return "Recipe";
      default:
        return "";
    }
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
            <DialogTitle>Search</DialogTitle>
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
              {filteredItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {getItemSubtext(item)}
                  </div>
                </div>
              ))}
              {search && filteredItems.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No results found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};