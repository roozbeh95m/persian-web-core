import { useMemo, useState } from 'react';

import { formatJalali, toJalali } from '@persian-web/core/date';
import { toEnglishDigits, toPersianDigits } from '@persian-web/core/digits';
import { getTextDirection, isRTL } from '@persian-web/core/direction';
import { normalizePersian } from '@persian-web/core/normalize';

import { fixtures } from '../examples/fixtures';
import { CodeBlock } from './CodeBlock';
import { Field } from './Field';
import { OutputBlock } from './OutputBlock';

type PlayTab = 'digits' | 'normalize' | 'direction' | 'date';

const TABS: { id: PlayTab; label: string; labelFa: string }[] = [
  { id: 'digits', label: 'Digits', labelFa: 'ارقام' },
  { id: 'normalize', label: 'Normalize', labelFa: 'نرمال‌سازی' },
  { id: 'direction', label: 'Direction', labelFa: 'جهت' },
  { id: 'date', label: 'Jalali', labelFa: 'جلالی' },
];

export function HomePlayground() {
  const [tab, setTab] = useState<PlayTab>('digits');
  const [digitsInput, setDigitsInput] = useState(fixtures.digits);
  const [normalizeInput, setNormalizeInput] = useState(fixtures.normalize);
  const [directionInput, setDirectionInput] = useState(fixtures.directionMixed);
  const [gy, setGy] = useState('2024');
  const [gm, setGm] = useState('3');
  const [gd, setGd] = useState('20');

  const persianDigits = useMemo(
    () => toPersianDigits(digitsInput),
    [digitsInput],
  );
  const englishDigits = useMemo(
    () => toEnglishDigits(digitsInput),
    [digitsInput],
  );
  const normalized = useMemo(
    () => normalizePersian(normalizeInput),
    [normalizeInput],
  );
  const direction = useMemo(
    () => getTextDirection(directionInput),
    [directionInput],
  );
  const rtl = useMemo(() => isRTL(directionInput), [directionInput]);

  const gYear = Number(gy);
  const gMonth = Number(gm);
  const gDay = Number(gd);
  const jalali = useMemo(() => {
    if (
      !Number.isInteger(gYear) ||
      !Number.isInteger(gMonth) ||
      !Number.isInteger(gDay)
    ) {
      return null;
    }
    try {
      return toJalali(gYear, gMonth, gDay);
    } catch {
      return null;
    }
  }, [gDay, gMonth, gYear]);

  const jalaliFormatted = useMemo(() => {
    if (!jalali) {
      return 'تاریخ نامعتبر';
    }
    return formatJalali(jalali, { digits: 'persian', pattern: 'YYYY/MM/DD' });
  }, [jalali]);

  let controls = null;
  let output = null;
  let snippet = '';

  if (tab === 'digits') {
    controls = (
      <Field label="متن ورودی">
        <textarea
          value={digitsInput}
          onChange={(event) => setDigitsInput(event.target.value)}
          dir="auto"
        />
      </Field>
    );
    output = (
      <>
        <OutputBlock label="toPersianDigits" value={persianDigits} />
        <OutputBlock label="toEnglishDigits" value={englishDigits} />
      </>
    );
    snippet = `import { toPersianDigits, toEnglishDigits } from '@persian-web/core/digits';

toPersianDigits(${JSON.stringify(digitsInput)});
// ${JSON.stringify(persianDigits)}

toEnglishDigits(${JSON.stringify(digitsInput)});
// ${JSON.stringify(englishDigits)}`;
  }

  if (tab === 'normalize') {
    controls = (
      <Field label="متن ورودی">
        <textarea
          value={normalizeInput}
          onChange={(event) => setNormalizeInput(event.target.value)}
          dir="auto"
        />
      </Field>
    );
    output = <OutputBlock label="normalizePersian" value={normalized} />;
    snippet = `import { normalizePersian } from '@persian-web/core/normalize';

normalizePersian(${JSON.stringify(normalizeInput)});
// ${JSON.stringify(normalized)}`;
  }

  if (tab === 'direction') {
    controls = (
      <Field label="متن ورودی">
        <textarea
          value={directionInput}
          onChange={(event) => setDirectionInput(event.target.value)}
          dir="auto"
        />
      </Field>
    );
    output = (
      <>
        <div className="badge-row">
          <span className="badge">getTextDirection: {direction}</span>
          <span className={`badge${rtl ? ' badge--ok' : ''}`}>
            isRTL: {String(rtl)}
          </span>
        </div>
        <div className="dir-preview" dir={direction === 'ltr' ? 'ltr' : 'rtl'}>
          {directionInput || '—'}
        </div>
      </>
    );
    snippet = `import { getTextDirection, isRTL } from '@persian-web/core/direction';

getTextDirection(${JSON.stringify(directionInput)});
// ${JSON.stringify(direction)}

isRTL(${JSON.stringify(directionInput)});
// ${rtl}`;
  }

  if (tab === 'date') {
    controls = (
      <div className="field-row">
        <Field label="سال میلادی">
          <input value={gy} onChange={(event) => setGy(event.target.value)} />
        </Field>
        <Field label="ماه">
          <input value={gm} onChange={(event) => setGm(event.target.value)} />
        </Field>
        <Field label="روز">
          <input value={gd} onChange={(event) => setGd(event.target.value)} />
        </Field>
      </div>
    );
    output = (
      <>
        <OutputBlock
          label="toJalali"
          value={jalali ? JSON.stringify(jalali) : 'تاریخ نامعتبر'}
        />
        <OutputBlock label="formatJalali" value={jalaliFormatted} />
      </>
    );
    snippet = `import { toJalali, formatJalali } from '@persian-web/core/date';

const jalali = toJalali(${gYear}, ${gMonth}, ${gDay});
// ${JSON.stringify(jalali)}

formatJalali(jalali, { digits: 'persian', pattern: 'YYYY/MM/DD' });
// ${JSON.stringify(jalaliFormatted)}`;
  }

  return (
    <div className="live-playground">
      <div
        className="live-playground__tabs"
        role="tablist"
        aria-label="Examples"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`tab${tab === item.id ? ' is-active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.labelFa}
            <span
              className="mono"
              style={{ opacity: 0.7, marginInlineStart: '0.35rem' }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="live-playground__grid">
        <section className="panel">
          <h2>Input</h2>
          {controls}
        </section>
        <section className="panel">
          <h2>Live output</h2>
          {output}
        </section>
      </div>

      <CodeBlock code={snippet} label="Corresponding code" />
    </div>
  );
}
