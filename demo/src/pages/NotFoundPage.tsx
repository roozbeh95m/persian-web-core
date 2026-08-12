import { GUIDE_PATHS } from '../docs/nav';

type NotFoundPageProps = {
  path: string;
  onNavigate: (path: string) => void;
};

export function NotFoundPage({ path, onNavigate }: NotFoundPageProps) {
  return (
    <article className="page-hero" aria-labelledby="not-found-heading">
      <p className="eyebrow">404</p>
      <h1 id="not-found-heading">Page not found</h1>
      <p>
        No documentation page for <code className="mono">{path}</code>.
      </p>
      <div className="btn-row">
        <a
          className="btn btn--secondary"
          href={`#${GUIDE_PATHS.introduction}`}
          onClick={(event) => {
            event.preventDefault();
            onNavigate(GUIDE_PATHS.introduction);
          }}
        >
          Back to Introduction
        </a>
        <a
          className="btn btn--ghost"
          href={`#${GUIDE_PATHS.api}`}
          onClick={(event) => {
            event.preventDefault();
            onNavigate(GUIDE_PATHS.api);
          }}
        >
          API Reference
        </a>
      </div>
    </article>
  );
}
