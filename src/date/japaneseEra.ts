export type JapaneseEra = '令和' | '平成' | '昭和' | '大正' | '明治';

interface EraBoundary {
  era: JapaneseEra;
  start: { year: number; month: number; day: number };
}

const ERA_BOUNDARIES: EraBoundary[] = [
  { era: '令和', start: { year: 2019, month: 5, day: 1 } },
  { era: '平成', start: { year: 1989, month: 1, day: 8 } },
  { era: '昭和', start: { year: 1926, month: 12, day: 25 } },
  { era: '大正', start: { year: 1912, month: 7, day: 30 } },
  { era: '明治', start: { year: 1868, month: 1, day: 25 } },
];

const isOnOrAfter = (
  date: { year: number; month: number; day: number },
  target: { year: number; month: number; day: number },
): boolean => {
  if (date.year !== target.year) {
    return date.year > target.year;
  }

  if (date.month !== target.month) {
    return date.month > target.month;
  }

  return date.day >= target.day;
};

export interface JapaneseEraDate {
  era: JapaneseEra;
  eraYear: number;
}

export const toJapaneseEra = (date: { year: number; month: number; day: number }): JapaneseEraDate => {
  const matched = ERA_BOUNDARIES.find((boundary) => isOnOrAfter(date, boundary.start));

  if (!matched) {
    throw new Error('対応していない日付です（明治以前）');
  }

  return {
    era: matched.era,
    eraYear: date.year - matched.start.year + 1,
  };
};
