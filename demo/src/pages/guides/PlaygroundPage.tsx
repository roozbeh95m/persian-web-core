import { HomePlayground } from '../../components/HomePlayground';
import { DocPage, DocSection } from '../../components/docs/DocPage';
import { DEMO_ROUTES } from '../../examples/routes';

type PlaygroundPageProps = {
  onNavigate: (path: string) => void;
};

export function PlaygroundPage({ onNavigate }: PlaygroundPageProps) {
  return (
    <DocPage
      title="Playground"
      titleFa="زمین بازی"
      lead="Live calls into @persian-web/core. Change inputs to see real outputs and copyable TypeScript snippets."
    >
      <DocSection id="live" title="Multi-module playground">
        <HomePlayground />
      </DocSection>

      <DocSection id="modules" title="Per-module playgrounds">
        <p>
          Each API module also has a dedicated playground with the matching
          reference docs.
        </p>
        <ul className="doc-list">
          {DEMO_ROUTES.map((route) => (
            <li key={route.path}>
              <a
                href={`#${route.path}`}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(route.path);
                }}
              >
                {route.title}
              </a>
              <span className="note"> — {route.descriptionEn}</span>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
