/** Zero-width non-joiner (U+200C). */
const ZWNJ = '\u200C';

/** Persian opening guillemet (U+00AB). */
const GUILLEMET_OPEN = '\u00AB';

/** Persian closing guillemet (U+00BB). */
const GUILLEMET_CLOSE = '\u00BB';

/**
 * Verbal/adjective prefixes that require ZWNJ before the following morpheme
 * when a space was typed instead (Rule: verbal-prefix-zwnj).
 */
const VERBAL_PREFIXES = ['می', 'نمی', 'بی'] as const;

/** Characters that may precede a verbal prefix at a word boundary. */
const PREFIX_BOUNDARY = /[\s«([{،؛؟!"]/u;

/** Persian letters used to validate ZWNJ insertion targets (Rule: verbal-prefix-zwnj). */
const PERSIAN_LETTER =
  /[\u0621-\u064A\u067E-\u0686\u0698\u06AF\u06A9\u06BE\u06CC\u0622\u0627\u0626\u0621\u0624\u0626\u0629\u0647\u0648\u06D2]/u;

/** Entirely Persian-script segment (letters, ZWNJ, spaces) for quote conversion. */
const PERSIAN_QUOTE_INNER = /^[\u0621-\u06FF\s\u200C]+$/u;

function isWhitespaceChar(char: string): boolean {
  return /\s/u.test(char);
}

/**
 * Rule: zwnj-cleanup
 *
 * Cleans malformed ZWNJ without removing meaningful intra-word joins:
 * - collapse consecutive ZWNJs to one
 * - drop ZWNJ at string edges and adjacent to whitespace
 *
 * Idempotent.
 */
function cleanupZwnj(input: string): string {
  if (input.length === 0 || !input.includes(ZWNJ)) {
    return input;
  }

  const chars = [...input];
  const out: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]!;

    if (char !== ZWNJ) {
      out.push(char);
      continue;
    }

    if (out[out.length - 1] === ZWNJ) {
      continue;
    }

    const prev = out.length > 0 ? out[out.length - 1]! : null;

    let j = i + 1;
    while (j < chars.length && chars[j] === ZWNJ) {
      j++;
    }
    const next = j < chars.length ? chars[j]! : null;

    const keep =
      prev !== null &&
      next !== null &&
      !isWhitespaceChar(prev) &&
      !isWhitespaceChar(next);

    if (keep) {
      out.push(ZWNJ);
    }

    i = j - 1;
  }

  const result = out.join('');
  return result === input ? input : result;
}

/**
 * Rule: horizontal-space-collapse
 *
 * Collapses runs of two or more ordinary spaces (U+0020) or no-break spaces
 * (U+00A0) to a single ASCII space. Tabs and newlines are preserved.
 *
 * Idempotent.
 */
function collapseHorizontalSpaces(input: string): string {
  const result = input.replace(/[ \u00A0]{2,}/gu, ' ');
  return result === input ? input : result;
}

function isPrefixBoundary(text: string, prefixStart: number): boolean {
  if (prefixStart === 0) {
    return true;
  }
  return PREFIX_BOUNDARY.test(text[prefixStart - 1]!);
}

function isWordTerminator(char: string | undefined): boolean {
  if (char === undefined) {
    return true;
  }
  return /[\s،؛؟!«»")}\]]/u.test(char);
}

function readPersianWord(text: string, start: number): string | null {
  let end = start;
  while (end < text.length && PERSIAN_LETTER.test(text[end]!)) {
    end++;
  }

  const word = text.slice(start, end);
  if (word.length < 2) {
    return null;
  }

  if (!isWordTerminator(text[end])) {
    return null;
  }

  return word;
}

/**
 * Rule: verbal-prefix-zwnj
 *
 * Inserts ZWNJ between a closed list of verbal/adjective prefixes (`می`, `نمی`,
 * `بی`) and the following Persian word when the user typed a space instead.
 * Only applies at a word boundary, with a Persian word of at least two letters,
 * and never when ZWNJ is already present.
 *
 * Examples: `می رود` → `می‌رود`, `نمی خواهد` → `نمی‌خواهد`, `بی شک` → `بی‌شک`.
 *
 * Idempotent.
 */
function insertVerbalPrefixZwnj(input: string): string {
  let changed = false;
  const parts: string[] = [];
  let index = 0;

  while (index < input.length) {
    let matched = false;

    for (const prefix of VERBAL_PREFIXES) {
      if (!input.startsWith(prefix, index)) {
        continue;
      }

      if (!isPrefixBoundary(input, index)) {
        continue;
      }

      let cursor = index + prefix.length;
      if (cursor >= input.length || !/[ \u00A0]/u.test(input[cursor]!)) {
        continue;
      }

      while (cursor < input.length && /[ \u00A0]/u.test(input[cursor]!)) {
        cursor++;
      }

      const word = readPersianWord(input, cursor);
      if (word === null) {
        continue;
      }

      parts.push(prefix, ZWNJ, word);
      index = cursor + word.length;
      changed = true;
      matched = true;
      break;
    }

    if (matched) {
      continue;
    }

    parts.push(input[index]!);
    index++;
  }

  if (!changed) {
    return input;
  }

  return parts.join('');
}

/**
 * Rule: punctuation-space-before
 *
 * Removes whitespace immediately before Persian punctuation (`،` `؛` `؟` `!`) and
 * before `.` when the preceding character is a Persian letter.
 *
 * Idempotent.
 */
function removeSpaceBeforePunctuation(input: string): string {
  const result = input
    .replace(/\s+([،؛؟!])/gu, '$1')
    .replace(/(?<=[\u0621-\u06FF])\s+(\.)/gu, '$1');
  return result === input ? input : result;
}

/**
 * Rule: punctuation-space-after
 *
 * Inserts a single ASCII space after `،` `؛` `؟` `!` when the next character
 * is not whitespace and not `»` (closing guillemet).
 *
 * Idempotent.
 */
function insertSpaceAfterPunctuation(input: string): string {
  const result = input.replace(/(?<=[،؛؟!])(?=[^\s»])/gu, ' ');
  return result === input ? input : result;
}

/**
 * Rule: guillemet-spacing
 *
 * Removes whitespace immediately after `«` and before `»`.
 *
 * Idempotent.
 */
function fixGuillemetSpacing(input: string): string {
  const result = input
    .replace(/«[ \u00A0]+/gu, GUILLEMET_OPEN)
    .replace(/[ \u00A0]+»/gu, GUILLEMET_CLOSE);
  return result === input ? input : result;
}

/**
 * Rule: parenthesis-spacing
 *
 * Removes whitespace immediately after `(` and before `)`.
 *
 * Idempotent.
 */
function fixParenthesisSpacing(input: string): string {
  const result = input
    .replace(/\([ \u00A0]+/gu, '(')
    .replace(/[ \u00A0]+\)/gu, ')');
  return result === input ? input : result;
}

function containsPersianLetter(text: string): boolean {
  for (const char of text) {
    if (PERSIAN_LETTER.test(char)) {
      return true;
    }
  }
  return false;
}

/**
 * Rule: persian-straight-quotes
 *
 * Converts paired ASCII double quotes (`"…"`) to Persian guillemets (`«…»`) only
 * when the enclosed segment is entirely Persian script (letters, ZWNJ, spaces)
 * and contains at least one Persian letter. Mixed-script, numeric-only, and
 * unmatched quotes are left unchanged.
 *
 * Idempotent.
 */
function convertPersianStraightQuotes(input: string): string {
  const result = input.replace(/"([^"]+)"/gu, (match, inner: string) => {
    const trimmed = inner.trim();
    if (
      trimmed.length === 0 ||
      !PERSIAN_QUOTE_INNER.test(trimmed) ||
      !containsPersianLetter(trimmed)
    ) {
      return match;
    }

    return `${GUILLEMET_OPEN}${trimmed}${GUILLEMET_CLOSE}`;
  });

  return result === input ? input : result;
}

