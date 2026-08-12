/**
 * Known Gregorian ↔ Jalali conversion fixtures.
 *
 * Sources: Wikipedia Solar Hijri calendar, fourmilab.ch calendar converter,
 * and jalaali-js test vectors.
 */
export const KNOWN_CONVERSIONS = [
  {
    label: 'Nowruz 1403',
    gregorian: { year: 2024, month: 3, day: 20 },
    jalali: { year: 1403, month: 1, day: 1 },
  },
  {
    label: 'Nowruz 1402',
    gregorian: { year: 2023, month: 3, day: 21 },
    jalali: { year: 1402, month: 1, day: 1 },
  },
  {
    label: 'End of 1402 (common year Esfand 29)',
    gregorian: { year: 2024, month: 3, day: 19 },
    jalali: { year: 1402, month: 12, day: 29 },
  },
  {
    label: 'Leap Esfand 30 (1395)',
    gregorian: { year: 2017, month: 3, day: 20 },
    jalali: { year: 1395, month: 12, day: 30 },
  },
  {
    label: 'jalaali-js example',
    gregorian: { year: 2016, month: 4, day: 11 },
    jalali: { year: 1395, month: 1, day: 23 },
  },
  {
    label: 'Mid-year summer date',
    gregorian: { year: 2021, month: 7, day: 21 },
    jalali: { year: 1400, month: 4, day: 30 },
  },
  {
    label: 'Late Shahrivar',
    gregorian: { year: 2025, month: 9, day: 22 },
    jalali: { year: 1404, month: 6, day: 31 },
  },
  {
    label: 'Leap year boundary (1399 leap)',
    gregorian: { year: 2021, month: 3, day: 20 },
    jalali: { year: 1399, month: 12, day: 30 },
  },
  {
    label: 'Common year boundary (1398)',
    gregorian: { year: 2020, month: 3, day: 19 },
    jalali: { year: 1398, month: 12, day: 29 },
  },
  {
    label: 'Historical anchor (1357 revolution era)',
    gregorian: { year: 1979, month: 2, day: 11 },
    jalali: { year: 1357, month: 11, day: 22 },
  },
] as const;

export const LEAP_JALALI_YEARS = [1395, 1399, 1403, 1408] as const;

export const COMMON_JALALI_YEARS = [1394, 1398, 1402, 1404] as const;
