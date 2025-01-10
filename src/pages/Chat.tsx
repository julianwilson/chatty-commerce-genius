import { ChatInterface } from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <h1 className="text-2xl font-bold mb-4">Chat with Jeff</h1>
        <div className="flex-1 bg-background rounded-lg border overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Chat;