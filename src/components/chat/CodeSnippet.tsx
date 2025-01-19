interface CodeSnippetProps {
  language: string;
  code: string;
}

export function CodeSnippet({ language, code }: CodeSnippetProps) {
  return (
    <div className="relative rounded-md bg-muted p-4 my-2">
      <pre className="overflow-x-auto text-sm">
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
