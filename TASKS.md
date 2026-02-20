# TASKS

## T-000: SPEC.mdに基づく初期タスク分解
- status: done
- priority: high
- depends_on: []
- scope:
  - TASKS.md
  - WORKLOG.md
- spec_refs:
  - SPEC.md 1.目的
  - SPEC.md 2.スコープ
  - SPEC.md 7.機能要件
  - SPEC.md 8.非機能要件
- goal: 仕様を実装可能な単位へ分解し、依存関係付きのタスク計画を確立する。
- steps:
  1. SPEC.md の要件を機能群（UI、描画、フォーマット、出力、履歴）に分類する。
  2. 1目的あたり1〜3ファイルの粒度で実装タスクを定義する。
  3. depends_on と受け入れ条件を付与し、実行順序を確定する。
- acceptance_criteria:
  - 固定項目を満たすタスク一覧が TASKS.md に記載されている。
  - 主要機能要件（7章）が少なくとも1つのタスクにトレースされている。
- checks:
  - `cat SPEC.md`
  - `cat TASKS.md`
- definition_of_done:
  - TASKS.md に実行可能なタスクバックログが作成され、依存関係が明示されている。
  - WORKLOG.md に本タスクの実施記録が追記されている。
- notes:
  - SPEC.md をもとに実装バックログ（T-001〜T-007）を新規作成した。

## T-001: SPA骨組みとTailwindベースの単一画面UI構築
- status: done
- priority: high
- depends_on: []
- scope:
  - index.html
  - src/main.ts
  - src/styles.css
- spec_refs:
  - SPEC.md 3.1 アーキテクチャ
  - SPEC.md 4.1 入力項目
  - SPEC.md 8.3 ユーザビリティ
- goal: 入力フォーム・プレビュー領域・履歴欄・ダウンロード操作を含む単一画面のUI基盤を作る。
- steps:
  1. 画面レイアウト（フォーム/Canvas/履歴/操作）を実装する。
  2. Tailwind CSS で可読性の高い余白・コントラストを適用する。
  3. 入力コントロールの初期値（色、線幅など）を仕様通り設定する。
- acceptance_criteria:
  - 画面上に仕様4.1/4.2の全操作要素が表示される。
  - 単一画面で主要操作に到達できる。
- checks:
  - `npm run build`
  - `npm run lint`
- definition_of_done:
  - UI骨組みが構築され、以降の描画・出力機能を接続できる状態である。
- notes:
  - Vite + Tailwind のSPA骨組みを構築し、仕様4.1/4.2の入力要素・プレビュー・履歴・ダウンロード操作を単一画面へ配置。
  - `reference-layout.svg` をプレビュー領域に組み込み、後続タスクでCanvas描画接続しやすい構成へ整理。
  - checks実行結果: `npm run build` 成功 / `npm run lint` 成功。

## T-001a: GitHub Pagesデプロイ基盤（Vite base + Actions）整備
- status: done
- priority: high
- depends_on: []
- scope:
  - vite.config.ts
  - .github/workflows/deploy.yml
  - WORKLOG.md
- spec_refs:
  - SPEC.md 3.1 アーキテクチャ
  - SPEC.md 7.14
- goal: GitHub Pages（`https://mokusatsu.github.io/japanese-date-stamp/`）へビルド成果物を自動公開できる状態にする。
- steps:
  1. Viteの`base`を`/japanese-date-stamp/`に設定する。
  2. mainブランチpushで`npm ci`→`npm run build`→PagesデプロイするGitHub Actionsを追加する。
  3. ビルドコマンドを実行して成果物生成を確認する。
- acceptance_criteria:
  - `npm run build` が成功する。
  - `.github/workflows/deploy.yml` によりGitHub Pagesデプロイジョブが実行可能である。
  - `base`設定によりPages配信パスでアセットが解決される。
- checks:
  - `npm run build`（成功）
- definition_of_done:
  - リポジトリにPagesデプロイワークフローとVite base設定が追加されている。
  - WORKLOG.mdに作業記録が追記されている。
- notes:
  - `vite.config.ts` を新規作成し `base: "/japanese-date-stamp/"` を設定。
  - `.github/workflows/deploy.yml` を追加し、GitHub ActionsでPagesへ自動デプロイする構成を実装。

## T-002: Canvas印影レンダリングエンジン実装
- status: done
- priority: high
- depends_on:
  - T-001
- scope:
  - src/stamp/drawStamp.ts
  - src/stamp/layout.ts
  - src/main.ts
- spec_refs:
  - SPEC.md 3.2 レンダリング
  - SPEC.md 5.1 外形
  - SPEC.md 5.2 内部構造
  - SPEC.md 5.3 文字配置
  - SPEC.md 7.1
