import { CodeBlock } from '../../components/CodeBlock';
import { DocPage, DocSection } from '../../components/docs/DocPage';

export function BrowserSupportPage() {
  return (
    <DocPage
      title="Browser support"
      titleFa="پشتیبانی مرورگر"
      lead="The library targets modern ESM environments with current Intl APIs. There is no CommonJS build and no polyfill bundle."
      toc={[
        { id: 'matrix', label: 'Compatibility matrix' },
        { id: 'intl', label: 'Intl notes' },
        { id: 'node', label: 'Node.js' },
      ]}
    >
      <DocSection id="matrix" title="Compatibility matrix">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Environment</th>
                <th>Support</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Node.js</td>
                <td>
                  <code dir="ltr">≥ 20</code> (declared in{' '}
                  <code dir="ltr">engines</code>)
                </td>
              </tr>
              <tr>
                <td>Bundlers</td>
                <td>
                  Vite, Webpack, Rollup, esbuild, and others that honor package
                  exports
                </td>
              </tr>
              <tr>
                <td>Browsers</td>
                <td>
                  Modern engines with ESM and{' '}
                  <code dir="ltr">Intl.NumberFormat</code>,{' '}
                  <code dir="ltr">Intl.Collator</code>,{' '}
                  <code dir="ltr">Intl.DateTimeFormat</code>,{' '}
                  <code dir="ltr">Intl.RelativeTimeFormat</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="intl" title="Intl notes">
        <ul className="doc-list">
          <li>
            Currency, number, sort, and relative-time output can vary slightly
            across Intl implementations. Pin locales in tests when asserting
            exact strings.
          </li>
          <li>
            Jalali conversion overloads that take numeric year/month/day are
            pure calendar math and do not depend on the host time zone.
          </li>
          <li>
            Digit remapping after Intl formatting is deterministic for a given
            input string.
          </li>
        </ul>
      </DocSection>

      <DocSection id="node" title="Node.js">
        <p>Use ESM imports. Example:</p>
        <CodeBlock
          code={`import { toPersianDigits } from '@persian-web/core/digits';

console.log(toPersianDigits('2500'));`}
          label="typescript"
        />
        <p className="note">
          Runnable Node scripts also live in the repository{' '}
          <code dir="ltr">examples/</code> folder after{' '}
          <code dir="ltr">npm run build</code>.
        </p>
      </DocSection>
    </DocPage>
  );
}
