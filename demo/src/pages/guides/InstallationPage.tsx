import { CodeBlock } from '../../components/CodeBlock';
import { DocPage, DocSection } from '../../components/docs/DocPage';
import { GUIDE_PATHS } from '../../docs/nav';

type InstallationPageProps = {
  onNavigate: (path: string) => void;
};

const NPM = `npm install @persian-web/core`;
const PNPM = `pnpm add @persian-web/core`;
const YARN = `yarn add @persian-web/core`;
const PACKAGE_JSON = `{
  "type": "module",
  "dependencies": {
    "@persian-web/core": "^0.1.3"
  }
}`;

export function InstallationPage({ onNavigate }: InstallationPageProps) {
  return (
    <DocPage
      title="Installation"
      titleFa="نصب"
      lead="Install from npm. The package is ESM-only with published TypeScript declarations for every subpath."
      toc={[
        { id: 'package-managers', label: 'Package managers' },
        { id: 'requirements', label: 'Requirements' },
        { id: 'esm', label: 'ESM only' },
        { id: 'verify', label: 'Verify' },
      ]}
    >
      <DocSection id="package-managers" title="Package managers">
        <CodeBlock code={NPM} label="npm" />
        <CodeBlock code={PNPM} label="pnpm" />
        <CodeBlock code={YARN} label="yarn" />
      </DocSection>

      <DocSection id="requirements" title="Requirements">
        <ul className="doc-list">
          <li>
            <strong>Node.js</strong> ≥ 20 for Node consumers and development (
            <code dir="ltr">engines.node</code>).
          </li>
          <li>
            <strong>Browsers</strong> with ESM and modern{' '}
            <code dir="ltr">Intl</code> APIs (see{' '}
            <a
              href={`#${GUIDE_PATHS.browserSupport}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(GUIDE_PATHS.browserSupport);
              }}
            >
              Browser support
            </a>
            ).
          </li>
          <li>
            Bundlers that respect the package <code dir="ltr">exports</code> map
            (Vite, Webpack, Rollup, esbuild, …).
          </li>
        </ul>
      </DocSection>

      <DocSection id="esm" title="ESM only">
        <p>
          There is no CommonJS (<code dir="ltr">require</code>) build. Prefer{' '}
          <code dir="ltr">"type": "module"</code> in Node projects, or import
          through a bundler.
        </p>
        <CodeBlock code={PACKAGE_JSON} label="package.json" />
      </DocSection>

      <DocSection id="verify" title="Verify">
        <CodeBlock
          code={`import { toPersianDigits } from '@persian-web/core/digits';

console.log(toPersianDigits(42)); // "۴۲"`}
          label="typescript"
        />
        <div className="btn-row">
          <a
            className="btn btn--primary"
            href={`#${GUIDE_PATHS.quickStart}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.quickStart);
            }}
          >
            Quick Start →
          </a>
        </div>
      </DocSection>
    </DocPage>
  );
}
