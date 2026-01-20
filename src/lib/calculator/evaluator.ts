import { create, all, MathJsInstance, ConfigOptions } from "mathjs";

const config: ConfigOptions = {
  number: "number",
  precision: 14,
};

const math: MathJsInstance = create(all, config);

export interface EvaluationResult {
  success: boolean;
  result: string;
  numericResult?: number;
  error?: string;
}

export interface EvaluatorOptions {
  angleUnit?: "deg" | "rad";
  precision?: number;
  scientific?: boolean;
}

const defaultOptions: EvaluatorOptions = {
  angleUnit: "deg",
  precision: 10,
  scientific: false,
};

export function evaluate(
  expression: string,
  options: EvaluatorOptions = {}
): EvaluationResult {
  const opts = { ...defaultOptions, ...options };

  try {
    if (!expression.trim()) {
      return { success: true, result: "0" };
    }

    let processedExpr = expression;

    // Handle degree mode for trigonometric functions
    if (opts.angleUnit === "deg") {
      processedExpr = processedExpr
        .replace(/sin\(/g, "sin(pi/180*")
        .replace(/cos\(/g, "cos(pi/180*")
        .replace(/tan\(/g, "tan(pi/180*");
    }

    // Handle percentage
    processedExpr = processedExpr.replace(
      /(\d+(?:\.\d+)?)\s*%/g,
      "($1/100)"
    );

    // Handle implicit multiplication
    processedExpr = processedExpr
      .replace(/(\d)([a-zA-Z(])/g, "$1*$2")
      .replace(/(\))(\d)/g, "$1*$2")
      .replace(/(\))([a-zA-Z(])/g, "$1*$2");

    const result = math.evaluate(processedExpr);

    if (typeof result === "undefined" || result === null) {
      return {
        success: false,
        result: "",
        error: "undefined",
      };
    }

    if (typeof result === "number") {
      if (!isFinite(result)) {
        if (result === Infinity) {
          return { success: false, result: "", error: "overflow" };
        }
        return { success: false, result: "", error: "undefined" };
      }

      const formatted = formatResult(result, opts.precision!, opts.scientific!);
      return {
        success: true,
        result: formatted,
        numericResult: result,
      };
    }

    return {
      success: true,
      result: String(result),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "unknown";

    if (errorMessage.includes("Division by zero")) {
      return { success: false, result: "", error: "divisionByZero" };
    }

    return {
      success: false,
      result: "",
      error: "invalidExpression",
    };
  }
}

function formatResult(
  value: number,
  precision: number,
  scientific: boolean
): string {
  if (value === 0) return "0";

  const absValue = Math.abs(value);

  if (scientific || absValue >= 1e10 || (absValue < 1e-6 && absValue !== 0)) {
    return value.toExponential(precision - 1);
  }

  const rounded = Number(value.toPrecision(precision));
  let str = String(rounded);

  // Remove trailing zeros after decimal point
  if (str.includes(".")) {
    str = str.replace(/\.?0+$/, "");
  }

  return str;
}

export function formatExpression(expression: string): string {
  return expression
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/sqrt/g, "√")
    .replace(/pi/gi, "π")
    .replace(/\^/g, "^");
}

export function validateExpression(expression: string): boolean {
  try {
    math.parse(expression);
    return true;
  } catch {
    return false;
  }
}

export const constants = {
  pi: Math.PI,
  e: Math.E,
  phi: (1 + Math.sqrt(5)) / 2,
  sqrt2: Math.sqrt(2),
  ln2: Math.LN2,
  ln10: Math.LN10,
};

export const scientificFunctions = [
  { name: "sin", label: "sin", description: "Sine" },
  { name: "cos", label: "cos", description: "Cosine" },
  { name: "tan", label: "tan", description: "Tangent" },
  { name: "asin", label: "sin⁻¹", description: "Arc sine" },
  { name: "acos", label: "cos⁻¹", description: "Arc cosine" },
  { name: "atan", label: "tan⁻¹", description: "Arc tangent" },
  { name: "sinh", label: "sinh", description: "Hyperbolic sine" },
  { name: "cosh", label: "cosh", description: "Hyperbolic cosine" },
  { name: "tanh", label: "tanh", description: "Hyperbolic tangent" },
  { name: "log", label: "log", description: "Logarithm base 10" },
  { name: "ln", label: "ln", description: "Natural logarithm" },
  { name: "log2", label: "log₂", description: "Logarithm base 2" },
  { name: "exp", label: "eˣ", description: "Exponential" },
  { name: "sqrt", label: "√", description: "Square root" },
  { name: "cbrt", label: "∛", description: "Cube root" },
  { name: "abs", label: "|x|", description: "Absolute value" },
  { name: "factorial", label: "n!", description: "Factorial" },
  { name: "pow", label: "xʸ", description: "Power" },
  { name: "mod", label: "mod", description: "Modulo" },
];
