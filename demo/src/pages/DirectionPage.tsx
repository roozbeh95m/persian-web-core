import { useMemo, useState } from 'react';

import {
  getTextDirection,
  isMixedDirection,
  isRTL,
} from '@persian-web/core/direction';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function DirectionPage() {
  const [input, setInput] = useState(fixtures.directionMixed);

  const direction = useMemo(() => getTextDirection(input), [input]);
  const rtl = useMemo(() => isRTL(input), [input]);
  const mixed = useMemo(() => isMixedDirection(input), [input]);

  const previewDir =
    direction === 'ltr' ? 'ltr' : direction === 'rtl' ? 'rtl' : 'auto';

  const snippet = `import {
  getTextDirection,
  isRTL,
  isMixedDirection,
} from '@persian-web/core/direction';

getTextDirection(${JSON.stringify(input)});
// ${JSON.stringify(direction)}

isRTL(${JSON.stringify(input)});
// ${rtl}

isMixedDirection(${JSON.stringify(input)});
// ${mixed}`;

  return (
    <PlaygroundLayout
      title="Direction"
      titleFa="جهت متن"
      description="تشخیص rtl / ltr / mixed / neutral از کاراکترهای قوی — برای تنظیم dir در UI."
      importPath="@persian-web/core/direction"
      modulePath="/direction"
      controls={
        <>
          <Field label="متن ورودی">
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
              onClick={() => setInput(fixtures.directionRtl)}
            >
              RTL
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput(fixtures.directionLtr)}
            >
              LTR
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput(fixtures.directionMixed)}
            >
              mixed
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput(fixtures.directionNeutral)}
            >
              neutral
            </button>
          </div>
        </>
      }
      output={
        <>
          <div className="badge-row">
            <span className="badge">getTextDirection: {direction}</span>
            <span className={`badge${rtl ? ' badge--ok' : ''}`}>
              isRTL: {String(rtl)}
            </span>
            <span className={`badge${mixed ? ' badge--bad' : ''}`}>
              isMixedDirection: {String(mixed)}
            </span>
          </div>
          <div className="dir-preview" dir={previewDir}>
            {input || '—'}
          </div>
          <OutputBlock label="suggested dir attribute" value={previewDir} />
        </>
      }
      snippet={snippet}
      note="isRTL فقط وقتی true است که متن خالص RTL باشد (نه mixed). برای UI معمولاً getTextDirection را به attribute dir نگاشت کنید."
    />
  );
}
