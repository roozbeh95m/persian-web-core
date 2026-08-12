import type { ReactNode } from 'react';

import { CodeBlock } from './CodeBlock';

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
          <span className="page-hero__en">{title}</span>
        </h1>
        <p>{description}</p>
        <p className="import-chip" dir="ltr">
          {importPath}
        </p>
      </header>

      <div className="playground__grid">
        <section className="panel">
          <h2>Input</h2>
          {controls}
        </section>
        <section className="panel">
          <h2>Live output</h2>
          {output}
        </section>
      </div>

      <CodeBlock code={snippet} label="Code example" />
      {note ? <p className="note">{note}</p> : null}
    </article>
  );
}
