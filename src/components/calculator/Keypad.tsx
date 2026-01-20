"use client";

import { motion } from "framer-motion";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { evaluate } from "@/lib/calculator/evaluator";
import { useThemeStore } from "@/stores/themeStore";
import { triggerHaptic } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";

interface KeypadButton {
  label: string;
  value: string;
  type: "number" | "operator" | "function" | "action" | "equals";
  span?: number;
  icon?: React.ReactNode;
}

const standardKeys: KeypadButton[] = [
  { label: "C", value: "clear", type: "action" },
  { label: "(", value: "(", type: "operator" },
  { label: ")", value: ")", type: "operator" },
  { label: "÷", value: "/", type: "operator" },
  { label: "7", value: "7", type: "number" },
  { label: "8", value: "8", type: "number" },
  { label: "9", value: "9", type: "number" },
  { label: "×", value: "*", type: "operator" },
  { label: "4", value: "4", type: "number" },
  { label: "5", value: "5", type: "number" },
  { label: "6", value: "6", type: "number" },
  { label: "−", value: "-", type: "operator" },
  { label: "1", value: "1", type: "number" },
  { label: "2", value: "2", type: "number" },
  { label: "3", value: "3", type: "number" },
  { label: "+", value: "+", type: "operator" },
  { label: "0", value: "0", type: "number", span: 1 },
  { label: ".", value: ".", type: "number" },
  { label: "⌫", value: "backspace", type: "action", icon: <Delete className="w-5 h-5" /> },
  { label: "=", value: "=", type: "equals" },
];

interface KeypadProps {
  keys?: KeypadButton[];
  className?: string;
  columns?: number;
}

export function Keypad({
  keys = standardKeys,
  className,
  columns = 4,
}: KeypadProps) {
  const { expression, angleUnit, appendToExpression, clear, backspace, setResult, setError, addToHistory } =
    useCalculatorStore();
  const { hapticEnabled } = useThemeStore();
  const { playKeySound } = useSound();

  const handleKeyPress = (key: KeypadButton) => {
    if (hapticEnabled) {
      triggerHaptic(key.type === "equals" ? "medium" : "light");
    }
    playKeySound(key.type);

    switch (key.value) {
      case "clear":
        clear();
        setResult("0");
        break;
      case "allclear":
        clear();
        setResult("0");
        break;
      case "backspace":
        backspace();
        break;
      case "=":
        if (expression) {
          const evalResult = evaluate(expression, { angleUnit });
          if (evalResult.success) {
            setResult(evalResult.result);
            setError(false);
            addToHistory({
              expression,
              result: evalResult.result,
              calculatorType: "engineering",
            });
          } else {
            setResult("Error");
            setError(true);
          }
        }
        break;
      default:
        appendToExpression(key.value);
    }
  };

  return (
    <div
      className={cn(
        "grid gap-2",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {keys.map((key, index) => (
        <motion.button
          key={`${key.value}-${index}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleKeyPress(key)}
          className={cn(
            "h-16 rounded-xl font-medium text-lg transition-all",
            key.type === "number" && "calc-btn-number",
            key.type === "operator" && "calc-btn-operator",
            key.type === "function" && "calc-btn glass hover:bg-white/15",
            key.type === "action" && "calc-btn glass hover:bg-white/15",
            key.type === "equals" && "calc-btn-primary",
            key.span && `col-span-${key.span}`
          )}
          style={key.span ? { gridColumn: `span ${key.span}` } : undefined}
        >
          {key.icon || key.label}
        </motion.button>
      ))}
    </div>
  );
}

// Scientific keypad extension
export const scientificKeys: KeypadButton[] = [
  { label: "sin", value: "sin(", type: "function" },
  { label: "cos", value: "cos(", type: "function" },
  { label: "tan", value: "tan(", type: "function" },
  { label: "π", value: "pi", type: "function" },
  { label: "log", value: "log10(", type: "function" },
  { label: "ln", value: "log(", type: "function" },
  { label: "√", value: "sqrt(", type: "function" },
  { label: "e", value: "e", type: "function" },
  { label: "xʸ", value: "^", type: "operator" },
  { label: "x²", value: "^2", type: "function" },
  { label: "x³", value: "^3", type: "function" },
  { label: "1/x", value: "^(-1)", type: "function" },
  { label: "n!", value: "factorial(", type: "function" },
  { label: "|x|", value: "abs(", type: "function" },
  { label: "%", value: "%", type: "operator" },
  { label: "EXP", value: "e", type: "function" },
];
