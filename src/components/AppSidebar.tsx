import {
  Calendar,
  MessageSquare,
  BarChart,
  Rocket,
  Percent,
  ShoppingCart,
  Settings,
  Users,
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

const items = [
  { title: "Chat with Jeff", url: "/", icon: MessageSquare },
  { title: "Dashboard", url: "/dashboard", icon: BarChart },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Promotions", url: "/promotions", icon: Percent },
  { title: "Collections", url: "/collections", icon: Users },
  { title: "Products", url: "/products", icon: ShoppingCart },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
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
                  <SidebarMenuButton asChild>
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