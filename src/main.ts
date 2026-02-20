import './styles.css';
import { drawStamp, type FontFamily } from './stamp/drawStamp';
import { formatDateText, type DateFormat } from './date/formatDate';
import {
  loadHistory,
  saveHistory,
  type StampFormState,
  type StampHistoryEntry,
} from './history/storage';
import { renderHistoryList } from './history/historyList';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = `
  <main class="mx-auto min-h-screen max-w-7xl p-4 sm:p-6 lg:p-8">
    <header class="mb-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">日本向けデータ印ジェネレーター</h1>
      <p class="mt-2 text-sm text-slate-600">入力からプレビュー、履歴、ダウンロードまでを1画面で操作できます。</p>
    </header>

    <section class="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form class="space-y-5 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200" aria-label="データ印設定フォーム">
        <h2 class="text-lg font-semibold">入力設定</h2>

        <div>
          <label class="input-label" for="topText">上枠テキスト</label>
          <input class="input-control" id="topText" type="text" value="田中" />
        </div>

        <div>
          <label class="input-label" for="date">日付</label>
          <input class="input-control" id="date" type="date" value="2026-02-20" />
        </div>

        <div>
          <label class="input-label" for="bottomText">下枠テキスト</label>
          <input class="input-control" id="bottomText" type="text" value="一郎" />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="input-label" for="eraFormat">日付フォーマット</label>
            <select class="input-control" id="eraFormat">
              <option value="wareki">和暦</option>
              <option value="seireki" selected>西暦</option>
            </select>
          </div>
          <div>
            <label class="input-label" for="dateSeparator">日付区切り文字</label>
            <input class="input-control" id="dateSeparator" type="text" list="dateSeparatorPresets" value="/" />
            <datalist id="dateSeparatorPresets">
              <option value="/" />
              <option value="-" />
              <option value="." />
              <option value="年/月/日" />
            </datalist>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="input-label" for="fontFamily">書体</label>
            <select class="input-control" id="fontFamily">
              <option value="mincho" selected>明朝体</option>
              <option value="gothic">ゴシック体</option>
            </select>
          </div>
          <div>
            <label class="input-label" for="textScale">文字サイズ倍率</label>
            <input class="input-control" id="textScale" type="number" min="0.5" max="2" step="0.1" value="1" />
          </div>
          <div>
            <label class="input-label" for="textColor">テキスト色</label>
            <input class="input-control h-10 p-1" id="textColor" type="color" value="#ff0000" />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="input-label" for="strokeWidth">枠線太さ(px)</label>
            <input class="input-control" id="strokeWidth" type="number" min="1" step="1" value="3" />
          </div>
          <div>
            <label class="input-label" for="strokeColor">枠線色</label>
            <input class="input-control h-10 p-1" id="strokeColor" type="color" value="#ff0000" />
          </div>
        </div>

        <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <label class="inline-flex items-center gap-2 text-sm text-slate-700" for="transparentBg">
            <input id="transparentBg" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
            PNGを透過背景で出力
          </label>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <button type="button" class="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">PNGをダウンロード</button>
          <button type="button" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">SVGをダウンロード</button>
        </div>
      </form>

      <div class="space-y-6">
        <section class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-semibold">プレビュー</h2>
            <span class="text-xs text-slate-500">reference-layout.svgベース</span>
          </div>
          <div class="grid place-items-center rounded-lg border border-slate-200 bg-slate-50 p-4">
            <img src="/reference-layout.svg" alt="データ印レイアウト参考図" class="h-auto w-full max-w-xs" />
            <canvas id="stampCanvas" lang="ja-JP" width="300" height="300" class="mt-4 w-full max-w-xs rounded-md border border-dashed border-slate-300 bg-white"></canvas>
          </div>
        </section>

        <section class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 class="text-lg font-semibold">履歴（最大10件）</h2>
          <button id="saveHistoryButton" type="button" class="mt-3 rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">
            現在の設定を履歴に保存
          </button>
          <ul id="historyList" class="mt-3 space-y-2 text-sm" aria-label="履歴一覧"></ul>
        </section>
      </div>
    </section>
  </main>
`;

