import { CodeBlock } from '../../components/CodeBlock';
import { DocPage, DocSection } from '../../components/docs/DocPage';
import { API_MODULES } from '../../docs/api-catalog';
import { GUIDE_PATHS } from '../../docs/nav';

type ApiReferencePageProps = {
  onNavigate: (path: string) => void;
};

export function ApiReferencePage({ onNavigate }: ApiReferencePageProps) {
  return (
    <DocPage
      title="API Reference"
      titleFa="مرجع API"
      lead="Public surface of @persian-web/core. Each module page combines reference docs generated from real exports with an interactive playground."
      toc={[
        { id: 'entries', label: 'Entry points' },
        { id: 'modules', label: 'Modules' },
        { id: 'types', label: 'Types' },
      ]}
    >
      <DocSection id="entries" title="Entry points">
        <p>
          Root import <code dir="ltr">@persian-web/core</code> re-exports the
          consumer API. Prefer subpaths when you only need one domain.
        </p>
        <CodeBlock
          code={`import { toPersianDigits, toJalali } from '@persian-web/core';
import { toPersianDigits } from '@persian-web/core/digits';`}
          label="typescript"
        />
      </DocSection>

      <DocSection id="modules" title="Modules">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                <th>Import</th>
                <th>Functions</th>
              </tr>
            </thead>
            <tbody>
              {API_MODULES.map((module) => {
                const functions = module.symbols
                  .filter((s) => s.kind === 'function')
                  .map((s) => s.name);
                return (
                  <tr key={module.id}>
                    <td>
                      <a
                        href={`#${module.path}`}
                        onClick={(event) => {
                          event.preventDefault();
                          onNavigate(module.path);
                        }}
                      >
                        {module.title}
                      </a>
                    </td>
                    <td>
                      <code dir="ltr">{module.importPath}</code>
                    </td>
                    <td>
                      <code dir="ltr">{functions.join(', ')}</code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="types" title="Types">
        <p>
          Option objects and result unions are exported as named types from the
          same entries. See{' '}
          <a
            href={`#${GUIDE_PATHS.typescript}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.typescript);
            }}
          >
            TypeScript usage
          </a>
          .
        </p>
        <p className="note">
          Internal helpers (for example parseIranianMobile, jalali convert
          utilities, and test-only cache clears) are not part of the public API
          and are not documented here.
        </p>
      </DocSection>
    </DocPage>
  );
}
