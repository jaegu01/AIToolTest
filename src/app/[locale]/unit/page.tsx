"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { UnitCalculator } from "@/components/calculator/unit/UnitCalculator";

export default function UnitPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.unit.name")}
      description={t("calculators.unit.description")}
    >
      <UnitCalculator />
    </CalculatorShell>
  );
}
