/**
 * Gregorian ↔ Jalali conversion using the Borkowski algorithm.
 *
 * Based on the proven implementation in [jalaali-js](https://github.com/jalaali/jalaali-js)
 * (Kazimierz M. Borkowski). Valid for Jalali years −61 through 3177.
 *
 * This module is internal; public callers use {@link toJalali} and
 * {@link toGregorian}.
 */

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192,
  2262, 2324, 2394, 2456, 3178,
] as const;

export const MIN_JALALI_YEAR = BREAKS[0];
export const MAX_JALALI_YEAR = BREAKS.at(-1)! - 1;

function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

function mod(a: number, b: number): number {
  return a - Math.trunc(a / b) * b;
}

function leapFromCycle(jump: number, n: number): number {
  let adjusted = n;
  if (jump - n < 6) {
    adjusted = n - jump + div(jump + 4, 33) * 33;
  }

  let leap = mod(mod(adjusted + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }

  return leap;
}

function jalCalCore(jy: number): {
  gy: number;
  march: number;
  jump: number;
  n: number;
} {
  assertJalaliYear(jy);

  const gy = jy + 621;
  let leapJ = -14;
  let jp: number = BREAKS[0];
  let jump = 0;

  for (let i = 1; i < BREAKS.length; i += 1) {
    const breakYear = BREAKS[i]!;
    jump = breakYear - jp;
    if (jy < breakYear) {
      break;
    }
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = breakYear;
  }

  const n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);

  if (mod(jump, 33) === 4 && jump - n === 4) {
    leapJ += 1;
  }

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

  return {
    gy,
    march: 20 + leapJ - leapG,
    jump,
    n,
  };
}

function jalCalLeap(jy: number): number {
  assertJalaliYear(jy);

  let jp: number = BREAKS[0];
  let jump = 0;

  for (let i = 1; i < BREAKS.length; i += 1) {
    const breakYear = BREAKS[i]!;
    jump = breakYear - jp;
    if (jy < breakYear) {
      break;
    }
    jp = breakYear;
  }

  return leapFromCycle(jump, jy - jp);
}

export function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

export function d2g(jdn: number): GregorianParts {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;

  return {
    year: div(j, 1461) - 100100 + div(8 - gm, 6),
    month: gm,
    day: gd,
  };
}

export function j2d(jy: number, jm: number, jd: number): number {
  const { gy, march } = jalCalShort(jy);
  return g2d(gy, 3, march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function jalCalShort(jy: number): { gy: number; march: number } {
  const { gy, march } = jalCalCore(jy);
  return { gy, march };
}

function jalCal(jy: number): { leap: number; gy: number; march: number } {
  const { gy, march, jump, n } = jalCalCore(jy);
  return {
    leap: leapFromCycle(jump, n),
    gy,
    march,
  };
}

export type GregorianParts = {
  year: number;
  month: number;
  day: number;
};

export type JalaliParts = {
  year: number;
  month: number;
  day: number;
};

const FIRST_JALALI_JDN = j2d(MIN_JALALI_YEAR, 1, 1);
const LAST_JALALI_JDN = j2d(
  MAX_JALALI_YEAR,
  12,
  jalaliMonthLength(MAX_JALALI_YEAR, 12),
);

export function gregorianToJalali(
  year: number,
  month: number,
  day: number,
): JalaliParts {
  return d2j(g2d(year, month, day));
}

export function jalaliToGregorian(
  year: number,
  month: number,
  day: number,
): GregorianParts {
  return d2g(j2d(year, month, day));
}

export function isLeapJalaliYear(year: number): boolean {
  return jalCalLeap(year) === 0;
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) {
    return 31;
  }
  if (jm <= 11) {
    return 30;
  }
  return isLeapJalaliYear(jy) ? 30 : 29;
}

export function isValidJalaliDate(
  year: number,
  month: number,
  day: number,
): boolean {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    year >= MIN_JALALI_YEAR &&
    year <= MAX_JALALI_YEAR &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= jalaliMonthLength(year, month)
  );
}

export function assertJalaliYear(year: number): void {
  if (
    !Number.isFinite(year) ||
    year < MIN_JALALI_YEAR ||
    year > MAX_JALALI_YEAR
  ) {
    throw new RangeError(
      `Invalid Jalali year ${String(year)}: must be a finite number between ${String(MIN_JALALI_YEAR)} and ${String(MAX_JALALI_YEAR)} (inclusive)`,
    );
  }
}

export function assertValidJalaliDate(
  year: number,
  month: number,
  day: number,
): void {
  assertJalaliYear(year);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError(
      `Invalid Jalali month ${String(month)}: must be an integer between 1 and 12`,
    );
  }

  const maxDay = jalaliMonthLength(year, month);
  if (!Number.isInteger(day) || day < 1 || day > maxDay) {
    throw new RangeError(
      `Invalid Jalali day ${String(day)}: must be an integer between 1 and ${String(maxDay)} for month ${String(month)} in year ${String(year)}`,
    );
  }
}

function d2j(jdn: number): JalaliParts {
  if (jdn < FIRST_JALALI_JDN || jdn > LAST_JALALI_JDN) {
    throw new RangeError(
      `Date is outside the supported Jalali range [${String(MIN_JALALI_YEAR)}, ${String(MAX_JALALI_YEAR)}]`,
    );
  }

  const gy = d2g(jdn).year;
  let jy = Math.min(gy - 621, MAX_JALALI_YEAR);
  const r = jalCal(jy);
  let k = jdn - g2d(r.gy, 3, r.march);

  if (k >= 0) {
    if (k <= 185) {
      return {
        year: jy,
        month: 1 + div(k, 31),
        day: mod(k, 31) + 1,
      };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) {
      k += 1;
    }
  }

  return {
    year: jy,
    month: 7 + div(k, 30),
    day: mod(k, 30) + 1,
  };
}
