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
      description="تبدیل ارقام بین انگلیسی، فارسی و عربی-هندی."
      importPath="@persian-web/core/digits"
      controls={
        <Field label="متن ورودی">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            dir="auto"
          />
        </Field>
      }
      output={
        <>
          <OutputBlock label="toPersianDigits" value={persian} />
          <OutputBlock label="toEnglishDigits" value={english} />
        </>
      }
      snippet={snippet}
    />
  );
}
