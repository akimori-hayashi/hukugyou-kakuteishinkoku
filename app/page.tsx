'use client';

import { useState, useRef } from 'react';
import SimulatorForm from '@/components/SimulatorForm';
import ResultCard from '@/components/ResultCard';
import AiExplanation from '@/components/AiExplanation';
import ShareButton from '@/components/ShareButton';
import { TaxInput, TaxResult, calculateTax } from '@/lib/taxCalc';

export default function Home() {
  const [result, setResult] = useState<TaxResult | null>(null);
  const [currentInput, setCurrentInput] = useState<TaxInput | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (input: TaxInput) => {
    const taxResult = calculateTax(input);
    setResult(taxResult);
    setCurrentInput(input);
    // 結果セクションへスクロール
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="text-xl font-bold tracking-tight">
            副業確定申告 税額簡易シミュレーター
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            2025年度税制に基づく概算計算ツール
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* 入力フォームセクション */}
        <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">
              1
            </span>
            基本情報を入力
          </h2>
          <SimulatorForm onSubmit={handleSubmit} />
        </section>

        {/* 結果セクション */}
        {result && currentInput && (
          <section ref={resultRef} className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">
                2
              </span>
              <h2 className="text-lg font-bold text-gray-800">計算結果</h2>
            </div>

            <ResultCard result={result} />

            {/* AI解説 */}
            <AiExplanation input={currentInput} result={result} />

            {/* シェアボタン */}
            <div className="flex justify-center pt-2">
              <ShareButton />
            </div>
          </section>
        )}

        {/* 免責事項 */}
        <footer className="text-center text-xs text-gray-400 pb-8 px-2 leading-relaxed">
          本ツールは簡易的な概算計算を提供するものです。実際の税額は個人の状況により異なります。
          正確な税額の計算・申告については、税理士や税務署にご相談ください。
        </footer>
      </div>
    </main>
  );
}
