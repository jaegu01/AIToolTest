"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { ColorCalculator } from "@/components/calculator/color/ColorCalculator";

export default function ColorPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.color.name")}
      description={t("calculators.color.description")}
      use3D={false}
    >
      <ColorCalculator />
    </CalculatorShell>
  );
}
