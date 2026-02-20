# 副業確定申告 税額簡易シミュレーター

副業収入の確定申告要否と税額を簡易計算できるWebアプリです。2025年度税制に基づく概算計算ツールです。

## 機能

- 給与収入・副業収入から税額を自動計算
- 確定申告の要否判定（副業所得20万円基準）
- 所得・控除・税額の内訳表示
- Claude API によるAI税務解説
- URLシェア機能

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic SDK** (Claude API、サーバーサイドのみ)
- **Vercel** デプロイ対応

---

## ローカル起動手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd fukugyou-tax-simulator
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成します。

```bash
cp .env.local.example .env.local
```

`.env.local` を編集し、Anthropic API キーを設定します。

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

API キーは [Anthropic Console](https://console.anthropic.com/) から取得できます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

---

## Vercel デプロイ手順

### 1. Vercel へのデプロイ

[Vercel](https://vercel.com/) にアカウントを作成し、GitHub リポジトリと連携してデプロイします。

```bash
# Vercel CLI を使う場合
npm i -g vercel
vercel
```

### 2. 環境変数の設定（重要）

Vercel の管理画面で以下の手順で環境変数を設定してください。

1. Vercel ダッシュボードでプロジェクトを選択
2. **Settings** → **Environment Variables** を開く
3. 以下の変数を追加する：

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...（あなたのAPIキー）` |

4. **Save** ボタンをクリック
5. プロジェクトを再デプロイ（Deployments → Redeploy）

> **注意**: API キーは絶対にソースコードやフロントエンドのレスポンスに含めないでください。サーバーサイド（API Route）でのみ使用されます。

---

## ディレクトリ構成

```
/
├── app/
│   ├── page.tsx              # メインページ（フォーム＋結果表示）
│   ├── layout.tsx            # ルートレイアウト
│   └── api/
│       └── explain/
│           └── route.ts      # Claude API呼び出し（Node.js runtime）
├── components/
│   ├── SimulatorForm.tsx     # 入力フォーム
│   ├── ResultCard.tsx        # 結果表示カード
│   ├── AiExplanation.tsx     # AI解説コンポーネント
│   └── ShareButton.tsx       # シェアボタン
├── lib/
│   └── taxCalc.ts            # 税額計算ロジック
├── .env.local.example        # 環境変数のサンプル
└── README.md
```

---

## 免責事項

本ツールは簡易的な概算計算を提供するものであり、実際の税額を保証するものではありません。
計算結果は2025年度の税制に基づいた概算であり、個人の状況によって実際の税額は異なります。
正確な税額の計算・確定申告については、税理士または最寄りの税務署にご相談ください。
