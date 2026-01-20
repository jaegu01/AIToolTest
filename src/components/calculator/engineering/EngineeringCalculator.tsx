"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Display } from "@/components/calculator/Display";
import { Keypad, scientificKeys } from "@/components/calculator/Keypad";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { cn } from "@/lib/utils";

export function EngineeringCalculator() {
  const [showScientific, setShowScientific] = useState(true);
  const { angleUnit, toggleAngleUnit } = useCalculatorStore();
  const t = useTranslations();

  return (
    <div className="glass p-4 rounded-2xl space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={toggleAngleUnit}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            "glass hover:bg-white/20"
          )}
        >
          {angleUnit === "deg" ? t("calculator.degree") : t("calculator.radian")}
        </button>

        <button
          onClick={() => setShowScientific(!showScientific)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg glass hover:bg-white/20 text-sm"
        >
          {showScientific ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Scientific
            </>
          )}
        </button>
      </div>

      {/* Display */}
      <Display />

      {/* Scientific Functions */}
      <AnimatePresence>
        {showScientific && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Keypad keys={scientificKeys} columns={4} className="mb-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standard Keypad */}
      <Keypad />
    </div>
  );
}
