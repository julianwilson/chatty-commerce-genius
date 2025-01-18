import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AiInputWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  onContinue?: () => void;
  placeholder?: string;
  suggestions: string[];
  className?: string;
}

export function AiInputWithSuggestions({
  value,
  onChange,
  onContinue,
  placeholder = "Ask me anything...",
  suggestions,
  className = ""
}: AiInputWithSuggestionsProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onContinue) {
      e.preventDefault();
      onContinue();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[100px]"
      />
      <div className="flex gap-2 flex-wrap">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-sm"
            onClick={() => onChange(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
