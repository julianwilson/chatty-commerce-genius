import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatInterface } from "@/components/ChatInterface";
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
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <main className="flex-1 pb-[300px]">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/promotions" element={<Promotions />} />
                  <Route path="/promotions/:id" element={<PromotionDetails />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/products" element={<Products />} />
                </Routes>
              </main>
              <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-white border-l border-t shadow-lg">
                <ChatInterface />
              </div>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;