import { useMemo, useState } from 'react';

import {
  isValidNationalId,
  validateNationalId,
} from '@persian-web/core/national-id';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

const REASON_FA: Record<string, string> = {
  invalid_length: 'طول باید ۱۰ رقم باشد',
  invalid_format: 'فقط رقم مجاز است',
  invalid_checksum: 'رقم کنترل (checksum) نادرست است',
  invalid_repeated_digits: 'همه ارقام یکسان مجاز نیست',
};

export function NationalIdPage() {
  const [input, setInput] = useState(fixtures.nationalId);

  const valid = useMemo(() => isValidNationalId(input), [input]);
  const result = useMemo(() => validateNationalId(input), [input]);

  const reasonLabel =
    !result.valid && result.reason
      ? (REASON_FA[result.reason] ?? result.reason)
      : null;

  const snippet = `import {
  isValidNationalId,
  validateNationalId,
} from '@persian-web/core/national-id';

isValidNationalId(${JSON.stringify(input)});
// ${valid}

validateNationalId(${JSON.stringify(input)});
// ${JSON.stringify(result)}`;

  return (
    <PlaygroundLayout
      title="National ID"
      titleFa="کد ملی"
      description="اعتبارسنجی کد ملی با checksum و دلیل مشخص برای ورودی نامعتبر."
      importPath="@persian-web/core/national-id"
      modulePath="/national-id"
      controls={
        <>
          <Field label="کد ملی">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              dir="ltr"
              style={{ textAlign: 'left' }}
              inputMode="numeric"
              maxLength={12}
            />
          </Field>
          <div className="badge-row">
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput(fixtures.nationalId)}
            >
              معتبر
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput(fixtures.nationalIdInvalid)}
            >
              checksum اشتباه
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput('0000000000')}
            >
              ارقام تکراری
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setInput('۱۲۳')}
            >
              کوتاه / فارسی
            </button>
          </div>
        </>
      }
      output={
        <>
          <div className="badge-row">
            <span className={`badge${valid ? ' badge--ok' : ' badge--bad'}`}>
              isValidNationalId: {String(valid)}
            </span>
            {reasonLabel ? (
              <span className="badge badge--bad">{reasonLabel}</span>
            ) : null}
          </div>
          <OutputBlock
            label="validateNationalId"
            value={JSON.stringify(result, null, 2)}
          />
        </>
      }
      snippet={snippet}
      note="برای فرم‌ها validateNationalId را ترجیح دهید تا reason را به کاربر نشان دهید. isValidNationalId فقط boolean برمی‌گرداند."
    />
  );
}
