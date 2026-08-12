import { useEffect, useId, useState } from 'react';

type CodeBlockProps = {
  code: string;
  label?: string;
};

async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall through to legacy path (non-secure contexts, denied permission).
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function CodeBlock({ code, label = 'example' }: CodeBlockProps) {
  const labelId = useId();
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (status === 'idle') {
      return;
    }
    const timer = window.setTimeout(() => setStatus('idle'), 1600);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="code-block">
      <div className="code-block__header">
        <p className="code-block__label" id={labelId}>
          {label}
        </p>
        <button
          type="button"
          className={`copy-button${status === 'copied' ? ' is-copied' : ''}${status === 'failed' ? ' is-failed' : ''}`}
          aria-describedby={labelId}
          onClick={() => {
            void copyText(code).then((ok) => {
              setStatus(ok ? 'copied' : 'failed');
            });
          }}
        >
          {status === 'copied'
            ? 'Copied'
            : status === 'failed'
              ? 'Copy failed'
              : 'Copy'}
        </button>
      </div>
      <pre dir="ltr" tabIndex={0} aria-labelledby={labelId}>
        {code}
      </pre>
      <span className="visually-hidden" aria-live="polite">
        {status === 'copied'
          ? 'Code copied to clipboard'
          : status === 'failed'
            ? 'Unable to copy code'
            : ''}
      </span>
    </div>
  );
}
