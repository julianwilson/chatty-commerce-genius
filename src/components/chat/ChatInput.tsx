import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CornerDownLeft } from 'lucide-react';
import { useChat } from './ChatProvider';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ChatMode = 'chat' | 'live';

const suggestions = [
  "What is my best free shipping threshold?",
  "Test best sellers price increase",
  "Compare conversion rates",
  "Analyze customer segments",
  "Optimize product pricing"
];

export function ChatInput() {
  const [message, setMessage] = useState('');
  const [isMultiline, setIsMultiline] = useState(false);
  const [mode, setMode] = useState<ChatMode>('chat');
  const { addMessage } = useChat();

  const handleSend = () => {
    if (message.trim()) {
      addMessage({
        sender: 'user',
        content: message.trim()
      });
      setMessage('');
      setIsMultiline(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addMessage({
      sender: 'user',
      content: suggestion
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Command+Return toggles multiline mode
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault();
      setIsMultiline(!isMultiline);
      return;
    }
    
    // Return sends the message in single-line mode
    if (e.key === 'Enter' && !e.shiftKey && !isMultiline) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background space-y-3 p-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border bg-background hover:bg-muted transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>

      <div className="flex items-center gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="resize-none min-h-[40px] h-[40px] py-2"
          rows={1}
        />
        <Button 
          onClick={handleSend}
          disabled={!message.trim()}
          size="icon"
          variant="ghost"
          className="shrink-0"
        >
          <CornerDownLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex justify-between items-center px-1 text-xs text-muted-foreground">
        <span>@ mention</span>
        <div className="flex items-center gap-2">
          <span>Claude 3.5 Sonnet</span>
          <ToggleGroup 
            type="single" 
            value={mode} 
            onValueChange={(value) => value && setMode(value as ChatMode)}
            className="bg-muted h-5 rounded-full p-0.5"
          >
            <ToggleGroupItem 
              value="live" 
              size="sm" 
              className="h-4 text-xs rounded-full px-2 data-[state=on]:bg-background"
            >
              Live
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="chat" 
              size="sm" 
              className="h-4 text-xs rounded-full px-2 data-[state=on]:bg-background"
            >
              Chat
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
