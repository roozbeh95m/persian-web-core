import type { ReactNode } from 'react';

type DocPageProps = {
  title: string;
  titleFa?: string;
  lead: string;
  children: ReactNode;
  toc?: readonly { id: string; label: string }[];
};

export function DocPage({ title, titleFa, lead, children, toc }: DocPageProps) {
  return (
    <article className="doc-page">
      <header className="doc-page__header">
        <h1>
          {title}
          {titleFa ? (
            <span className="page-hero__en" lang="fa" dir="rtl">
              {titleFa}
            </span>
          ) : null}
        </h1>
        <p className="doc-page__lead">{lead}</p>
      </header>

      {toc && toc.length > 0 ? (
        <nav className="doc-toc" aria-label="On this page">
          <p className="doc-toc__label">On this page</p>
          <ol>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="doc-page__body">{children}</div>
    </article>
  );
}

type DocSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function DocSection({ id, title, children }: DocSectionProps) {
  return (
    <section className="doc-section" id={id} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{title}</h2>
      {children}
    </section>
  );
}
