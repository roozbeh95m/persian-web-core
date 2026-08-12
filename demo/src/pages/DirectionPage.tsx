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

  const snippet = `import { getTextDirection, isRTL, isMixedDirection } from '@persian-web/core/direction';

getTextDirection(${JSON.stringify(input)}); // ${JSON.stringify(direction)}
isRTL(${JSON.stringify(input)}); // ${rtl}
isMixedDirection(${JSON.stringify(input)}); // ${mixed}`;

  return (
    <PlaygroundLayout
      title="Direction"
      titleFa="جهت متن"
      description="تشخیص جهت قوی کاراکترها برای تنظیم dir در UI."
      importPath="@persian-web/core/direction"
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
              نمونه RTL
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput(fixtures.directionLtr)}
            >
              نمونه LTR
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput(fixtures.directionMixed)}
            >
              نمونه mixed
            </button>
          </div>
        </>
      }
      output={
        <>
          <div className="badge-row">
            <span className="badge">dir: {direction}</span>
            <span className={`badge${rtl ? ' badge--ok' : ''}`}>
              isRTL: {String(rtl)}
            </span>
            <span className={`badge${mixed ? ' badge--bad' : ''}`}>
              isMixed: {String(mixed)}
            </span>
          </div>
          <div
            className="dir-preview"
            dir={direction === 'ltr' ? 'ltr' : 'rtl'}
          >
            {input || '—'}
          </div>
          <OutputBlock label="getTextDirection" value={direction} />
        </>
      }
      snippet={snippet}
    />
  );
}
