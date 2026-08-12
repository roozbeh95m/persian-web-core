import { CodeBlock } from '../../components/CodeBlock';
import { DocPage, DocSection } from '../../components/docs/DocPage';
import { listFunctionNames } from '../../docs/api-catalog';
import { GUIDE_PATHS } from '../../docs/nav';

type FaqPageProps = {
  onNavigate: (path: string) => void;
};

const FAQ = [
  {
    id: 'cjs',
    q: 'Is there a CommonJS build?',
    a: 'No. The package is ESM-only ("type": "module"). Use a bundler or Node with ESM.',
  },
  {
    id: 'i18n',
    q: 'Does this replace an i18n framework?',
    a: 'No. It is a focused utility layer for Persian orthography, digits, Jalali dates, RTL heuristics, and Iranian form rules — not message catalogs or plural rules.',
  },
  {
    id: 'irr-irt',
    q: 'Does formatToman convert rials to tomans?',
    a: 'No. formatToman expects an amount already in tomans; formatRial expects rials. Automatic IRR↔IRT conversion is intentionally out of scope.',
  },
  {
    id: 'slug-latin',
    q: 'Does persianSlug transliterate to Latin?',
    a: 'No. It keeps Persian letters and produces a URL-safe slug. Latin transliteration is not part of the API.',
  },
  {
    id: 'phone-landline',
    q: 'Do phone helpers accept landlines?',
    a: 'No. Only Iranian mobile numbers are accepted. Landlines and non-IR numbers return null / false.',
  },
  {
    id: 'tree-shake',
    q: 'How do I keep bundles small?',
    a: 'Import from subpaths such as @persian-web/core/digits. The package sets sideEffects: false so unused modules can be dropped.',
  },
  {
    id: 'docs-source',
    q: 'Where does this documentation come from?',
    a: 'API pages are driven by a catalog that imports the real public exports. Examples call those functions at runtime. Internal helpers are not listed.',
  },
] as const;

export function FaqPage({ onNavigate }: FaqPageProps) {
  const functions = listFunctionNames();

  return (
    <DocPage
      title="FAQ"
      titleFa="پرسش‌ها"
      lead="Short answers about scope, packaging, and what the library deliberately does not do."
      toc={FAQ.map((item) => ({ id: item.id, label: item.q }))}
    >
      {FAQ.map((item) => (
        <DocSection key={item.id} id={item.id} title={item.q}>
          <p>{item.a}</p>
        </DocSection>
      ))}

      <DocSection id="surface" title="What is in the public API?">
        <p>
          {functions.length} documented functions across the package exports:
        </p>
        <CodeBlock code={functions.join('\n')} label="exports" />
        <div className="btn-row">
          <a
            className="btn btn--secondary"
            href={`#${GUIDE_PATHS.api}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.api);
            }}
          >
            Browse API Reference
          </a>
        </div>
      </DocSection>
    </DocPage>
  );
}
