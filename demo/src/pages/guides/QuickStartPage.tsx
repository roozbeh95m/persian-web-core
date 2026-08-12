import {
  formatJalali,
  formatNumber,
  formatToman,
  fixPersianTypography,
  includesPersian,
  isRTL,
  normalizePersian,
  normalizePhone,
  toJalali,
  toPersianDigits,
} from '@persian-web/core';

import { CodeBlock } from '../../components/CodeBlock';
import { DocPage, DocSection } from '../../components/docs/DocPage';
import { formatExampleSnippet } from '../../docs/format-result';
import { GUIDE_PATHS } from '../../docs/nav';

type QuickStartPageProps = {
  onNavigate: (path: string) => void;
};

const IMPORT_ROOT = `import {
  toPersianDigits,
  normalizePersian,
  formatNumber,
  formatToman,
  normalizePhone,
  includesPersian,
  toJalali,
  formatJalali,
  isRTL,
  fixPersianTypography,
} from '@persian-web/core';`;

const IMPORT_SUBPATH = `import { toPersianDigits } from '@persian-web/core/digits';
import { normalizePersian } from '@persian-web/core/normalize';
import { toJalali } from '@persian-web/core/date';
import { isRTL } from '@persian-web/core/direction';`;

const QUICK_CALLS: { code: string; run: () => unknown }[] = [
  {
    code: `toPersianDigits('قیمت: 2500')`,
    run: () => toPersianDigits('قیمت: 2500'),
  },
  {
    code: `normalizePersian('كي')`,
    run: () => normalizePersian('كي'),
  },
  {
    code: `formatNumber(1_250_000, { locale: 'fa-IR' })`,
    run: () => formatNumber(1_250_000, { locale: 'fa-IR' }),
  },
  {
    code: `formatToman(1_250_000)`,
    run: () => formatToman(1_250_000),
  },
  {
    code: `normalizePhone('۰۹۱۲۱۲۳۴۵۶۷')`,
    run: () => normalizePhone('۰۹۱۲۱۲۳۴۵۶۷'),
  },
  {
    code: `includesPersian('گوشی سامسونگ كلاسیک', 'کلاس')`,
    run: () => includesPersian('گوشی سامسونگ كلاسیک', 'کلاس'),
  },
  {
    code: `toJalali(2024, 3, 20)`,
    run: () => toJalali(2024, 3, 20),
  },
  {
    code: `formatJalali({ year: 1403, month: 1, day: 1 }, { digits: 'persian' })`,
    run: () =>
      formatJalali({ year: 1403, month: 1, day: 1 }, { digits: 'persian' }),
  },
  {
    code: `isRTL('سلام دنیا')`,
    run: () => isRTL('سلام دنیا'),
  },
  {
    code: `fixPersianTypography('می رود')`,
    run: () => fixPersianTypography('می رود'),
  },
];

export function QuickStartPage({ onNavigate }: QuickStartPageProps) {
  const liveBlock = QUICK_CALLS.map((item) =>
    formatExampleSnippet(item.code, item.run()),
  ).join('\n\n');

  return (
    <DocPage
      title="Quick Start"
      titleFa="شروع سریع"
      lead="Import from the root entry or a subpath, then call the helpers. Every snippet below is executed against the live library."
      toc={[
        { id: 'import', label: 'Import' },
        { id: 'examples', label: 'Live examples' },
        { id: 'next', label: 'Next' },
      ]}
    >
      <DocSection id="import" title="Import">
        <p>Root entry (tree-shakeable with a modern bundler):</p>
        <CodeBlock code={IMPORT_ROOT} label="typescript" />
        <p>Or import only what you need:</p>
        <CodeBlock code={IMPORT_SUBPATH} label="typescript" />
      </DocSection>

      <DocSection id="examples" title="Live examples">
        <CodeBlock code={liveBlock} label="typescript" />
      </DocSection>

      <DocSection id="next" title="Next">
        <div className="btn-row">
          <a
            className="btn btn--primary"
            href={`#${GUIDE_PATHS.api}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.api);
            }}
          >
            API Reference
          </a>
          <a
            className="btn btn--secondary"
            href={`#${GUIDE_PATHS.playground}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.playground);
            }}
          >
            Open playground
          </a>
          <a
            className="btn btn--ghost"
            href={`#${GUIDE_PATHS.examples}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.examples);
            }}
          >
            More examples
          </a>
        </div>
      </DocSection>
    </DocPage>
  );
}
