/** Pretty-print a live API result for docs / copyable snippets. */
export function formatResult(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  return JSON.stringify(value, null, 2);
}

/** Build a copyable TypeScript snippet from example code + live result. */
export function formatExampleSnippet(code: string, result: unknown): string {
  return `${code}\n// → ${formatResult(result)}`;
}
