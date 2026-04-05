---
title: RAG (Retrieval-Augmented Generation)
tags: [rag, llm, retrieval, architecture]
sources: [2026-04-05_meilisearch_14-types-of-rag-retrieval-augmented-generation.md, 2026-04-05_dev_beyond-vanilla-rag-the-7-modern-rag-architectures-every-ai-engineer-must-know.md, 2026-04-05_ragflow_from-rag-to-context-a-2025-year-end-review-of-rag.md, 2026-04-05_neuramonks_standard-rag-is-dead-what-s-replacing-it-in-2026.md]
created: 2026-04-05
updated: 2026-04-05
---

# RAG (Retrieval-Augmented Generation)

LLM が生成時に外部知識ソースから関連情報を取得して利用するアーキテクチャパターン。訓練データだけに頼らず、リアルタイムのドキュメントやデータベースから根拠を得て回答を生成する。

## 基本フロー

```
ユーザークエリ
  → Embedding（クエリをベクトル化）
  → Retrieval（ベクトルDBから類似チャンクを検索）
  → Augmentation（取得チャンクをプロンプトに挿入）
  → Generation（LLM が根拠付きで回答を生成）
```

## コアコンポーネント

### 1. Document Ingestion（取り込み）
ドキュメントをチャンクに分割し、埋め込みモデルでベクトル化してインデックスに格納する。

- **Chunking** — ドキュメントを適切なサイズに分割。[発展的手法](rag-advanced-techniques.md)参照
- **Embedding** — テキストをベクトル表現に変換（OpenAI ada-002, Cohere, sentence-transformers 等）
- **Indexing** — ベクトルDB に格納（Pinecone, Weaviate, Chroma, Qdrant 等）

### 2. Retrieval（検索）
クエリのベクトルとインデックス内のベクトルを比較し、最も類似するチャンク（Top-K）を取得する。

- **Dense Retrieval** — ベクトル類似度による意味的検索
- **Sparse Retrieval** — BM25 等のキーワードベース検索
- **Hybrid Retrieval** — 両者の組み合わせ。[発展的手法](rag-advanced-techniques.md)参照

### 3. Augmentation（コンテキスト構築）
取得したチャンクを元のクエリと組み合わせてプロンプトを構築する。

### 4. Generation（生成）
LLM が構築されたプロンプトに基づいて回答を生成する。

## なぜ RAG が必要か

- **ハルシネーション削減** — 取得した事実に基づいて回答を生成
- **プライベートデータへのアクセス** — モデルの再訓練なしにドメイン固有の知識を利用
- **知識の更新** — モデルを変更せずにナレッジベースを更新可能
- **トレーサビリティ** — 回答をソースドキュメントに紐付け可能

## Standard RAG の限界

Standard RAG（Vanilla RAG）はデモでは機能するが、本番環境では構造的な限界がある:

- チャンクレベルの検索はドキュメントの構造・文脈・関係性を失う
- 複数ドキュメントの統合が必要な質問（マルチホップ推論）に弱い
- コサイン類似度が高くても実際には無関係なチャンクを返すことがある
- エンタープライズの知識は近接検索問題ではなく**推論問題**である

> "The companies winning with AI in 2026 are not the ones with the most documents in their vector store. They are the ones who stopped trusting Standard RAG to do the heavy lifting."

これらの限界を克服するため、[発展的テクニック](rag-advanced-techniques.md)と[RAG 派生アーキテクチャ](rag-variants.md)が生まれた。[2026年のトレンド](rag-trends-2026.md)も参照。

## LLM Wiki パターンとの対比

[LLM Wiki パターン](llm-wiki-pattern.md)は RAG の代替アプローチ。RAG がクエリ時に知識を再導出するのに対し、LLM Wiki は事前にナレッジをコンパイルして永続的な Wiki を構築する。
