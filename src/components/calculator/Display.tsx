"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { formatExpression } from "@/lib/calculator/evaluator";
import { cn } from "@/lib/utils";

interface DisplayProps {
  className?: string;
  showExpression?: boolean;
}

export function Display({ className, showExpression = true }: DisplayProps) {
  const { expression, result, isError } = useCalculatorStore();

  const formattedExpression = formatExpression(expression);

  return (
    <div className={cn("glass-heavy p-6 rounded-2xl mb-4", className)}>
      {/* Expression */}
      {showExpression && (
        <div className="text-right text-muted-foreground text-lg min-h-[1.75rem] mb-2 font-mono overflow-x-auto hide-scrollbar">
          {formattedExpression || "\u00A0"}
        </div>
      )}

      {/* Result */}
      <AnimatePresence mode="wait">
        <motion.div
          key={result}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={cn(
            "text-right text-4xl md:text-5xl font-bold font-mono tracking-tight",
            isError && "text-destructive error-shake"
          )}
        >
          {result}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
