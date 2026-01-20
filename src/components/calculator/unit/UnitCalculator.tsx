"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Ruler, Weight, Thermometer, Gauge, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

type UnitCategory = "length" | "weight" | "temperature" | "pressure" | "data";

interface UnitDefinition {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const unitCategories: Record<UnitCategory, { icon: typeof Ruler; label: string; units: Record<string, UnitDefinition> }> = {
  length: {
    icon: Ruler,
    label: "Length",
    units: {
      m: { name: "Meter", symbol: "m", toBase: (v) => v, fromBase: (v) => v },
      km: { name: "Kilometer", symbol: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cm: { name: "Centimeter", symbol: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      mm: { name: "Millimeter", symbol: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mi: { name: "Mile", symbol: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      ft: { name: "Foot", symbol: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      in: { name: "Inch", symbol: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    },
  },
  weight: {
    icon: Weight,
    label: "Weight",
    units: {
      kg: { name: "Kilogram", symbol: "kg", toBase: (v) => v, fromBase: (v) => v },
      g: { name: "Gram", symbol: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mg: { name: "Milligram", symbol: "mg", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      lb: { name: "Pound", symbol: "lb", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      oz: { name: "Ounce", symbol: "oz", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      ton: { name: "Ton", symbol: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    },
  },
  temperature: {
    icon: Thermometer,
    label: "Temperature",
    units: {
      c: { name: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
      f: { name: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
      k: { name: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    },
  },
  pressure: {
    icon: Gauge,
    label: "Pressure",
    units: {
      pa: { name: "Pascal", symbol: "Pa", toBase: (v) => v, fromBase: (v) => v },
      kpa: { name: "Kilopascal", symbol: "kPa", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      bar: { name: "Bar", symbol: "bar", toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
      atm: { name: "Atmosphere", symbol: "atm", toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
      psi: { name: "PSI", symbol: "psi", toBase: (v) => v * 6894.76, fromBase: (v) => v / 6894.76 },
    },
  },
  data: {
    icon: HardDrive,
    label: "Data",
    units: {
      b: { name: "Byte", symbol: "B", toBase: (v) => v, fromBase: (v) => v },
      kb: { name: "Kilobyte", symbol: "KB", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      mb: { name: "Megabyte", symbol: "MB", toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
      gb: { name: "Gigabyte", symbol: "GB", toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
      tb: { name: "Terabyte", symbol: "TB", toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
    },
  },
};

export function UnitCalculator() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  const currentCategory = unitCategories[category];
  const units = currentCategory.units;

  useEffect(() => {
    const keys = Object.keys(units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
    setFromValue("");
    setToValue("");
  }, [category]);

  useEffect(() => {
    if (!fromValue) {
      setToValue("");
      return;
    }

    const value = parseFloat(fromValue);
    if (isNaN(value)) return;

    const baseValue = units[fromUnit].toBase(value);
    const result = units[toUnit].fromBase(baseValue);
    setToValue(result.toPrecision(10).replace(/\.?0+$/, ""));
  }, [fromValue, fromUnit, toUnit, units]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="glass p-2 rounded-xl flex gap-2 overflow-x-auto">
        {(Object.keys(unitCategories) as UnitCategory[]).map((cat) => {
          const { icon: Icon, label } = unitCategories[cat];
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                category === cat
                  ? "bg-primary/30 border border-primary"
                  : "hover:bg-white/10"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Converter */}
      <div className="glass p-6 rounded-2xl space-y-6">
        {/* From Unit */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">From</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="0"
              className="flex-1 px-4 py-3 glass rounded-xl bg-transparent font-mono text-lg"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="px-4 py-3 glass rounded-xl bg-transparent cursor-pointer"
            >
              {Object.entries(units).map(([key, unit]) => (
                <option key={key} value={key} className="bg-background">
                  {unit.symbol} - {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={swapUnits}
            className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* To Unit */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">To</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={toValue}
              readOnly
              placeholder="0"
              className="flex-1 px-4 py-3 glass-heavy rounded-xl bg-transparent font-mono text-lg font-bold"
            />
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="px-4 py-3 glass rounded-xl bg-transparent cursor-pointer"
            >
              {Object.entries(units).map(([key, unit]) => (
                <option key={key} value={key} className="bg-background">
                  {unit.symbol} - {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversion Formula */}
        {fromValue && toValue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-muted-foreground"
          >
            {fromValue} {units[fromUnit].symbol} = {toValue} {units[toUnit].symbol}
          </motion.div>
        )}
      </div>
    </div>
  );
}
