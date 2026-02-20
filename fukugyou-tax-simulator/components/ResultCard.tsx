'use client';

import { TaxResult } from '@/lib/taxCalc';

interface Props {
  result: TaxResult;
}

function fmt(value: number, digits = 1): string {
  const rounded = Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
  return rounded.toLocaleString('ja-JP', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function Row({
  label,
  value,
  unit = '万円',
  highlight = false,
}: {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${highlight ? 'font-semibold text-blue-700' : 'text-gray-700'}`}
    >
      <span className="text-sm">{label}</span>
      <span className={`text-sm ${highlight ? 'text-base' : ''}`}>
        {value}
        <span className="text-xs text-gray-500 ml-1">{unit}</span>
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-5">
      <h3 className="text-base font-semibold text-blue-800 mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

export default function ResultCard({ result }: Props) {
  return (
    <div className="space-y-4">
      {/* 確定申告要否バナー */}
      <div
        className={`rounded-xl p-4 flex items-center gap-3 shadow-sm ${
          result.needsFilingTax
            ? 'bg-red-50 border border-red-300'
            : 'bg-green-50 border border-green-300'
        }`}
      >
        <span className="text-2xl">{result.needsFilingTax ? '⚠️' : '✅'}</span>
        <div>
          <p
            className={`font-bold text-lg ${
              result.needsFilingTax ? 'text-red-700' : 'text-green-700'
            }`}
          >
            確定申告は
            {result.needsFilingTax ? '【必要】' : '【原則不要】'}
            です
          </p>
          <p className="text-sm mt-0.5 text-gray-600">
            {result.needsFilingTax
              ? '副業所得が20万円を超えているため、確定申告が必要です。'
              : '副業所得が20万円以下のため、所得税の確定申告は原則不要です。ただし住民税の申告が必要な場合があります。'}
          </p>
        </div>
      </div>

      {/* 所得の内訳 */}
      <Section title="所得の内訳">
        <Row label="給与所得控除" value={fmt(result.salaryDeduction)} />
        <Row label="給与所得" value={fmt(result.salaryEarnings)} />
        <Row label="副業所得" value={fmt(result.sideJobEarnings)} />
        <Row label="合計所得" value={fmt(result.totalEarnings)} highlight />
      </Section>

      {/* 控除の内訳 */}
      <Section title="控除の内訳">
        <Row label="基礎控除" value={fmt(result.basicDeduction)} />
        <Row
          label="社会保険料控除"
          value={fmt(result.socialInsuranceDeduction)}
        />
        <Row label="配偶者控除" value={fmt(result.spouseDeduction)} />
        <Row label="扶養控除" value={fmt(result.dependentDeduction)} />
        <Row label="合計控除" value={fmt(result.totalDeduction)} highlight />
      </Section>

      {/* 税額の内訳 */}
      <Section title="税額の内訳">
        <Row label="課税所得" value={fmt(result.taxableIncome)} />
        <Row label="所得税" value={fmt(result.incomeTax)} />
        <Row label="復興特別所得税" value={fmt(result.reconstructionTax, 2)} />
        <Row label="住民税" value={fmt(result.residentTax)} />
        <Row label="合計税額" value={fmt(result.totalTax)} highlight />
      </Section>

      {/* 副業による追加税負担・実効税率 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-orange-700 font-medium mb-1">
            副業による追加税負担（概算）
          </p>
          <p className="text-2xl font-bold text-orange-800">
            {fmt(result.additionalTaxBurden)}
            <span className="text-sm font-normal ml-1">万円</span>
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-700 font-medium mb-1">実効税率</p>
          <p className="text-2xl font-bold text-blue-800">
            {result.effectiveTaxRate.toFixed(1)}
            <span className="text-sm font-normal ml-1">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
