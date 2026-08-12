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
      description="ساخت اسلاگ URL با حفظ حروف فارسی."
      importPath="@persian-web/core/slug"
      controls={
        <Field label="عنوان">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            dir="auto"
          />
        </Field>
      }
      output={
        <>
          <OutputBlock label="persianSlug" value={slug} />
          <p className="note" dir="ltr" style={{ textAlign: 'left' }}>
            /posts/{slug || '…'}
          </p>
        </>
      }
      snippet={snippet}
    />
  );
}
