"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { ProgrammerCalculator } from "@/components/calculator/programmer/ProgrammerCalculator";

export default function ProgrammerPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.programmer.name")}
      description={t("calculators.programmer.description")}
    >
      <ProgrammerCalculator />
    </CalculatorShell>
  );
}
