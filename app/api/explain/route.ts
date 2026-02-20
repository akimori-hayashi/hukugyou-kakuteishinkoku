export const runtime = 'nodejs';

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { TaxInput, TaxResult } from '@/lib/taxCalc';

const SIDE_JOB_LABELS: Record<string, string> = {
  freelance: 'フリーランス・業務委託',
  resale: 'ネット販売・せどり',
  affiliate: 'アフィリエイト',
  youtube: 'YouTube・動画収益',
  realestate: '不動産収入',
  other: 'その他雑所得',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input: TaxInput = body.input;
    const result: TaxResult = body.result;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY が設定されていません。' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const prompt = `あなたは税務の専門家です。以下の副業確定申告シミュレーション結果をもとに、ユーザーにわかりやすく解説してください。

【シミュレーション入力情報】
- 給与収入（本業）: ${input.salaryIncome}万円
- 副業の種類: ${SIDE_JOB_LABELS[input.sideJobType] ?? input.sideJobType}
- 副業年間収入: ${input.sideJobIncome}万円
- 副業経費: ${input.sideJobExpenses}万円
- 社会保険料控除: ${input.socialInsurance}万円
- 配偶者: ${input.hasSpouse ? 'あり' : 'なし'}
- 扶養家族: ${input.dependents}人

【シミュレーション結果】
- 給与所得: ${result.salaryEarnings.toFixed(1)}万円
- 副業所得: ${result.sideJobEarnings.toFixed(1)}万円
- 合計所得: ${result.totalEarnings.toFixed(1)}万円
- 課税所得: ${result.taxableIncome.toFixed(1)}万円
- 所得税: ${result.incomeTax.toFixed(1)}万円
- 復興特別所得税: ${result.reconstructionTax.toFixed(2)}万円
- 住民税: ${result.residentTax.toFixed(1)}万円
- 合計税額: ${result.totalTax.toFixed(1)}万円
- 副業による追加税負担: ${result.additionalTaxBurden.toFixed(1)}万円
- 実効税率: ${result.effectiveTaxRate.toFixed(1)}%
- 確定申告: ${result.needsFilingTax ? '必要' : '原則不要'}

【解説に含める内容】
1. 確定申告が必要かどうかの理由
2. 税額が高い・低い理由のポイント
3. 節税のために検討できる具体的な方法（iDeCo、小規模企業共済、青色申告、経費計上など）
4. 申告時の注意点
5. 副業の種類（${SIDE_JOB_LABELS[input.sideJobType] ?? input.sideJobType}）に応じたアドバイス

【制約】
- 300〜400文字程度で簡潔にまとめる
- 難しい専門用語は避け、わかりやすい言葉で説明する
- 最後に1行、「本シミュレーターは概算です。正確な税額は税理士にご相談ください。」という免責を添える`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ explanation: text });
  } catch (error: unknown) {
    console.error('Claude API error:', error);
    const message = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `APIエラーが発生しました: ${message}` },
      { status: 500 }
    );
  }
}
