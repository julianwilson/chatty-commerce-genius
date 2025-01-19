export function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4 bg-muted/50">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">Cascade</span>
          <span className="text-xs text-muted-foreground">is typing</span>
          <span className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-foreground/70 animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 rounded-full bg-foreground/70 animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 rounded-full bg-foreground/70 animate-bounce [animation-delay:300ms]" />
          </span>
        </div>
      </div>
    </div>
  );
}
