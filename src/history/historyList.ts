import { formatDateText, type DateFormat } from '../date/formatDate';
import type { StampHistoryEntry } from './storage';

type RenderHistoryListOptions = {
  listElement: HTMLUListElement;
  entries: StampHistoryEntry[];
  onSelect: (entry: StampHistoryEntry) => void;
};

const makeEntryLabel = (entry: StampHistoryEntry): string => {
  const dateText = formatDateText(entry.values.date, entry.values.eraFormat as DateFormat, entry.values.dateSeparator);
  return `${dateText} ${entry.values.topText} / ${entry.values.bottomText}`;
};

export const renderHistoryList = ({ listElement, entries, onSelect }: RenderHistoryListOptions): void => {
  listElement.innerHTML = '';

  if (entries.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'rounded-md border border-dashed border-slate-300 px-3 py-2 text-slate-500';
    emptyItem.textContent = '履歴はまだありません';
    listElement.append(emptyItem);
    return;
  }

  for (const entry of entries) {
    const item = document.createElement('li');
    const button = document.createElement('button');

    button.type = 'button';
    button.className =
      'w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100';
    button.textContent = makeEntryLabel(entry);
    button.addEventListener('click', () => onSelect(entry));

    item.append(button);
    listElement.append(item);
  }
};
