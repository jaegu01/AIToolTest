"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, X, RotateCcw, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as math from "mathjs";

type Operation = "add" | "subtract" | "multiply" | "determinant" | "inverse" | "transpose";

export function MatrixCalculator() {
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);
  const [matrixA, setMatrixA] = useState<number[][]>(() =>
    Array(2).fill(null).map(() => Array(2).fill(0))
  );
  const [matrixB, setMatrixB] = useState<number[][]>(() =>
    Array(2).fill(null).map(() => Array(2).fill(0))
  );
  const [result, setResult] = useState<number[][] | number | null>(null);
  const [operation, setOperation] = useState<Operation>("add");
  const [error, setError] = useState<string | null>(null);

  const resizeMatrix = (
    matrix: number[][],
    rows: number,
    cols: number
  ): number[][] => {
    const newMatrix = Array(rows).fill(null).map((_, i) =>
      Array(cols).fill(0).map((_, j) => matrix[i]?.[j] ?? 0)
    );
    return newMatrix;
  };

  const updateMatrixA = useCallback((row: number, col: number, value: string) => {
    const num = parseFloat(value) || 0;
    setMatrixA(prev => {
      const newMatrix = prev.map(r => [...r]);
      newMatrix[row][col] = num;
      return newMatrix;
    });
  }, []);

  const updateMatrixB = useCallback((row: number, col: number, value: string) => {
    const num = parseFloat(value) || 0;
    setMatrixB(prev => {
      const newMatrix = prev.map(r => [...r]);
      newMatrix[row][col] = num;
      return newMatrix;
    });
  }, []);

  const handleResize = (matrix: "A" | "B", dimension: "rows" | "cols", delta: number) => {
    if (matrix === "A") {
      const newRows = dimension === "rows" ? Math.max(1, Math.min(5, rowsA + delta)) : rowsA;
      const newCols = dimension === "cols" ? Math.max(1, Math.min(5, colsA + delta)) : colsA;
      setRowsA(newRows);
      setColsA(newCols);
      setMatrixA(resizeMatrix(matrixA, newRows, newCols));
    } else {
      const newRows = dimension === "rows" ? Math.max(1, Math.min(5, rowsB + delta)) : rowsB;
      const newCols = dimension === "cols" ? Math.max(1, Math.min(5, colsB + delta)) : colsB;
      setRowsB(newRows);
      setColsB(newCols);
      setMatrixB(resizeMatrix(matrixB, newRows, newCols));
    }
  };

  const calculate = () => {
    setError(null);
    try {
      let res: number[][] | number;

      switch (operation) {
        case "add":
          if (rowsA !== rowsB || colsA !== colsB) {
            throw new Error("Matrices must have same dimensions");
          }
          res = math.add(matrixA, matrixB) as number[][];
          break;
        case "subtract":
          if (rowsA !== rowsB || colsA !== colsB) {
            throw new Error("Matrices must have same dimensions");
          }
          res = math.subtract(matrixA, matrixB) as number[][];
          break;
        case "multiply":
          if (colsA !== rowsB) {
            throw new Error("Matrix A columns must equal Matrix B rows");
          }
          res = math.multiply(matrixA, matrixB) as number[][];
          break;
        case "determinant":
          if (rowsA !== colsA) {
            throw new Error("Matrix must be square");
          }
          res = math.det(matrixA) as number;
          break;
        case "inverse":
          if (rowsA !== colsA) {
            throw new Error("Matrix must be square");
          }
          res = math.inv(matrixA) as number[][];
          break;
        case "transpose":
          res = math.transpose(matrixA) as number[][];
          break;
        default:
          throw new Error("Unknown operation");
      }

      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation error");
      setResult(null);
    }
  };

  const clearAll = () => {
    setMatrixA(Array(rowsA).fill(null).map(() => Array(colsA).fill(0)));
    setMatrixB(Array(rowsB).fill(null).map(() => Array(colsB).fill(0)));
    setResult(null);
    setError(null);
  };

  const operations: { id: Operation; label: string; needsB: boolean }[] = [
    { id: "add", label: "A + B", needsB: true },
    { id: "subtract", label: "A - B", needsB: true },
    { id: "multiply", label: "A × B", needsB: true },
    { id: "determinant", label: "det(A)", needsB: false },
    { id: "inverse", label: "A⁻¹", needsB: false },
    { id: "transpose", label: "Aᵀ", needsB: false },
  ];

  const needsMatrixB = operations.find(o => o.id === operation)?.needsB ?? false;

  const MatrixInput = ({
    matrix,
    rows,
    cols,
    label,
    onUpdate,
    onResize,
  }: {
    matrix: number[][];
    rows: number;
    cols: number;
    label: string;
    onUpdate: (row: number, col: number, value: string) => void;
    onResize: (dimension: "rows" | "cols", delta: number) => void;
  }) => (
    <div className="glass p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{label}</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{rows}×{cols}</span>
          <div className="flex gap-1">
            <button
              onClick={() => onResize("rows", -1)}
              className="p-1 glass rounded hover:bg-white/20"
              disabled={rows <= 1}
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={() => onResize("rows", 1)}
              className="p-1 glass rounded hover:bg-white/20"
              disabled={rows >= 5}
            >
              <Plus className="w-3 h-3" />
            </button>
            <span className="mx-1">R</span>
            <button
              onClick={() => onResize("cols", -1)}
              className="p-1 glass rounded hover:bg-white/20"
              disabled={cols <= 1}
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={() => onResize("cols", 1)}
              className="p-1 glass rounded hover:bg-white/20"
              disabled={cols >= 5}
            >
              <Plus className="w-3 h-3" />
            </button>
            <span>C</span>
          </div>
        </div>
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {matrix.slice(0, rows).map((row, i) =>
          row.slice(0, cols).map((cell, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={cell || ""}
              onChange={(e) => onUpdate(i, j, e.target.value)}
              className="w-full px-2 py-2 glass-light rounded text-center font-mono text-sm"
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Operation Selection */}
      <div className="glass p-2 rounded-xl flex flex-wrap gap-2">
        {operations.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setOperation(id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              operation === id
                ? "bg-primary/30 border border-primary"
                : "hover:bg-white/10"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Matrix Inputs */}
      <div className={cn("grid gap-4", needsMatrixB ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
        <MatrixInput
          matrix={matrixA}
          rows={rowsA}
          cols={colsA}
          label="Matrix A"
          onUpdate={updateMatrixA}
          onResize={(dim, delta) => handleResize("A", dim, delta)}
        />
        {needsMatrixB && (
          <MatrixInput
            matrix={matrixB}
            rows={rowsB}
            cols={colsB}
            label="Matrix B"
            onUpdate={updateMatrixB}
            onResize={(dim, delta) => handleResize("B", dim, delta)}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={calculate}
          className="flex-1 py-3 calc-btn-primary rounded-xl font-medium"
        >
          Calculate
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearAll}
          className="px-4 py-3 glass rounded-xl hover:bg-white/20"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 glass rounded-xl border border-destructive/50 text-destructive"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-heavy p-6 rounded-2xl"
          >
            <h3 className="text-sm text-muted-foreground mb-4">Result</h3>
            {typeof result === "number" ? (
              <div className="text-4xl font-bold font-mono text-center text-primary">
                {result.toFixed(4)}
              </div>
            ) : (
              <div
                className="grid gap-2 max-w-md mx-auto"
                style={{ gridTemplateColumns: `repeat(${result[0]?.length || 1}, 1fr)` }}
              >
                {result.map((row, i) =>
                  row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      className="px-3 py-2 glass-light rounded text-center font-mono"
                    >
                      {typeof cell === "number" ? cell.toFixed(2) : cell}
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
