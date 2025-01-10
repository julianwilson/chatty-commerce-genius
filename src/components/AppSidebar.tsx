import {
  Calendar,
  MessageSquare,
  BarChart,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const items = [
  { title: "Chat with Jeff", url: "/home", icon: MessageSquare },
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
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center justify-center">
                          <item.icon className="h-5 w-5" />
                        </a>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}