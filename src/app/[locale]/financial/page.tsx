"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { FinancialCalculator } from "@/components/calculator/financial/FinancialCalculator";

export default function FinancialPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.financial.name")}
      description={t("calculators.financial.description")}
    >
      <FinancialCalculator />
    </CalculatorShell>
  );
}
