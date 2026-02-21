# DEPLOY

このドキュメントは、本プロジェクト（Vite + TypeScript）の本番成果物を再現可能な手順で作成し、`docs/` フォルダへ配置するための運用手順です。

## 1. 前提条件
- Node.js / npm が利用可能であること
- リポジトリルート（`japanese-date-stamp/`）で作業すること

## 2. ローカルでのデプロイ成果物作成手順

### 2.1 依存関係のインストール
```bash
npm ci
```

### 2.2 TypeScript を含む本番ビルドの実行
```bash
npm run build
```

- Vite が `dist/` に最適化済み成果物（`index.html`, `assets/*`）を生成します。

- `vite.config.ts` は `base: "./"` を採用しているため、`/japanese-date-stamp/` 直下配信でも `/japanese-date-stamp/docs/` のようなサブディレクトリ配信でも、相対パスで `assets/*` を解決できます。

### 2.3 `docs/` への配置
```bash
mkdir -p docs
cp -R dist/. docs/
```

- 既存ファイルを含めて完全に同期したい場合は、必要に応じて先に `docs/` を空にしてからコピーしてください。

### 2.4 配置確認
```bash
find docs -maxdepth 3 -type f | sort
```

最低限、以下が出力されることを確認してください。
- `docs/index.html`
- `docs/assets/*.css`
- `docs/assets/*.js`

## 3. よく使う検証コマンド（任意）
デプロイ前に品質確認を行う場合:

```bash
npm run test
npm run lint
npm run build
```

## 4. GitHub Pages 運用との関係
- 本リポジトリには `main` への push で GitHub Pages へデプロイする Workflow（`.github/workflows/deploy.yml`）があります。
- 本運用では `docs/` を Pages 配信用ディレクトリとして扱い、ローカル再現時も同じ配置を維持します。
- 今後も本手順（`npm ci` → `npm run build` → `docs/` へコピー）を同様に実行することで、再現可能な成果物を維持できます。

## 5. 更新時の運用ルール
- ソース変更後に再デプロイする場合も、必ず同じコマンド順で実行してください。
- `docs/` の中身が更新されたら、必要に応じて `TASKS.md` と `WORKLOG.md` に実施内容・確認結果を記録してください。
