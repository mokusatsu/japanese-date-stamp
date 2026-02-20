import type { DateFormat } from '../date/formatDate';
import type { FontFamily } from '../stamp/drawStamp';

export const HISTORY_STORAGE_KEY = 'japanese-date-stamp.history';
export const HISTORY_LIMIT = 10;

export interface StampFormState {
  topText: string;
  date: string;
  bottomText: string;
  eraFormat: DateFormat;
  dateSeparator: string;
  fontFamily: FontFamily;
  textScale: number;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface StampHistoryEntry {
  id: string;
  savedAt: string;
  state: StampFormState;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isStampFormState = (value: unknown): value is StampFormState => {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.topText === 'string' &&
    typeof value.date === 'string' &&
    typeof value.bottomText === 'string' &&
    (value.eraFormat === 'wareki' || value.eraFormat === 'seireki') &&
    typeof value.dateSeparator === 'string' &&
    (value.fontFamily === 'mincho' || value.fontFamily === 'gothic') &&
    typeof value.textScale === 'number' &&
    typeof value.textColor === 'string' &&
    typeof value.strokeColor === 'string' &&
    typeof value.strokeWidth === 'number'
  );
};

const isHistoryEntry = (value: unknown): value is StampHistoryEntry => {
  if (!isObject(value)) {
    return false;
  }

  return typeof value.id === 'string' && typeof value.savedAt === 'string' && isStampFormState(value.state);
};

export const loadHistory = (storage: Storage): StampHistoryEntry[] => {
  const raw = storage.getItem(HISTORY_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isHistoryEntry).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
};

const trimHistory = (entries: StampHistoryEntry[]): StampHistoryEntry[] => entries.slice(0, HISTORY_LIMIT);

const buildEntryId = (savedAt: string): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `history-${savedAt}-${Math.random().toString(16).slice(2)}`;
};

export const saveHistory = (
  storage: Storage,
  state: StampFormState,
  now: () => string = () => new Date().toISOString(),
): StampHistoryEntry[] => {
  const savedAt = now();
  const nextEntry: StampHistoryEntry = {
    id: buildEntryId(savedAt),
    savedAt,
    state,
  };

  const current = loadHistory(storage);
  const updated = trimHistory([nextEntry, ...current]);
  storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));

  return updated;
};
