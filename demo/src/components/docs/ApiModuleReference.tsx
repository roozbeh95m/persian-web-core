import { CodeBlock } from '../CodeBlock';
import { formatExampleSnippet } from '../../docs/format-result';
import type { ApiModuleDoc, ApiSymbol } from '../../docs/types';

type ApiSymbolCardProps = {
  symbol: ApiSymbol;
  importPath: string;
};

function ApiSymbolCard({ symbol, importPath }: ApiSymbolCardProps) {
  return (
    <section
      className="api-symbol"
      id={symbol.name}
      aria-labelledby={`${symbol.name}-heading`}
    >
      <div className="api-symbol__meta">
        <h3 id={`${symbol.name}-heading`}>
          <code dir="ltr">{symbol.name}</code>
          <span className={`api-kind api-kind--${symbol.kind}`}>
            {symbol.kind}
          </span>
        </h3>
        <p>{symbol.description}</p>
      </div>

      <CodeBlock code={symbol.signature} label="signature" />

      {symbol.options && symbol.options.length > 0 ? (
        <div className="api-options">
          <h4>Options</h4>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {symbol.options.map((option) => (
                  <tr key={option.name}>
                    <td>
                      <code dir="ltr">{option.name}</code>
                    </td>
                    <td>
                      <code dir="ltr">{option.type}</code>
                    </td>
                    <td>
                      {option.defaultValue ? (
                        <code dir="ltr">{option.defaultValue}</code>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{option.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {symbol.examples && symbol.examples.length > 0 ? (
        <div className="api-examples">
          <h4>Examples</h4>
          <p className="note" dir="ltr">
            import {'{ '}
            {symbol.name}
            {' }'} from '{importPath}';
          </p>
          {symbol.examples.map((example) => {
            let result: unknown;
            try {
              result = example.run();
            } catch (error) {
              result =
                error instanceof Error
                  ? `Error: ${error.message}`
                  : String(error);
            }
            return (
              <CodeBlock
                key={example.code}
                code={formatExampleSnippet(example.code, result)}
                label="typescript"
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

type ApiModuleReferenceProps = {
  module: ApiModuleDoc;
};

export function ApiModuleReference({ module }: ApiModuleReferenceProps) {
  const functions = module.symbols.filter((s) => s.kind === 'function');
  const types = module.symbols.filter((s) => s.kind === 'type');

  return (
    <div className="api-module-ref">
      <div className="api-module-ref__intro">
        <p className="import-chip" dir="ltr">
          {module.importPath}
        </p>
        <p>{module.description}</p>
        <CodeBlock
          code={`import { ${functions.map((f) => f.name).join(', ')} } from '${module.importPath}';${
            types.length > 0
              ? `\nimport type { ${types.map((t) => t.name).join(', ')} } from '${module.importPath}';`
              : ''
          }`}
          label="typescript"
        />
      </div>

      <nav className="doc-toc doc-toc--inline" aria-label="Symbols">
        <p className="doc-toc__label">Symbols</p>
        <ol>
          {module.symbols.map((symbol) => (
            <li key={symbol.name}>
              <a href={`#${symbol.name}`}>
                <code dir="ltr">{symbol.name}</code>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {module.symbols.map((symbol) => (
        <ApiSymbolCard
          key={symbol.name}
          symbol={symbol}
          importPath={module.importPath}
        />
      ))}
    </div>
  );
}