- goal: 円形枠・内部2本線・3領域テキストをCanvas上に即時描画できるようにする。
- steps:
  1. 描画パラメータから外周円と内部線を描画する。
  2. 上中下テキストを中央揃えで配置する。
  3. 入力変更時に再描画されるイベント連携を行う。
- acceptance_criteria:
  - 仕様の印影構造（円＋2線＋3領域文字）がプレビューに反映される。
  - 入力変更に追従して遅延なく再描画される。
- checks:
  - `npm run test -- drawStamp`
  - `npm run build`
- definition_of_done:
  - 描画ロジックが関数分離され、UIイベントから再利用可能である。
- notes:
  - Canvas描画エンジンを `src/stamp/drawStamp.ts` と `src/stamp/layout.ts` に分離実装し、外周円・内部2本線・3領域テキストを描画可能にした。
  - `src/main.ts` で入力フォーム（上段/日付/下段/書体/色/線幅）イベントを再描画処理に接続し、入力変更時の即時プレビュー更新を実装した。
  - checks実行結果: `npm run test -- drawStamp` 成功 / `npm run build` 成功。
  - フィードバック対応として `reference-layout.svg` の座標・二重円構造（外周r142/内周r128）・横線位置（y=100/200）・文字位置（y=70/150/240）へ描画基準を一致させた。
  - 追加修正として線ストローク太さを `reference-layout.svg` の仕様（外周2倍・内周/横線同一、既定3px）に一致させ、初期テキストを上枠「田中」/下枠「一郎」へ変更。HTML言語指定を `ja-JP` へ修正し日本語グリフ優先フォントを適用した。

## T-003: 日付フォーマット（和暦/西暦・区切り）実装
- status: done
- priority: high
- depends_on:
  - T-002
- scope:
  - src/date/formatDate.ts
  - src/date/japaneseEra.ts
  - src/main.ts
- spec_refs:
  - SPEC.md 4.1 日付フォーマット
  - SPEC.md 5.6 日付フォーマット
  - SPEC.md 6.1 入力
  - SPEC.md 7.5
  - SPEC.md 7.6
- goal: 指定された日付を和暦/西暦および任意区切りで整形し、中央領域と出力へ反映する。
- steps:
  1. 西暦フォーマット処理を実装する。
  2. 和暦変換処理（元号・年数）を実装する。
  3. 区切りプリセット/自由入力を表示文字列に適用する。
- acceptance_criteria:
  - 和暦/西暦切替が表示に反映される。
  - 区切り変更が日付表示と出力に反映される。
- checks:
  - `npm run test -- formatDate`（成功）
  - `npm run build`（成功）
  - `npm run lint`（成功）
- definition_of_done:
  - 日付整形ロジックがユニットテスト可能な独立モジュールとして実装されている。
- notes:
  - `src/date/japaneseEra.ts` と `src/date/formatDate.ts` を追加し、和暦（令和/平成/昭和/大正/明治）変換と西暦/和暦フォーマット処理を実装。
  - `src/main.ts` から日付入力を `formatDateText` 経由で描画へ反映し、日付フォーマット切替と区切り文字（プリセット+自由入力）を即時プレビュー更新に接続。
  - `src/date/formatDate.test.ts` を追加し、元号境界・区切り文字適用・和暦/西暦の整形ロジックを検証。

## T-004: 書体・文字サイズ制御と枠線カスタマイズ実装
- status: done
- priority: medium
- depends_on:
  - T-002
- scope:
  - src/stamp/textStyle.ts
  - src/stamp/drawStamp.ts
  - src/main.ts
- spec_refs:
  - SPEC.md 5.3 文字配置
  - SPEC.md 5.4 書体
  - SPEC.md 5.5 枠線カスタマイズ
  - SPEC.md 7.4
  - SPEC.md 7.7
  - SPEC.md 7.8
- goal: 明朝/ゴシック切替、文字サイズ調整、枠線太さ・色変更を描画へ反映する。
- steps:
  1. 書体系フォントファミリーの切替処理を追加する。
  2. 長文時の視認性確保（自動縮小または制限）を実装する。
  3. 枠線太さ・色を外周と内部線に適用する。
- acceptance_criteria:
  - 書体変更が全領域に一括反映される。
  - 枠線色/太さの変更がプレビューへ反映される。
- checks:
  - `npm run test -- textStyle`（成功）
  - `npm run test -- drawStamp`（成功）
  - `npm run build`（成功）
  - `npm run lint`（成功）
  - `rg -n "文字サイズ|書体|枠線太さ|枠線色|自動縮小|fitFontSizeToWidth|textScale|fontFamily|strokeWidth|strokeColor" SPEC.md src/main.ts src/stamp/drawStamp.ts src/stamp/textStyle.ts`（成功: 仕様突合せ）
