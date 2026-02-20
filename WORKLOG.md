# WORKLOG

- 2026-02-20 | Task: AGENTS.md TASKS.md運用ルール追記
  - 概要: `AGENTS.md` に TASKS.md の形式・必須項目・ステータス・実行順序・完了条件・作業ログ運用ルールを追加。
  - 確認コマンド:
    - `nl -ba AGENTS.md`
    - `git status --short`

- 2026-02-20 | Task: T-000 SPEC.mdに基づく初期タスク分解
  - 概要: `SPEC.md` の機能要件・非機能要件を実装単位へ分割し、依存関係付きのタスク一覧（T-001〜T-007）を `TASKS.md` に新規作成。
  - 確認コマンド:
    - `cat SPEC.md`（仕様参照）
    - `cat TASKS.md`（タスク定義確認）
    - `git status --short`（変更確認）

- 2026-02-20 | Task: T-001 SPA骨組みとTailwindベースの単一画面UI構築
  - 概要: `index.html` / `src/main.ts` / `src/styles.css` を中心にVite+Tailwind基盤を構築し、仕様4.1/4.2に対応する入力フォーム・プレビュー（`reference-layout.svg`採用）・履歴欄・ダウンロード操作を単一画面へ実装。`TESTS.md` を新規作成して回帰テストケースを記録。
  - 確認コマンド:
    - `npm run build`（成功）
    - `npm run lint`（成功）
    - `git status --short`

- 2026-02-20 | Task: T-001a GitHub Pagesデプロイ基盤（Vite base + Actions）整備
  - 概要: `vite.config.ts` を新規追加し `base: "/japanese-date-stamp/"` を設定。`.github/workflows/deploy.yml` を追加して `main` への push で `npm ci` → `npm run build` → GitHub Pages デプロイを自動化。
  - 確認コマンド:
    - `npm run build`（成功）
    - `git status --short`

- 2026-02-20 | Task: T-002 Canvas印影レンダリングエンジン実装
  - 概要: `src/stamp/layout.ts` に印影レイアウト計算を実装し、`src/stamp/drawStamp.ts` で外周円・内部2本線・3領域テキスト描画を関数化。`src/main.ts` からフォーム入力イベントで再描画を呼び出し、即時プレビュー更新を実装。`src/stamp/drawStamp.test.ts` を追加して描画呼び出しとレイアウト算出を検証。`TESTS.md` に実行チェックと回帰テストケースを追記。
  - 確認コマンド:
    - `npm run test -- drawStamp`（成功）
    - `npm run build`（成功）
    - `npm run lint`（成功）
    - `git status --short`

- 2026-02-20 | Task: T-002 フィードバック対応（reference-layout.svg一致化）
  - 概要: `src/stamp/layout.ts` と `src/stamp/drawStamp.ts` を更新し、`reference-layout.svg` と同一の座標系（300基準）・外周太線/内周細線/横線2本/テキスト基準位置で描画するよう補正。`src/stamp/drawStamp.test.ts` を一致仕様に合わせて更新し、位置と半径を固定値検証。`src/main.ts` のcanvasサイズを300x300へ調整。`TESTS.md` に一致性回帰ケースを追記。
  - 確認コマンド:
    - `npm run test -- drawStamp`（成功）
    - `npm run build`（成功）
    - `npm run lint`（成功）
    - `git status --short`

- 2026-02-20 | Task: T-002 フィードバック対応（ストローク太さ・日本語グリフ修正）
  - 概要: `src/stamp/drawStamp.ts` の線幅計算を `reference-layout.svg` と同じ外周2倍/内周・横線同一へ調整し、フォントスタックを日本語優先（Noto/Hiragino/Yu）へ更新。`index.html` の `lang` を `ja-JP` と `Content-Language` に修正し、`src/main.ts` の初期テキストを上枠「田中」・下枠「一郎」に変更。`TESTS.md` に回帰ケースを追記。
  - 確認コマンド:
    - `npm run test -- drawStamp`（成功）
    - `npm run build`（成功）
    - `npm run lint`（成功）
    - 

