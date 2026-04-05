# LLM Wiki — Schema

ソフトウェアエンジニアの日々の学習・情報キャッチアップを管理するための LLM 維持型ナレッジベース。
Andrej Karpathy の LLM Wiki パターンに基づく。

## アーキテクチャ

- `raw/` — 生資料。人間が投入し、LLM は読むだけで変更しない（不変）
- `wiki/` — LLM が生成・維持するページ群
- `CLAUDE.md` — このファイル。Wiki の運用規約・LLM への指示書

## raw/ 規約

### ファイル命名

`YYYY-MM-DD_source_slug.md`

例: `2026-04-03_karpathy_llm-knowledge-bases-tweet.md`

複数アセットを伴うソースはディレクトリにまとめる:

```
raw/2026-04-04_some-paper/
├── paper.md
├── paper.pdf
└── figure1.png
```

### フロントマター

```yaml
---
title: 元記事のタイトル
url: https://...
date: YYYY-MM-DD
type: article | tweet | paper | video-transcript | gist | ...
---
```

## wiki/ 規約

### 構造

フラット構成。ディレクトリのネストはしない。

- `wiki/index.md` — 全ページカタログ。カテゴリ別に整理。LLM はクエリ時にまずこれを読む
- `wiki/log.md` — 操作ログ（追記専用）

### ページのフロントマター

```yaml
---
title: ページタイトル
tags: [tag1, tag2]
sources: [YYYY-MM-DD_source_slug.md, ...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### ページ間リンク

Markdown リンクで相互参照する: `[ページ名](filename.md)`

## 操作

### Ingest

raw/ のファイルを読み、wiki に統合する。

1. raw ファイルの内容を読む
2. 既存の wiki ページとの関連を index.md から把握する
3. 新規ページの作成、または既存ページの更新を行う
4. index.md を更新する
5. log.md に ingest 記録を追記する

### Query

wiki に対する質問に回答する。

1. index.md を読み、関連ページを特定する
2. 該当ページを読み、回答を合成する
3. 有用な回答が生まれた場合、新規 wiki ページとして保存することを検討する
4. log.md に query 記録を追記する

### Lint

wiki の健全性チェック。

- ページ間の矛盾検出
- 孤立ページ（inbound link なし）の検出
- 古い記述の検出
- 欠落した相互参照の提案
- log.md に lint 記録を追記する

## セッション開始時

raw/ に未 ingest のファイルがないか確認し、あればユーザーに通知すること。
判定基準: wiki/log.md の ingest エントリに記載されていない raw/ 内ファイル。

## log.md フォーマット

```markdown
## [YYYY-MM-DD] operation | description
- sources: 処理した raw ファイル（ingest の場合）
- wiki updates: 作成・更新したページ
- notes: 補足
```

operation は ingest / query / lint のいずれか。
