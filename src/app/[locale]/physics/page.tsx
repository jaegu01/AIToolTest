"use client";

import { useTranslations } from "next-intl";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { PhysicsCalculator } from "@/components/calculator/physics/PhysicsCalculator";

export default function PhysicsPage() {
  const t = useTranslations();

  return (
    <CalculatorShell
      title={t("calculators.physics.name")}
      description={t("calculators.physics.description")}
    >
      <PhysicsCalculator />
    </CalculatorShell>
  );
}
