"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

type Base = "bin" | "oct" | "dec" | "hex";

const baseConfig: Record<Base, { label: string; radix: number; prefix: string }> = {
  bin: { label: "BIN", radix: 2, prefix: "0b" },
  oct: { label: "OCT", radix: 8, prefix: "0o" },
  dec: { label: "DEC", radix: 10, prefix: "" },
  hex: { label: "HEX", radix: 16, prefix: "0x" },
};

export function ProgrammerCalculator() {
  const [inputBase, setInputBase] = useState<Base>("dec");
  const [inputValue, setInputValue] = useState("");
  const [decimalValue, setDecimalValue] = useState<number>(0);
  const [copiedBase, setCopiedBase] = useState<Base | null>(null);

  useEffect(() => {
    if (!inputValue) {
      setDecimalValue(0);
      return;
    }

    try {
      const parsed = parseInt(inputValue, baseConfig[inputBase].radix);
      if (!isNaN(parsed)) {
        setDecimalValue(parsed);
      }
    } catch {
      // Invalid input
    }
  }, [inputValue, inputBase]);

  const getValueInBase = (base: Base): string => {
    if (decimalValue === 0 && !inputValue) return "0";
    return decimalValue.toString(baseConfig[base].radix).toUpperCase();
  };

  const handleCopy = async (base: Base) => {
    const value = baseConfig[base].prefix + getValueInBase(base);
    await copyToClipboard(value);
    setCopiedBase(base);
    setTimeout(() => setCopiedBase(null), 1500);
  };

  const handleKeyPress = (key: string) => {
    if (key === "C") {
      setInputValue("");
      return;
    }

    if (key === "⌫") {
      setInputValue((v) => v.slice(0, -1));
      return;
    }

    // Validate key for current base
    const validChars: Record<Base, string> = {
      bin: "01",
      oct: "01234567",
      dec: "0123456789",
      hex: "0123456789ABCDEF",
    };

    if (validChars[inputBase].includes(key.toUpperCase())) {
      setInputValue((v) => v + key.toUpperCase());
    }
  };

  // Bit operations
  const performBitOp = (op: string) => {
    switch (op) {
      case "NOT":
        setDecimalValue(~decimalValue >>> 0);
        break;
      case "<<":
        setDecimalValue((decimalValue << 1) >>> 0);
        break;
      case ">>":
        setDecimalValue(decimalValue >>> 1);
        break;
    }
    setInputValue(decimalValue.toString(baseConfig[inputBase].radix).toUpperCase());
  };

  const hexKeys = [
    ["D", "E", "F", "NOT"],
    ["A", "B", "C", "<<"],
    ["7", "8", "9", ">>"],
    ["4", "5", "6", "AND"],
    ["1", "2", "3", "OR"],
    ["0", "C", "⌫", "XOR"],
  ];

  return (
    <div className="space-y-4">
      {/* Base Selection */}
      <div className="glass p-2 rounded-xl flex gap-2">
        {(Object.keys(baseConfig) as Base[]).map((base) => (
          <button
            key={base}
            onClick={() => {
              setInputBase(base);
              setInputValue(getValueInBase(base));
            }}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
              inputBase === base
                ? "bg-primary/30 border border-primary"
                : "hover:bg-white/10"
            )}
          >
            {baseConfig[base].label}
          </button>
        ))}
      </div>

      {/* Display All Bases */}
      <div className="glass p-4 rounded-2xl space-y-3">
        {(Object.keys(baseConfig) as Base[]).map((base) => (
          <div
            key={base}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all",
              inputBase === base ? "glass-heavy" : "hover:bg-white/5"
            )}
          >
            <span className="w-12 text-xs text-muted-foreground font-medium">
              {baseConfig[base].label}
            </span>
            <span className="text-xs text-muted-foreground">
              {baseConfig[base].prefix}
            </span>
            <span className="flex-1 font-mono text-lg font-medium truncate">
              {getValueInBase(base)}
            </span>
            <button
              onClick={() => handleCopy(base)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {copiedBase === base ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Bit Display */}
      <div className="glass p-4 rounded-2xl">
        <h3 className="text-xs text-muted-foreground mb-3">32-bit Binary</h3>
        <div className="grid grid-cols-8 gap-1 font-mono text-xs">
          {Array.from({ length: 32 }, (_, i) => {
            const bit = (decimalValue >>> (31 - i)) & 1;
            return (
              <div
                key={i}
                className={cn(
                  "aspect-square flex items-center justify-center rounded",
                  bit ? "bg-primary/30 text-primary" : "bg-white/5 text-muted-foreground",
                  i % 4 === 3 && i < 31 && "mr-1"
                )}
              >
                {bit}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>31</span>
          <span>0</span>
        </div>
      </div>

      {/* Keypad */}
      <div className="glass p-4 rounded-2xl">
        <div className="grid grid-cols-4 gap-2">
          {hexKeys.flat().map((key, i) => {
            const isHexDigit = "ABCDEF".includes(key);
            const isDisabled =
              (inputBase === "bin" && !"01C⌫".includes(key)) ||
              (inputBase === "oct" && !"01234567C⌫".includes(key)) ||
              (inputBase === "dec" && isHexDigit);

            return (
              <motion.button
                key={`${key}-${i}`}
                whileHover={!isDisabled ? { scale: 1.05 } : undefined}
                whileTap={!isDisabled ? { scale: 0.95 } : undefined}
                onClick={() => {
                  if (["NOT", "<<", ">>", "AND", "OR", "XOR"].includes(key)) {
                    performBitOp(key);
                  } else {
                    handleKeyPress(key);
                  }
                }}
                disabled={isDisabled}
                className={cn(
                  "h-14 rounded-xl font-medium text-lg transition-all",
                  isDisabled
                    ? "opacity-30 cursor-not-allowed"
                    : "calc-btn hover:bg-white/20",
                  ["NOT", "<<", ">>", "AND", "OR", "XOR"].includes(key) &&
                    "calc-btn-operator text-sm"
                )}
              >
                {key}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ASCII Table (collapsed by default) */}
      <details className="glass rounded-2xl">
        <summary className="p-4 cursor-pointer text-sm font-medium">
          ASCII Reference
        </summary>
        <div className="p-4 pt-0 grid grid-cols-4 gap-2 text-xs max-h-60 overflow-y-auto custom-scrollbar">
          {Array.from({ length: 95 }, (_, i) => {
            const code = i + 32;
            return (
              <div
                key={code}
                className="flex items-center gap-2 p-2 glass-light rounded"
              >
                <span className="text-muted-foreground">{code}</span>
                <span className="font-mono">
                  {code === 32 ? "SP" : String.fromCharCode(code)}
                </span>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
