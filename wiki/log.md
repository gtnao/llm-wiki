# Log

操作ログ。ingest / query / lint の記録を時系列で追記する。

## [2026-04-05] ingest | Karpathy LLM Wiki パターン
- sources: 2026-04-04_karpathy_llm-wiki-gist.md, 2026-04-04_antigravity_karpathy-llm-wiki-guide.md
- wiki updates: created llm-wiki-pattern.md, created andrej-karpathy.md, updated index.md
- notes: 初回 ingest。Karpathy が2026年4月に公開した LLM Wiki パターンの一次ソース (GitHub Gist) と解説記事を取り込み

## [2026-04-05] ingest | Antigravity 解説記事 (clip版)
- sources: 2026-04-05_antigravity_karpathy-s-llm-wiki-the-complete-guide-to-his-idea-file.md
- wiki updates: updated llm-wiki-pattern.md, updated andrej-karpathy.md
- notes: clip.ts で取得した完全版記事で再 ingest。手動版 (2026-04-04_antigravity_karpathy-llm-wiki-guide.md) を削除し置換。RAG比較表の拡充、idea file概念の詳述、コミュニティ貢献(.brainパターン等)、Memex歴史の補強、実践スケール感を追加
