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
  const [catalogText, setCatalogText] = useState(
    fixtures.searchCatalog.join('\n'),
  );
  const [query, setQuery] = useState(fixtures.searchNeedle);

  const catalog = useMemo(
    () =>
      catalogText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    [catalogText],
  );

  const foldedQuery = useMemo(() => normalizeForSearch(query), [query]);

  const filtered = useMemo(
    () => catalog.filter((item) => includesPersian(item, query)),
    [catalog, query],
  );

  const exactMatches = useMemo(
    () => catalog.filter((item) => matchesPersian(item, query)),
    [catalog, query],
  );

  const snippet = `import {
  normalizeForSearch,
  includesPersian,
  matchesPersian,
} from '@persian-web/core/search';

const catalog = ${JSON.stringify(catalog, null, 2)};

normalizeForSearch(${JSON.stringify(query)});
// ${JSON.stringify(foldedQuery)}

catalog.filter((item) => includesPersian(item, ${JSON.stringify(query)}));
// ${JSON.stringify(filtered)}

catalog.filter((item) => matchesPersian(item, ${JSON.stringify(query)}));
// ${JSON.stringify(exactMatches)}`;

  return (
    <PlaygroundLayout
      title="Search"
      titleFa="جستجو"
      description="جستجوی مقاوم به اختلاف ی/ک، ارقام و فاصله مجازی — مناسب فیلتر محصولات و autocomplete."
      importPath="@persian-web/core/search"
      controls={
        <>
          <Field label="عبارت جستجو (query)">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              dir="auto"
              placeholder="مثلاً کلاس یا سامسونگ"
            />
          </Field>
          <div className="badge-row">
            <button
              type="button"
              className="icon-button"
              onClick={() => setQuery('کلاس')}
            >
              کلاس ↔ كلاس
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setQuery('samsung')}
            >
              samsung
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setQuery('برنامه نویسی')}
            >
              برنامه‌نویسی
            </button>
          </div>
          <Field label="فهرست (هر خط یک آیتم)">
            <textarea
              value={catalogText}
              onChange={(event) => setCatalogText(event.target.value)}
              dir="auto"
              rows={10}
            />
          </Field>
        </>
      }
      output={
        <>
          <div className="badge-row">
            <span className="badge">
              includesPersian: {filtered.length}/{catalog.length}
            </span>
            <span className="badge">
              matchesPersian: {exactMatches.length}/{catalog.length}
            </span>
          </div>
          <OutputBlock label="normalizeForSearch(query)" value={foldedQuery} />
          <OutputBlock
            label="filtered with includesPersian"
            value={
              filtered.length > 0
                ? filtered.join('\n')
                : query.trim()
                  ? 'نتیجه‌ای یافت نشد'
                  : 'عبارت جستجو را وارد کنید'
            }
          />
          <OutputBlock
            label="exact matchesPersian"
            value={
              exactMatches.length > 0
                ? exactMatches.join('\n')
                : '— هیچ تطابق دقیقی'
            }
          />
        </>
      }
      snippet={snippet}
      note="includesPersian برای فیلتر زیررشته‌ای است؛ matchesPersian فقط برابری کامل پس از نرمال‌سازی را چک می‌کند. ی عربی (ي) و کاف عربی (ك) با معادل فارسی یکی می‌شوند."
    />
  );
}
