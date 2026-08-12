import { useMemo, useState } from 'react';

import type { DigitNormalization } from '@persian-web/core/normalize';
import { normalizePersian } from '@persian-web/core/normalize';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function NormalizePage() {
  const [input, setInput] = useState(fixtures.normalize);
  const [digits, setDigits] = useState<DigitNormalization>('preserve');
  const [removeDiacritics, setRemoveDiacritics] = useState(false);
  const [normalizeWhitespace, setNormalizeWhitespace] = useState(false);

  const output = useMemo(
    () =>
      normalizePersian(input, {
        digits,
        removeDiacritics,
        normalizeWhitespace,
      }),
    [digits, input, normalizeWhitespace, removeDiacritics],
  );

  const snippet = `import { normalizePersian } from '@persian-web/core/normalize';

normalizePersian(${JSON.stringify(input)}, {
  digits: '${digits}',
  removeDiacritics: ${removeDiacritics},
  normalizeWhitespace: ${normalizeWhitespace},
});
// ${JSON.stringify(output)}`;

  return (
    <PlaygroundLayout
      title="Normalize"
      titleFa="نرمال‌سازی"
      description="یکسان‌سازی حروف فارسی، پاک‌سازی ZWNJ، و تبدیل اختیاری ارقام."
      importPath="@persian-web/core/normalize"
      controls={
        <>
          <Field label="متن ورودی">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              dir="auto"
            />
          </Field>
          <div className="options-grid">
            <Field label="digits">
              <select
                value={digits}
                onChange={(event) =>
                  setDigits(event.target.value as DigitNormalization)
                }
              >
                <option value="preserve">preserve</option>
                <option value="persian">persian</option>
                <option value="english">english</option>
              </select>
            </Field>
            <label className="check">
              <input
                type="checkbox"
                checked={removeDiacritics}
                onChange={(event) => setRemoveDiacritics(event.target.checked)}
              />
              removeDiacritics
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={normalizeWhitespace}
                onChange={(event) =>
                  setNormalizeWhitespace(event.target.checked)
                }
              />
              normalizeWhitespace
            </label>
          </div>
        </>
      }
      output={<OutputBlock label="normalizePersian" value={output} />}
      snippet={snippet}
      note="اصلاح ی/ک و پاک‌سازی پایه ZWNJ همیشه اعمال می‌شود."
    />
  );
}
