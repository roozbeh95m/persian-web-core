import { useMemo, useState } from 'react';

import type { SortPersianDirection } from '@persian-web/core/sort';
import { createPersianCollator, sortPersian } from '@persian-web/core/sort';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function SortPage() {
  const [lines, setLines] = useState(fixtures.sortLines.join('\n'));
  const [direction, setDirection] = useState<SortPersianDirection>('asc');
  const [numeric, setNumeric] = useState(true);

  const items = useMemo(
    () =>
      lines
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    [lines],
  );

  const sorted = useMemo(() => {
    const collator = createPersianCollator({ numeric });
    // When reusing a collator, do not pass numeric/locale again.
    return sortPersian(items, { direction, collator });
  }, [direction, items, numeric]);

  const snippet = `import { createPersianCollator, sortPersian } from '@persian-web/core/sort';

const items = ${JSON.stringify(items)};

const collator = createPersianCollator({ numeric: ${numeric} });

sortPersian(items, {
  direction: '${direction}',
  collator, // reuse; do not also pass numeric/locale
});
// ${JSON.stringify(sorted)}`;

  return (
    <PlaygroundLayout
      title="Sort"
      titleFa="مرتب‌سازی"
      description="مرتب‌سازی فارسی با Collator — حساس به ی/ک و ارقام عددی."
      importPath="@persian-web/core/sort"
      modulePath="/sort"
      controls={
        <>
          <Field label="آیتم‌ها (هر خط یک مورد)">
            <textarea
              value={lines}
              onChange={(event) => setLines(event.target.value)}
              dir="auto"
              rows={8}
            />
          </Field>
          <div className="badge-row">
            <button
              type="button"
              className="icon-button"
              onClick={() => setLines(fixtures.sortLines.join('\n'))}
            >
              نمونه پیش‌فرض
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setLines(['۱۰', '2', '۱', '20'].join('\n'))}
            >
              فقط اعداد
            </button>
          </div>
          <div className="options-grid">
            <Field label="direction">
              <select
                value={direction}
                onChange={(event) =>
                  setDirection(event.target.value as SortPersianDirection)
                }
              >
                <option value="asc">asc</option>
                <option value="desc">desc</option>
              </select>
            </Field>
            <label className="check">
              <input
                type="checkbox"
                checked={numeric}
                onChange={(event) => setNumeric(event.target.checked)}
              />
              numeric
            </label>
          </div>
        </>
      }
      output={
        <>
          <OutputBlock
            label="قبل"
            value={items.length > 0 ? items.join('\n') : 'لیست خالی'}
          />
          <OutputBlock
            label="sortPersian"
            value={sorted.length > 0 ? sorted.join('\n') : '—'}
          />
        </>
      }
      snippet={snippet}
      note="createPersianCollator را برای مرتب‌سازی‌های مکرر بسازید و در options.collator پاس دهید. با numeric: true مقدار «۲» قبل از «۱۲» قرار می‌گیرد."
    />
  );
}
