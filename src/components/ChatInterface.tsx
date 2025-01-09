import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Message {
  text: string | JSX.Element;
  isUser: boolean;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey Julian. It looks like sales are a bit slower than last year this month. We may want to consider running a site wide sale. What's on your mind?",
      isUser: false,
    },
    {
      text: "I identified these products as good opportunities because they have been selling well and you may be able to increase prices while maintaining the same conversion.",
      isUser: false,
    }
  ]);
  const [input, setInput] = useState("");

  const handleInputClick = () => {
    if (!input) {
      setInput("Setup a promotion on Jeans for 20% off");
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      
      // Add Jeff's response if the message matches our specific case
      if (input.includes("Setup a promotion on Jeans for 20% off")) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: <>Okay. I've setup a draft promotion <Link to="/promotions/draft" className="text-primary underline">here</Link>. Give it a look and when you're ready to launch just press Go Live.</>,
            isUser: false
          }]);
        }, 500);
      }
      
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">
                J
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClick={handleInputClick}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}