import { describe, expect, it } from 'vitest';

import { HISTORY_LIMIT, HISTORY_STORAGE_KEY, loadHistory, saveHistory, type StampFormState } from './storage';

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const createState = (seed: number): StampFormState => ({
  topText: `上-${seed}`,
  date: `2026-02-${String((seed % 28) + 1).padStart(2, '0')}`,
  bottomText: `下-${seed}`,
  eraFormat: seed % 2 === 0 ? 'seireki' : 'wareki',
  dateSeparator: '/',
  fontFamily: seed % 2 === 0 ? 'mincho' : 'gothic',
  textScale: 1,
  textColor: '#ff0000',
  strokeColor: '#ff0000',
  strokeWidth: 3,
});

describe('history storage', () => {
  it('履歴が未保存の場合は空配列を返す', () => {
    const storage = new MemoryStorage();

    expect(loadHistory(storage)).toEqual([]);
  });

  it('保存時に先頭へ追加し、10件を超えた分を削除する', () => {
    const storage = new MemoryStorage();

    for (let index = 0; index < HISTORY_LIMIT + 2; index += 1) {
      saveHistory(storage, createState(index), () => `2026-02-20T12:00:${String(index).padStart(2, '0')}.000Z`);
    }

    const entries = loadHistory(storage);

    expect(entries).toHaveLength(HISTORY_LIMIT);
    expect(entries[0]?.state.topText).toBe('上-11');
    expect(entries.at(-1)?.state.topText).toBe('上-2');
  });

  it('不正なJSONが保存されている場合は空配列へフォールバックする', () => {
    const storage = new MemoryStorage();
    storage.setItem(HISTORY_STORAGE_KEY, '{invalid-json');

    expect(loadHistory(storage)).toEqual([]);
  });
});
