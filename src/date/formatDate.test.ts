import { describe, expect, it } from 'vitest';

import { formatDateText } from './formatDate';
import { toJapaneseEra } from './japaneseEra';

describe('toJapaneseEra', () => {
  it('令和開始日を令和元年として変換する', () => {
    expect(toJapaneseEra({ year: 2019, month: 5, day: 1 })).toEqual({ era: '令和', eraYear: 1 });
  });

  it('平成開始日の前日は昭和として変換する', () => {
    expect(toJapaneseEra({ year: 1989, month: 1, day: 7 })).toEqual({ era: '昭和', eraYear: 64 });
  });
});

describe('formatDateText', () => {
  it('西暦を区切り文字で整形する', () => {
    expect(formatDateText('2026-02-20', 'seireki', '/')).toBe('2026/02/20');
    expect(formatDateText('2026-02-20', 'seireki', '-')).toBe('2026-02-20');
  });

  it('和暦を区切り文字で整形する', () => {
    expect(formatDateText('2026-02-20', 'wareki', '/')).toBe('令和8/02/20');
  });

  it('年/月/日プリセットを和暦と西暦の両方に適用する', () => {
    expect(formatDateText('2026-02-20', 'seireki', '年/月/日')).toBe('2026年02月20日');
    expect(formatDateText('2019-05-01', 'wareki', '年/月/日')).toBe('令和元年05月01日');
  });

  it('空文字の日付は空文字を返す', () => {
    expect(formatDateText('', 'seireki', '/')).toBe('');
  });
});
