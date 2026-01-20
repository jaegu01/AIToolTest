"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { DateTimeCalculator } from "@/components/calculator/datetime/DateTimeCalculator";

export default function DateTimePage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.datetime.name")}
      description={t("calculators.datetime.description")}
    >
      <DateTimeCalculator />
    </CalculatorShell>
  );
}
