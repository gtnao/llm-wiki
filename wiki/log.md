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

## [2026-04-05] ingest | Agentic RAG 深掘り（批判・トレードオフ・本番運用）
- sources: 2026-04-05_towardsdatascience_agentic-rag-vs-classic-rag-from-a-pipeline-to-a-control-loop.md, 2026-04-05_dev_agentic-rag-the-complete-production-guide-nobody-else-wrote.md, 2026-04-05_vellum_agentic-rag-architecture-use-cases-and-limitations.md
- wiki updates: created agentic-rag.md, updated rag-variants.md, updated index.md
- notes: Agentic RAG の構造的差異、5コンポーネントアーキテクチャ、本番失敗パターン5種、コスト分析（$0.02-$0.31/query）、判断マトリクス、ハイブリッド戦略を詳述

## [2026-04-05] ingest | RAG インフラ・プラットフォーム・セキュリティ
- sources: 2026-04-05_firecrawl_best-vector-databases-in-2026-a-complete-comparison-guide.md, 2026-04-05_firecrawl_15-best-open-source-rag-frameworks-in-2026.md, 2026-04-05_dasroot_securing-internal-rag-systems-in-enterprises.md, 2026-04-05_nstarxinc_the-next-frontier-of-rag-how-enterprise-knowledge-systems-will-evolve-2026-2030.md, 2026-04-05_cio_snowflake-and-databricks-vie-for-the-heart-of-enterprise-ai.md
- wiki updates: created rag-tech-stack.md, created rag-enterprise-platforms.md, created rag-security.md, updated index.md
- notes: VectorDB 18種比較・選定フレームワーク、OSSフレームワーク (LangChain/LlamaIndex/DSPy等)、埋め込みモデル比較、ハイパースケーラーRAGオファリング (Snowflake Cortex/Databricks Mosaic AI/Vertex AI/Azure)、セキュリティリスク4種 (AgentSmith/CVE-2025-1793/BadRAG/TrojanRAG)、アクセス制御・暗号化・プロヴナンス・評価フレームワーク
