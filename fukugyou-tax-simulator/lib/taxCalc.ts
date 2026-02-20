export type SideJobType =
  | 'freelance'
  | 'resale'
  | 'affiliate'
  | 'youtube'
  | 'realestate'
  | 'other';

export interface TaxInput {
  salaryIncome: number; // 万円
  sideJobType: SideJobType;
  sideJobIncome: number; // 万円
  sideJobExpenses: number; // 万円
  socialInsurance: number; // 万円
  hasSpouse: boolean;
  dependents: number;
}

export interface TaxResult {
  // 所得
  salaryDeduction: number; // 給与所得控除
  salaryEarnings: number; // 給与所得
  sideJobEarnings: number; // 副業所得
  totalEarnings: number; // 合計所得

  // 控除
  basicDeduction: number; // 基礎控除
  socialInsuranceDeduction: number; // 社会保険料控除
  spouseDeduction: number; // 配偶者控除
  dependentDeduction: number; // 扶養控除
  totalDeduction: number; // 合計控除

  // 課税所得・税額
  taxableIncome: number; // 課税所得
  incomeTax: number; // 所得税
  reconstructionTax: number; // 復興特別所得税
  residentTax: number; // 住民税
  totalTax: number; // 合計税額

  // 副業分の追加税負担
  additionalTaxBurden: number;

  // 実効税率
  effectiveTaxRate: number;

  // 確定申告要否
  needsFilingTax: boolean;
}

/** 給与所得控除を計算（2025年度基準・万円単位） */
function calcSalaryDeduction(salaryIncome: number): number {
  if (salaryIncome <= 162.5) return 55;
  if (salaryIncome <= 180) return salaryIncome * 0.4 - 10;
  if (salaryIncome <= 360) return salaryIncome * 0.3 + 8;
  if (salaryIncome <= 660) return salaryIncome * 0.2 + 44;
  if (salaryIncome <= 850) return salaryIncome * 0.1 + 110;
  return 195;
}

/** 所得税額を計算（超過累進課税・万円単位） */
function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 195) return taxableIncome * 0.05;
  if (taxableIncome <= 330) return taxableIncome * 0.1 - 9.75;
  if (taxableIncome <= 695) return taxableIncome * 0.2 - 42.75;
  if (taxableIncome <= 900) return taxableIncome * 0.23 - 63.6;
  if (taxableIncome <= 1800) return taxableIncome * 0.33 - 153.6;
  if (taxableIncome <= 4000) return taxableIncome * 0.4 - 279.6;
  return taxableIncome * 0.45 - 479.6;
}

export function calculateTax(input: TaxInput): TaxResult {
  const {
    salaryIncome,
    sideJobIncome,
    sideJobExpenses,
    socialInsurance,
    hasSpouse,
    dependents,
  } = input;

  // 所得計算
  const salaryDeduction = calcSalaryDeduction(salaryIncome);
  const salaryEarnings = Math.max(salaryIncome - salaryDeduction, 0);
  const sideJobEarnings = Math.max(sideJobIncome - sideJobExpenses, 0);
  const totalEarnings = salaryEarnings + sideJobEarnings;

  // 控除計算
  const basicDeduction = totalEarnings <= 2400 ? 48 : 0;
  const socialInsuranceDeduction = socialInsurance;
  const spouseDeduction = hasSpouse && totalEarnings <= 900 ? 38 : 0;
  const dependentDeduction = 38 * dependents;
  const totalDeduction =
    basicDeduction +
    socialInsuranceDeduction +
    spouseDeduction +
    dependentDeduction;

  // 課税所得
  const taxableIncome = Math.max(totalEarnings - totalDeduction, 0);

  // 所得税
  const incomeTax = calcIncomeTax(taxableIncome);
  const reconstructionTax = incomeTax * 0.021;
  const residentTax = taxableIncome * 0.1;
  const totalTax = incomeTax + reconstructionTax + residentTax;

  // 副業なしの場合の税額を計算して差分を求める
  const taxableIncomeWithoutSide = Math.max(
    salaryEarnings -
      (basicDeduction + socialInsuranceDeduction + spouseDeduction + dependentDeduction),
    0
  );
  const incomeTaxWithoutSide = calcIncomeTax(taxableIncomeWithoutSide);
  const reconstructionTaxWithoutSide = incomeTaxWithoutSide * 0.021;
  const residentTaxWithoutSide = taxableIncomeWithoutSide * 0.1;
  const totalTaxWithoutSide =
    incomeTaxWithoutSide + reconstructionTaxWithoutSide + residentTaxWithoutSide;

  const additionalTaxBurden = Math.max(totalTax - totalTaxWithoutSide, 0);

  // 実効税率（合計所得が0の場合は0）
  const effectiveTaxRate =
    totalEarnings > 0 ? (totalTax / totalEarnings) * 100 : 0;

  // 確定申告要否（副業所得20万超）
  const needsFilingTax = sideJobEarnings > 20;

  return {
    salaryDeduction,
    salaryEarnings,
    sideJobEarnings,
    totalEarnings,
    basicDeduction,
    socialInsuranceDeduction,
    spouseDeduction,
    dependentDeduction,
    totalDeduction,
    taxableIncome,
    incomeTax,
    reconstructionTax,
    residentTax,
    totalTax,
    additionalTaxBurden,
    effectiveTaxRate,
    needsFilingTax,
  };
}
