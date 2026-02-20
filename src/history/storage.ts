export type StampFormValues = {
  topText: string;
  date: string;
  bottomText: string;
  eraFormat: 'wareki' | 'seireki';
  dateSeparator: string;
  fontFamily: 'mincho' | 'gothic';
  textScale: number;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
  transparentBackground: boolean;
};

export type StampHistoryEntry = {
  id: string;
  createdAt: string;
  values: StampFormValues;
};

export const HISTORY_STORAGE_KEY = 'japanese-date-stamp.history.v1';
const HISTORY_LIMIT = 10;

export const loadHistory = (storage: Storage = localStorage): StampHistoryEntry[] => {
  const raw = storage.getItem(HISTORY_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as StampHistoryEntry[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
};

export const saveHistory = (
  values: StampFormValues,
  storage: Storage = localStorage,
): StampHistoryEntry[] => {
  const history = loadHistory(storage);
  const nextEntry: StampHistoryEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    values,
  };

  const next = [nextEntry, ...history].slice(0, HISTORY_LIMIT);
  storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));

  return next;
};
