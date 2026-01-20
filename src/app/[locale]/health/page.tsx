"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { HealthCalculator } from "@/components/calculator/health/HealthCalculator";

export default function HealthPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.health.name")}
      description={t("calculators.health.description")}
    >
      <HealthCalculator />
    </CalculatorShell>
  );
}