- definition_of_done:
  - 視認性を損なわない文字描画と枠線カスタマイズが実装されている。
- notes:
  - `src/stamp/textStyle.ts` を新規追加し、書体解決・文字サイズ倍率クランプ・長文時の自動縮小ロジックを実装。
  - `src/stamp/drawStamp.ts` で全領域の書体一括適用、文字サイズ倍率、横幅に応じた自動縮小、枠線色/太さの反映を統合。
  - `src/main.ts` に文字サイズ倍率入力を追加し、既存の書体/枠線入力とあわせて即時プレビュー再描画に接続。

## T-005: PNG/SVGダウンロード機能と透過背景対応
- status: done
- priority: high
- depends_on:
  - T-003
  - T-004
- scope:
  - src/export/exportPng.ts
  - src/export/exportSvg.ts
  - src/main.ts
- spec_refs:
  - SPEC.md 4.1 背景
  - SPEC.md 4.1 ダウンロード形式
  - SPEC.md 6.2 出力
  - SPEC.md 7.9
  - SPEC.md 7.10
  - SPEC.md 7.11
- goal: Canvas内容をPNG/SVGとしてダウンロードし、PNGで透過背景を選択可能にする。
- steps:
  1. PNGエクスポート処理を実装し透過背景オプションを反映する。
  2. 同等構造のSVG生成ロジックを実装する。
  3. UIのダウンロード操作から各処理を呼び出す。
- acceptance_criteria:
  - PNGとSVGの両形式でダウンロードできる。
  - 透過背景ON時にPNG背景が透明になる。
- checks:
  - `npm run test -- export`（成功）
  - `npm run build`（成功）
  - `npm run lint`（成功）
  - `rg -n "透過背景|ダウンロード形式|PNG|SVG|exportPng|exportSvg|transparentBg|ダウンロード" SPEC.md src/main.ts src/export/exportPng.ts src/export/exportSvg.ts`（成功: 仕様突合せ）
- definition_of_done:
  - 出力画像がプレビュー内容と整合し、仕様フォーマットで保存できる。
- notes:
  - `src/export/exportPng.ts` を追加し、透過背景ON/OFFを切り替え可能なPNG出力（透過時は元Canvas、通常時は白背景合成）を実装。
  - `src/export/exportSvg.ts` を追加し、プレビューと同等構造（外周円・内周円・2本線・3領域テキスト）のSVG生成およびダウンロード処理を実装。
  - `src/main.ts` からPNG/SVGダウンロードボタンをエクスポート処理に接続し、フォーム入力値を出力へ反映。

## T-006: LocalStorage履歴（最大10件）と編集再開機能
- status: done
- priority: high
- depends_on:
  - T-001
  - T-003
  - T-004
- scope:
  - src/history/storage.ts
  - src/history/historyList.ts
  - src/main.ts
- spec_refs:
  - SPEC.md 4.2 履歴一覧
  - SPEC.md 6.2 LocalStorageへの履歴保存
  - SPEC.md 7.12
  - SPEC.md 7.13
  - SPEC.md 8.5 ローカルデータ保持
- goal: 作成パラメータを最新10件まで保存し、履歴選択でフォームへ復元できるようにする。
- steps:
  1. 保存データ構造と10件上限のローテーション処理を実装する。
  2. 履歴一覧UIに読み込み・選択操作を実装する。
  3. 選択した履歴でフォーム/プレビューを復元する。
- acceptance_criteria:
  - 保存件数が10件を超えると古い履歴から削除される。
  - 履歴選択で編集再開できる。
- checks:
  - `npm run test -- storage`（成功）
  - `npm run test`（成功）
  - `npm run lint`（成功）
  - `npm run build`（成功）
  - `rg -n "LocalStorage|履歴|最大10件|編集再開|外部通信" SPEC.md src/main.ts src/history/storage.ts src/history/historyList.ts`（成功: 仕様突合せ）
- definition_of_done:
  - LocalStorage永続化と履歴復元が安定して動作する。
- notes:
  - `src/history/storage.ts` を追加し、LocalStorage保存・読み込み・最大10件ローテーション処理を実装。
  - `src/history/historyList.ts` を追加し、履歴一覧描画と履歴選択時の編集再開処理を実装。
  - `src/main.ts` に履歴保存ボタンと履歴復元連携を追加し、選択時にフォームとプレビューを復元。

## T-007: 統合仕上げ（外部通信なし確認・互換性確認・最終検証）
- status: done
- priority: medium
- depends_on:
  - T-005
  - T-006
