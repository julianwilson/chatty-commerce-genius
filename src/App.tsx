import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnalyticsSidebar } from "@/components/AnalyticsSidebar";
import { SearchBar } from "@/components/SearchBar";
import { ChatProvider, useChat } from "@/components/chat/ChatProvider";
import Dashboard from "./pages/Dashboard";
import DashboardEmpty from "./pages/DashboardEmpty";
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
import Recipes from "./components/Recipes";
import SalesPlan from "./pages/SalesPlan";
import Settings from "./pages/Settings";
import DynamicPricing from "./pages/DynamicPricing";
import CreateDynamicPricingRule from "./pages/CreateDynamicPricingRule";
import Navigation from "./pages/Navigation";
import { UserFeedback } from "./components/user-feedback/UserFeedback";
import { ThemeProvider } from "@/components/theme-provider";

// Analytics Pages
import AnalyticsSummary from "./pages/analytics/Summary";
import AnalyticsShipping from "./pages/analytics/Shipping";
import AnalyticsVisitors from "./pages/analytics/Visitors";
import AnalyticsDiscounts from "./pages/analytics/Discounts";
import AnalyticsGroups from "./pages/analytics/Groups";
import ExperimentAnalytics from "./pages/analytics/ExperimentAnalytics";

const queryClient = new QueryClient();

function MainContent() {
  const { isCollapsed } = useChat();
  const location = useLocation();
  
  return (
    <div
      className="flex min-h-screen bg-background relative"
      style={{
        '--chat-open': isCollapsed ? 0 : 1,
      } as React.CSSProperties}
    >
      <AppSidebar />
      {location.pathname.startsWith('/analytics') && <AnalyticsSidebar />}
      <main
        className="flex-1 min-w-[1550px] transition-all duration-300 overflow-auto relative z-20 w-full pl-[72px]"
        style={{
          paddingLeft: location.pathname.startsWith('/analytics') ? '272px' : '72px',
          paddingRight: isCollapsed ? '0px' : '400px'
        }}
      >
        <div className="px-2 py-3 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <SearchBar />
        </div>
        <div className="max-w-[1550px] px-2 py-3 pl-0 ml-12 mt-12">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/navigation" element={<Navigation />} />
            <Route path="/dashboard/empty" element={<DashboardEmpty />} />
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
            <Route path="/dynamic-pricing" element={<DynamicPricing />} />
            <Route path="/dynamic-pricing/create" element={<CreateDynamicPricingRule />} />
            <Route path="/user-feedback" element={<UserFeedback />} />
            
            {/* Analytics Routes */}
            <Route path="/analytics/summary" element={<AnalyticsSummary />} />
            <Route path="/analytics/shipping" element={<AnalyticsShipping />} />
            <Route path="/analytics/visitors" element={<AnalyticsVisitors />} />
            <Route path="/analytics/discounts" element={<AnalyticsDiscounts />} />
            <Route path="/analytics/groups" element={<AnalyticsGroups />} />
            <Route path="/analytics/experiments/:id" element={<ExperimentAnalytics />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

const App = () => (
  <ThemeProvider defaultTheme="dark" attribute="class">
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
  </ThemeProvider>
);

export default App;