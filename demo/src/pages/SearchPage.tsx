import { useMemo, useState } from 'react';

import {
  includesPersian,
  matchesPersian,
  normalizeForSearch,
} from '@persian-web/core/search';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function SearchPage() {
  const [haystack, setHaystack] = useState(fixtures.searchHaystack);
  const [needle, setNeedle] = useState(fixtures.searchNeedle);

  const folded = useMemo(() => normalizeForSearch(haystack), [haystack]);
  const includes = useMemo(
    () => includesPersian(haystack, needle),
    [haystack, needle],
  );
  const matches = useMemo(
    () => matchesPersian(haystack, needle),
    [haystack, needle],
  );

  const snippet = `import { normalizeForSearch, includesPersian, matchesPersian } from '@persian-web/core/search';

normalizeForSearch(${JSON.stringify(haystack)});
// ${JSON.stringify(folded)}

includesPersian(${JSON.stringify(haystack)}, ${JSON.stringify(needle)}); // ${includes}
matchesPersian(${JSON.stringify(haystack)}, ${JSON.stringify(needle)}); // ${matches}`;

  return (
    <PlaygroundLayout
      title="Search"
      titleFa="جستجو"
      description="جستجو با نرمال‌سازی املایی فارسی (ی/ک، ارقام، و غیره)."
      importPath="@persian-web/core/search"
      controls={
        <>
          <Field label="متن (haystack)">
            <textarea
              value={haystack}
              onChange={(event) => setHaystack(event.target.value)}
              dir="auto"
            />
          </Field>
          <Field label="عبارت (needle)">
            <input
              value={needle}
              onChange={(event) => setNeedle(event.target.value)}
              dir="auto"
            />
          </Field>
        </>
      }
      output={
        <>
          <div className="badge-row">
            <span className={`badge${includes ? ' badge--ok' : ' badge--bad'}`}>
              includesPersian: {String(includes)}
            </span>
            <span className={`badge${matches ? ' badge--ok' : ' badge--bad'}`}>
              matchesPersian: {String(matches)}
            </span>
          </div>
          <OutputBlock label="normalizeForSearch(haystack)" value={folded} />
        </>
      }
      snippet={snippet}
    />
  );
}
