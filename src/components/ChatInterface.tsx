import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Message {
  text: string | JSX.Element;
  isUser: boolean;
}

const products = [
  {
    id: 1,
    name: "Summer Floral Dress",
    price: "$129.99",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
  },
  {
    id: 2,
    name: "Evening Cocktail Dress",
    price: "$299.99",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  },
  {
    id: 3,
    name: "Casual Maxi Dress",
    price: "$179.99",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
  }
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey Julian. It looks like sales are a bit slower than last year this month. We may want to consider running a site wide sale. What's on your mind?",
      isUser: false,
    }
  ]);
  
  const [hasUserReplied, setHasUserReplied] = useState(false);
  const [input, setInput] = useState("");

  const handleInputClick = () => {
    if (!input) {
      setInput("Setup a promotion on Jeans for 20% off");
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setHasUserReplied(true);
      
      // Add Jeff's response if the message matches our specific case
      if (input.includes("Setup a promotion on Jeans for 20% off")) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: <>Okay. I've setup a draft promotion <Link to="/promotions/draft" className="text-primary underline">here</Link>. Give it a look and when you're ready to launch just press Go Live.</>,
              isUser: false
            },
            {
              text: (
                <>
                  By the way, I identified a few products as good opportunities because they've been selling well and you may be able to increase prices while maintaining conversion rate.{" "}
                  <Dialog>
                    <DialogTrigger className="text-primary underline">See more</DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Product Opportunities</DialogTitle>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-16 h-16 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </>
              ),
              isUser: false
            }
          ]);
        }, 500);
      }
      
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                J
              </div>
            )}
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
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
            placeholder={hasUserReplied ? "Give me some recommendations" : "Type your message..."}
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