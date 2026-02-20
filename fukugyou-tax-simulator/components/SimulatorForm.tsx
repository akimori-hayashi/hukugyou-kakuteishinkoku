'use client';

import { useState, useEffect } from 'react';
import { TaxInput, SideJobType } from '@/lib/taxCalc';

interface Props {
  onSubmit: (input: TaxInput) => void;
}

const SIDE_JOB_OPTIONS: { value: SideJobType; label: string }[] = [
  { value: 'freelance', label: 'フリーランス・業務委託' },
  { value: 'resale', label: 'ネット販売・せどり' },
  { value: 'affiliate', label: 'アフィリエイト' },
  { value: 'youtube', label: 'YouTube・動画収益' },
  { value: 'realestate', label: '不動産収入' },
  { value: 'other', label: 'その他雑所得' },
];

export default function SimulatorForm({ onSubmit }: Props) {
  const [salaryIncome, setSalaryIncome] = useState('500');
  const [sideJobType, setSideJobType] = useState<SideJobType>('freelance');
  const [sideJobIncome, setSideJobIncome] = useState('50');
  const [sideJobExpenses, setSideJobExpenses] = useState('10');
  const [socialInsurance, setSocialInsurance] = useState('');
  const [hasSpouse, setHasSpouse] = useState(false);
  const [dependents, setDependents] = useState('0');

  // 給与収入の14.5%を社会保険料のデフォルト値として自動計算
  useEffect(() => {
    const salary = parseFloat(salaryIncome) || 0;
    const defaultSocialInsurance = Math.round(salary * 0.145 * 10) / 10;
    setSocialInsurance(defaultSocialInsurance.toString());
  }, [salaryIncome]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: TaxInput = {
      salaryIncome: parseFloat(salaryIncome) || 0,
      sideJobType,
      sideJobIncome: parseFloat(sideJobIncome) || 0,
      sideJobExpenses: parseFloat(sideJobExpenses) || 0,
      socialInsurance: parseFloat(socialInsurance) || 0,
      hasSpouse,
      dependents: parseInt(dependents) || 0,
    };
    onSubmit(input);
  };

  const inputClass =
    'w-full rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition';

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 給与収入 */}
      <div>
        <label className={labelClass}>
          給与収入（本業）<span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="0.1"
            value={salaryIncome}
            onChange={(e) => setSalaryIncome(e.target.value)}
            className={inputClass}
            placeholder="例: 500"
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            万円
          </span>
        </div>
      </div>

      {/* 副業収入の種類 */}
      <div>
        <label className={labelClass}>
          副業収入の種類<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={sideJobType}
          onChange={(e) => setSideJobType(e.target.value as SideJobType)}
          className={inputClass}
          required
        >
          {SIDE_JOB_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 副業年間収入 */}
      <div>
        <label className={labelClass}>
          副業年間収入<span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="0.1"
            value={sideJobIncome}
            onChange={(e) => setSideJobIncome(e.target.value)}
            className={inputClass}
            placeholder="例: 50"
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            万円
          </span>
        </div>
      </div>

      {/* 副業経費 */}
      <div>
        <label className={labelClass}>副業にかかった経費</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="0.1"
            value={sideJobExpenses}
            onChange={(e) => setSideJobExpenses(e.target.value)}
            className={inputClass}
            placeholder="例: 10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            万円
          </span>
        </div>
      </div>

      {/* 社会保険料控除 */}
      <div>
        <label className={labelClass}>
          社会保険料控除額
          <span className="ml-2 text-xs text-blue-500">
            （給与の14.5%を自動計算）
          </span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="0.1"
            value={socialInsurance}
            onChange={(e) => setSocialInsurance(e.target.value)}
            className={inputClass}
            placeholder="例: 72.5"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            万円
          </span>
        </div>
      </div>

      {/* 配偶者の有無 */}
      <div>
        <label className={labelClass}>配偶者の有無</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="spouse"
              checked={hasSpouse}
              onChange={() => setHasSpouse(true)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-gray-700">あり</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="spouse"
              checked={!hasSpouse}
              onChange={() => setHasSpouse(false)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-gray-700">なし</span>
          </label>
        </div>
      </div>

      {/* 扶養家族の人数 */}
      <div>
        <label className={labelClass}>扶養家族の人数</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="10"
            step="1"
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            className={inputClass}
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            人
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold text-base shadow hover:bg-blue-700 active:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        税額を計算する
      </button>
    </form>
  );
}
