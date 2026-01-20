"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Move, Atom, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "motion" | "force" | "energy" | "electricity";

interface Formula {
  id: string;
  name: string;
  formula: string;
  variables: { id: string; name: string; unit: string }[];
  solve: (vars: Record<string, number>, target: string) => number | null;
}

const formulas: Record<Category, Formula[]> = {
  motion: [
    {
      id: "velocity",
      name: "Velocity",
      formula: "v = d / t",
      variables: [
        { id: "v", name: "Velocity", unit: "m/s" },
        { id: "d", name: "Distance", unit: "m" },
        { id: "t", name: "Time", unit: "s" },
      ],
      solve: (vars, target) => {
        const { v, d, t } = vars;
        switch (target) {
          case "v": return d / t;
          case "d": return v * t;
          case "t": return d / v;
          default: return null;
        }
      },
    },
    {
      id: "acceleration",
      name: "Acceleration",
      formula: "a = (v - u) / t",
      variables: [
        { id: "a", name: "Acceleration", unit: "m/s²" },
        { id: "v", name: "Final Velocity", unit: "m/s" },
        { id: "u", name: "Initial Velocity", unit: "m/s" },
        { id: "t", name: "Time", unit: "s" },
      ],
      solve: (vars, target) => {
        const { a, v, u, t } = vars;
        switch (target) {
          case "a": return (v - u) / t;
          case "v": return u + a * t;
          case "u": return v - a * t;
          case "t": return (v - u) / a;
          default: return null;
        }
      },
    },
    {
      id: "kinematic",
      name: "Kinematic Equation",
      formula: "s = ut + ½at²",
      variables: [
        { id: "s", name: "Displacement", unit: "m" },
        { id: "u", name: "Initial Velocity", unit: "m/s" },
        { id: "a", name: "Acceleration", unit: "m/s²" },
        { id: "t", name: "Time", unit: "s" },
      ],
      solve: (vars, target) => {
        const { s, u, a, t } = vars;
        switch (target) {
          case "s": return u * t + 0.5 * a * t * t;
          case "u": return (s - 0.5 * a * t * t) / t;
          case "a": return 2 * (s - u * t) / (t * t);
          case "t": return (-u + Math.sqrt(u * u + 2 * a * s)) / a;
          default: return null;
        }
      },
    },
  ],
  force: [
    {
      id: "newton2",
      name: "Newton's 2nd Law",
      formula: "F = ma",
      variables: [
        { id: "F", name: "Force", unit: "N" },
        { id: "m", name: "Mass", unit: "kg" },
        { id: "a", name: "Acceleration", unit: "m/s²" },
      ],
      solve: (vars, target) => {
        const { F, m, a } = vars;
        switch (target) {
          case "F": return m * a;
          case "m": return F / a;
          case "a": return F / m;
          default: return null;
        }
      },
    },
    {
      id: "weight",
      name: "Weight",
      formula: "W = mg",
      variables: [
        { id: "W", name: "Weight", unit: "N" },
        { id: "m", name: "Mass", unit: "kg" },
        { id: "g", name: "Gravity", unit: "m/s²" },
      ],
      solve: (vars, target) => {
        const { W, m, g } = vars;
        switch (target) {
          case "W": return m * g;
          case "m": return W / g;
          case "g": return W / m;
          default: return null;
        }
      },
    },
    {
      id: "momentum",
      name: "Momentum",
      formula: "p = mv",
      variables: [
        { id: "p", name: "Momentum", unit: "kg·m/s" },
        { id: "m", name: "Mass", unit: "kg" },
        { id: "v", name: "Velocity", unit: "m/s" },
      ],
      solve: (vars, target) => {
        const { p, m, v } = vars;
        switch (target) {
          case "p": return m * v;
          case "m": return p / v;
          case "v": return p / m;
          default: return null;
        }
      },
    },
  ],
  energy: [
    {
      id: "kinetic",
      name: "Kinetic Energy",
      formula: "KE = ½mv²",
      variables: [
        { id: "KE", name: "Kinetic Energy", unit: "J" },
        { id: "m", name: "Mass", unit: "kg" },
        { id: "v", name: "Velocity", unit: "m/s" },
      ],
      solve: (vars, target) => {
        const { KE, m, v } = vars;
        switch (target) {
          case "KE": return 0.5 * m * v * v;
          case "m": return 2 * KE / (v * v);
          case "v": return Math.sqrt(2 * KE / m);
          default: return null;
        }
      },
    },
    {
      id: "potential",
      name: "Potential Energy",
      formula: "PE = mgh",
      variables: [
        { id: "PE", name: "Potential Energy", unit: "J" },
        { id: "m", name: "Mass", unit: "kg" },
        { id: "g", name: "Gravity", unit: "m/s²" },
        { id: "h", name: "Height", unit: "m" },
      ],
      solve: (vars, target) => {
        const { PE, m, g, h } = vars;
        switch (target) {
          case "PE": return m * g * h;
          case "m": return PE / (g * h);
          case "g": return PE / (m * h);
          case "h": return PE / (m * g);
          default: return null;
        }
      },
    },
    {
      id: "work",
      name: "Work",
      formula: "W = Fd",
      variables: [
        { id: "W", name: "Work", unit: "J" },
        { id: "F", name: "Force", unit: "N" },
        { id: "d", name: "Distance", unit: "m" },
      ],
      solve: (vars, target) => {
        const { W, F, d } = vars;
        switch (target) {
          case "W": return F * d;
          case "F": return W / d;
          case "d": return W / F;
          default: return null;
        }
      },
    },
  ],
  electricity: [
    {
      id: "ohm",
      name: "Ohm's Law",
      formula: "V = IR",
      variables: [
        { id: "V", name: "Voltage", unit: "V" },
        { id: "I", name: "Current", unit: "A" },
        { id: "R", name: "Resistance", unit: "Ω" },
      ],
      solve: (vars, target) => {
        const { V, I, R } = vars;
        switch (target) {
          case "V": return I * R;
          case "I": return V / R;
          case "R": return V / I;
          default: return null;
        }
      },
    },
    {
      id: "power",
      name: "Electrical Power",
      formula: "P = IV",
      variables: [
        { id: "P", name: "Power", unit: "W" },
        { id: "I", name: "Current", unit: "A" },
        { id: "V", name: "Voltage", unit: "V" },
      ],
      solve: (vars, target) => {
        const { P, I, V } = vars;
        switch (target) {
          case "P": return I * V;
          case "I": return P / V;
          case "V": return P / I;
          default: return null;
        }
      },
    },
    {
      id: "coulomb",
      name: "Coulomb's Law",
      formula: "F = kq₁q₂/r²",
      variables: [
        { id: "F", name: "Force", unit: "N" },
        { id: "q1", name: "Charge 1", unit: "C" },
        { id: "q2", name: "Charge 2", unit: "C" },
        { id: "r", name: "Distance", unit: "m" },
      ],
      solve: (vars, target) => {
        const k = 8.99e9;
        const { F, q1, q2, r } = vars;
        switch (target) {
          case "F": return k * q1 * q2 / (r * r);
          case "q1": return F * r * r / (k * q2);
          case "q2": return F * r * r / (k * q1);
          case "r": return Math.sqrt(k * q1 * q2 / F);
          default: return null;
        }
      },
    },
  ],
};

