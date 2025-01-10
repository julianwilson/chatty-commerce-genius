import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to your E-commerce Dashboard</h1>
      <p className="text-gray-600">
        Use the sidebar to navigate through different sections, and chat with Jeff anytime using the chat interface.
      </p>
    </div>
  );
};

export default Index;