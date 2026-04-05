---
title: Agentic RAG
tags: [rag, agentic-rag, agents, architecture, production]
sources: [2026-04-05_towardsdatascience_agentic-rag-vs-classic-rag-from-a-pipeline-to-a-control-loop.md, 2026-04-05_dev_agentic-rag-the-complete-production-guide-nobody-else-wrote.md, 2026-04-05_vellum_agentic-rag-architecture-use-cases-and-limitations.md]
created: 2026-04-05
updated: 2026-04-05
---

# Agentic RAG

[RAG](rag.md) の派生アーキテクチャの一つ。固定パイプラインを制御ループに置き換え、LLM が検索プロセス自体をエージェントとして制御する。[RAG 派生アーキテクチャ](rag-variants.md)の中でも特に注目されているが、トレードオフも大きい。

## Classic RAG との構造的差異

Classic RAG はパイプライン（DAG）: 各ステップが固定順で実行される。Agentic RAG は制御ループ: Retrieve → Reason → Decide を終了条件が満たされるまで反復する。

**使えるツールセットは同じ**（ベクトル検索、リランキング、クエリ書き換え等）。違いは**フローを誰が制御するか**。Classic RAG は開発者がハードコード、Agentic RAG は LLM が実行時に判断する。

| 観点 | Classic RAG | Agentic RAG |
|---|---|---|
| コスト予測可能性 | 高い | 低い（ループ深度に依存） |
| レイテンシ予測可能性 | 高い | 低い（p95がイテレーションで増大） |
| マルチホップクエリ | 弱い | 強い |
| デバッグ範囲 | 小さい | 大きい |
| 失敗モード | 検索+プロンプト | ループ制御の失敗が追加 |

## 5コンポーネントアーキテクチャ

本番運用されている Agentic RAG システムの共通構造:

1. **Router** — クエリを分類し、検索が必要か判断。小型モデル（Claude Haiku, GPT-4o-mini）で十分
2. **Retriever** — ベクトルDB、SQL DB、その他のナレッジソースに対して検索を実行
3. **Grader** — 取得文書の関連性を評価。**多くの実装がここを省略し、失敗する**。バイナリ判定（relevant/irrelevant）が有効
4. **Generator** — Grader が十分と判断した場合にのみ回答を生成
5. **Hallucination Checker** — 生成された回答が取得コンテキストに基づいているか検証。捏造を検出したら検索に差し戻し

## 本番環境の失敗パターン

パイプラインからループに移行すると繰り返し発生する問題:

- **Retrieval thrash** — エージェントが証拠の品質を改善できないまま検索を繰り返す
- **Tool-call cascade** — 1つのツール呼び出しが連鎖し、レイテンシとコストが膨張
- **Context bloat** — プロンプトが肥大化し、品質が低下するか重要な詳細を見落とす
- **Stop-condition バグ** — ループが止まるべき時に止まらない（または早すぎる停止）
- **Confident-wrong** — ノイジーな証拠に収束し、高い確信度で誤った回答を返す

> Classic RAG は主に検索品質やプロンプトの問題で失敗する。Agentic RAG はこれらに加え、制御に関する失敗（不適切な判断、不十分な停止ルール、制御不能なループ）が加わる。

## コスト

本番クエリあたりのコスト:
- 単純なルックアップ: **$0.02**
- 複雑なマルチソース推論: **$0.31**

Grading ステップには Claude Haiku 等の小型モデルを使えばコストを大幅に抑えられる。計算予算はフロンティアモデルの推論品質が重要な Generation ステップに温存すべき。

## いつ使うべきか

> **"Don't pay for loops unless your task routinely fails in one pass."**

### 判断マトリクス（クエリ複雑度 × エラー許容度）

|  | エラー許容度が高い | エラー許容度が低い |
|---|---|---|
| **低複雑度** | Classic RAG | Classic RAG + 引用・エスカレーション |
| **高複雑度** | Classic RAG + 失敗時のみ二次パス | Agentic RAG（厳格な停止条件・予算付き） |

### Classic RAG が適するケース
- FAQ、ドキュメント Q&A
- 単一ドキュメントの回答（ポリシー、仕様、制限値）
- レイテンシ予測可能性が精度より重要な場面

### Agentic RAG が適するケース
- 質問のサブ質問への分解が必要
- 反復検索（書き換え、拡大/縮小、ソース切替）が必要
- 複数ソース間の検証・クロスチェックが必要
- $100K の意思決定に影響する回答（$10/クエリのコストは無視できる）

## 実用的なハイブリッド戦略

**デフォルトは Classic RAG、失敗シグナル検出時にのみ Agentic ループに切り替え**が現実的なスイートスポット:

- 失敗シグナル = 引用なし、低検索信頼度、矛盾する証拠、ユーザーの追加質問
- 単純な単一ホップの事実確認では Classic と Agentic の精度はほぼ同等。Agent ループはレイテンシを増やすだけ
- セマンティックキャッシュで15倍の速度改善、バッチ処理で評価処理50%高速化の事例あり

## 実装フレームワーク

- **LangGraph** — グラフベースのステートマシンで Agentic ループを定義。2026年時点で最も直接的なマッピング
- **CrewAI** — マルチエージェントのチーム協調
- **LlamaIndex** — 外部データソースとの接続
- **Vellum** — 評価・モニタリング・コラボレーション一体型

## NVIDIA のベンチマーク

Traditional → Agentic RAG への移行で、複雑なマルチホップクエリの精度が **34% → 78%** に改善（NVIDIA エンジニアリングブログ）。ただしこれは複雑なクエリでの改善であり、単純なクエリでは差が出ない。
