import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { TypingMessage } from './TypingMessage';

interface ChatMessageProps {
  sender: 'user' | 'assistant';
  content: ReactNode;
  timestamp: string;
}

export function ChatMessage({ sender, content, timestamp }: ChatMessageProps) {
  const [isTypingComplete, setIsTypingComplete] = useState(sender === 'user');

  return (
    <div className={cn(
      'flex gap-3 p-4',
      sender === 'assistant' ? 'bg-muted/50' : '',
      !isTypingComplete ? 'opacity-80' : ''
    )}>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {sender === 'assistant' ? 'Cascade' : 'You'}
          </span>
          {isTypingComplete && (
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          )}
        </div>
        <div className="prose prose-sm max-w-none">
          {sender === 'assistant' ? (
            <TypingMessage 
              content={content} 
              onComplete={() => setIsTypingComplete(true)}
            />
          ) : content}
        </div>
      </div>
    </div>
  );
}
