import { useMemo, useState } from 'react';

import type {
  Currency,
  CurrencyDigits,
  CurrencyDisplay,
} from '@persian-web/core/currency';
import {
  formatCurrency,
  formatRial,
  formatToman,
} from '@persian-web/core/currency';

import { Field } from '../components/Field';
import { OutputBlock } from '../components/OutputBlock';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { fixtures } from '../examples/fixtures';

export function CurrencyPage() {
  const [value, setValue] = useState(String(fixtures.currency));
  const [currency, setCurrency] = useState<Currency>('IRT');
  const [locale, setLocale] = useState('fa-IR');
  const [digits, setDigits] = useState<CurrencyDigits | ''>('persian');
  const [currencyDisplay, setCurrencyDisplay] =
    useState<CurrencyDisplay>('symbol');

  const numeric = Number(value);
  const valid = Number.isFinite(numeric);

  const options = useMemo(
    () => ({
      locale,
      ...(digits ? { digits } : {}),
      currencyDisplay,
    }),
    [currencyDisplay, digits, locale],
  );

  const formatted = useMemo(() => {
    if (!valid) {
      return 'عدد نامعتبر';
    }
    return formatCurrency(numeric, { currency, ...options });
  }, [currency, numeric, options, valid]);

  const toman = useMemo(
    () => (valid ? formatToman(numeric, options) : '—'),
    [numeric, options, valid],
  );
  const rial = useMemo(
    () => (valid ? formatRial(numeric, options) : '—'),
    [numeric, options, valid],
  );

  const snippet = `import { formatCurrency, formatToman, formatRial } from '@persian-web/core/currency';

formatCurrency(${valid ? numeric : 0}, {
  currency: '${currency}',
  locale: '${locale}',${digits ? `\n  digits: '${digits}',` : ''}
  currencyDisplay: '${currencyDisplay}',
});
// ${JSON.stringify(formatted)}`;

  return (
    <PlaygroundLayout
      title="Currency"
      titleFa="واحد پول"
      description="نمایش تومان و ریال بدون تبدیل خودکار IRR↔IRT."
      importPath="@persian-web/core/currency"
      controls={
        <>
          <Field label="مبلغ">
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              inputMode="decimal"
            />
          </Field>
          <div className="options-grid">
            <Field label="currency">
              <select
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value as Currency)
                }
              >
                <option value="IRT">IRT (تومان)</option>
                <option value="IRR">IRR (ریال)</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </Field>
            <Field label="locale">
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
              >
                <option value="fa-IR">fa-IR</option>
                <option value="en-US">en-US</option>
              </select>
            </Field>
            <Field label="digits">
              <select
                value={digits}
                onChange={(event) =>
                  setDigits(event.target.value as CurrencyDigits | '')
                }
              >
                <option value="">locale default</option>
                <option value="persian">persian</option>
                <option value="english">english</option>
              </select>
            </Field>
            <Field label="currencyDisplay">
              <select
                value={currencyDisplay}
                onChange={(event) =>
                  setCurrencyDisplay(event.target.value as CurrencyDisplay)
                }
              >
                <option value="symbol">symbol</option>
                <option value="narrowSymbol">narrowSymbol</option>
                <option value="code">code</option>
                <option value="name">name</option>
              </select>
            </Field>
          </div>
        </>
      }
      output={
        <>
          <OutputBlock label="formatCurrency" value={formatted} />
          <OutputBlock label="formatToman" value={toman} />
          <OutputBlock label="formatRial" value={rial} />
        </>
      }
      snippet={snippet}
    />
  );
}
