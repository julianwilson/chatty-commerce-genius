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

const recommendations = [
  {
    id: 1,
    text: "I identified these products as good opportunities because they have been selling well and you may be able to increase prices while maintaining the same conversion.",
    products: [
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
    ],
    details: "Based on historical data analysis, these dresses have shown consistent demand and positive customer feedback. The price elasticity study suggests room for a 10-15% price increase without significant impact on conversion rates."
  },
  {
    id: 2,
    text: "Based on historical data, increasing prices by 5% on these items could result in a 3% increase in overall revenue.",
    products: [
      {
        id: 4,
        name: "Classic White Shirt",
        price: "$89.99",
        image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
      },
      {
        id: 5,
        name: "Silk Blouse",
        price: "$149.99",
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
      },
      {
        id: 6,
        name: "Linen Button-Down",
        price: "$119.99",
        image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
      }
    ],
    details: "Detailed analysis shows stable demand patterns across seasons, with particularly strong performance in business casual categories."
  },
  {
    id: 3,
    text: "Consider bundling these complementary products to increase average order value.",
    products: [
      {
        id: 7,
        name: "Leather Boots",
        price: "$199.99",
        image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
      },
      {
        id: 8,
        name: "Running Shoes",
        price: "$159.99",
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
      },
      {
        id: 9,
        name: "Canvas Sneakers",
        price: "$79.99",
        image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
      }
    ],
    details: "Customer purchase history indicates strong correlation between these items. Bundle pricing could drive higher cart values and improve overall revenue."
  }
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey Julian. It looks like sales are a bit slower than last year this month. We may want to consider running a site wide sale. What's on your mind?",
      isUser: false,
    },
    ...recommendations.map(rec => ({
      text: (
        <div>
          <p>{rec.text}</p>
          <Dialog>
            <DialogTrigger className="text-primary underline mt-2 block">See products</DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Product Details</DialogTitle>
              </DialogHeader>
              <p className="mt-4 text-sm text-muted-foreground">
                {rec.details}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {rec.products.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.price}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ),
      isUser: false
    }))
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