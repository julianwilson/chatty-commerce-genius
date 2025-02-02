import {
  LineChart,
  Truck,
  Users,
  Tags,
  UserSquare2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const analyticsItems = [
  { title: "Summary", url: "/analytics/summary", icon: LineChart },
  { title: "Shipping", url: "/analytics/shipping", icon: Truck },
  { title: "Visitors", url: "/analytics/visitors", icon: Users },
  { title: "Discounts", url: "/analytics/discounts", icon: Tags },
  { title: "Groups", url: "/analytics/groups", icon: UserSquare2 },
];

export function AnalyticsSidebar() {
  const location = useLocation();
  const isAnalyticsPage = location.pathname.startsWith('/analytics');

  if (!isAnalyticsPage) return null;

  return (
    <div className="fixed left-[4.5rem] top-0 z-30 h-screen w-48 bg-[#000000] transition-all duration-500 ease-in-out">
      <div className="flex h-full flex-col">
        <div className="flex flex-col gap-1 p-2">
          {analyticsItems.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className={cn(
                "flex items-center gap-3 rounded-md px-5 py-2 text-sm text-white hover:text-white hover:bg-white/[0.03]",
                location.pathname === item.url && "bg-white/[0.03]"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}