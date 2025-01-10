import React from "react";
import { Command } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      // TODO: Implement global search functionality
      console.log("Global search triggered");
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown as any);
    return () => document.removeEventListener("keydown", handleKeyDown as any);
  }, []);

  return (
    <div className="relative w-full max-w-lg">
      <Input
        type="text"
        placeholder="Search..."
        className="w-full pl-4 pr-12"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <div className="flex items-center text-sm text-muted-foreground">
          <Command className="w-4 h-4 mr-1" />
          <span>K</span>
        </div>
      </div>
    </div>
  );
};