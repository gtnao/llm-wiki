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

### Cortex Search（非構造化データの検索）

フルマネージドのハイブリッド検索（セマンティック + キーワード + リランキング）。[RAG](rag.md) のバックエンド。埋め込み生成・インデックス構築・差分更新を SQL 1文に抽象化。

**サービス作成:**
```sql
CREATE CORTEX SEARCH SERVICE contract_search
  ON chunk_text                                    -- 検索対象カラム
  ATTRIBUTES department, doc_type                  -- フィルタ用カラム
  WAREHOUSE = my_wh
  TARGET_LAG = '1 hour'                            -- データ鮮度の許容ラグ
  EMBEDDING_MODEL = 'snowflake-arctic-embed-l-v2.0'
AS (
  SELECT chunk_text, department, doc_type, file_name
  FROM parsed_documents
);
```

主要パラメータ: `ON`（検索対象）、`ATTRIBUTES`（フィルタ用）、`TARGET_LAG`（鮮度）、`EMBEDDING_MODEL`（埋め込みモデル）、`REFRESH_MODE`（FULL/INCREMENTAL）

Multi-Index 構文では `TEXT INDEXES` と `VECTOR INDEXES` で複数カラムの検索も可能。

**検索クエリ（Python）:**
```python
resp = my_service.search(
    query="解約時の違約金はいくら？",
    columns=["chunk_text", "file_name"],
    filter={"@eq": {"doc_type": "contract"}},
    limit=5
)
```

**フィルタ構文:** `@eq`（等値）、`@contains`（配列含有）、`@gte`/`@lte`（範囲）、`@and`/`@or`/`@not`（論理結合）

**RAG としての回答生成（Search + COMPLETE の組み合わせ）:**
```sql
WITH docs AS (
  SELECT chunk_text, file_name
  FROM TABLE(contract_search!SEARCH(QUERY => question, LIMIT => 3))
),
ctx AS (
  SELECT LISTAGG('Source: ' || file_name || '\n' || chunk_text, '\n---\n') as c FROM docs
)
SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3.1-70b',
  'Answer based on context: ' || c || '\nQuestion: ' || question
) FROM ctx;
```

検索 API は Python / REST / SQL（SEARCH_PREVIEW、テスト用）の3種。REST/Python は応答上限 10MB、SQL は 300KB。

### Cortex Analyst（構造化データの Text-to-SQL）

自然言語を SQL に変換して実行。精度 90%（Snowflake ベンチマーク）。セマンティックモデル（YAML）でテーブルの意味・関係・サンプル値を定義。

**セマンティックモデル例:**
```yaml
tables:
  - name: orders
    base_table:
      database: sales_db
      schema: public
      table: orders
    dimensions:
      - name: state
        expr: STATE
        sample_values: ["CA", "NY", "TX"]
        cortex_search_service_name: state_search  # ファジー検索連携
    metrics:
      - name: total_revenue
        expr: SUM(order_amount)
    relationships:
      - name: orders_to_customers
        left_table: orders
        right_table: customers
        join_key: customer_id
```

`cortex_search_service_name` で Cortex Search と連携可能。カラムの値が "Biryani (Chicken)" のようにあいまいな場合、Search でファジーマッチしてからリテラル値を SQL に埋め込む。

Verified Query Repository (VQR) で事前承認済みクエリを登録すると、類似質問に対して検証済み SQL を再利用。

### Cortex Agents（構造化 + 非構造化の統合）

Cortex Search と Cortex Analyst をツールとして束ね、LLM が Planning → Tool Use → Reflection → Monitor/Iterate で自律制御。[Agentic RAG](agentic-rag.md) パターンの Snowflake 実装。

**Agent 定義:**
```json
{
  "name": "sales_analyst",
  "model": "claude-sonnet-4-5",
  "instructions": "売上分析と契約書検索を組み合わせて回答",
  "tools": [
    {
      "type": "cortex_analyst",
      "semantic_model_database": "sales_db",
      "semantic_model_name": "revenue_metrics"
    },
    {
      "type": "cortex_search_service",
      "cortex_search_service_name": "contracts"
    },
    {
      "type": "custom_tool",
      "function": {"database": "utils_db", "schema": "tools", "name": "validate_contract"}
    }
  ]
}
```

ツールは3種: cortex_analyst（構造化）、cortex_search_service（非構造化）、custom_tool（ストアドプロシージャ/UDF）。

**実行レスポンス例:**
```json
{
  "response": "Acme社の契約では...",
  "tool_calls": [
    {"tool": "cortex_analyst", "query": "SELECT ... FROM orders WHERE vendor = 'Acme'"},
    {"tool": "cortex_search", "query": "Acme contract terms"}
  ],
  "citations": [{"source": "contract_001.pdf", "excerpt": "..."}]
}
```

Threads でセッション間の会話コンテキストを維持。利用可能モデル: `auto`（推奨）、Claude Haiku/Sonnet、OpenAI GPT-4.1 等。

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

## 課金モデルとサードパーティモデル

Amazon Bedrock と同じ構造。Anthropic や OpenAI と個別契約する必要はなく、**Snowflake の契約・課金体系の中**で各社のモデルを利用する。

### 仕組み
- 課金は**トークンベース**で Snowflake クレジットに換算
- データは Snowflake のセキュリティ境界内で処理され、外部に出ない
- モデルが自リージョンにない場合、**Cross-region inference** で別リージョンにルーティング可能（例: `deepseek-r1` は `AWS_US` にルーティング）

### モデル間の価格差

モデル間で **10倍以上の価格差**がある。タスクに応じた選択が重要。

| モデル | 価格目安 |
|---|---|
| Claude Opus | 12 クレジット / 100万トークン |
| 小型モデル (Llama 8b 等) | 数分の1クレジット / 100万トークン |

同一タスク（10万件のレビュー分析）で小型モデル $3/月 vs Claude $60/月 のような差が出る。単純なカテゴリ分類や感情分析には小型モデルで十分なケースが多い。

### Bedrock との比較

| 観点 | Snowflake Cortex | Amazon Bedrock |
|---|---|---|
| インターフェース | SQL 関数 (`SNOWFLAKE.CORTEX.COMPLETE(...)`) | SDK / API |
| 統合対象 | Snowflake 内のデータ | AWS サービス全般 |
| 課金統合 | Snowflake クレジット | AWS 請求 |
| データ移動 | 不要（Snowflake 内で完結） | S3 等からの読み込みは必要 |
| ユースケース | データ分析・BI と一体化した AI | 汎用 AI アプリケーション構築 |

## 採用状況

9,100+ アカウントが Cortex を利用。AI 関連ワークロードは 200%+ 成長。

## モデルライフサイクル

Private Preview → Public Preview → GA → Legacy → EOL。GA モデルの非推奨には最低60日の事前通知。
