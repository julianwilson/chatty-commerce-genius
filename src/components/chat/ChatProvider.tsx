import { createContext, useContext, ReactNode, useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { MentionLink } from './MentionLink';
import { CodeSnippet } from './CodeSnippet';

const TEST_SUGGESTION_RESPONSE = [
  <>I'll analyze your last 6 months sales data and recommend some tests...</>,
  <>Based on what I'm seeing we could try the following:<ul className="list-disc pl-6 mt-2 space-y-1">
<li>1. Raise prices of best sellers in a multivariant test between 10-25%, while monitoring daily ad spend and conversion rate.</li>
<li>2. Change your free shipping from all orders to orders above $50 as your AOV is $45. Increasing your AOV can greatly add to profit margins.</li>
<li>3. Deduce prices of all Sale products by 15% for the next 14 days and see if we can increase daily unit sales.</li></ul></>
];

const sampleResponses = [
  <>
    Based on your historical data, I recommend testing a free shipping threshold of $75. This balances cart value increase with conversion rate. Would you like me to create an <MentionLink type="experiments">A/B test</MentionLink> to validate this?
  </>,
  <>
    Looking at your <MentionLink type="products">best sellers</MentionLink>, I suggest a 5-8% price increase test. Your top products have strong demand and healthy margins. Should I help you set up this experiment?
  </>,
  <>
    I can help you optimize your shipping rates. Would you like to:
    <ul className="list-disc pl-6 mt-2 space-y-1">
      <li>Compare current rates with competitors</li>
      <li>Analyze impact on conversion</li>
      <li>Test different thresholds</li>
      <li>Review shipping zones</li>
    </ul>
  </>,
  <>
    I've analyzed your <MentionLink type="promotions">recent promotions</MentionLink> and noticed an opportunity to improve ROI. Would you like to see a detailed breakdown?
  </>,
  <>
    Let me check your current settings and data to provide a personalized recommendation. Is there any specific metric you'd like me to focus on?
  </>
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: ReactNode;
  timestamp: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  isTyping: boolean;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      content: (
        <>
          I can help you manage your:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><MentionLink type="experiments">Experiments</MentionLink></li>
            <li><MentionLink type="promotions">Promotions</MentionLink></li>
            <li><MentionLink type="products">Products</MentionLink></li>
          </ul>
          I can also analyze your store's data to help you set up tests optimized for your business.
          What would you like to work on?
        </>
      ),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);

    // Add assistant response
    if (message.sender === 'user') {
      setIsTyping(true);

      // Check for test suggestion request
      if (typeof message.content === 'string' && message.content.toLowerCase() === 'suggest tests i can run') {
        // First response after 1 second
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Math.random().toString(36).substring(7),
            sender: 'assistant',
            content: TEST_SUGGESTION_RESPONSE[0],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          
          // Second response after 2 more seconds
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Math.random().toString(36).substring(7),
              sender: 'assistant',
              content: TEST_SUGGESTION_RESPONSE[1],
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
          }, 2000);
        }, 1000);
      } else {
        // Default random response behavior
        setTimeout(() => {
          const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
          setMessages(prev => [...prev, {
            id: Math.random().toString(36).substring(7),
            sender: 'assistant',
            content: randomResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          setIsTyping(false);
        }, 1500);
      }
    }
  };

  const toggleCollapsed = () => setIsCollapsed(prev => !prev);

  return (
    <ChatContext.Provider value={{ messages, addMessage, isTyping, isCollapsed, toggleCollapsed }}>
      {children}
      <ChatWindow messages={messages} isTyping={isTyping} isCollapsed={isCollapsed} onToggleCollapse={toggleCollapsed} />
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
