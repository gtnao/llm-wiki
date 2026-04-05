---
title: Snowflake Cortex AI
tags: [snowflake, cortex, llm, rag, enterprise, platform]
sources: [2026-04-05_docs_snowflake-ai-and-ml-snowflake-documentation.md, 2026-04-05_dataengineerhub_snowflake-cortex-ai-complete-guide-for-2026.md]
created: 2026-04-05
updated: 2026-04-05
---

# Snowflake Cortex AI

Snowflake プラットフォーム内で直接動作する AI/ML 機能のスイート。データをエクスポートせずに SQL で LLM・ベクトル検索・ML 機能を利用できる。[RAG エンタープライズプラットフォーム](rag-enterprise-platforms.md)の中核。

## 全体像

Snowflake の AI/ML は大きく2カテゴリ:

1. **Snowflake Cortex** — LLM を使った非構造化データの理解・質問応答・知的支援
2. **Snowflake ML** — 独自モデルの構築（ML Functions + カスタムモデル開発）

## Cortex のサービス一覧

### Cortex AI Functions（LLM 関数）

SQL から直接呼べる LLM ベースの関数群。インターフェースは `SNOWFLAKE.CORTEX.<FUNCTION>(model, prompt)` の形式。

| 関数 | 機能 | 用途例 |
|---|---|---|
| **COMPLETE** | テキスト生成・補完 | カテゴリ分類、商品説明生成、質問応答 |
| **SUMMARIZE** | テキスト要約 | 会議議事録の要約、レポート圧縮 |
| **TRANSLATE** | 言語翻訳 | 多言語コンテンツ、カスタマーサポート |
| **EXTRACT_ANSWER** | ドキュメントから質問に答える | 契約書分析、ポリシー確認 |
| **SENTIMENT** | 感情分析 (-1〜1) | レビュー分析、CS品質モニタリング |

利用可能なモデル（2026年時点）:
- Llama 3.1 (8b / 70b / 405b)
- Mistral Large 2, Mixtral-8x7b
- Anthropic Claude, OpenAI（サードパーティモデル）

### Cortex Search

フルマネージドのテキスト埋め込み + ハイブリッド検索（セマンティック + キーワード）+ 検索。[RAG](rag.md) アプリケーションのバックエンドとして機能。

### Cortex Analyst

自然言語で構造化データにクエリ。「Q4の売上を製品ラインごとに比較して」のような質問をSQLに変換して実行。

### Cortex Agents

自律的なエージェントの構築。[Agentic RAG](agentic-rag.md) パターンをSnowflake内で実現。

### Cortex Fine-tuning

Llama 3 等のオープンソースモデルを自社データでファインチューニング。データのエクスポート不要。推論エンドポイントをトークン課金でデプロイ。

### Cortex Code

2026年2月リリースの AI コーディングエージェント。

- **Cortex Code in Snowsight** — Web UI 内でのデータエンジニアリング・分析支援
- **Cortex Code CLI** — CLI からの利用。dbt、Apache Airflow 等の外部データソースにも対応拡大中
- 自然言語でデータエンジニアリング、分析、ML、エージェント構築タスクを実行

### Snowflake Intelligence

エンタープライズ向けの知的検索・ナレッジ機能。

### Cortex Knowledge Extensions

CB Insights、FactSet、Investopedia、AP、Washington Post 等のパブリッシャーから非構造化データを提供（GA）。

## ML Functions（従来型 ML）

コーディング不要の分析ツール。構造化データのパターン検出。

| 関数 | 機能 |
|---|---|
| **FORECAST** | 時系列予測 |
| **ANOMALY_DETECTION** | 異常検知 |
| **CLASSIFICATION** | 分類 |

## Snowflake ML（カスタムモデル）

データサイエンティスト向け。人気 ML フレームワークベースのモデル開発クラス + MLOps 機能（Feature Store、Model Registry、フレームワークコネクタ、不変データスナップショット）。

## セキュリティ原則

- **完全なセキュリティ境界内**: ユーザーが選択しない限り、すべての AI モデルは Snowflake のセキュリティ・ガバナンス境界内で実行
- **データプライバシー**: 顧客データを他の顧客やモデル開発者向けの訓練に使用しない
- **アクセス制御**: 既存の RBAC でチームの AI 機能利用を制御

## 利用パターン

**旧来のやり方:**
```
データエクスポート → 外部 API 呼び出し → 認証・レート制限管理 → 結果保存 → Snowflake に戻す
```

**Cortex:**
```sql
SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3.1-70b', 'プロンプト') FROM my_table;
```

データが Snowflake を離れない。API キー管理不要。SQL だけ。

## 採用状況

9,100+ アカウントが Cortex を利用。AI 関連ワークロードは 200%+ 成長。

## モデルライフサイクル

Private Preview → Public Preview → GA → Legacy → EOL。GA モデルの非推奨には最低60日の事前通知。
