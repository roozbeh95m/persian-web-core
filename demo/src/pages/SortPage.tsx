import { useMemo, useState } from 'react';

import type { SortPersianDirection } from '@persian-web/core/sort';
import { sortPersian } from '@persian-web/core/sort';

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

  const sorted = useMemo(
    () => sortPersian(items, { direction, numeric }),
    [direction, items, numeric],
  );

  const snippet = `import { sortPersian } from '@persian-web/core/sort';

sortPersian(${JSON.stringify(items)}, {
  direction: '${direction}',
  numeric: ${numeric},
});
// ${JSON.stringify(sorted)}`;

  return (
    <PlaygroundLayout
      title="Sort"
      titleFa="مرتب‌سازی"
      description="مرتب‌سازی لیست فارسی با قوانین Collator و ارقام عددی."
      importPath="@persian-web/core/sort"
      controls={
        <>
          <Field label="آیتم‌ها (هر خط یک مورد)">
            <textarea
              value={lines}
              onChange={(event) => setLines(event.target.value)}
              dir="auto"
            />
          </Field>
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
      output={<OutputBlock label="sortPersian" value={sorted.join('\n')} />}
      snippet={snippet}
    />
  );
}
