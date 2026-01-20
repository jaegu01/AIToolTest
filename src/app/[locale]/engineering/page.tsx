"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { EngineeringCalculator } from "@/components/calculator/engineering/EngineeringCalculator";
import { HistoryPanel } from "@/components/calculator/HistoryPanel";

export default function EngineeringPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.engineering.name")}
      description={t("calculators.engineering.description")}
      showHistory
      historyPanel={<HistoryPanel calculatorType="engineering" />}
    >
      <EngineeringCalculator />
    </CalculatorShell>
  );
}
