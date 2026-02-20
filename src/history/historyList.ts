import { formatDateText } from '../date/formatDate';
import type { StampHistoryEntry } from './storage';

const EMPTY_MESSAGE = '履歴はまだありません。設定を保存するとここに表示されます。';

const formatSavedAt = (savedAt: string): string => {
  const date = new Date(savedAt);

  if (Number.isNaN(date.getTime())) {
    return savedAt;
  }

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const createLabel = (entry: StampHistoryEntry): string => {
  const state = entry.state;
  const formattedDate = formatDateText(state.date, state.eraFormat, state.dateSeparator);

  return `${formattedDate || '日付未設定'} ${state.topText || '上枠未設定'} / ${state.bottomText || '下枠未設定'}`;
};

export const renderHistoryList = (
  listElement: HTMLUListElement,
  entries: StampHistoryEntry[],
  onSelect: (entry: StampHistoryEntry) => void,
): void => {
  listElement.replaceChildren();

  if (entries.length === 0) {
    const item = document.createElement('li');
    item.className = 'rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500';
    item.textContent = EMPTY_MESSAGE;
    listElement.append(item);
    return;
  }

  for (const entry of entries) {
    const item = document.createElement('li');
    const button = document.createElement('button');

    button.type = 'button';
    button.className =
      'w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm transition hover:border-sky-300 hover:bg-sky-50';

    const title = document.createElement('div');
    title.className = 'font-medium text-slate-900';
    title.textContent = createLabel(entry);

    const subtitle = document.createElement('div');
    subtitle.className = 'mt-1 text-xs text-slate-500';
    subtitle.textContent = `保存日時: ${formatSavedAt(entry.savedAt)}`;

    button.append(title, subtitle);
    button.addEventListener('click', () => onSelect(entry));

    item.append(button);
    listElement.append(item);
  }
};
