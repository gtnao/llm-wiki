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

## [2026-04-05] ingest | RAG 体系学習ソース 5本
- sources: 2026-04-05_meilisearch_14-types-of-rag-retrieval-augmented-generation.md, 2026-04-05_meilisearch_9-advanced-rag-techniques-to-know-how-to-implement-them.md, 2026-04-05_dev_beyond-vanilla-rag-the-7-modern-rag-architectures-every-ai-engineer-must-know.md, 2026-04-05_ragflow_from-rag-to-context-a-2025-year-end-review-of-rag.md, 2026-04-05_neuramonks_standard-rag-is-dead-what-s-replacing-it-in-2026.md
- wiki updates: created rag.md, created rag-advanced-techniques.md, created rag-variants.md, created rag-trends-2026.md, updated llm-wiki-pattern.md, updated index.md
- notes: RAG の体系学習。基本概念・フロー、発展的テクニック（chunking, reranking, hybrid search等）、派生アーキテクチャ（Self-RAG, CRAG, GraphRAG, Agentic RAG等14種）、2026年トレンド（Context Engineering, Long Context協調, 評価フレームワーク）をカバー
