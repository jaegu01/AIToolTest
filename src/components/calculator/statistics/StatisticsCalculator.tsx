"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, BarChart3, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";

type ViewMode = "stats" | "histogram" | "scatter";

export function StatisticsCalculator() {
  const [data, setData] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("stats");

  const addValue = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      setData([...data, num]);
      setInputValue("");
    }
  };

  const removeValue = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setData([]);
  };

  const stats = useMemo(() => {
    if (data.length === 0) {
      return null;
    }

    const n = data.length;
    const sorted = [...data].sort((a, b) => a - b);
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const sampleStdDev = n > 1 ? Math.sqrt(variance * n / (n - 1)) : 0;

    const median =
      n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];

    const mode = (() => {
      const counts: Record<number, number> = {};
      data.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
      const maxCount = Math.max(...Object.values(counts));
      return Object.entries(counts)
        .filter(([, count]) => count === maxCount)
        .map(([val]) => parseFloat(val));
    })();

    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;

    return {
      n,
      sum,
      mean,
      median,
      mode,
      min,
      max,
      range,
      variance,
      stdDev,
      sampleStdDev,
      q1,
      q3,
      iqr,
    };
  }, [data]);

  const histogramData = useMemo(() => {
    if (data.length < 2) return [];

    const min = Math.min(...data);
    const max = Math.max(...data);
    const binCount = Math.min(10, Math.ceil(Math.sqrt(data.length)));
    const binWidth = (max - min) / binCount || 1;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: `${(min + i * binWidth).toFixed(1)}`,
      count: 0,
    }));

    data.forEach((val) => {
      const binIndex = Math.min(
        Math.floor((val - min) / binWidth),
        binCount - 1
      );
      bins[binIndex].count++;
    });

    return bins;
  }, [data]);

  const scatterData = useMemo(() => {
    return data.map((y, x) => ({ x: x + 1, y }));
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="glass p-4 rounded-2xl">
        <div className="flex gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addValue()}
            placeholder="Enter a number"
            className="flex-1 px-4 py-3 glass rounded-xl bg-transparent font-mono"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addValue}
            className="px-4 py-3 calc-btn-primary rounded-xl"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Data Points */}
        {data.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Data Points ({data.length})
              </span>
              <button
                onClick={clearAll}
                className="text-xs text-destructive hover:underline"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
              {data.map((val, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1 px-2 py-1 glass-light rounded text-sm font-mono"
                >
                  {val}
                  <button
                    onClick={() => removeValue(i)}
                    className="p-0.5 hover:bg-white/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Mode Tabs */}
      <div className="glass p-2 rounded-xl flex gap-2">
        {[
          { id: "stats", icon: BarChart3, label: "Statistics" },
          { id: "histogram", icon: BarChart3, label: "Histogram" },
          { id: "scatter", icon: TrendingUp, label: "Scatter" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setViewMode(id as ViewMode)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
              viewMode === id
                ? "bg-primary/30 border border-primary"
                : "hover:bg-white/10"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {viewMode === "stats" && stats && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Count (n)", value: stats.n },
                { label: "Sum (Σx)", value: stats.sum.toFixed(4) },
                { label: "Mean (x̄)", value: stats.mean.toFixed(4) },
                { label: "Median", value: stats.median.toFixed(4) },
                { label: "Mode", value: stats.mode.join(", ") },
                { label: "Min", value: stats.min.toFixed(4) },
                { label: "Max", value: stats.max.toFixed(4) },
                { label: "Range", value: stats.range.toFixed(4) },
                { label: "Variance (σ²)", value: stats.variance.toFixed(4) },
                { label: "Std Dev (σ)", value: stats.stdDev.toFixed(4) },
                { label: "Sample Std Dev (s)", value: stats.sampleStdDev.toFixed(4) },
                { label: "IQR", value: stats.iqr.toFixed(4) },
              ].map(({ label, value }) => (
                <div key={label} className="glass-light p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-lg font-mono font-medium">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {viewMode === "histogram" && histogramData.length > 0 && (
          <motion.div
            key="histogram"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-4 rounded-2xl h-80"
          >
            <ResponsiveContainer>
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {viewMode === "scatter" && scatterData.length > 0 && (
          <motion.div
            key="scatter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-4 rounded-2xl h-80"
          >
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="x" name="Index" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="y" name="Value" stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                {stats && (
                  <ReferenceLine
                    y={stats.mean}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: "Mean", fill: "#22c55e" }}
                  />
                )}
                <Scatter data={scatterData} fill="#6366f1" />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {!stats && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-8 rounded-2xl text-center text-muted-foreground"
          >
            Enter at least one number to see statistics
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
