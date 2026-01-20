"use client";

import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { formatExpression } from "@/lib/calculator/evaluator";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

interface DisplayProps {
  className?: string;
  showExpression?: boolean;
}

// Animated number digit component
function AnimatedDigit({ digit, index }: { digit: string; index: number }) {
  return (
    <motion.span
      key={`${digit}-${index}`}
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: index * 0.02,
      }}
      className="inline-block"
    >
      {digit}
    </motion.span>
  );
}

export function Display({ className, showExpression = true }: DisplayProps) {
  const { expression, result, isError } = useCalculatorStore();
  const [copied, setCopied] = useState(false);
  const [displayedResult, setDisplayedResult] = useState(result);

  const formattedExpression = formatExpression(expression);

  // Spring animation for result changes
  const springValue = useSpring(0, { stiffness: 100, damping: 20 });

  // Determine font size based on result length
  const fontSize = useMemo(() => {
    const len = result.length;
    if (len > 20) return "text-2xl md:text-3xl";
    if (len > 15) return "text-3xl md:text-4xl";
    if (len > 10) return "text-4xl md:text-5xl";
    return "text-4xl md:text-5xl lg:text-6xl";
  }, [result]);

  useEffect(() => {
    setDisplayedResult(result);
  }, [result]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "calc-display relative group",
        className
      )}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Expression */}
      {showExpression && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="calc-display-expression"
        >
          <AnimatePresence mode="popLayout">
            {formattedExpression ? (
              <motion.span
                key={formattedExpression}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.6, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {formattedExpression}
              </motion.span>
            ) : (
              <span className="opacity-0">0</span>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Result with animated digits */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayedResult}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className={cn(
              "calc-display-result font-mono tracking-tight",
              fontSize,
              isError && "text-destructive"
            )}
          >
            {isError ? (
              <motion.span
                animate={{
                  x: [0, -4, 4, -4, 4, 0],
                }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                {displayedResult}
              </motion.span>
            ) : (
              displayedResult.split("").map((char, i) => (
                <AnimatedDigit key={`${char}-${i}-${displayedResult}`} digit={char} index={i} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Copy button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-lg",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "glass-light hover:bg-white/20",
            copied && "opacity-100"
          )}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-4 h-4 text-green-400" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Bottom glow effect */}
      <motion.div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl pointer-events-none"
        animate={{
          opacity: isError ? [0.3, 0.5, 0.3] : [0.15, 0.25, 0.15],
          scale: isError ? [1, 1.1, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: isError
            ? "hsl(var(--destructive))"
            : "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
        }}
      />
    </motion.div>
  );
}

// Compact display variant for smaller calculators
export function CompactDisplay({ className }: { className?: string }) {
  const { result, isError } = useCalculatorStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "glass p-4 rounded-xl text-right",
        className
      )}
    >
      <div
        className={cn(
          "text-2xl md:text-3xl font-mono font-semibold truncate",
          isError && "text-destructive"
        )}
      >
        {result}
      </div>
    </motion.div>
  );
}
