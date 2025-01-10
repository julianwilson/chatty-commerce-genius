import { ChatInterface } from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="h-full">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;