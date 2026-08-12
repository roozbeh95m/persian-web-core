/**
 * Folds ASCII Latin uppercase (`A–Z`) to lowercase without touching non-ASCII.
 *
 * Avoids `[...string]` so Persian/BMP text does not pay for code-point
 * iteration when only ASCII case may change.
 */
export function foldAsciiLatinCase(input: string): string {
  const length = input.length;
  if (length === 0) {
    return input;
  }

  let firstUpper = -1;
  for (let i = 0; i < length; i++) {
    const code = input.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      firstUpper = i;
      break;
    }
  }

  if (firstUpper === -1) {
    return input;
  }

  const chars = new Array<string>(length);
  for (let i = 0; i < firstUpper; i++) {
    chars[i] = input[i]!;
  }
  for (let i = firstUpper; i < length; i++) {
    const code = input.charCodeAt(i);
    chars[i] =
      code >= 65 && code <= 90 ? String.fromCharCode(code + 32) : input[i]!;
  }
  return chars.join('');
}
