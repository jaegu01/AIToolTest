import { describe, it, expect } from "vitest";
import { evaluate } from "@/lib/calculator/evaluator";

describe("Calculator Evaluator", () => {
  describe("Basic Operations", () => {
    it("should add numbers correctly", () => {
      expect(evaluate("1 + 1").result).toBe("2");
      expect(evaluate("10 + 20").result).toBe("30");
      expect(evaluate("0.1 + 0.2").result).toBe("0.3");
    });

    it("should subtract numbers correctly", () => {
      expect(evaluate("10 - 3").result).toBe("7");
      expect(evaluate("5 - 10").result).toBe("-5");
    });

    it("should multiply numbers correctly", () => {
      expect(evaluate("6 * 7").result).toBe("42");
      expect(evaluate("0.5 * 0.5").result).toBe("0.25");
    });

    it("should divide numbers correctly", () => {
      expect(evaluate("10 / 2").result).toBe("5");
      expect(evaluate("7 / 2").result).toBe("3.5");
    });

    it("should handle division by zero", () => {
      const result = evaluate("10 / 0");
      expect(result.success).toBe(false);
    });
  });

  describe("Scientific Functions", () => {
    it("should calculate trigonometric functions in degree mode", () => {
      const sin0 = evaluate("sin(0)", { angleUnit: "deg" });
      expect(parseFloat(sin0.result)).toBeCloseTo(0, 5);

      const sin90 = evaluate("sin(90)", { angleUnit: "deg" });
      expect(parseFloat(sin90.result)).toBeCloseTo(1, 5);

      const cos0 = evaluate("cos(0)", { angleUnit: "deg" });
      expect(parseFloat(cos0.result)).toBeCloseTo(1, 5);
    });

    it("should calculate logarithms correctly", () => {
      const log10 = evaluate("log10(100)");
      expect(parseFloat(log10.result)).toBeCloseTo(2, 5);

      const ln = evaluate("log(e)");
      expect(parseFloat(ln.result)).toBeCloseTo(1, 5);
    });

    it("should calculate square roots correctly", () => {
      expect(evaluate("sqrt(4)").result).toBe("2");
      expect(evaluate("sqrt(2)").result).toBe("1.41421356");
    });

    it("should calculate powers correctly", () => {
      expect(evaluate("2^10").result).toBe("1024");
      expect(evaluate("10^(-3)").result).toBe("0.001");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty expressions", () => {
      expect(evaluate("").result).toBe("0");
      expect(evaluate("   ").result).toBe("0");
    });

    it("should handle percentages", () => {
      expect(evaluate("50%").result).toBe("0.5");
      expect(evaluate("100 * 20%").result).toBe("20");
    });

    it("should handle parentheses correctly", () => {
      expect(evaluate("(2 + 3) * 4").result).toBe("20");
      expect(evaluate("2 + (3 * 4)").result).toBe("14");
    });

    it("should handle invalid expressions", () => {
      const result = evaluate("invalid");
      expect(result.success).toBe(false);
      expect(result.error).toBe("invalidExpression");
    });
  });

  describe("Constants", () => {
    it("should recognize pi", () => {
      const result = evaluate("pi");
      expect(parseFloat(result.result)).toBeCloseTo(Math.PI, 5);
    });

    it("should recognize e", () => {
      const result = evaluate("e");
      expect(parseFloat(result.result)).toBeCloseTo(Math.E, 5);
    });
  });
});