- scope:
  - README.md
  - docs/manual-test.md
  - src/main.ts
- spec_refs:
  - SPEC.md 7.14
  - SPEC.md 8.1 パフォーマンス
  - SPEC.md 8.2 互換性
  - SPEC.md 8.4 セキュリティ・プライバシー
- goal: 非機能要件と最終受け入れを確認し、運用可能な状態に整える。
- steps:
  1. 手動テスト観点（入力〜出力〜履歴）を整理する。
  2. 外部通信を行わないことをコード/実行で確認する。
  3. READMEに利用手順・制約を追記する。
- acceptance_criteria:
  - 機能要件1〜14を満たす検証記録が残る。
  - 外部通信不要のSPAとして動作する。
- checks:
  - `npm run build`（成功）
  - `npm run test`（成功）
  - `npm run lint`（成功）
  - `rg -n "fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|navigator\.sendBeacon|axios" src`（成功: 外部通信実装なし）
  - `rg -n "7\.14|8\.1|8\.2|8\.4|外部通信|パフォーマンス|互換性|セキュリティ・プライバシー" SPEC.md README.md docs/manual-test.md`（成功: 仕様突合せ）
- definition_of_done:
  - 仕様適合の確認結果と利用手順が文書化されている。
- notes:
  - `docs/manual-test.md` を新規追加し、入力〜出力〜履歴〜非機能（外部通信なし/互換性/体感性能）の手動検証観点を整備。
  - `README.md` に利用手順・検証コマンド・非機能要件（外部通信なし、LocalStorage保存、モダンブラウザ互換）を追記。
  - `src/main.ts` で `reference-layout.svg` の参照パスを `import.meta.env.BASE_URL` ベースへ変更し、サブパス配信互換性を改善。

## T-008: TSトランスパイル成果物のdeploy格納
- status: done
- priority: medium
- depends_on:
  - T-007
- scope:
  - deploy/index.html
  - deploy/assets/index-D-qT16_r.css
  - deploy/assets/index-aS-u9P7c.js
  - TASKS.md
  - WORKLOG.md
- spec_refs:
  - SPEC.md 3.1 アーキテクチャ
  - SPEC.md 7.14
- goal: TypeScriptをトランスパイルした本番ビルド成果物を `deploy/` 配下へ格納し、配布可能な状態にする。
- steps:
  1. 依存関係をインストールしてビルド可能状態にする。
  2. `npm run build` でTypeScriptを含むアプリを本番ビルドする。
  3. `dist/` の成果物を `deploy/` へコピーする。
- acceptance_criteria:
  - `deploy/` 配下に `index.html` と `assets/*` が配置されている。
  - ビルドコマンドが成功している。
- checks:
  - `npm ci`（成功）
  - `npm run build`（成功）
  - `find deploy -maxdepth 3 -type f | sort`（成功）
- definition_of_done:
  - 最新ビルド成果物が `deploy/` に格納され、配布用ディレクトリとして参照できる。
  - WORKLOG.md に本タスクの実施記録が追記されている。
- notes:
  - `npm run build` で生成した `dist/` の内容を `deploy/` にコピーし、`index.html` と `assets` 一式を配置した。

## T-009: デプロイ手順書（DEPLOY.md）整備
- status: done
- priority: medium
- depends_on:
  - T-008
- scope:
  - DEPLOY.md
  - TASKS.md
  - WORKLOG.md
- spec_refs:
  - SPEC.md 3.1 アーキテクチャ
  - SPEC.md 7.14
- goal: TSトランスパイル〜`deploy/` 配置までの手順を文書化し、今後も同じ手順で再実行できるようにする。
- steps:
  1. デプロイ前提条件と実行コマンド（`npm ci` / `npm run build` / `cp`）を整理する。
  2. `deploy/` 配置確認方法と期待成果物を明記する。
  3. GitHub Pages自動デプロイとの関係と継続運用ルールを追記する。
- acceptance_criteria:
  - `DEPLOY.md` に再現可能な手順が記載されている。
  - `deploy/` 生成・確認のための具体的なコマンドが含まれている。
- checks:
  - `cat DEPLOY.md`（成功）
  - `npm run build`（成功）
  - `find deploy -maxdepth 3 -type f | sort`（成功）
- definition_of_done:
  - 後続エージェント/開発者が `DEPLOY.md` のみで同様のデプロイ作業を再現できる。
  - WORKLOG.md に作業記録が追記されている。
- notes:
  - `DEPLOY.md` を新規作成し、依存導入→本番ビルド→`deploy/` 配置→確認の標準手順を記載した。
