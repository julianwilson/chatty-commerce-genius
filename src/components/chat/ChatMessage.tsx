import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

interface ChatMessageProps {
  sender: 'user' | 'assistant';
  content: ReactNode;
  timestamp: string;
}

export function ChatMessage({ sender, content, timestamp }: ChatMessageProps) {
  const renderContent = () => {
    if (sender === 'assistant' && typeof content === 'string') {
      return (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(content, { 
              ALLOWED_TAGS: ['p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'code', 'pre', 'br'],
              ALLOWED_ATTR: ['href', 'target', 'rel']
            })
          }} 
        />
      );
    }
    
    return <div className="prose prose-sm max-w-none">{content}</div>;
  };

  return (
    <div className={cn(
      'flex gap-3 p-4',
      sender === 'assistant' ? 'bg-muted/50' : '',
    )}>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {sender === 'assistant' ? 'Cascade' : 'You'}
          </span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
