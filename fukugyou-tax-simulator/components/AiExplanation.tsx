'use client';

import { useState } from 'react';
import { TaxInput, TaxResult } from '@/lib/taxCalc';

interface Props {
  input: TaxInput;
  result: TaxResult;
}

export default function AiExplanation({ input, result }: Props) {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    setExplanation('');
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, result }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'エラーが発生しました。');
      } else {
        setExplanation(data.explanation ?? '');
        setFetched(true);
      }
    } catch {
      setError('ネットワークエラーが発生しました。しばらくしてからもう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🤖</span>
        <h3 className="text-base font-semibold text-blue-800">
          AIによる税務解説
        </h3>
      </div>

      {!fetched && !loading && (
        <button
          onClick={handleFetch}
          className="w-full rounded-lg bg-indigo-600 px-6 py-2.5 text-white font-semibold shadow hover:bg-indigo-700 active:bg-indigo-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          AIで解説を見る
        </button>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-indigo-600">AIが解説を生成しています...</p>
        </div>
      )}

      {error && (
        <div className="mt-2">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
          <button
            onClick={handleFetch}
            className="mt-3 w-full rounded-lg bg-indigo-600 px-6 py-2.5 text-white font-semibold shadow hover:bg-indigo-700 transition"
          >
            再試行する
          </button>
        </div>
      )}

      {explanation && (
        <div className="mt-2">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {explanation}
          </p>
          <button
            onClick={handleFetch}
            className="mt-4 text-xs text-indigo-500 underline hover:text-indigo-700 transition"
          >
            解説を再生成する
          </button>
        </div>
      )}
    </div>
  );
}
