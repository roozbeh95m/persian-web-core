import type {
  JalaliDate,
  TextDirection,
  ValidateNationalIdResult,
} from '@persian-web/core';

import { CodeBlock } from '../../components/CodeBlock';
import { DocPage, DocSection } from '../../components/docs/DocPage';

const TYPES_IMPORT = `import type {
  FormatNumberOptions,
  ValidateNationalIdResult,
  JalaliDate,
  TextDirection,
  NormalizePersianOptions,
} from '@persian-web/core';`;

const USAGE = `const date: JalaliDate = { year: 1403, month: 1, day: 1 };
const direction: TextDirection = 'rtl';

function handleNationalId(result: ValidateNationalIdResult) {
  if (result.valid) {
    return 'ok';
  }
  return result.reason;
}`;

// Compile-time / demo anchors — these types exist on the public API.
const _demoDate: JalaliDate = { year: 1403, month: 1, day: 1 };
const _demoDirection: TextDirection = 'rtl';
const _demoResult: ValidateNationalIdResult = { valid: true };
void _demoDate;
void _demoDirection;
void _demoResult;

export function TypeScriptPage() {
  return (
    <DocPage
      title="TypeScript usage"
      titleFa="تایپ‌اسکریپت"
      lead="The library is written in TypeScript with strict settings. Published .d.ts files cover every export and subpath — no @types package is required."
      toc={[
        { id: 'declarations', label: 'Declarations' },
        { id: 'importing-types', label: 'Importing types' },
        { id: 'patterns', label: 'Useful patterns' },
      ]}
    >
      <DocSection id="declarations" title="Declarations">
        <ul className="doc-list">
          <li>
            Strict compiler settings upstream (<code dir="ltr">strict</code>,{' '}
            <code dir="ltr">exactOptionalPropertyTypes</code>,{' '}
            <code dir="ltr">noUncheckedIndexedAccess</code>).
          </li>
          <li>
            Option objects and result unions are exported as named types (for
            example <code dir="ltr">NormalizePersianOptions</code>,{' '}
            <code dir="ltr">ValidateNationalIdResult</code>,{' '}
            <code dir="ltr">JalaliDate</code>).
          </li>
          <li>
            Subpath imports resolve their own <code dir="ltr">types</code>{' '}
            condition in the package exports map.
          </li>
        </ul>
      </DocSection>

      <DocSection id="importing-types" title="Importing types">
        <CodeBlock code={TYPES_IMPORT} label="typescript" />
        <CodeBlock code={USAGE} label="typescript" />
      </DocSection>

      <DocSection id="patterns" title="Useful patterns">
        <ul className="doc-list">
          <li>
            Prefer <code dir="ltr">import type</code> for option and result
            types so they erase at runtime.
          </li>
          <li>
            Narrow <code dir="ltr">ValidateNationalIdResult</code> with{' '}
            <code dir="ltr">result.valid</code> before reading{' '}
            <code dir="ltr">reason</code>.
          </li>
          <li>
            Pass explicit <code dir="ltr">locale</code> /{' '}
            <code dir="ltr">digits</code> in tests when asserting formatted
            strings.
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
