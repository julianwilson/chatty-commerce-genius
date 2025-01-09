import {
  Calendar,
  MessageSquare,
  BarChart,
  Rocket,
  Percent,
  ShoppingCart,
  Graph,
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
} from "@/components/ui/sidebar";

const items = [
  { title: "Chat with Jeff", url: "/", icon: MessageSquare },
  { title: "Dashboard", url: "/dashboard", icon: BarChart },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Marketing", url: "/marketing", icon: Rocket },
  { title: "Promotions", url: "/promotions", icon: Percent },
  { title: "Collections", url: "/collections", icon: Users },
  { title: "Products", url: "/products", icon: ShoppingCart },
  { title: "Experiments", url: "/experiments", icon: Graph },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>E-commerce Director</SidebarGroupLabel>
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