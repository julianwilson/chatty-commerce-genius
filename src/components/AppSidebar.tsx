import {
  BarChart,
  Percent,
  ShoppingCart,
  ReceiptText,
  Settings,
  FlaskConical,
  ChevronDown,
  LineChart,
  Truck,
  Users,
  Tags,
  UserSquare2,
  PieChart,
  DollarSign,
  Menu,
  MessageSquare,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart },
  { title: "Experiments", url: "/experiments", icon: FlaskConical },
  { title: "Analytics", url: "/analytics/summary", icon: PieChart },
  { title: "Dynamic Pricing", url: "/dynamic-pricing", icon: DollarSign },
  { title: "Navigation", url: "/navigation", icon: Menu },
  { title: "User Feedback", url: "/user-feedback", icon: MessageSquare },
  { title: "Recipes", url: "/recipes", icon: ReceiptText },
  { title: "Products", url: "/products", icon: ShoppingCart },
  { title: "Settings", url: "/settings", icon: Settings },
];

const analyticsItems = [
  { title: "Summary", url: "/analytics/summary", icon: LineChart },
  { title: "Shipping", url: "/analytics/shipping", icon: Truck },
  { title: "Visitors", url: "/analytics/visitors", icon: Users },
  { title: "Discounts", url: "/analytics/discounts", icon: Tags },
  { title: "Groups", url: "/analytics/groups", icon: UserSquare2 },
];

export function AppSidebar() {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(true);
  const location = useLocation();
  const { state } = useSidebar();

  // Close analytics submenu when sidebar is collapsed
  useEffect(() => {
    if (state === "collapsed") {
      setIsAnalyticsOpen(false);
    }
  }, [state]);

  // Check if we're on an analytics page
  const isAnalyticsPage = location.pathname.startsWith('/analytics');

  return (
    <Sidebar collapsible="icon" variant="floating" className="group hover:w-[var(--sidebar-width)] bg-[#000000] transition-all duration-500 ease-in-out">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "Analytics" ? (
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-5 py-2 text-white hover:text-white hover:bg-white/[0.03]",
                          location.pathname.startsWith('/analytics') && "bg-white/[0.03]"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1">
                          <span className="transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">{item.title}</span>
                        </span>
                      </a>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-5 py-2 text-white hover:text-white hover:bg-white/[0.03]",
                          location.pathname === item.url && "bg-white/[0.03]"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1">
                          <span className="transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">{item.title}</span>
                        </span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}