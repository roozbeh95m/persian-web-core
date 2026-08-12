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

type Mode = 'g2j' | 'j2g';

const RELATIVE_PRESETS: { label: string; offsetMs: number }[] = [
  { label: '۳ دقیقه پیش', offsetMs: -3 * 60_000 },
  { label: '۲ ساعت پیش', offsetMs: -2 * 3_600_000 },
  { label: 'دیروز', offsetMs: -24 * 3_600_000 },
  { label: 'فردا', offsetMs: 24 * 3_600_000 },
  { label: '۲ هفته بعد', offsetMs: 14 * 24 * 3_600_000 },
];

export function DatePage() {
  const [mode, setMode] = useState<Mode>('g2j');
  const [gy, setGy] = useState('2024');
  const [gm, setGm] = useState('3');
  const [gd, setGd] = useState('20');
  const [jy, setJy] = useState('1403');
  const [jm, setJm] = useState('1');
  const [jd, setJd] = useState('1');
  const [digits, setDigits] = useState<FormatJalaliDigits>('persian');
  const [pattern, setPattern] = useState('YYYY/MM/DD');
  const [relativeDigits, setRelativeDigits] =
    useState<RelativeTimeDigits>('persian');
  const [relativeOffsetMs, setRelativeOffsetMs] = useState(-3 * 60_000);

  const gYear = Number(gy);
  const gMonth = Number(gm);
  const gDay = Number(gd);
  const jYear = Number(jy);
  const jMonth = Number(jm);
  const jDay = Number(jd);

  const jalaliFromGregorian = useMemo(() => {
    if (
      !Number.isInteger(gYear) ||
      !Number.isInteger(gMonth) ||
      !Number.isInteger(gDay)
    ) {
      return { ok: false as const, error: 'سال/ماه/روز باید عدد صحیح باشند' };
    }
    try {
      return {
        ok: true as const,
        value: toJalali(gYear, gMonth, gDay),
      };
    } catch (error) {
      return {
        ok: false as const,
        error: error instanceof Error ? error.message : 'تاریخ نامعتبر',
      };
    }
  }, [gDay, gMonth, gYear]);

  const gregorianFromJalali = useMemo(() => {
    if (
      !Number.isInteger(jYear) ||
      !Number.isInteger(jMonth) ||
      !Number.isInteger(jDay)
    ) {
      return { ok: false as const, error: 'سال/ماه/روز باید عدد صحیح باشند' };
    }
    try {
      return {
        ok: true as const,
        value: toGregorian(jYear, jMonth, jDay),
      };
    } catch (error) {
      return {
        ok: false as const,
        error: error instanceof Error ? error.message : 'تاریخ نامعتبر',
      };
    }
  }, [jDay, jMonth, jYear]);

  const activeJalali =
    mode === 'g2j'
      ? jalaliFromGregorian.ok
        ? jalaliFromGregorian.value
        : null
      : Number.isInteger(jYear) &&
          Number.isInteger(jMonth) &&
          Number.isInteger(jDay)
        ? { year: jYear, month: jMonth, day: jDay }
        : null;

  const formatted = useMemo(() => {
    if (!activeJalali) {
      return 'تاریخ نامعتبر';
    }
    try {
      return formatJalali(activeJalali, { digits, pattern });
    } catch (error) {
      return error instanceof Error ? error.message : 'قالب‌بندی نامعتبر';
    }
  }, [activeJalali, digits, pattern]);

  const relative = useMemo(() => {
    const now = new Date('2024-06-15T12:00:00Z');
    const then = new Date(now.getTime() + relativeOffsetMs);
    try {
      return relativeTime(then, { now, digits: relativeDigits });
    } catch (error) {
      return error instanceof Error ? error.message : 'خطا';
    }
  }, [relativeDigits, relativeOffsetMs]);

  const conversionSnippet =
    mode === 'g2j'
      ? `const jalali = toJalali(${gYear}, ${gMonth}, ${gDay});
// ${
          jalaliFromGregorian.ok
            ? JSON.stringify(jalaliFromGregorian.value)
            : jalaliFromGregorian.error
        }`
      : `const gregorian = toGregorian(${jYear}, ${jMonth}, ${jDay});
// ${
          gregorianFromJalali.ok
            ? JSON.stringify(gregorianFromJalali.value)
            : gregorianFromJalali.error
        }`;

  const snippet = `import {
  toJalali,
  toGregorian,
  formatJalali,
  relativeTime,
} from '@persian-web/core/date';

${conversionSnippet}

formatJalali(${JSON.stringify(activeJalali)}, {
  digits: '${digits}',
  pattern: '${pattern}',
});
// ${JSON.stringify(formatted)}

const now = new Date('2024-06-15T12:00:00Z');
relativeTime(new Date(now.getTime() + ${relativeOffsetMs}), {
  now,
  digits: '${relativeDigits}',
});
// ${JSON.stringify(relative)}`;

  return (
    <PlaygroundLayout
      title="Jalali date"
      titleFa="تاریخ جلالی"
      description="تبدیل میلادی ↔ شمسی، قالب‌بندی با الگوی تاریخ، و زمان نسبی فارسی."
      importPath="@persian-web/core/date"
      controls={
        <>
          <Field label="جهت تبدیل">
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as Mode)}
            >
              <option value="g2j">Gregorian → Jalali (toJalali)</option>
              <option value="j2g">Jalali → Gregorian (toGregorian)</option>
            </select>
          </Field>

          {mode === 'g2j' ? (
            <div className="field-row">
              <Field label="سال میلادی">
                <input
                  value={gy}
                  onChange={(event) => setGy(event.target.value)}
                  inputMode="numeric"
                />
              </Field>
              <Field label="ماه">
                <input
                  value={gm}
                  onChange={(event) => setGm(event.target.value)}
                  inputMode="numeric"
                />
              </Field>
              <Field label="روز">
                <input
                  value={gd}
                  onChange={(event) => setGd(event.target.value)}
                  inputMode="numeric"
                />
              </Field>
            </div>
          ) : (
            <div className="field-row">
              <Field label="سال شمسی">
                <input
                  value={jy}
                  onChange={(event) => setJy(event.target.value)}
                  inputMode="numeric"
                />
              </Field>
              <Field label="ماه">
                <input
                  value={jm}
                  onChange={(event) => setJm(event.target.value)}
                  inputMode="numeric"
                />
              </Field>
              <Field label="روز">
                <input
                  value={jd}
                  onChange={(event) => setJd(event.target.value)}
                  inputMode="numeric"
                />
              </Field>
            </div>
          )}

          <div className="options-grid">
            <Field label="formatJalali digits">
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
                dir="ltr"
                style={{ textAlign: 'left' }}
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

          <Field label="relativeTime — فاصله از لحظه مرجع">
            <div className="badge-row">
              {RELATIVE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={`icon-button${
                    relativeOffsetMs === preset.offsetMs ? ' is-active' : ''
                  }`}
                  onClick={() => setRelativeOffsetMs(preset.offsetMs)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Field>
        </>
      }
      output={
        <>
          {mode === 'g2j' ? (
            <OutputBlock
              label="toJalali"
              value={
                jalaliFromGregorian.ok
                  ? JSON.stringify(jalaliFromGregorian.value)
                  : jalaliFromGregorian.error
              }
            />
          ) : (
            <OutputBlock
              label="toGregorian"
              value={
                gregorianFromJalali.ok
                  ? JSON.stringify(gregorianFromJalali.value)
                  : gregorianFromJalali.error
              }
            />
          )}
          <OutputBlock label="formatJalali" value={formatted} />
          <OutputBlock label="relativeTime" value={relative} />
        </>
      }
      snippet={snippet}
      note="توکن‌های الگو: YYYY / YY / MM / M / DD / D. ورودی نامعتبر با پیام خطا نمایش داده می‌شود و UI را نمی‌شکند."
    />
  );
}
