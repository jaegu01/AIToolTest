"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Delete, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { evaluate } from "@/lib/calculator/evaluator";
import { useThemeStore } from "@/stores/themeStore";
import { triggerHaptic } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";
import { useRef, useCallback } from "react";

interface KeypadButton {
  label: string;
  value: string;
  type: "number" | "operator" | "function" | "action" | "equals";
  span?: number;
  icon?: React.ReactNode;
}

const standardKeys: KeypadButton[] = [
  { label: "AC", value: "clear", type: "action", icon: <RotateCcw className="w-4 h-4" /> },
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

// Ripple effect button component
function KeyButton({
  keyData,
  onClick,
}: {
  keyData: KeypadButton;
  onClick: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleX = useMotionValue(0);
  const rippleY = useMotionValue(0);
  const rippleOpacity = useMotionValue(0);
  const rippleScale = useSpring(0, { stiffness: 300, damping: 30 });

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    rippleX.set(x);
    rippleY.set(y);
    rippleOpacity.set(0.4);
    rippleScale.set(0);

    // Animate ripple
    setTimeout(() => {
      rippleScale.set(4);
      rippleOpacity.set(0);
    }, 10);

    onClick();
  }, [onClick, rippleX, rippleY, rippleOpacity, rippleScale]);

  const rippleSize = 100;

  return (
    <motion.button
      ref={buttonRef}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn(
        // Base styles - responsive height
        "h-12 sm:h-14 md:h-16 rounded-xl font-medium transition-all relative overflow-hidden",
        // Responsive text size
        "text-base sm:text-lg",
        // Type-specific styles
        keyData.type === "number" && "calc-btn-number",
        keyData.type === "operator" && "calc-btn-operator",
        keyData.type === "function" && "calc-btn-function",
        keyData.type === "action" && "calc-btn glass hover:bg-white/15",
        keyData.type === "equals" && "calc-btn-primary glow-pulse",
        // Span
        keyData.span && `col-span-${keyData.span}`
      )}
      style={keyData.span ? { gridColumn: `span ${keyData.span}` } : undefined}
    >
      {/* Ripple Effect */}
      <motion.span
        className="absolute rounded-full bg-white/30 pointer-events-none"
        style={{
          left: useTransform(rippleX, (v) => v - rippleSize / 2),
          top: useTransform(rippleY, (v) => v - rippleSize / 2),
          width: rippleSize,
          height: rippleSize,
          opacity: rippleOpacity,
          scale: rippleScale,
        }}
      />

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-1">
        {keyData.icon || keyData.label}
      </span>
    </motion.button>
  );
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

  const handleKeyPress = useCallback((key: KeypadButton) => {
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
  }, [expression, angleUnit, hapticEnabled, playKeySound, clear, setResult, backspace, appendToExpression, setError, addToHistory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
      className={cn(
        "grid gap-2 sm:gap-3",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {keys.map((key, index) => (
        <motion.div
          key={`${key.value}-${index}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: index * 0.02,
          }}
        >
          <KeyButton
            keyData={key}
            onClick={() => handleKeyPress(key)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Scientific keypad extension with better organization
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

// Inverse trig functions
export const inverseTrigKeys: KeypadButton[] = [
  { label: "sin⁻¹", value: "asin(", type: "function" },
  { label: "cos⁻¹", value: "acos(", type: "function" },
  { label: "tan⁻¹", value: "atan(", type: "function" },
  { label: "sinh", value: "sinh(", type: "function" },
  { label: "cosh", value: "cosh(", type: "function" },
  { label: "tanh", value: "tanh(", type: "function" },
];