- 2026-02-20 | Task: T-003 日付フォーマット（和暦/西暦・区切り）実装
  - 概要: `src/date/japaneseEra.ts` と `src/date/formatDate.ts` を新規追加し、和暦変換（令和/平成/昭和/大正/明治）と西暦/和暦の整形処理を実装。`src/main.ts` で日付フォーマット選択と区切り文字（プリセット+自由入力）を `formatDateText` に接続し、中央領域へ即時反映。`src/date/formatDate.test.ts` と `TESTS.md` を追加更新し回帰検証を整備。
  - 確認コマンド:
    - `npm run test -- formatDate`（成功）
    - `npm run build`（成功）
    - `npm run lint`（成功）
    - `rg -n "日付フォーマット|区切り|和暦|西暦|formatDateText" SPEC.md src/main.ts src/date/formatDate.ts src/date/japaneseEra.ts`（仕様突合せ）
    - `git status --short`

- 2026-02-20 | Task: T-004 書体・文字サイズ制御と枠線カスタマイズ実装
  - 概要: `src/stamp/textStyle.ts` を新規追加し、書体マップ、文字サイズ倍率クランプ、長文時の自動縮小処理を実装。`src/stamp/drawStamp.ts` を更新して全領域への書体一括反映・文字サイズ倍率・枠線色/太さ反映を統合。`src/main.ts` に文字サイズ倍率入力を追加し、即時再描画へ接続。`src/stamp/textStyle.test.ts` を追加し、`src/stamp/drawStamp.test.ts` を更新。`TESTS.md` に実行結果と回帰ケースを追記。
  - 確認コマンド:
    - `npm run test -- textStyle`（成功）
    - `npm run test -- drawStamp`（成功）
    - `npm run build`（成功）
    - `npm run lint`（成功）
    - `rg -n "文字サイズ|書体|枠線太さ|枠線色|自動縮小|fitFontSizeToWidth|textScale|fontFamily|strokeWidth|strokeColor" SPEC.md src/main.ts src/stamp/drawStamp.ts src/stamp/textStyle.ts`（成功: 仕様突合せ）

- 2026-02-20 | Task: T-005 PNG/SVGダウンロード機能と透過背景対応
  - 概要: `src/export/exportPng.ts` を追加し、PNG透過背景ON/OFFの切替出力（通常時は白背景合成）を実装。`src/export/exportSvg.ts` を追加し、プレビュー同等構造のSVG生成とダウンロードを実装。`src/main.ts` のPNG/SVGボタンを新規エクスポート処理へ接続。`src/export/*.test.ts` と `TESTS.md` を更新し、回帰防止ケースを追記。
  - 確認コマンド:
    - `npm run test -- export`（成功）
    - `npm run build`（成功）
    - `npm run lint`（成功）
    - `rg -n "透過背景|ダウンロード形式|PNG|SVG|exportPng|exportSvg|transparentBg|ダウンロード" SPEC.md src/main.ts src/export/exportPng.ts src/export/exportSvg.ts`（成功: 仕様突合せ）
    - `git status --short`

- 2026-02-20 | Task: T-006 LocalStorage履歴（最大10件）と編集再開機能
  - 概要: `src/history/storage.ts` を追加してLocalStorage永続化と最新10件ローテーションを実装。`src/history/historyList.ts` を追加して履歴一覧描画と選択復元を実装。`src/main.ts` に「現在の設定を履歴に保存」操作、履歴描画、履歴選択時のフォーム・プレビュー復元を接続。
  - 確認コマンド:
    - `npm run test -- storage`（成功）
    - `npm run test`（成功）
    - `npm run lint`（成功）
    - `npm run build`（成功）
    - `rg -n "LocalStorage|履歴|最大10件|編集再開|外部通信" SPEC.md src/main.ts src/history/storage.ts src/history/historyList.ts`（成功: 仕様突合せ）
