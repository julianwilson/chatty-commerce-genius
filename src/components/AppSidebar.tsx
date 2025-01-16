import {
  Calendar,
  BarChart,
  Percent,
  ShoppingCart,
  ReceiptText,
  Settings,
  FlaskConical,
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
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Promotions", url: "/promotions", icon: Percent },
  { title: "Experiments", url: "/experiments", icon: FlaskConical },
  { title: "Recipes", url: "/recipes", icon: ReceiptText },
  { title: "Products", url: "/products", icon: ShoppingCart },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [isHovered, setIsHovered] = React.useState(false);
  const { setOpen } = useSidebar();

  return (
    <Sidebar 
      collapsible="icon" 
      variant="floating" 
      className="transition-all duration-300 ease-in-out bg-sidebar fixed left-0 top-0 h-full z-50"
      onMouseEnter={() => {
        setIsHovered(true);
        setOpen(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setOpen(false);
      }}
    >
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <SidebarGroupLabel>E-commerce Director</SidebarGroupLabel>
            <SidebarTrigger />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}