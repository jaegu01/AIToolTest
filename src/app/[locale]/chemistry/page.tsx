"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { ChemistryCalculator } from "@/components/calculator/chemistry/ChemistryCalculator";

export default function ChemistryPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.chemistry.name")}
      description={t("calculators.chemistry.description")}
    >
      <ChemistryCalculator />
    </CalculatorShell>
  );
}
