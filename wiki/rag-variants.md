---
title: RAG 派生アーキテクチャ
tags: [rag, self-rag, corrective-rag, graph-rag, agentic-rag, architecture]
sources: [2026-04-05_meilisearch_14-types-of-rag-retrieval-augmented-generation.md, 2026-04-05_dev_beyond-vanilla-rag-the-7-modern-rag-architectures-every-ai-engineer-must-know.md, 2026-04-05_neuramonks_standard-rag-is-dead-what-s-replacing-it-in-2026.md]
created: 2026-04-05
updated: 2026-04-05
---

# RAG 派生アーキテクチャ

[Standard RAG](rag.md) の限界を克服するために生まれた様々な派生系。それぞれ異なる問題を解決する。

## 主要な派生系

### Self-RAG
LLM が**自分自身の検索と回答の質を評価**する。検索結果の関連性を判定し、低品質なら再検索、回答が証拠と一致しなければ修正する。静的パイプラインをフィードバックループに変える。

- 利点: ハルシネーション大幅削減、曖昧なクエリに強い
- 欠点: 複数ループで低速・高コスト
- 適用: 法務・医療等、正確性が速度より重要な場面

### Corrective RAG (CRAG)
検索失敗を**能動的に検出・修正**する。取得文書の品質を動的に評価し、品質が低ければクエリ書き換え、代替検索戦略、フォールバック検索を自動トリガーする。

- 利点: 検索品質の安全網、本番環境の信頼性向上
- 欠点: 複雑な実装、追加レイテンシ
- 適用: データ品質にばらつきがある環境

### Graph RAG
ナレッジグラフを使って**エンティティ間の関係性**を理解する。近接検索ではなくグラフ走査でマルチホップ推論を実現。Microsoft Research が提唱。

- 利点: 複数概念の接続が必要な質問に強い、テーマレベルのクエリ対応
- 欠点: グラフ構築に大量のトークン消費（元テキストの3-5倍）、自動抽出の品質にノイズ
- 適用: 金融、法務、ヘルスケア等の関係性が本質的な領域

### Agentic RAG
LLM を検索ループ内に**エージェントとして埋め込む**。単一の retrieve-then-generate サイクルではなく、計画→検索→推論→十分か判断を反復する。リサーチアナリストのように振る舞う。

- 利点: 複雑な分析クエリ・オープンエンドな調査に強い
- 欠点: 高コスト、構築・管理が困難、応答時間が長い
- 適用: 複合的なリサーチタスク、エンタープライズ分析

### Multi-Agent RAG
複数の専門エージェントが**並列で検索・検証・統合**を担当する。クエリ分解エージェント、検索エージェント、検証エージェント、統合エージェントが協調。

- 利点: 各エージェントが専門化、スケーラブル
- 欠点: オーケストレーションの複雑さ、コスト
- 適用: エンタープライズ規模の複雑なワークフロー

### Hybrid RAG
Dense（ベクトル）と Sparse（キーワード）検索を組み合わせ、リランカーで統合する。詳細は[発展的テクニック](rag-advanced-techniques.md)参照。

## その他の派生系

| 派生系 | 概要 |
|---|---|
| **RAG with Memory** | 会話履歴を保持し、文脈を引き継ぐ |
| **Branched RAG** | 質問の複数解釈を並列探索し、最良を選択 |
| **Multimodal RAG** | テキスト・画像・動画・音声を統合的に検索 |
| **Adaptive RAG** | クエリの種類（単純/複雑/広い/狭い）を認識し、検索プロセスを動的に調整 |
| **Multi-Hop RAG** | 複数ステップの逐次検索で、各ステップの結果を次の検索に活用 |
| **Real-Time RAG** | ライブデータソース（DB, API, ニュースフィード）に直接接続 |
| **Speculative RAG** | 投機的に複数の候補回答を並列生成し、最良を選択 |
| **Modular RAG** | パイプラインの各コンポーネントを独立モジュールとして交換可能に |

## アーキテクチャ選択の指針

| ユースケース | 推奨アーキテクチャ |
|---|---|
| 単純な FAQ・事実確認 | Standard RAG |
| 正確性が最重要（法務・医療） | Self-RAG / Corrective RAG |
| 関係性の推論が必要 | Graph RAG |
| 複雑なリサーチ・分析 | Agentic RAG |
| エンタープライズ規模 | Multi-Agent RAG / Hybrid RAG |
| リアルタイムデータ | Real-Time RAG / Talk to Data |

> "The future of RAG isn't about replacing the old — it's about choosing the right architecture for the problem you're trying to solve."
