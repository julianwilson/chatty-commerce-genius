interface MentionLinkProps {
  type: string;
  children: React.ReactNode;
}

export function MentionLink({ type, children }: MentionLinkProps) {
  return (
    <a 
      href={`/${type.toLowerCase()}`}
      className="inline-flex items-center text-primary hover:underline"
    >
      @{children}
    </a>
  );
}