function fixPunctuationSpacing(input: string): string {
  let result = removeSpaceBeforePunctuation(input);
  result = insertSpaceAfterPunctuation(result);
  return result;
}

/**
 * Applies conservative Persian typography fixes to display text.
 *
 * This is a deterministic typography utility — not grammar correction, spell
 * checking, or NLP. Each rule below is safe to apply only when the input
 * pattern is unambiguous; otherwise the text is left unchanged.
 *
 * **Rules (in application order)**
 *
 * 1. **zwnj-cleanup** — Collapse consecutive ZWNJs; drop ZWNJ at edges and
 *    next to whitespace; keep meaningful joins such as `می‌رود`.
 * 2. **horizontal-space-collapse** — Collapse runs of 2+ spaces or NBSPs to
 *    one ASCII space (tabs and newlines preserved).
 * 3. **guillemet-spacing** — Remove space after `«` and before `»`.
 * 4. **parenthesis-spacing** — Remove space after `(` and before `)`.
 * 5. **persian-straight-quotes** — `"…"` → `«…»` when the inner segment is
 *    entirely Persian script with at least one letter.
 * 6. **guillemet-spacing** — Re-apply after quote conversion.
 * 7. **verbal-prefix-zwnj** — `می` / `نمی` / `بی` + space + Persian word
 *    (≥2 letters) → insert ZWNJ (e.g. `می رود` → `می‌رود`).
 * 8. **punctuation-space-before** — Remove space before `،` `؛` `؟` `!`, and
 *    before `.` after a Persian letter.
 * 9. **punctuation-space-after** — Insert a space after `،` `؛` `؟` `!` when
 *    missing (except before `»`).
 *
 * **Invariants:** deterministic and idempotent —
 * `fixPersianTypography(fixPersianTypography(text)) === fixPersianTypography(text)`.
 * The input string is never mutated. When nothing changes, the original
 * reference is returned.
 *
 * @param text - Input string (never mutated).
 * @returns Typography-corrected string, or the original reference when unchanged.
 *
 * @example
 * ```ts
 * fixPersianTypography('می رود'); // 'می\u200Cرود'
 * fixPersianTypography('سلام ، دنیا'); // 'سلام، دنیا'
 * fixPersianTypography('"کتاب"'); // '«کتاب»'
 * ```
 */
export function fixPersianTypography(text: string): string {
  if (text.length === 0) {
    return text;
  }

  let result = text;

  result = cleanupZwnj(result);
  result = collapseHorizontalSpaces(result);
  result = fixGuillemetSpacing(result);
  result = fixParenthesisSpacing(result);
  result = convertPersianStraightQuotes(result);
  result = fixGuillemetSpacing(result);
  result = insertVerbalPrefixZwnj(result);
  result = fixPunctuationSpacing(result);

  return result === text ? text : result;
}
