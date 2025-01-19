import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypingMessageProps {
  content: ReactNode;
  onComplete?: () => void;
  className?: string;
}

export function TypingMessage({ content, onComplete, className }: TypingMessageProps) {
  const [displayContent, setDisplayContent] = useState<ReactNode>(null);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!content || typeof content !== 'string') {
      setDisplayContent(content);
      setIsTyping(false);
      onComplete?.();
      return;
    }

    const totalDuration = 2000; // 2 seconds
    const charsPerFrame = content.length / (totalDuration / 16.67); // 60fps
    let currentPos = 0;
    let lastUpdate = 0;

    const animate = (timestamp: number) => {
      if (!lastUpdate) lastUpdate = timestamp;
      const delta = timestamp - lastUpdate;
      
      if (delta > 16.67) { // 60fps
        currentPos += charsPerFrame * (delta / 16.67);
        setDisplayContent(content.slice(0, Math.floor(currentPos)));
        lastUpdate = timestamp;
      }

      if (currentPos < content.length) {
        requestAnimationFrame(animate);
      } else {
        setIsTyping(false);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [content, onComplete]);

  if (!displayContent) return null;

  return (
    <div className={cn("relative", className)}>
      {displayContent}
      {isTyping && (
        <span className="inline-block w-0.5 h-4 bg-foreground ml-0.5 animate-blink" />
      )}
    </div>
  );
}
