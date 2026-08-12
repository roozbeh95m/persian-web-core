import { useMemo, useState } from 'react';

import type {
  FormatNumberDigits,
  FormatNumberNotation,
} from '@persian-web/core/format';
import { formatNumber } from '@persian-web/core/format';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function NumbersPage() {
  const [value, setValue] = useState(String(fixtures.number));
  const [locale, setLocale] = useState('fa-IR');
  const [digits, setDigits] = useState<FormatNumberDigits | ''>('persian');
  const [notation, setNotation] = useState<FormatNumberNotation>('standard');
  const [useGrouping, setUseGrouping] = useState(true);
  const [precision, setPrecision] = useState('');

  const numeric = Number(value);
  const valid = value.trim() !== '' && Number.isFinite(numeric);
  const precisionNum = precision === '' ? undefined : Number(precision);
  const precisionValid =
    precisionNum === undefined ||
    (Number.isInteger(precisionNum) && precisionNum >= 0 && precisionNum <= 20);

  const output = useMemo(() => {
    if (!valid) {
      return 'عدد نامعتبر — یک مقدار finite وارد کنید';
    }
    if (!precisionValid) {
      return 'precision باید عدد صحیح بین ۰ تا ۲۰ باشد';
    }
    return formatNumber(numeric, {
      locale,
      ...(digits ? { digits } : {}),
      notation,
      useGrouping,
      ...(precisionNum !== undefined ? { precision: precisionNum } : {}),
    });
  }, [
    digits,
    locale,
    notation,
    numeric,
    precisionNum,
    precisionValid,
    useGrouping,
    valid,
  ]);

  const snippet = `import { formatNumber } from '@persian-web/core/format';

formatNumber(${valid ? numeric : '/* NaN */'}, {
  locale: '${locale}',${digits ? `\n  digits: '${digits}',` : ''}
  notation: '${notation}',
  useGrouping: ${useGrouping},${
    precisionNum !== undefined && precisionValid
      ? `\n  precision: ${precisionNum},`
      : ''
  }
});
// ${JSON.stringify(output)}`;

  return (
    <PlaygroundLayout
      title="Numbers"
      titleFa="اعداد"
      description="قالب‌بندی اعداد با Intl؛ پشتیبانی از locale فارسی، ارقام فارسی و نماد فشرده."
      importPath="@persian-web/core/format"
      controls={
        <>
          <Field label="عدد">
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              inputMode="decimal"
              dir="ltr"
              style={{ textAlign: 'left' }}
            />
          </Field>
          <div className="badge-row">
            <button
              type="button"
              className="icon-button"
              onClick={() => setValue('1250000')}
            >
              1,250,000
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setValue('-1234.5')}
            >
              منفی اعشاری
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setValue('not-a-number')}
            >
              ورودی نامعتبر
            </button>
          </div>
          <div className="options-grid">
            <Field label="locale">
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
              >
                <option value="fa-IR">fa-IR</option>
                <option value="en-US">en-US</option>
              </select>
            </Field>
            <Field label="digits">
              <select
                value={digits}
                onChange={(event) =>
                  setDigits(event.target.value as FormatNumberDigits | '')
                }
              >
                <option value="">locale default</option>
                <option value="persian">persian</option>
                <option value="english">english</option>
              </select>
            </Field>
            <Field label="notation">
              <select
                value={notation}
                onChange={(event) =>
                  setNotation(event.target.value as FormatNumberNotation)
                }
              >
                <option value="standard">standard</option>
                <option value="compact">compact</option>
              </select>
            </Field>
            <Field label="precision">
              <input
                value={precision}
                onChange={(event) => setPrecision(event.target.value)}
                placeholder="اختیاری"
                inputMode="numeric"
                dir="ltr"
                style={{ textAlign: 'left' }}
              />
            </Field>
            <label className="check">
              <input
                type="checkbox"
                checked={useGrouping}
                onChange={(event) => setUseGrouping(event.target.checked)}
              />
              useGrouping
            </label>
          </div>
        </>
      }
      output={<OutputBlock label="formatNumber" value={output} />}
      snippet={snippet}
      note="برای نمایش مبلغ ریال/تومان از @persian-web/core/currency استفاده کنید؛ formatNumber فقط قالب عدد است."
    />
  );
}