const categories: { id: Category; icon: typeof Move; label: string }[] = [
  { id: "motion", icon: Move, label: "Motion" },
  { id: "force", icon: Atom, label: "Force" },
  { id: "energy", icon: Flame, label: "Energy" },
  { id: "electricity", icon: Zap, label: "Electricity" },
];

export function PhysicsCalculator() {
  const [category, setCategory] = useState<Category>("motion");
  const [selectedFormula, setSelectedFormula] = useState<Formula>(formulas.motion[0]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [solveFor, setSolveFor] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSelectedFormula(formulas[cat][0]);
    setValues({});
    setSolveFor("");
    setResult(null);
  };

  const handleFormulaChange = (formula: Formula) => {
    setSelectedFormula(formula);
    setValues({});
    setSolveFor("");
    setResult(null);
  };

  const calculate = () => {
    if (!solveFor) return;

    const numericValues: Record<string, number> = {};
    for (const v of selectedFormula.variables) {
      if (v.id !== solveFor) {
        const val = parseFloat(values[v.id] || "0");
        if (isNaN(val)) return;
        numericValues[v.id] = val;
      }
    }

    const res = selectedFormula.solve(numericValues, solveFor);
    setResult(res);
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="glass p-2 rounded-xl flex gap-2 overflow-x-auto">
        {categories.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleCategoryChange(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              category === id
                ? "bg-primary/30 border border-primary"
                : "hover:bg-white/10"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Formula Selection */}
      <div className="glass p-4 rounded-2xl">
        <h3 className="text-sm text-muted-foreground mb-3">Select Formula</h3>
        <div className="flex flex-wrap gap-2">
          {formulas[category].map((formula) => (
            <button
              key={formula.id}
              onClick={() => handleFormulaChange(formula)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm transition-all",
                selectedFormula.id === formula.id
                  ? "bg-primary/30 border border-primary"
                  : "glass-light hover:bg-white/10"
              )}
            >
              {formula.name}
            </button>
          ))}
        </div>

        {/* Formula Display */}
        <div className="mt-4 p-4 glass-light rounded-xl text-center">
          <span className="text-2xl font-mono">{selectedFormula.formula}</span>
        </div>
      </div>

      {/* Input Fields */}
      <div className="glass p-4 rounded-2xl space-y-4">
        <h3 className="text-sm text-muted-foreground">Solve for</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedFormula.variables.map((v) => (
            <button
              key={v.id}
              onClick={() => setSolveFor(v.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-all",
                solveFor === v.id
                  ? "bg-primary/30 border border-primary"
                  : "glass-light hover:bg-white/10"
              )}
            >
              {v.id} ({v.name})
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {selectedFormula.variables
            .filter((v) => v.id !== solveFor)
            .map((v) => (
              <div key={v.id}>
                <label className="block text-sm text-muted-foreground mb-1">
                  {v.name} ({v.id})
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={values[v.id] || ""}
                    onChange={(e) =>
                      setValues({ ...values, [v.id]: e.target.value })
                    }
                    placeholder="0"
                    className="flex-1 px-4 py-3 glass rounded-xl bg-transparent font-mono"
                  />
                  <span className="text-sm text-muted-foreground w-16">
                    {v.unit}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Calculate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={calculate}
        disabled={!solveFor}
        className="w-full py-4 calc-btn-primary rounded-xl font-medium disabled:opacity-50"
      >
        Calculate
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-heavy p-6 rounded-2xl text-center"
          >
            <div className="text-sm text-muted-foreground mb-2">
              {selectedFormula.variables.find((v) => v.id === solveFor)?.name}
            </div>
            <div className="text-4xl font-bold font-mono text-primary">
              {result.toExponential(4)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {selectedFormula.variables.find((v) => v.id === solveFor)?.unit}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
