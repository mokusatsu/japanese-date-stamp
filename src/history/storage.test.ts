import { describe, expect, it, vi } from 'vitest';
import { HISTORY_STORAGE_KEY, loadHistory, saveHistory, type StampFormValues } from './storage';

const createStorageMock = (): Storage => {
  const map = new Map<string, string>();

  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
};

const sampleValues: StampFormValues = {
  topText: '営業部',
  date: '2026-02-20',
  bottomText: '確認済',
  eraFormat: 'seireki',
  dateSeparator: '/',
  fontFamily: 'mincho',
  textScale: 1,
  textColor: '#ff0000',
  strokeColor: '#ff0000',
  strokeWidth: 3,
  transparentBackground: false,
};

describe('history/storage', () => {
  it('returns empty history when storage has no data', () => {
    const storage = createStorageMock();

    expect(loadHistory(storage)).toEqual([]);
  });

  it('saves history and keeps only latest 10 entries', () => {
    const storage = createStorageMock();
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => 'fixed-id');

    for (let index = 0; index < 11; index += 1) {
      saveHistory({ ...sampleValues, topText: `部署${index}` }, storage);
    }

    const loaded = loadHistory(storage);
    expect(loaded).toHaveLength(10);
    expect(loaded[0].values.topText).toBe('部署10');
    expect(loaded[9].values.topText).toBe('部署1');
  });

  it('returns empty when stored data is invalid json', () => {
    const storage = createStorageMock();
    storage.setItem(HISTORY_STORAGE_KEY, '{invalid json');

    expect(loadHistory(storage)).toEqual([]);
  });
});
