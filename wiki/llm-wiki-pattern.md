---
title: LLM Wiki パターン
tags: [llm, knowledge-management, architecture, rag, idea-file]
sources: [2026-04-04_karpathy_llm-wiki-gist.md, 2026-04-05_antigravity_karpathy-s-llm-wiki-the-complete-guide-to-his-idea-file.md]
created: 2026-04-05
updated: 2026-04-05
---

# LLM Wiki パターン

[Andrej Karpathy](andrej-karpathy.md) が2026年4月に提唱した、LLM を使って個人ナレッジベースを構築・維持するパターン。従来の RAG とは根本的に異なるアプローチを取る。

## 核心のアイデア

RAG は問い合わせのたびに生ドキュメントから知識を再導出する。LLM Wiki パターンでは、LLM が生資料を読み込み、**構造化された相互リンク付き Markdown Wiki を段階的に構築・維持する**。Wiki は永続的に蓄積される成果物であり、ソースを追加するたび・質問するたびに豊かになる。

> "the wiki is a persistent, compounding artifact." — Karpathy

## [RAG](rag.md) との違い

| 観点 | RAG | LLM Wiki |
|---|---|---|
| 知識の処理タイミング | クエリ時（毎回） | Ingest 時（ソースごとに1回） |
| 相互参照 | クエリごとにアドホックに発見 | 事前構築・維持済み |
| 矛盾検出 | 気づかない可能性がある | Ingest 時にフラグ |
| 知識の蓄積 | なし（毎回ゼロから） | ソース・クエリごとに複利的に蓄積 |
| 出力形式 | チャット応答（揮発） | 永続 Markdown ファイル |
| 透明性 | ベクトル埋め込み（ブラックボックス） | Markdown（人間が読める・編集可能） |
| 人間の役割 | アップロードして質問 | キュレーション・探索・問いかけ |
| インフラ | ベクトルDB、埋め込みモデル等 | ファイルシステム + Git |
| スケール感 | 大規模向け | ~100記事・~40万語で十分機能 |

## 3層アーキテクチャ

1. **Raw Sources** — 生資料の不変コレクション。LLM は読むだけで変更しない。ここが source of truth
2. **Wiki** — LLM が完全に所有する Markdown ページ群。作成・更新・相互参照の維持を行う。raw と人間の間に位置する「事前消化済みの知識」
3. **Schema** — Wiki の構造・規約・ワークフローを定義する設定ドキュメント（`CLAUDE.md`, `AGENTS.md` 等）。LLM と人間が共同で進化させる。これがないと LLM は汎用チャットボットのままで、体系的な Wiki メンテナーにならない

## 3つのコア操作

### Ingest
新しいソースを raw に追加し、LLM に処理させる。LLM はソースを読み、要約を書き、インデックスを更新し、関連するエンティティ・概念ページを横断的に更新する。1つのソースが10〜15ページに影響しうる。Karpathy は1ソースずつ対話しながら取り込むスタイルを好む。

### Query
Wiki に対して質問する。LLM は index.md を読んで関連ページを特定し、回答を合成する。出力形式は Markdown ページ、比較表、スライド（Marp）、チャート等。**有用な回答は新しい Wiki ページとして保存でき、探索自体が知識として蓄積される**。これが複利ループの鍵。

### Lint
定期的な健全性チェック。ページ間の矛盾、古い記述、孤立ページ、欠落した相互参照、データギャップを検出する。LLM は調査すべき新しい問いや探すべき新しいソースの提案も行う。

## インデックスとログ

- **index.md** — 全ページカタログ。カテゴリ別に整理。LLM がクエリ時に最初に読むエントリポイント。~100ソース・数百ページ規模では埋め込みベースの RAG インフラなしで十分機能する
- **log.md** — 時系列の追記専用ログ。`## [YYYY-MM-DD] operation | description` の形式で、`grep "^## \[" log.md | tail -5` のように unix ツールでパース可能

## 推奨ツール

- **Obsidian** — Markdown エディタ + グラフビュー。Karpathy は「Obsidian は IDE、LLM はプログラマ、Wiki はコードベース」と表現
- **Obsidian Web Clipper** — Web 記事を Markdown に変換するブラウザ拡張。テンプレート対応で取り込みを統一できる
- **qmd** — Tobi Lutke (Shopify CEO) 作のローカル Markdown 検索エンジン。BM25 + ベクトル + LLM リランキングのハイブリッド検索。CLI と MCP サーバーの両方に対応。Wiki が index.md で収まらない規模になったら導入
- **Marp** — Markdown ベースのスライドデック。Wiki コンテンツからプレゼン生成
- **Dataview** — Obsidian プラグイン。フロントマターへの SQL ライクなクエリで動的テーブルを生成
- **Git** — Wiki はただの Markdown ファイルの git リポジトリ。バージョン履歴、ブランチ、コラボレーションが無料で付く

## なぜ機能するのか

Wiki を殺すのはメンテナンスの負担。LLM はその負担を引き受ける。相互参照の更新、要約の維持、矛盾のフラグ立てを一度に15ファイルにわたって行える。人間の仕事はソースのキュレーション、分析の方向づけ、良い質問を投げること。

## "Idea File" という公開形態

Karpathy はこのパターンをコードではなく「idea file」として GitHub Gist に公開した。これは AI エージェント時代の新しいオープンソースの形態。従来はコード（GitHub リポジトリ、npm パッケージ）を共有していたが、LLM エージェントの時代ではアイデアを共有すればエージェントがユーザーの環境に合わせて実装をカスタマイズできる。

> "The document's only job is to communicate the pattern. Your LLM can figure out the rest." — Karpathy

Gist の Discussion タブではコミュニティが派生アイデアを共有している。注目すべき貢献:
- **.brain フォルダパターン** — プロジェクトルートに `.brain/` を置き、AI セッション間の永続メモリとして使う軽量版
- **Gist を介したエージェント間通信** — 異なる AI フロントエンド間でコンテキストを受け渡す手法

## 歴史的文脈

Vannevar Bush が1945年に _The Atlantic_ で発表した "As We May Think" で提唱した Memex（memory + index）の実現形。Bush は人間の思考が階層的分類ではなく**連想**で働くことに着目し、個人の知識ストアに連想的リンクを張るデバイスを構想した。この構想は Douglas Engelbart（パーソナルコンピューティング）、Ted Nelson（ハイパーテキスト）、Tim Berners-Lee（WWW）に影響を与えた。

Bush が解けなかった「誰がメンテナンスするか」という問題に LLM が答えを出した。

## 実践のスケール感

Karpathy の研究 Wiki は単一の ML 研究トピックで ~100記事・~40万語。10ソースから始めて、複数ソースの統合が必要な質問をしてみて、個別に読むだけでは得られない洞察が出れば、システムが機能している証拠。
