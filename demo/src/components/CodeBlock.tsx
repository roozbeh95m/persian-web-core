import { useEffect, useState } from 'react';

type CodeBlockProps = {
  code: string;
  label?: string;
};

export function CodeBlock({ code, label = 'example' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className="code-block">
      <div className="code-block__header">
        <p className="code-block__label">{label}</p>
        <button
          type="button"
          className={`copy-button${copied ? ' is-copied' : ''}`}
          onClick={() => {
            void navigator.clipboard
              .writeText(code)
              .then(() => setCopied(true));
          }}
        >
          {copied ? 'کپی شد' : 'کپی'}
        </button>
      </div>
      <pre dir="ltr">{code}</pre>
    </div>
  );
}
