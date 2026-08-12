import { useMemo, useState } from 'react';

import type {
  FormatJalaliDigits,
  RelativeTimeDigits,
} from '@persian-web/core/date';
import {
  formatJalali,
  relativeTime,
  toGregorian,
  toJalali,
} from '@persian-web/core/date';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';

export function DatePage() {
  const [gy, setGy] = useState('2024');
  const [gm, setGm] = useState('3');
  const [gd, setGd] = useState('20');
  const [digits, setDigits] = useState<FormatJalaliDigits>('persian');
  const [pattern, setPattern] = useState('YYYY/MM/DD');
  const [relativeDigits, setRelativeDigits] =
    useState<RelativeTimeDigits>('persian');

  const gYear = Number(gy);
  const gMonth = Number(gm);
  const gDay = Number(gd);
  const validGregorian =
    Number.isInteger(gYear) &&
    Number.isInteger(gMonth) &&
    Number.isInteger(gDay) &&
    gMonth >= 1 &&
    gMonth <= 12 &&
    gDay >= 1 &&
    gDay <= 31;

  const jalali = useMemo(() => {
    if (!validGregorian) {
      return null;
    }
    try {
      return toJalali(gYear, gMonth, gDay);
    } catch {
      return null;
    }
  }, [gDay, gMonth, gYear, validGregorian]);

  const formatted = useMemo(() => {
    if (!jalali) {
      return 'تاریخ نامعتبر';
    }
    return formatJalali(jalali, { digits, pattern });
  }, [digits, jalali, pattern]);

  const back = useMemo(() => {
    if (!jalali) {
      return null;
    }
    return toGregorian(jalali.year, jalali.month, jalali.day);
  }, [jalali]);

  const relative = useMemo(() => {
    const now = new Date('2024-03-21T12:00:00Z');
    const then = new Date('2024-03-20T12:00:00Z');
    return relativeTime(then, { now, digits: relativeDigits });
  }, [relativeDigits]);

  const snippet = `import { toJalali, toGregorian, formatJalali, relativeTime } from '@persian-web/core/date';

const jalali = toJalali(${gYear}, ${gMonth}, ${gDay});
// ${JSON.stringify(jalali)}

formatJalali(jalali, { digits: '${digits}', pattern: '${pattern}' });
// ${JSON.stringify(formatted)}

relativeTime(new Date('2024-03-20T12:00:00Z'), {
  now: new Date('2024-03-21T12:00:00Z'),
  digits: '${relativeDigits}',
});
// ${JSON.stringify(relative)}`;

  return (
    <PlaygroundLayout
      title="Jalali date"
      titleFa="تاریخ جلالی"
      description="تبدیل میلادی ↔ شمسی، قالب‌بندی و زمان نسبی."
      importPath="@persian-web/core/date"
      controls={
        <>
          <div className="field-row">
            <Field label="سال میلادی">
              <input
                value={gy}
                onChange={(event) => setGy(event.target.value)}
              />
            </Field>
            <Field label="ماه">
              <input
                value={gm}
                onChange={(event) => setGm(event.target.value)}
              />
            </Field>
            <Field label="روز">
              <input
                value={gd}
                onChange={(event) => setGd(event.target.value)}
              />
            </Field>
          </div>
          <div className="options-grid">
            <Field label="format digits">
              <select
                value={digits}
                onChange={(event) =>
                  setDigits(event.target.value as FormatJalaliDigits)
                }
              >
                <option value="persian">persian</option>
                <option value="english">english</option>
              </select>
            </Field>
            <Field label="pattern">
              <input
                value={pattern}
                onChange={(event) => setPattern(event.target.value)}
              />
            </Field>
            <Field label="relativeTime digits">
              <select
                value={relativeDigits}
                onChange={(event) =>
                  setRelativeDigits(event.target.value as RelativeTimeDigits)
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
          <OutputBlock
            label="toJalali"
            value={jalali ? JSON.stringify(jalali) : 'تاریخ نامعتبر'}
          />
          <OutputBlock label="formatJalali" value={formatted} />
          <OutputBlock
            label="toGregorian (round-trip)"
            value={back ? JSON.stringify(back) : '—'}
          />
          <OutputBlock label="relativeTime (sample)" value={relative} />
        </>
      }
      snippet={snippet}
    />
  );
}
