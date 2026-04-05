---
title: RAG 発展的テクニック
tags: [rag, chunking, reranking, hybrid-search, embedding]
sources: [2026-04-05_meilisearch_9-advanced-rag-techniques-to-know-how-to-implement-them.md, 2026-04-05_ragflow_from-rag-to-context-a-2025-year-end-review-of-rag.md]
created: 2026-04-05
updated: 2026-04-05
---

# RAG 発展的テクニック

[RAG](rag.md) パイプラインの各コンポーネントを改善する個別テクニック。基本的な RAG の「retrieve and hope」から「retrieve with intent」へ進化させる。

## 1. Chunking（チャンク分割）

ドキュメントをどう分割するかが検索精度に直結する。

| 手法 | 概要 | トレードオフ |
|---|---|---|
| **Fixed-size chunking** | 固定長で分割（例: 200-1000トークン、オーバーラップあり） | 単純だが意味的境界を無視 |
| **Semantic chunking** | 埋め込みのコサイン類似度で意味的まとまりを検出して分割 | 精度向上だが埋め込みモデルが必要 |
| **LLM-based chunking** | LLM を使って自己完結的な命題に分割 | 最高の一貫性だが計算コスト大 |
| **Hierarchical chunking** | セクション境界・見出し階層・テーブル構造を保持して分割。親子関係でマルチグラニュラリティ検索 | 構造的文書に有効だが複雑 |

### Chunking の根本的な矛盾

RAGFlow の分析によると、単一粒度のチャンクで2つの相反する目的を達成しようとする構造的矛盾がある:
- **意味的マッチング（recall）** には小さいチャンク（100-256トークン）が最適
- **コンテキスト理解（utilization）** には大きいチャンク（1024+トークン）が最適

解決策は Search（小粒度で精密位置特定）と Retrieve（大粒度でコンテキスト組み立て）を分離すること。TreeRAG はこのアプローチを体現し、オフラインで階層的ツリー構造を構築し、オンラインで動的にコンテキストを組み立てる。

## 2. Reranking（再ランキング）

初期検索結果を並べ替え、最も関連性の高い情報を上位にする。50,000チャンク以上のコーパスでは品質向上に有意な効果。

| 手法 | 概要 | トレードオフ |
|---|---|---|
| **Cross-encoder reranking** | クエリと各チャンクのペアを Transformer（BERT等）に入力してスコアリング | 高精度だが低速・高コスト |
| **Score-based reranking** | BM25ブースト等のヒューリスティックでスコア調整 | 高速だが精度は劣る |

Cohere Rerank v3.5 等のリランカーは、純粋なベクトル検索に対して検索リコールで平均18%、回答関連性で12%の改善を示す（2025年末のベンチマーク）。

## 3. Hybrid Search（ハイブリッド検索）

Dense（ベクトル）と Sparse（キーワード）検索を組み合わせる。

- **Dense retrieval** — 意味的類似性に優れるが、正確なキーワードマッチを見逃す可能性
- **Sparse retrieval (BM25)** — 正確なキーワードマッチに優れるが、意味的理解が不足
- **Hybrid** — 両者の組み合わせ。2026年では本番パイプラインの標準（table stakes）

結合方法:
- **Score fusion** — 両方の重み付きスコアを統合
- **Result merging** — 両方の上位結果をマージしてリランク

## 4. Query Rewriting（クエリ書き換え）

曖昧または不完全なクエリを検索前に改善する。

- **Synonym expansion** — 同義語を追加してカバレッジ拡大
- **Spelling correction** — タイポの自動修正
- **Intent clarification** — 広いクエリをより明確な形に変換

## 5. Metadata Filtering（メタデータフィルタリング）

構造化タグ（日付、著者、ドキュメント種別）で検索結果をフィルタ・ブースト。低コストで高効果。

## 6. Autocut（自動トリミング）

トークン制限に基づいてコンテキストを動的にトリミング。LLM のコンテキストウィンドウに収まるよう、重要度の低い部分を除去。

## 7. Context Distillation（コンテキスト蒸留）

大きなドキュメントを高価値な要約に圧縮。

- **Summarization-based** — 抽出的/抽象的要約で要点を保持
- **Question-driven** — 質問に応じてコンテキストを調整

## 8. Fine-tuning

- **LLM のファインチューニング** — ドメイン固有のデータで LLM を再訓練。教師あり学習、RLHF 等
- **Embedding モデルのファインチューニング** — 対比学習やドメイン適応で埋め込みの「類似性の理解」を再形成

## 2026年の本番パイプライン推奨構成

1. **ベースレイヤー**: Query transformation + Hybrid search
2. **品質向上**: Reranking（50K+チャンク規模で有効）
3. **エンタープライズ**: Knowledge graph（マルチホップ質問が一般的な場合）
