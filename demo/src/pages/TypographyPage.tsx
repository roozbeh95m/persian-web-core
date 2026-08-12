import { useMemo, useState } from 'react';

import { fixPersianTypography } from '@persian-web/core/typography';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function TypographyPage() {
  const [input, setInput] = useState(fixtures.typography);

  const output = useMemo(() => fixPersianTypography(input), [input]);

  const snippet = `import { fixPersianTypography } from '@persian-web/core/typography';

fixPersianTypography(${JSON.stringify(input)});
// ${JSON.stringify(output)}`;

  return (
    <PlaygroundLayout
      title="Typography"
      titleFa="تایپوگرافی"
      description="اصلاح محافظه‌کارانه نمایشی برای نقل‌قول و پیشوندهای فعلی."
      importPath="@persian-web/core/typography"
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
          <OutputBlock label="قبل" value={input} />
          <OutputBlock label="fixPersianTypography" value={output} />
        </>
      }
      snippet={snippet}
    />
  );
}
