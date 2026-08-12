import { useMemo, useState } from 'react';

import type {
  IranianPhoneDigits,
  IranianPhoneFormat,
} from '@persian-web/core/phone';
import {
  formatIranianPhone,
  isValidIranianPhone,
  normalizePhone,
} from '@persian-web/core/phone';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function PhonePage() {
  const [input, setInput] = useState(fixtures.phone);
  const [format, setFormat] = useState<IranianPhoneFormat>('national');
  const [digits, setDigits] = useState<IranianPhoneDigits>('persian');

  const valid = useMemo(() => isValidIranianPhone(input), [input]);
  const normalized = useMemo(() => normalizePhone(input), [input]);
  const formatted = useMemo(
    () => formatIranianPhone(input, { format, digits }),
    [digits, format, input],
  );

  const snippet = `import {
  normalizePhone,
  isValidIranianPhone,
  formatIranianPhone,
} from '@persian-web/core/phone';

isValidIranianPhone(${JSON.stringify(input)}); // ${valid}
normalizePhone(${JSON.stringify(input)}); // ${JSON.stringify(normalized)}
formatIranianPhone(${JSON.stringify(input)}, {
  format: '${format}',
  digits: '${digits}',
});
// ${JSON.stringify(formatted)}`;

  return (
    <PlaygroundLayout
      title="Phone"
      titleFa="تلفن"
      description="نرمال‌سازی، اعتبارسنجی و قالب‌بندی موبایل ایران."
      importPath="@persian-web/core/phone"
      controls={
        <>
          <Field label="شماره">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              dir="ltr"
              style={{ textAlign: 'left' }}
            />
          </Field>
          <div className="options-grid">
            <Field label="format">
              <select
                value={format}
                onChange={(event) =>
                  setFormat(event.target.value as IranianPhoneFormat)
                }
              >
                <option value="national">national</option>
                <option value="international">international</option>
              </select>
            </Field>
            <Field label="digits">
              <select
                value={digits}
                onChange={(event) =>
                  setDigits(event.target.value as IranianPhoneDigits)
                }
              >
                <option value="persian">persian</option>
                <option value="english">english</option>
              </select>
            </Field>
          </div>
        </>
      }
      output={
        <>
          <div className="badge-row">
            <span className={`badge${valid ? ' badge--ok' : ' badge--bad'}`}>
              isValidIranianPhone: {String(valid)}
            </span>
          </div>
          <OutputBlock label="normalizePhone" value={normalized ?? 'null'} />
          <OutputBlock label="formatIranianPhone" value={formatted ?? 'null'} />
        </>
      }
      snippet={snippet}
    />
  );
}
