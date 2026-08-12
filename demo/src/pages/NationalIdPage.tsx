import { useMemo, useState } from 'react';

import {
  isValidNationalId,
  validateNationalId,
} from '@persian-web/core/national-id';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function NationalIdPage() {
  const [input, setInput] = useState(fixtures.nationalId);

  const valid = useMemo(() => isValidNationalId(input), [input]);
  const result = useMemo(() => validateNationalId(input), [input]);

  const snippet = `import { isValidNationalId, validateNationalId } from '@persian-web/core/national-id';

isValidNationalId(${JSON.stringify(input)}); // ${valid}
validateNationalId(${JSON.stringify(input)});
// ${JSON.stringify(result)}`;

  return (
    <PlaygroundLayout
      title="National ID"
      titleFa="کد ملی"
      description="اعتبارسنجی کد ملی با جزئیات دلیل نامعتبر بودن."
      importPath="@persian-web/core/national-id"
      controls={
        <Field label="کد ملی">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            dir="ltr"
            style={{ textAlign: 'left' }}
            inputMode="numeric"
          />
        </Field>
      }
      output={
        <>
          <div className="badge-row">
            <span className={`badge${valid ? ' badge--ok' : ' badge--bad'}`}>
              isValidNationalId: {String(valid)}
            </span>
          </div>
          <OutputBlock
            label="validateNationalId"
            value={JSON.stringify(result, null, 2)}
          />
        </>
      }
      snippet={snippet}
    />
  );
}
