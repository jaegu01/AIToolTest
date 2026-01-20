"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { StatisticsCalculator } from "@/components/calculator/statistics/StatisticsCalculator";

export default function StatisticsPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.statistics.name")}
      description={t("calculators.statistics.description")}
    >
      <StatisticsCalculator />
    </CalculatorShell>
  );
}