const topTextInput = document.querySelector<HTMLInputElement>('#topText');
const dateInput = document.querySelector<HTMLInputElement>('#date');
const bottomTextInput = document.querySelector<HTMLInputElement>('#bottomText');
const eraFormatSelect = document.querySelector<HTMLSelectElement>('#eraFormat');
const dateSeparatorInput = document.querySelector<HTMLInputElement>('#dateSeparator');
const fontFamilySelect = document.querySelector<HTMLSelectElement>('#fontFamily');
const textScaleInput = document.querySelector<HTMLInputElement>('#textScale');
const textColorInput = document.querySelector<HTMLInputElement>('#textColor');
const strokeColorInput = document.querySelector<HTMLInputElement>('#strokeColor');
const strokeWidthInput = document.querySelector<HTMLInputElement>('#strokeWidth');
const historyListElement = document.querySelector<HTMLUListElement>('#historyList');
const saveHistoryButton = document.querySelector<HTMLButtonElement>('#saveHistoryButton');
const canvas = document.querySelector<HTMLCanvasElement>('#stampCanvas');

if (
  !topTextInput ||
  !dateInput ||
  !bottomTextInput ||
  !eraFormatSelect ||
  !dateSeparatorInput ||
  !fontFamilySelect ||
  !textScaleInput ||
  !textColorInput ||
  !strokeColorInput ||
  !strokeWidthInput ||
  !historyListElement ||
  !saveHistoryButton ||
  !canvas
) {
  throw new Error('Rendering controls not found');
}

const context = canvas.getContext('2d');

if (!context) {
  throw new Error('Canvas 2D context not found');
}

const getFormState = (): StampFormState => ({
  topText: topTextInput.value,
  date: dateInput.value,
  bottomText: bottomTextInput.value,
  eraFormat: eraFormatSelect.value as DateFormat,
  dateSeparator: dateSeparatorInput.value,
  fontFamily: fontFamilySelect.value as FontFamily,
  textScale: Number(textScaleInput.value),
  textColor: textColorInput.value,
  strokeColor: strokeColorInput.value,
  strokeWidth: Number(strokeWidthInput.value),
});

const applyFormState = (state: StampFormState): void => {
  topTextInput.value = state.topText;
  dateInput.value = state.date;
  bottomTextInput.value = state.bottomText;
  eraFormatSelect.value = state.eraFormat;
  dateSeparatorInput.value = state.dateSeparator;
  fontFamilySelect.value = state.fontFamily;
  textScaleInput.value = String(state.textScale);
  textColorInput.value = state.textColor;
  strokeColorInput.value = state.strokeColor;
  strokeWidthInput.value = String(state.strokeWidth);
};

let histories = loadHistory(localStorage);

const selectHistory = (entry: StampHistoryEntry): void => {
  applyFormState(entry.state);
  render();
};

const renderHistories = (): void => {
  renderHistoryList(historyListElement, histories, selectHistory);
};

const saveCurrentHistory = (): void => {
  histories = saveHistory(localStorage, getFormState());
  renderHistories();
};

const render = (): void => {
  const state = getFormState();

  drawStamp(context, canvas, {
    topText: state.topText,
    dateText: formatDateText(state.date, state.eraFormat, state.dateSeparator),
    bottomText: state.bottomText,
    fontFamily: state.fontFamily,
    textScale: state.textScale,
    textColor: state.textColor,
    strokeColor: state.strokeColor,
    strokeWidth: state.strokeWidth,
  });
};

const renderTargets: Array<HTMLInputElement | HTMLSelectElement> = [
  topTextInput,
  dateInput,
  bottomTextInput,
  eraFormatSelect,
  dateSeparatorInput,
  fontFamilySelect,
  textScaleInput,
  textColorInput,
  strokeColorInput,
  strokeWidthInput,
];

for (const target of renderTargets) {
  target.addEventListener('input', render);
  target.addEventListener('change', render);
}

saveHistoryButton.addEventListener('click', saveCurrentHistory);

renderHistories();

render();
