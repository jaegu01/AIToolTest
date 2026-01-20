"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { evaluate } from "mathjs";
import { cn } from "@/lib/utils";

interface FunctionEntry {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

const COLORS = [
  "#6366f1",
  "#f43f5e",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
];

export function GraphCalculator() {
  const [functions, setFunctions] = useState<FunctionEntry[]>([
    { id: "1", expression: "sin(x)", color: COLORS[0], visible: true },
  ]);
  const [xRange, setXRange] = useState({ min: -10, max: 10 });
  const [newExpression, setNewExpression] = useState("");

  const generatePoints = (expr: string, min: number, max: number) => {
    const points = [];
    const step = (max - min) / 200;

    for (let x = min; x <= max; x += step) {
      try {
        const y = evaluate(expr, { x });
        if (typeof y === "number" && isFinite(y) && Math.abs(y) < 1000) {
          points.push({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) });
        }
      } catch {
        // Skip invalid points
      }
    }
    return points;
  };

  const chartData = useMemo(() => {
    const allPoints: Record<number, Record<string, number>> = {};

    functions.forEach((fn) => {
      if (!fn.visible) return;
      const points = generatePoints(fn.expression, xRange.min, xRange.max);
      points.forEach((point) => {
        if (!allPoints[point.x]) {
          allPoints[point.x] = { x: point.x };
        }
        allPoints[point.x][fn.id] = point.y;
      });
    });

    return Object.values(allPoints).sort((a, b) => a.x - b.x);
  }, [functions, xRange]);

  const addFunction = () => {
    if (!newExpression.trim()) return;

    const newFn: FunctionEntry = {
      id: Date.now().toString(),
      expression: newExpression,
      color: COLORS[functions.length % COLORS.length],
      visible: true,
    };

    setFunctions([...functions, newFn]);
    setNewExpression("");
  };

  const removeFunction = (id: string) => {
    setFunctions(functions.filter((f) => f.id !== id));
  };

  const toggleVisibility = (id: string) => {
    setFunctions(
      functions.map((f) =>
        f.id === id ? { ...f, visible: !f.visible } : f
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Graph */}
      <div className="glass p-4 rounded-2xl">
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="x"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                }}
              />
              <ReferenceLine x={0} stroke="rgba(255,255,255,0.3)" />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />

              {functions
                .filter((f) => f.visible)
                .map((fn) => (
                  <Line
                    key={fn.id}
                    type="monotone"
                    dataKey={fn.id}
                    stroke={fn.color}
                    strokeWidth={2}
                    dot={false}
                    name={fn.expression}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Range Controls */}
      <div className="glass p-4 rounded-xl flex items-center gap-4">
        <label className="text-sm text-muted-foreground">X Range:</label>
        <input
          type="number"
          value={xRange.min}
          onChange={(e) => setXRange({ ...xRange, min: Number(e.target.value) })}
          className="w-20 px-3 py-2 glass rounded-lg bg-transparent text-center"
        />
        <span className="text-muted-foreground">to</span>
        <input
          type="number"
          value={xRange.max}
          onChange={(e) => setXRange({ ...xRange, max: Number(e.target.value) })}
          className="w-20 px-3 py-2 glass rounded-lg bg-transparent text-center"
        />
      </div>

      {/* Function List */}
      <div className="glass p-4 rounded-2xl space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Functions
        </h3>

        {functions.map((fn) => (
          <motion.div
            key={fn.id}
            layout
            className="flex items-center gap-3 glass-light p-3 rounded-lg"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: fn.color }}
            />
            <span className="flex-1 font-mono text-sm">
              f(x) = {fn.expression}
            </span>
            <button
              onClick={() => toggleVisibility(fn.id)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {fn.visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => removeFunction(fn.id)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}

        {/* Add Function */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
              f(x) =
            </span>
            <input
              type="text"
              value={newExpression}
              onChange={(e) => setNewExpression(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFunction()}
              placeholder="x^2 + 2*x + 1"
              className="w-full pl-14 pr-4 py-3 glass rounded-xl bg-transparent font-mono text-sm"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addFunction}
            className="px-4 py-3 calc-btn-primary rounded-xl"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
