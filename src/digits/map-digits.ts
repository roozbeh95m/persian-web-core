/** ASCII / English digits: 0–9 */
const EN_DIGIT_START = 0x0030;
/** Arabic-Indic digits: ٠–٩ */
const AR_DIGIT_START = 0x0660;
/** Extended Arabic-Indic (Persian) digits: ۰–۹ */
const FA_DIGIT_START = 0x06f0;
const DIGIT_COUNT = 10;

/**
 * Maps digit code points in `value` with a single pass.
 * Returns the original string when no character changes (zero extra allocation
 * beyond number→string coercion).
 */
export function mapDigits(
  value: string | number,
  mapCode: (code: number) => number,
): string {
  const input = typeof value === 'number' ? String(value) : value;
  const length = input.length;
  if (length === 0) {
    return input;
  }

  let buffer: string[] | null = null;

  for (let i = 0; i < length; i++) {
    const code = input.charCodeAt(i);
    const mapped = mapCode(code);

    if (buffer !== null) {
      buffer[i] = String.fromCharCode(mapped);
    } else if (mapped !== code) {
      buffer = new Array<string>(length);
      for (let j = 0; j < i; j++) {
        buffer[j] = input[j]!;
      }
      buffer[i] = String.fromCharCode(mapped);
    }
  }

  return buffer === null ? input : buffer.join('');
}

/** English or Arabic-Indic → Persian digit code point; otherwise unchanged. */
export function toPersianCode(code: number): number {
  if (code >= EN_DIGIT_START && code < EN_DIGIT_START + DIGIT_COUNT) {
    return FA_DIGIT_START + (code - EN_DIGIT_START);
  }
  if (code >= AR_DIGIT_START && code < AR_DIGIT_START + DIGIT_COUNT) {
    return FA_DIGIT_START + (code - AR_DIGIT_START);
  }
  return code;
}

/** Persian or Arabic-Indic → English digit code point; otherwise unchanged. */
export function toEnglishCode(code: number): number {
  if (code >= FA_DIGIT_START && code < FA_DIGIT_START + DIGIT_COUNT) {
    return EN_DIGIT_START + (code - FA_DIGIT_START);
  }
  if (code >= AR_DIGIT_START && code < AR_DIGIT_START + DIGIT_COUNT) {
    return EN_DIGIT_START + (code - AR_DIGIT_START);
  }
  return code;
}
