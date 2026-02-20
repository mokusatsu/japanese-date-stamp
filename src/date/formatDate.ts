import { toJapaneseEra } from './japaneseEra';

export type DateFormat = 'wareki' | 'seireki';

interface DateParts {
  year: number;
  month: number;
  day: number;
}

const pad2 = (value: number): string => value.toString().padStart(2, '0');

const parseDateInput = (dateInput: string): DateParts => {
  const matched = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!matched) {
    throw new Error('日付は YYYY-MM-DD 形式で指定してください');
  }

  return {
    year: Number(matched[1]),
    month: Number(matched[2]),
    day: Number(matched[3]),
  };
};

const withSeparator = (year: string, month: string, day: string, separator: string): string => {
  if (separator === '年/月/日') {
    return `${year}年${month}月${day}日`;
  }

  return `${year}${separator}${month}${separator}${day}`;
};

export const formatDateText = (dateInput: string, dateFormat: DateFormat, separator: string): string => {
  if (!dateInput) {
    return '';
  }

  const parts = parseDateInput(dateInput);
  const month = pad2(parts.month);
  const day = pad2(parts.day);

  if (dateFormat === 'seireki') {
    return withSeparator(String(parts.year), month, day, separator);
  }

  const eraDate = toJapaneseEra(parts);
  const eraYearLabel = eraDate.eraYear === 1 ? '元' : String(eraDate.eraYear);

  return withSeparator(`${eraDate.era}${eraYearLabel}`, month, day, separator);
};
