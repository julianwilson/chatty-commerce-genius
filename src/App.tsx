import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChatBox } from "@/components/ChatBox";
import { SearchBar } from "@/components/SearchBar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Promotions from "./pages/Promotions";
import PromotionDetails from "./pages/PromotionDetails";
import Collections from "./pages/Collections";
import Products from "./pages/Products";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex w-full">
          <ChatBox />
          <main className="flex-1">
            <div className="p-4 border-b">
              <SearchBar />
            </div>
            <div className="p-4">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/home" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/promotions/:id" element={<PromotionDetails />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/products" element={<Products />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;