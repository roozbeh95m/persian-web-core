import type { ReactNode } from 'react';

type PlaygroundLayoutProps = {
  title: string;
  titleFa: string;
  description: string;
  importPath: string;
  controls: ReactNode;
  output: ReactNode;
  snippet: string;
  note?: string;
};

export function PlaygroundLayout({
  title,
  titleFa,
  description,
  importPath,
  controls,
  output,
  snippet,
  note,
}: PlaygroundLayoutProps) {
  return (
    <article className="playground">
      <header className="page-hero">
        <h1>
          {titleFa}
          <span
            style={{
              display: 'block',
              marginTop: '0.35rem',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'var(--ink-faint)',
            }}
          >
            {title}
          </span>
        </h1>
        <p>{description}</p>
        <p className="note">
          Import: <code>{importPath}</code>
        </p>
      </header>

      <div className="playground__grid">
        <section className="panel">
          <h2>ورودی و گزینه‌ها</h2>
          {controls}
        </section>
        <section className="panel">
          <h2>خروجی زنده</h2>
          {output}
        </section>
      </div>

      <section
        className="panel"
        style={{ background: 'var(--bg-code)', borderColor: '#2a3833' }}
      >
        <div className="snippet-header">
          <h2 style={{ color: '#c9ddd4' }}>نمونه کد</h2>
          <CopyButton text={snippet} />
        </div>
        <pre className="output output--code">{snippet}</pre>
        {note ? <p className="note">{note}</p> : null}
      </section>
    </article>
  );
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="copy-button"
      onClick={() => {
        void navigator.clipboard.writeText(text);
      }}
    >
      کپی
    </button>
  );
}
