import type { ReactNode } from 'react';

import { findApiModule } from '../docs/api-catalog';
import { ApiModuleReference } from './docs/ApiModuleReference';
import { CodeBlock } from './CodeBlock';

type PlaygroundLayoutProps = {
  title: string;
  titleFa: string;
  description: string;
  importPath: string;
  /** Module route path used to look up API catalog docs. */
  modulePath: string;
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
  modulePath,
  controls,
  output,
  snippet,
  note,
}: PlaygroundLayoutProps) {
  const moduleDoc = findApiModule(modulePath);

  return (
    <article className="playground">
      <header className="page-hero">
        <p className="eyebrow">API Reference</p>
        <h1>
          {title}
          <span className="page-hero__en" lang="fa" dir="rtl">
            {titleFa}
          </span>
        </h1>
        <p>{description}</p>
        <p className="import-chip" dir="ltr">
          {importPath}
        </p>
        <nav className="page-tabs" aria-label="Page sections">
          <a href="#playground">Playground</a>
          <a href="#reference">Reference</a>
        </nav>
      </header>

      <div className="playground__stack">
        <section className="playground-block" id="playground">
          <h2 className="playground-block__title">Interactive playground</h2>
          <p className="note">
            Inputs call the real library. The snippet below updates as you type
            and includes a copy button.
          </p>
          <div className="playground__grid">
            <section className="panel">
              <h3>Input</h3>
              {controls}
            </section>
            <section className="panel">
              <h3>Live output</h3>
              {output}
            </section>
          </div>
          <CodeBlock code={snippet} label="typescript" />
          {note ? <p className="note">{note}</p> : null}
        </section>

        {moduleDoc ? (
          <section className="playground-block" id="reference">
            <h2 className="playground-block__title">API reference</h2>
            <p className="note">
              Documented from the public exports of{' '}
              <code dir="ltr">{moduleDoc.importPath}</code>. Every example below
              executes the live API.
            </p>
            <ApiModuleReference module={moduleDoc} />
          </section>
        ) : null}
      </div>
    </article>
  );
}
