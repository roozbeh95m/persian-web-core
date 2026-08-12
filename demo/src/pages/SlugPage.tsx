import { useMemo, useState } from 'react';

import { persianSlug } from '@persian-web/core/slug';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function SlugPage() {
  const [input, setInput] = useState(fixtures.slug);

  const slug = useMemo(() => persianSlug(input), [input]);

  const snippet = `import { persianSlug } from '@persian-web/core/slug';

persianSlug(${JSON.stringify(input)});
// ${JSON.stringify(slug)}`;

  return (
    <PlaygroundLayout
      title="Slug"
      titleFa="اسلاگ"
      description="ساخت اسلاگ URL با حفظ حروف فارسی — بدون لاتین‌نویسی اجباری."
      importPath="@persian-web/core/slug"
      controls={
        <>
          <Field label="عنوان">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              dir="auto"
            />
          </Field>
          <div className="badge-row">
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput(fixtures.slug)}
            >
              نمونه فارسی
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput('React + TypeScript در ۱۴۰۳')}
            >
              ترکیبی
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput('!!!@@@')}
            >
              فقط علائم
            </button>
          </div>
        </>
      }
      output={
        <>
          <OutputBlock
            label="persianSlug"
            value={slug || '(خالی — چیزی برای اسلاگ نماند)'}
          />
          <p className="note" dir="ltr" style={{ textAlign: 'left' }}>
            /posts/{slug || '…'}
          </p>
        </>
      }
      snippet={snippet}
      note="حروف فارسی حفظ می‌شوند؛ فاصله مجازی به خط تیره تبدیل می‌شود. ورودی فقط علائم ممکن است اسلاگ خالی بدهد."
    />
  );
}
