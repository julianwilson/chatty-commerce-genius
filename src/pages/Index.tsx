import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-white">
          <ChatInterface />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;