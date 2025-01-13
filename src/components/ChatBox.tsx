import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { useSidebar } from "@/components/ui/sidebar";

export function ChatBox() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state } = useSidebar();

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={toggleChat}
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 w-[400px] border-l bg-background h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Chat with Jeff</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleChat}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}