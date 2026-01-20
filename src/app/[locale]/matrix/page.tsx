"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { MatrixCalculator } from "@/components/calculator/matrix/MatrixCalculator";

export default function MatrixPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.matrix.name")}
      description={t("calculators.matrix.description")}
    >
      <MatrixCalculator />
    </CalculatorShell>
  );
}
