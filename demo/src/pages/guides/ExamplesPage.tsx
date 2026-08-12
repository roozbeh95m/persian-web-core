import {
  formatIranianPhone,
  formatJalali,
  formatToman,
  getTextDirection,
  includesPersian,
  normalizePersian,
  sortPersian,
  toJalali,
  toPersianDigits,
  validateNationalId,
} from '@persian-web/core';

import { CodeBlock } from '../../components/CodeBlock';
import { DocPage, DocSection } from '../../components/docs/DocPage';
import { formatExampleSnippet } from '../../docs/format-result';
import { GUIDE_PATHS } from '../../docs/nav';

type ExamplesPageProps = {
  onNavigate: (path: string) => void;
};

type ExampleGroup = {
  id: string;
  title: string;
  description: string;
  importLine: string;
  items: { code: string; run: () => unknown }[];
  apiPath: string;
};

const GROUPS: ExampleGroup[] = [
  {
    id: 'forms',
    title: 'Iranian forms',
    description: 'Normalize mobile numbers and validate national IDs.',
    importLine: `import { normalizePhone, formatIranianPhone, validateNationalId } from '@persian-web/core';`,
    apiPath: '/phone',
    items: [
      {
        code: `formatIranianPhone('09121234567', { format: 'national', digits: 'persian' })`,
        run: () =>
          formatIranianPhone('09121234567', {
            format: 'national',
            digits: 'persian',
          }),
      },
      {
        code: `validateNationalId('0013542419')`,
        run: () => validateNationalId('0013542419'),
      },
    ],
  },
  {
    id: 'catalog',
    title: 'Catalog search & sort',
    description:
      'Fold Yeh/Kaf differences for search; sort with Persian collation.',
    importLine: `import { includesPersian, sortPersian, normalizePersian } from '@persian-web/core';`,
    apiPath: '/search',
    items: [
      {
        code: `includesPersian('گوشی سامسونگ كلاسیک', 'کلاس')`,
        run: () => includesPersian('گوشی سامسونگ كلاسیک', 'کلاس'),
      },
      {
        code: `sortPersian(['یوسف', 'آرش', 'كيان'])`,
        run: () => sortPersian(['یوسف', 'آرش', 'كيان']),
      },
      {
        code: `normalizePersian('كيلكسيون')`,
        run: () => normalizePersian('كيلكسيون'),
      },
    ],
  },
  {
    id: 'display',
    title: 'Display & money',
    description: 'Persian digits, toman formatting, and Jalali dates for UI.',
    importLine: `import { toPersianDigits, formatToman, toJalali, formatJalali, getTextDirection } from '@persian-web/core';`,
    apiPath: '/currency',
    items: [
      {
        code: `toPersianDigits('Order #42')`,
        run: () => toPersianDigits('Order #42'),
      },
      {
        code: `formatToman(1_250_000)`,
        run: () => formatToman(1_250_000),
      },
      {
        code: `formatJalali(toJalali(2024, 3, 20), { digits: 'persian' })`,
        run: () => formatJalali(toJalali(2024, 3, 20), { digits: 'persian' }),
      },
      {
        code: `getTextDirection('Android گوشی ۱۲۳')`,
        run: () => getTextDirection('Android گوشی ۱۲۳'),
      },
    ],
  },
];

export function ExamplesPage({ onNavigate }: ExamplesPageProps) {
  return (
    <DocPage
      title="Examples"
      titleFa="نمونه‌ها"
      lead="Executable patterns for common product surfaces. Outputs are produced by the live library in this browser session."
      toc={GROUPS.map((g) => ({ id: g.id, label: g.title }))}
    >
      {GROUPS.map((group) => (
        <DocSection key={group.id} id={group.id} title={group.title}>
          <p>{group.description}</p>
          <CodeBlock code={group.importLine} label="typescript" />
          <CodeBlock
            code={group.items
              .map((item) => formatExampleSnippet(item.code, item.run()))
              .join('\n\n')}
            label="typescript"
          />
          <div className="btn-row">
            <a
              className="btn btn--secondary"
              href={`#${group.apiPath}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(group.apiPath);
              }}
            >
              Open related API
            </a>
          </div>
        </DocSection>
      ))}

      <DocSection id="playground" title="Interactive playground">
        <p>
          For editable inputs, open the{' '}
          <a
            href={`#${GUIDE_PATHS.playground}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(GUIDE_PATHS.playground);
            }}
          >
            playground
          </a>{' '}
          or any module under API Reference.
        </p>
      </DocSection>
    </DocPage>
  );
}
