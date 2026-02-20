# AGENTS.md

このリポジトリの仕様は `SPEC.md` に記載されています。

## 運用ルール
- タスク完了後は作業ログを必ず更新し、後続エージェントが参照できるようにしてください。

## TASKS.md 運用ルール
- タスクリストはリポジトリ直下の `TASKS.md` で管理してください。
- `TASKS.md` は Markdown 形式で記述し、1タスクごとに見出し（例: `## T-001: ...`）を作成してください。
- 各タスクには次の固定項目を必ず含めてください。
  - `status`
  - `priority`
  - `depends_on`
  - `scope`
  - `spec_refs`
  - `goal`
  - `steps`
  - `acceptance_criteria`
  - `checks`
  - `definition_of_done`
  - `notes`
- `status` は `todo | in_progress | blocked | done` の4種類のみ使用してください。
- `depends_on` には依存タスクID（例: `T-001`）を列挙し、依存がない場合は空配列 `[]` を使用してください。
- `scope` には変更対象ファイルを列挙してください。
- `spec_refs` には `SPEC.md` の該当節を必ず記載し、仕様トレーサビリティを確保してください。
- タスク粒度は「1目的・1〜3ファイル程度」を目安に分割してください。
- 実行時は、`depends_on` をすべて満たす `status: todo` の先頭タスクを1件だけ選び、順次処理してください。
- 1回の実行で複数タスクを同時に `in_progress` にしないでください。
- タスク完了時は次を必ず実施してください。
  - 対象タスクの `status` を `done` に更新
  - `notes` に実施内容を簡潔に追記
  - `checks` の実行結果を記録
- 追加・変更実装は `acceptance_criteria` と `definition_of_done` を満たすことを完了条件としてください。

## 作業ログ運用
- 作業ログはリポジトリ直下の `WORKLOG.md` で管理してください。
- 各タスク完了時に、実施日・タスクID・概要・確認コマンド結果を追記してください。
- 後続エージェントが追跡しやすいよう、最新の記録を末尾に時系列で追加してください。

## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills that can be used. Each entry includes a name, description, and file path so you can open the source for full instructions when using a specific skill.
### Available skills
- skill-creator: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Codex's capabilities with specialized knowledge, workflows, or tool integrations. (file: /opt/codex/skills/.system/skill-creator/SKILL.md)
- skill-installer: Install Codex skills into $CODEX_HOME/skills from a curated list or a GitHub repo path. Use when a user asks to list installable skills, install a curated skill, or install a skill from another repo (including private repos). (file: /opt/codex/skills/.system/skill-installer/SKILL.md)
### How to use skills
- Discovery: The list above is the skills available in this session (name + description + file path). Skill bodies live on disk at the listed paths.
- Trigger rules: If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill's description shown above, you must use that skill for that turn. Multiple mentions mean use them all. Do not carry skills across turns unless re-mentioned.
- Missing/blocked: If a named skill isn't in the list or the path can't be read, say so briefly and continue with the best fallback.
- How to use a skill (progressive disclosure):
  1) After deciding to use a skill, open its `SKILL.md`. Read only enough to follow the workflow.
  2) If `SKILL.md` points to extra folders such as `references/`, load only the specific files needed for the request; don't bulk-load everything.
  3) If `scripts/` exist, prefer running or patching them instead of retyping large code blocks.
  4) If `assets/` or templates exist, reuse them instead of recreating from scratch.
- Coordination and sequencing:
  - If multiple skills apply, choose the minimal set that covers the request and state the order you'll use them.
  - Announce which skill(s) you're using and why (one short line). If you skip an obvious skill, say why.
- Context hygiene:
  - Keep context small: summarize long sections instead of pasting them; only load extra files when needed.
  - Avoid deep reference-chasing: prefer opening only files directly linked from `SKILL.md` unless you're blocked.
  - When variants exist (frameworks, providers, domains), pick only the relevant reference file(s) and note that choice.
- Safety and fallback: If a skill can't be applied cleanly (missing files, unclear instructions), state the issue, pick the next-best approach, and continue.
