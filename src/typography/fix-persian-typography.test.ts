import { describe, expect, it } from 'vitest';

import { fixPersianTypography } from './index.js';

const ZWNJ = '\u200C';

function assertIdempotent(input: string): void {
  const once = fixPersianTypography(input);
  const twice = fixPersianTypography(once);
  expect(twice).toBe(once);
}

function assertUnchanged(input: string): void {
  expect(fixPersianTypography(input)).toBe(input);
}

describe('fixPersianTypography', () => {
  describe('empty input', () => {
    it('returns empty string', () => {
      expect(fixPersianTypography('')).toBe('');
    });

    it('returns the same reference', () => {
      const empty = '';
      expect(fixPersianTypography(empty)).toBe(empty);
    });

    it('is idempotent', () => {
      assertIdempotent('');
    });
  });

  describe('Rule: zwnj-cleanup', () => {
    it('preserves meaningful ZWNJ between letters', () => {
      const word = `می${ZWNJ}رود`;
      expect(fixPersianTypography(word)).toBe(word);
      assertUnchanged(word);
    });

    it('collapses consecutive ZWNJs to one', () => {
      expect(fixPersianTypography(`می${ZWNJ}${ZWNJ}رود`)).toBe(`می${ZWNJ}رود`);
    });

    it('strips leading and trailing ZWNJ', () => {
      expect(fixPersianTypography(`${ZWNJ}متن`)).toBe('متن');
      expect(fixPersianTypography(`متن${ZWNJ}`)).toBe('متن');
    });

    it('strips ZWNJ adjacent to whitespace', () => {
      expect(fixPersianTypography(`می ${ZWNJ}رود`)).toBe(`می${ZWNJ}رود`);
      expect(fixPersianTypography(`می${ZWNJ} رود`)).toBe(`می${ZWNJ}رود`);
    });

    it('is idempotent for ZWNJ cases', () => {
      assertIdempotent(`می${ZWNJ}رود`);
      assertIdempotent(`می${ZWNJ}${ZWNJ}رود`);
      assertIdempotent(`${ZWNJ}متن${ZWNJ}`);
    });
  });

  describe('Rule: horizontal-space-collapse', () => {
    it('collapses multiple spaces to one', () => {
      expect(fixPersianTypography('سلام   دنیا')).toBe('سلام دنیا');
    });

    it('collapses no-break spaces', () => {
      expect(fixPersianTypography('سلام\u00A0\u00A0دنیا')).toBe('سلام دنیا');
    });

    it('preserves tabs and newlines', () => {
      assertUnchanged('سلام\t\tدنیا');
      assertUnchanged('خط\nدوم');
    });

    it('is idempotent', () => {
      assertIdempotent('سلام   دنیا');
    });
  });

  describe('Rule: verbal-prefix-zwnj', () => {
    it('inserts ZWNJ after می before the following word', () => {
      expect(fixPersianTypography('می رود')).toBe(`می${ZWNJ}رود`);
      expect(fixPersianTypography('می شود')).toBe(`می${ZWNJ}شود`);
      expect(fixPersianTypography('می رفت')).toBe(`می${ZWNJ}رفت`);
    });

    it('inserts ZWNJ after نمی before the following word', () => {
      expect(fixPersianTypography('نمی خواهد')).toBe(`نمی${ZWNJ}خواهد`);
      expect(fixPersianTypography('نمی دانم')).toBe(`نمی${ZWNJ}دانم`);
    });

    it('inserts ZWNJ after بی before the following word', () => {
      expect(fixPersianTypography('بی شک')).toBe(`بی${ZWNJ}شک`);
      expect(fixPersianTypography('بی نظیر')).toBe(`بی${ZWNJ}نظیر`);
    });

    it('handles multiple prefixes in one sentence', () => {
      expect(fixPersianTypography('می رود و نمی ایستد')).toBe(
        `می${ZWNJ}رود و نمی${ZWNJ}ایستد`,
      );
    });

    it('applies at sentence boundaries and after opening punctuation', () => {
      expect(fixPersianTypography('«می رود»')).toBe(`«می${ZWNJ}رود»`);
      expect(fixPersianTypography('(می رود)')).toBe(`(می${ZWNJ}رود)`);
    });

    it('does not change text that already uses ZWNJ', () => {
      assertUnchanged(`می${ZWNJ}رود`);
    });

    it('is idempotent for prefix cases', () => {
      assertIdempotent('می رود');
      assertIdempotent('نمی خواهد');
      assertIdempotent('بی شک');
    });
  });

  describe('Rule: verbal-prefix-zwnj (negative — no change when uncertain)', () => {
    it('does not treat در as a verbal prefix', () => {
      assertUnchanged('در شهر');
      assertUnchanged('در رفت');
    });

    it('does not treat هم as a verbal prefix', () => {
      assertUnchanged('هم کار');
      assertUnchanged('هم زمان');
    });

    it('does not join prefix to a single-letter following token', () => {
      assertUnchanged('می و');
    });

    it('does not join prefix to Latin words', () => {
      assertUnchanged('می go');
      assertUnchanged('می test');
    });

    it('does not join prefix to digits', () => {
      assertUnchanged('می 123');
    });

    it('does not join when prefix is part of a longer word', () => {
      assertUnchanged('نمی‌پذیر'); // already correct compound
      assertUnchanged('سمی‌دار'); // contains می but not at boundary
    });

    it('does not join across punctuation', () => {
      assertUnchanged('می، رود');
    });
  });

  describe('Rule: punctuation-space-before', () => {
    it('removes space before Persian punctuation', () => {
      expect(fixPersianTypography('سلام ، دنیا')).toBe('سلام، دنیا');
      expect(fixPersianTypography('چرا ؟')).toBe('چرا؟');
      expect(fixPersianTypography('بسیار !')).toBe('بسیار!');
      expect(fixPersianTypography('پایان ؛')).toBe('پایان؛');
    });

    it('removes space before period after a Persian letter', () => {
      expect(fixPersianTypography('پایان .')).toBe('پایان.');
    });

    it('does not remove space before period after Latin letters', () => {
      assertUnchanged('file .txt');
      assertUnchanged('example .com');
    });

    it('is idempotent', () => {
      assertIdempotent('سلام ، دنیا');
      assertIdempotent('پایان .');
    });
  });

  describe('Rule: punctuation-space-after', () => {
    it('inserts space after punctuation when missing', () => {
      expect(fixPersianTypography('سلام،دنیا')).toBe('سلام، دنیا');
      expect(fixPersianTypography('چرا؟بله')).toBe('چرا؟ بله');
      expect(fixPersianTypography('بسیار!آری')).toBe('بسیار! آری');
      expect(fixPersianTypography('اول؛دوم')).toBe('اول؛ دوم');
    });

    it('does not add space before closing guillemet', () => {
      assertUnchanged('گفت:«سلام»');
    });

    it('does not duplicate existing spaces', () => {
      assertUnchanged('سلام، دنیا');
    });

    it('is idempotent', () => {
      assertIdempotent('سلام،دنیا');
    });
  });

  describe('Rule: guillemet-spacing', () => {
    it('removes space after opening guillemet', () => {
      expect(fixPersianTypography('« کتاب')).toBe('«کتاب');
    });

    it('removes space before closing guillemet', () => {
      expect(fixPersianTypography('کتاب »')).toBe('کتاب»');
    });

    it('fixes both sides', () => {
      expect(fixPersianTypography('« کتاب »')).toBe('«کتاب»');
    });

    it('is idempotent', () => {
      assertIdempotent('« کتاب »');
    });
  });

  describe('Rule: parenthesis-spacing', () => {
    it('removes space after opening parenthesis', () => {
      expect(fixPersianTypography('( متن')).toBe('(متن');
    });

    it('removes space before closing parenthesis', () => {
      expect(fixPersianTypography('متن )')).toBe('متن)');
    });

    it('fixes both sides', () => {
      expect(fixPersianTypography('( متن )')).toBe('(متن)');
    });

    it('is idempotent', () => {
      assertIdempotent('( متن )');
    });
  });

  describe('Rule: persian-straight-quotes', () => {
    it('converts ASCII quotes around Persian text to guillemets', () => {
      expect(fixPersianTypography('"کتاب"')).toBe('«کتاب»');
      expect(fixPersianTypography('"سلام دنیا"')).toBe('«سلام دنیا»');
    });

    it('trims inner whitespace in converted quotes', () => {
      expect(fixPersianTypography('"  کتاب  "')).toBe('«کتاب»');
    });

    it('preserves ZWNJ inside quoted Persian text', () => {
      expect(fixPersianTypography(`"می${ZWNJ}رود"`)).toBe(`«می${ZWNJ}رود»`);
    });

    it('is idempotent', () => {
      assertIdempotent('"کتاب"');
    });
  });

  describe('Rule: persian-straight-quotes (negative — no change when uncertain)', () => {
    it('does not convert quotes around Latin text', () => {
      assertUnchanged('"hello"');
      assertUnchanged('"test world"');
    });

    it('does not convert quotes around mixed-script text', () => {
      assertUnchanged('"سلام world"');
      assertUnchanged('"hello دنیا"');
    });

    it('does not convert quotes around digits only', () => {
      assertUnchanged('"123"');
      assertUnchanged('"۱۲۳"');
    });

    it('does not convert unmatched quotes', () => {
      assertUnchanged('"کتاب');
      assertUnchanged('کتاب"');
    });

    it('does not convert inch-style numeric quotes', () => {
      assertUnchanged('6"');
      assertUnchanged('"6');
    });

    it('does not convert quotes around text with email or URL characters', () => {
      assertUnchanged('"test@example.com"');
      assertUnchanged('"site.com/path"');
    });
  });

  describe('combined examples', () => {
    it('fixes the documented می رود example', () => {
      expect(fixPersianTypography('می رود')).toBe(`می${ZWNJ}رود`);
    });

    it('applies multiple rules in one pass', () => {
      expect(fixPersianTypography('گفت "می رود" ، درست است .')).toBe(
        `گفت «می${ZWNJ}رود»، درست است.`,
      );
    });
  });

  describe('defaults and safety', () => {
    it('does not alter plain Persian text', () => {
      const input = 'سلام دنیا';
      expect(fixPersianTypography(input)).toBe(input);
    });

    it('does not mutate the input string', () => {
      const input = 'می رود';
      const snapshot = input.slice();
      fixPersianTypography(input);
      expect(input).toBe(snapshot);
    });

    it('is deterministic for the same input', () => {
      const input = 'می   رود ، سلام';
      expect(fixPersianTypography(input)).toBe(fixPersianTypography(input));
    });
  });

  describe('idempotency (core invariant)', () => {
    const samples = [
      '',
      'سلام دنیا',
      'می رود',
      'نمی خواهد',
      'بی شک',
      'در شهر',
      'هم کار',
      `می${ZWNJ}رود`,
      `می${ZWNJ}${ZWNJ}رود`,
      `${ZWNJ}متن${ZWNJ}`,
      'سلام   دنیا',
      'سلام ، دنیا',
      'سلام،دنیا',
      'پایان .',
      '« کتاب »',
      '( متن )',
      '"کتاب"',
      '"hello"',
      'file .txt',
      'گفت "می رود" ، درست است .',
    ];

    it('satisfies fix(fix(x)) === fix(x) for all samples', () => {
      for (const input of samples) {
        assertIdempotent(input);
      }
    });

    it('triple application matches single application', () => {
      const input = 'می   رود ، "کتاب"';
      const once = fixPersianTypography(input);
      const thrice = fixPersianTypography(
        fixPersianTypography(fixPersianTypography(input)),
      );
      expect(thrice).toBe(once);
    });
  });
});
