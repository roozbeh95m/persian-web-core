import { useMemo, useState } from 'react';

import { toEnglishDigits, toPersianDigits } from '@persian-web/core/digits';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function DigitsPage() {
  const [input, setInput] = useState(fixtures.digits);

  const persian = useMemo(() => toPersianDigits(input), [input]);
  const english = useMemo(() => toEnglishDigits(input), [input]);

  const snippet = `import { toPersianDigits, toEnglishDigits } from '@persian-web/core/digits';

toPersianDigits(${JSON.stringify(input)});
// ${JSON.stringify(persian)}

toEnglishDigits(${JSON.stringify(input)});
// ${JSON.stringify(english)}`;

  return (
    <PlaygroundLayout
      title="Digits"
      titleFa="ارقام"
      description="تبدیل ارقام انگلیسی، فارسی و عربی-هندی به یکدیگر بدون تغییر بقیه متن."
      importPath="@persian-web/core/digits"
      modulePath="/digits"
      controls={
        <>
          <Field label="متن یا عدد">
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
              onClick={() => setInput('قیمت: 2500 تومان')}
            >
              انگلیسی
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput('قیمت: ۲۵۰۰ تومان')}
            >
              فارسی
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput('عربي: ٠١٢٣٤٥٦٧٨٩')}
            >
              عربی-هندی
            </button>
          </div>
        </>
      }
      output={
        <>
          <OutputBlock label="toPersianDigits" value={persian} />
          <OutputBlock label="toEnglishDigits" value={english} />
        </>
      }
      snippet={snippet}
      note="هر دو تابع string یا number می‌پذیرند. ارقام عربی-هندی (٠–٩) نیز پشتیبانی می‌شوند؛ بقیه کاراکترها دست‌نخورده می‌مانند."
    />
  );
}
