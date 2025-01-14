import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { ChatBox } from "@/components/ChatBox";
import { UtensilsCrossed } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import Promotions from "./pages/Promotions";
import CreatePromotion from "./pages/CreatePromotion";
import PromotionDetails from "./pages/PromotionDetails";
import Collections from "./pages/Collections";
import CollectionDetails from "./pages/CollectionDetails";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Chat from "./pages/Chat";
import Experiments from "./pages/Experiments";
import CreateExperiment from "./pages/CreateExperiment";
import ExperimentDetails from "./pages/ExperimentDetails";
import Recipes from "./pages/Recipes";
import SalesPlan from "./pages/SalesPlan";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";

const queryClient = new QueryClient();

const NavigationMenuComponent = () => {
  const location = useLocation();
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link 
            to="/recipes" 
            className={`${navigationMenuTriggerStyle()} flex items-center gap-2 ${
              location.pathname === '/recipes' ? 'bg-accent' : ''
            }`}
          >
            <UtensilsCrossed className="h-4 w-4" />
            Recipes
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const AppContent = () => (
  <BrowserRouter>
    <SidebarProvider>
      <div className="min-h-screen">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <SearchBar />
            <NavigationMenuComponent />
          </div>
        </div>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/promotions/create" element={<CreatePromotion />} />
            <Route path="/promotions/:id" element={<PromotionDetails />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:id" element={<CollectionDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/experiments/create" element={<CreateExperiment />} />
            <Route path="/experiments/:id" element={<ExperimentDetails />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/sales-plan" element={<SalesPlan />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <ChatBox />
      </div>
    </SidebarProvider>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;