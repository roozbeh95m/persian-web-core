import { CodeBlock } from '../../components/CodeBlock';
import { DocPage, DocSection } from '../../components/docs/DocPage';
import { API_MODULES } from '../../docs/api-catalog';
import { GUIDE_PATHS } from '../../docs/nav';
import { DEMO_ROUTES } from '../../examples/routes';

type IntroductionPageProps = {
  onNavigate: (path: string) => void;
};

export function IntroductionPage({ onNavigate }: IntroductionPageProps) {
  return (
    <DocPage
      title="Introduction"
      titleFa="مقدمه"
      lead="@persian-web/core is a dependency-free TypeScript toolkit for Persian and Farsi web apps: digits, Jalali dates, RTL heuristics, typography, search, sorting, and Iranian form helpers."
      toc={[
        { id: 'what', label: 'What it is' },
        { id: 'problems', label: 'Problems it solves' },
        { id: 'modules', label: 'Modules' },
        { id: 'design', label: 'Design principles' },
        { id: 'next', label: 'Next steps' },
      ]}
    >
      <DocSection id="what" title="What it is">
        <p>
          The package ships ESM modules with full TypeScript declarations.
          Import the root entry or a focused subpath; unused modules stay out of
          well-configured bundler graphs (
          <code dir="ltr">sideEffects: false</code>
          ).
        </p>
        <p>
          This site documents only the public API exported by{' '}
          <code dir="ltr">@persian-web/core</code>. Interactive playgrounds on
          each API page call the same functions.
        </p>
      </DocSection>

      <DocSection id="problems" title="Problems it solves">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Problem</th>
                <th>Without shared helpers</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mixed digit scripts</td>
                <td>
                  English <code>0–9</code>, Persian <code>۰–۹</code>, and
                  Arabic-Indic <code>٠–٩</code> collide in forms and search.
                </td>
              </tr>
              <tr>
                <td>Yeh / Kaf variants</td>
                <td>
                  Arabic <code>ي</code> / <code>ك</code> vs Persian{' '}
                  <code>ی</code> / <code>ک</code> break equality and sort.
                </td>
              </tr>
              <tr>
                <td>ZWNJ</td>
                <td>
                  <code>می‌روم</code> vs <code>میروم</code> must match for
                  search but stay distinct for display.
                </td>
              </tr>
              <tr>
                <td>Iranian domain rules</td>
                <td>
                  Mobile numbers, national ID checksums, rial/toman display, and
                  Jalali civil dates.
                </td>
              </tr>
              <tr>
                <td>RTL / mixed UI</td>
                <td>
                  Direction should follow strong characters, not locale alone.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="modules" title="Modules">
        <p>
          {API_MODULES.length} public modules — same surface as the package{' '}
          <code dir="ltr">exports</code> map:
        </p>
        <div className="feature-grid">
          {DEMO_ROUTES.map((route) => (
            <a
              key={route.path}
              className="feature-card"
              href={`#${route.path}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(route.path);
              }}
            >
              <div className="feature-card__meta">
                <h3>{route.title}</h3>
                <code dir="ltr">{route.titleFa}</code>
              </div>
              <p>{route.descriptionEn}</p>
              <code dir="ltr">{route.importPath}</code>
            </a>
          ))}
        </div>
      </DocSection>

      <DocSection id="design" title="Design principles">
        <ul className="doc-list">
          <li>No runtime dependencies.</li>
          <li>Pure functions; inputs are never mutated.</li>
          <li>ESM-only; tree-shakeable subpath exports.</li>
          <li>
            Prefer Intl where it is already correct; add Persian-specific layers
            only where needed.
          </li>
          <li>Documented edge cases over surprising “magic”.</li>
        </ul>
      </DocSection>

      <DocSection id="next" title="Next steps">
        <div className="btn-row">
          <a
            className="btn btn--primary"
            href={`#${GUIDE_PATHS.installation}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.installation);
            }}
          >
            Installation
          </a>
          <a
            className="btn btn--secondary"
            href={`#${GUIDE_PATHS.quickStart}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.quickStart);
            }}
          >
            Quick Start
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
        <CodeBlock code={`npm install @persian-web/core`} label="bash" />
      </DocSection>
    </DocPage>
  );
}
