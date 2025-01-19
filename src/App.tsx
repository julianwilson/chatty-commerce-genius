import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { ChatProvider, useChat } from "@/components/chat/ChatProvider";
import Dashboard from "./pages/Dashboard";
import Promotions from "./pages/Promotions";
import PromotionsEmpty from "./pages/PromotionsEmpty";
import CreatePromotion from "./pages/CreatePromotion";
import PromotionDetails from "./pages/PromotionDetails";
import Collections from "./pages/Collections";
import CollectionDetails from "./pages/CollectionDetails";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Experiments from "./pages/Experiments";
import ExperimentsEmpty from "./pages/ExperimentsEmpty";
import CreateExperiment from "./pages/CreateExperiment";
import ExperimentDetails from "./pages/ExperimentDetails";
import Recipes from "./pages/Recipes";
import SalesPlan from "./pages/SalesPlan";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

function MainContent() {
  const { isCollapsed } = useChat();
  
  return (
    <div className="flex min-h-screen">
      <div className="flex-none">
        <AppSidebar />
      </div>
      <main 
        className="flex-1 w-full min-w-[1024px] transition-all duration-300 fixed top-0 bottom-0 overflow-auto"
        style={{ 
          left: isCollapsed ? '112px' : '464px',
          right: 0
        }}
      >
        <div className="px-2 py-3 border-b bg-background sticky top-0 z-10">
          <SearchBar />
        </div>
        <div className="max-w-[1280px] px-2 py-3 pl-0 ml-12 mt-12">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/promotions/empty" element={<PromotionsEmpty />} />
            <Route path="/promotions/create" element={<CreatePromotion />} />
            <Route path="/promotions/:id" element={<PromotionDetails />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:id" element={<CollectionDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/experiments/empty" element={<ExperimentsEmpty />} />
            <Route path="/experiments/create" element={<CreateExperiment />} />
            <Route path="/experiments/:id" element={<ExperimentDetails />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/sales-plan" element={<SalesPlan />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={false}>
          <ChatProvider>
            <MainContent />
          </ChatProvider>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;