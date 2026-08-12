import { useMemo, useState } from 'react';

import { fixPersianTypography } from '@persian-web/core/typography';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function TypographyPage() {
  const [input, setInput] = useState(fixtures.typography);

  const output = useMemo(() => fixPersianTypography(input), [input]);
  const changed = input !== output;

  const snippet = `import { fixPersianTypography } from '@persian-web/core/typography';

fixPersianTypography(${JSON.stringify(input)});
// ${JSON.stringify(output)}`;

  return (
    <PlaygroundLayout
      title="Typography"
      titleFa="تایپوگرافی"
      description="اصلاح نمایشی محافظه‌کارانه: نیم‌فاصله پیشوندهای فعلی، گیومه فارسی، و فاصله‌گذاری علائم."
      importPath="@persian-web/core/typography"
      modulePath="/typography"
      controls={
        <>
          <Field label="متن ورودی">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              dir="auto"
            />
          </Field>
          <div className="badge-row">
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput('می رود و نمی دانم')}
            >
              می / نمی
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput('او گفت: "سلام"')}
            >
              نقل‌قول
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput('سلام ، دنیا !')}
            >
              علائم
            </button>
          </div>
        </>
      }
      output={
        <>
          <div className="badge-row">
            <span className={`badge${changed ? ' badge--ok' : ''}`}>
              تغییر کرد: {changed ? 'بله' : 'خیر'}
            </span>
          </div>
          <OutputBlock label="قبل" value={input || '—'} />
          <OutputBlock label="fixPersianTypography" value={output || '—'} />
        </>
      }
      snippet={snippet}
      note="این تابع املا را اصلاح نمی‌کند؛ فقط نمایش (ZWNJ، «»، فاصله علائم) را تمیز می‌کند. برای یکسان‌سازی ی/ک از normalizePersian استفاده کنید."
    />
  );
}
