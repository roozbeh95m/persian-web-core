import {
  formatJalali,
  formatToman,
  getTextDirection,
  includesPersian,
  normalizePersian,
  normalizePhone,
  persianSlug,
  sortPersian,
  toEnglishDigits,
  toJalali,
  validateNationalId,
} from '@persian-web/core';

import { CodeBlock } from '../../components/CodeBlock';
import { DocPage, DocSection } from '../../components/docs/DocPage';
import { formatExampleSnippet } from '../../docs/format-result';

type UseCasesPageProps = {
  onNavigate: (path: string) => void;
};

type UseCase = {
  id: string;
  title: string;
  summary: string;
  apiPath: string;
  items: { code: string; run: () => unknown }[];
};

const CASES: UseCase[] = [
  {
    id: 'form-input',
    title: 'Normalize form input',
    summary:
      'Convert Persian digits before parsing numbers; normalize Yeh/Kaf for storage.',
    apiPath: '/normalize',
    items: [
      {
        code: `toEnglishDigits('۲۵۰۰')`,
        run: () => toEnglishDigits('۲۵۰۰'),
      },
      {
        code: `normalizePersian('كيلكسيون كلاسيك')`,
        run: () => normalizePersian('كيلكسيون كلاسيك'),
      },
    ],
  },
  {
    id: 'checkout',
    title: 'Checkout amounts & dates',
    summary: 'Show toman prices and Jalali order dates in the UI.',
    apiPath: '/currency',
    items: [
      {
        code: `formatToman(1_250_000)`,
        run: () => formatToman(1_250_000),
      },
      {
        code: `formatJalali(toJalali(2024, 3, 20), { pattern: 'YYYY/MM/DD', digits: 'persian' })`,
        run: () =>
          formatJalali(toJalali(2024, 3, 20), {
            pattern: 'YYYY/MM/DD',
            digits: 'persian',
          }),
      },
    ],
  },
  {
    id: 'auth-forms',
    title: 'Phone & national ID fields',
    summary: 'Canonicalize mobiles and surface checksum failures clearly.',
    apiPath: '/phone',
    items: [
      {
        code: `normalizePhone('0912 123 4567')`,
        run: () => normalizePhone('0912 123 4567'),
      },
      {
        code: `validateNationalId('0013542419')`,
        run: () => validateNationalId('0013542419'),
      },
    ],
  },
  {
    id: 'search-ui',
    title: 'Search and sort lists',
    summary:
      'Match despite Arabic Yeh/Kaf; sort labels with Persian collation.',
    apiPath: '/search',
    items: [
      {
        code: `includesPersian('هدفون بی‌سیم كلاسیک', 'کلاس')`,
        run: () => includesPersian('هدفون بی‌سیم كلاسیک', 'کلاس'),
      },
      {
        code: `sortPersian(['پگاه', 'آرش', 'بابک'])`,
        run: () => sortPersian(['پگاه', 'آرش', 'بابک']),
      },
    ],
  },
  {
    id: 'content',
    title: 'Content URLs & direction',
    summary: 'Slug Persian titles and set dir from text content.',
    apiPath: '/slug',
    items: [
      {
        code: `persianSlug('راهنمای شروع سریع')`,
        run: () => persianSlug('راهنمای شروع سریع'),
      },
      {
        code: `getTextDirection('خرید iPhone ۱۳')`,
        run: () => getTextDirection('خرید iPhone ۱۳'),
      },
    ],
  },
];

export function UseCasesPage({ onNavigate }: UseCasesPageProps) {
  return (
    <DocPage
      title="Common use cases"
      titleFa="موارد رایج"
      lead="Practical recipes mapped to the public API. Each example runs in the browser against @persian-web/core."
      toc={CASES.map((c) => ({ id: c.id, label: c.title }))}
    >
      {CASES.map((useCase) => (
        <DocSection key={useCase.id} id={useCase.id} title={useCase.title}>
          <p>{useCase.summary}</p>
          <CodeBlock
            code={useCase.items
              .map((item) => formatExampleSnippet(item.code, item.run()))
              .join('\n\n')}
            label="typescript"
          />
          <a
            className="btn btn--ghost"
            href={`#${useCase.apiPath}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(useCase.apiPath);
            }}
          >
            Open {useCase.apiPath} API →
          </a>
        </DocSection>
      ))}
    </DocPage>
  );
}
