"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { GraphCalculator } from "@/components/calculator/graph/GraphCalculator";

export default function GraphPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.graph.name")}
      description={t("calculators.graph.description")}
      use3D={false}
    >
      <GraphCalculator />
    </CalculatorShell>
  );
}
