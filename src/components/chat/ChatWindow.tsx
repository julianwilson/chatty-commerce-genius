import { ReactNode, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  messages: {
    id: string;
    sender: 'user' | 'assistant';
    content: ReactNode;
    timestamp: string;
  }[];
  isTyping: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ChatWindow({ messages, isTyping, isCollapsed, onToggleCollapse }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, []);

  // Set up intersection observer to detect when we're near bottom
  useEffect(() => {
    if (!lastMessageRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // If the last message is visible, keep scrolling to bottom for new messages
        if (entries[0]?.isIntersecting) {
          scrollToBottom();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(lastMessageRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [scrollToBottom]);

  // Initial scroll and new message scroll
  useEffect(() => {
    scrollToBottom('instant');
  }, []);

  // Scroll on new messages or typing state change
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping, scrollToBottom]);

  return (
    <div 
      className={cn(
        "fixed top-16 bottom-0 border-r bg-background flex flex-col transition-all duration-300",
        isCollapsed 
          ? "left-[64px] w-[48px]" 
          : "left-[64px] w-[400px]"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-3 z-50 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={onToggleCollapse}
      >
        {isCollapsed ? (
          <PanelRightOpen className="h-4 w-4" />
        ) : (
          <PanelRightClose className="h-4 w-4" />
        )}
      </Button>

      {!isCollapsed && (
        <>
          <ScrollArea className="flex-1">
            <div ref={scrollRef} className="divide-y">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  ref={index === messages.length - 1 ? lastMessageRef : undefined}
                >
                  <ChatMessage
                    sender={message.sender}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                </div>
              ))}
              {isTyping && (
                <div ref={lastMessageRef}>
                  <TypingIndicator />
                </div>
              )}
            </div>
          </ScrollArea>
          <ChatInput />
        </>
      )}
    </div>
  );
}
