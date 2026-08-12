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

  const numeric = Number(value);
  const valid = Number.isFinite(numeric);

  const output = useMemo(() => {
    if (!valid) {
      return 'عدد نامعتبر';
    }
    return formatNumber(numeric, {
      locale,
      ...(digits ? { digits } : {}),
      notation,
      useGrouping,
    });
  }, [digits, locale, notation, numeric, useGrouping, valid]);

  const snippet = `import { formatNumber } from '@persian-web/core/format';

formatNumber(${valid ? numeric : 0}, {
  locale: '${locale}',${digits ? `\n  digits: '${digits}',` : ''}
  notation: '${notation}',
  useGrouping: ${useGrouping},
});
// ${JSON.stringify(output)}`;

  return (
    <PlaygroundLayout
      title="Numbers"
      titleFa="اعداد"
      description="قالب‌بندی اعداد با Intl و تبدیل اختیاری ارقام."
      importPath="@persian-web/core/format"
      controls={
        <>
          <Field label="عدد">
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              inputMode="decimal"
            />
          </Field>
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
    />
  );
}
