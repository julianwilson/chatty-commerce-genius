import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { ChatBox } from "@/components/ChatBox";
import Dashboard from "./pages/Dashboard";
import Promotions from "./pages/Promotions";
import PromotionsEmpty from "./pages/PromotionsEmpty";
import CreatePromotion from "./pages/CreatePromotion";
import PromotionDetails from "./pages/PromotionDetails";
import Collections from "./pages/Collections";
import CollectionDetails from "./pages/CollectionDetails";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Chat from "./pages/Chat";
import Experiments from "./pages/Experiments";
import ExperimentsEmpty from "./pages/ExperimentsEmpty";
import CreateExperiment from "./pages/CreateExperiment";
import ExperimentDetails from "./pages/ExperimentDetails";
import Recipes from "./pages/Recipes";
import SalesPlan from "./pages/SalesPlan";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={false}>
          <div className="min-h-screen">
            <AppSidebar />
            <main className="ml-[var(--sidebar-width-icon)] flex-1 pr-[400px]">
              <div className="p-4 border-b">
                <SearchBar />
              </div>
              <div className="p-4">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/chat" element={<Chat />} />
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
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/sales-plan" element={<SalesPlan />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </main>
            <ChatBox />
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;