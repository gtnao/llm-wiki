---
title: RAG エンタープライズプラットフォーム
tags: [rag, enterprise, snowflake, databricks, google, azure, platform]
sources: [2026-04-05_cio_snowflake-and-databricks-vie-for-the-heart-of-enterprise-ai.md, 2026-04-05_nstarxinc_the-next-frontier-of-rag-how-enterprise-knowledge-systems-will-evolve-2026-2030.md]
created: 2026-04-05
updated: 2026-04-05
---

# RAG エンタープライズプラットフォーム

ハイパースケーラーやデータプラットフォームベンダーが提供する [RAG](rag.md) 関連のマネージドサービス。OSS の[テクノロジースタック](rag-tech-stack.md)を自前で組む代わりに、統合プラットフォームとして利用する選択肢。

## DWH / データプラットフォーム系

### Snowflake

- **Snowflake Cortex** — LLM推論、ベクトル検索、エージェント機能をSnowflakeプラットフォーム内で直接提供
- **最大の強み**: データ移動ゼロ（AI ワークロードが既存のSnowflakeデータ上で直接実行）
- **Agentic Document Analytics** — 構造化データなしに数千のソースを横断分析可能。従来のRAGパイプラインを拡張
- ポジショニング: 使いやすさ、セキュリティ、構造化データ分析。SQL ベースのセルフサービス

### Databricks

- **Mosaic AI** — RAG、合成データ生成、カスタマイズ可能なエージェントワークフローを含む
- **Agent Bricks** — エンタープライズ向けインテリジェントエージェントのオーケストレーション
- **最大の強み**: 開発者ファーストの環境、ML/AI ツーリング、マルチモーダルワークロード対応
- ポジショニング: オープンソース柔軟性（コアインターフェースはOSS）、非構造化データ処理・リアルタイム分析に強い

### 両者の共通点と競争

- 両者とも「ストレージとコンピュートの分離」「クラウドアグノスティック（AWS/GCP/Azure）」
- 2026年時点で機能はほぼ同等。Snowflake = 使いやすさ、Databricks = OSS 柔軟性
- 両者とも「データプラットフォーム」から「AI オーケストレーション環境」へ進化
- CIO の視点: 「データを保存・クエリするだけでなく、モデル訓練、データバージョニング、本番推論まで一箇所で」

## クラウドプロバイダー系

### Google (Vertex AI + BigQuery)

- Vertex AI: Google のモデルポートフォリオ全体を使った推論。SaaS として RAG ベースアプリ構築ツールを提供
- BigQuery: サーバーレス。GPU クラスターのサイジング不要だが、Vertex AI 消費は GCP 請求に別途加算

### Microsoft (Azure AI Search + Fabric)

- Azure AI Search: ベクトル検索 + セマンティック検索の統合
- Microsoft Fabric: データ統合・分析・AI の統合プラットフォーム
- Azure OpenAI Service との密な統合

## プラットフォーム選定の観点

| 観点 | 考慮点 |
|---|---|
| データの所在 | 既にSnowflake/Databricksにデータがあるならデータ移動ゼロの利点 |
| ロックイン | Databricks はコアがOSS。Snowflake はプロプライエタリだが運用が簡単 |
| マルチクラウド | 両者とも3大クラウドに対応 |
| 既存投資 | GCP → BigQuery + Vertex AI、Azure → Fabric + Azure AI Search が自然 |
| データの種類 | 構造化中心 → Snowflake、非構造化・ML中心 → Databricks |

## 方向性 (2026-2030)

NStarX の分析によると、RAG は「LLM にボルトオンする検索パイプライン」から**自律的なナレッジランタイム**に進化中:

- 検索、検証、推論、アクセス制御、監査証跡を統合運用として管理
- Kubernetes がアプリケーションワークロードを管理するように、ナレッジランタイムが情報フローを管理
- カスタムRAGパイプラインの構築 (6-12ヶ月) → 共有ランタイムプラットフォーム (4-8週間) へ
- 40-60% の RAG 実装が検索品質・ガバナンス問題で本番到達に失敗している現状を改善

## EU AI Act の影響

2026年8月にハイリスクAI義務が発効。RAGシステムにも影響:
- 検索パスの説明可能性
- ソース権威の検証
- 判断根拠の監査証跡

これが[セキュリティ・ガバナンス](rag-security.md)への投資を加速させている。
