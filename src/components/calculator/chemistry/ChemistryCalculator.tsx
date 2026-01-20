"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Atom, Droplets, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

type CalcMode = "molar" | "molarity" | "ph" | "dilution";

const periodicTable: Record<string, { name: string; mass: number }> = {
  H: { name: "Hydrogen", mass: 1.008 },
  He: { name: "Helium", mass: 4.003 },
  Li: { name: "Lithium", mass: 6.941 },
  Be: { name: "Beryllium", mass: 9.012 },
  B: { name: "Boron", mass: 10.81 },
  C: { name: "Carbon", mass: 12.01 },
  N: { name: "Nitrogen", mass: 14.01 },
  O: { name: "Oxygen", mass: 16.00 },
  F: { name: "Fluorine", mass: 19.00 },
  Ne: { name: "Neon", mass: 20.18 },
  Na: { name: "Sodium", mass: 22.99 },
  Mg: { name: "Magnesium", mass: 24.31 },
  Al: { name: "Aluminum", mass: 26.98 },
  Si: { name: "Silicon", mass: 28.09 },
  P: { name: "Phosphorus", mass: 30.97 },
  S: { name: "Sulfur", mass: 32.07 },
  Cl: { name: "Chlorine", mass: 35.45 },
  Ar: { name: "Argon", mass: 39.95 },
  K: { name: "Potassium", mass: 39.10 },
  Ca: { name: "Calcium", mass: 40.08 },
  Fe: { name: "Iron", mass: 55.85 },
  Cu: { name: "Copper", mass: 63.55 },
  Zn: { name: "Zinc", mass: 65.38 },
  Ag: { name: "Silver", mass: 107.87 },
  Au: { name: "Gold", mass: 196.97 },
};

function parseMolecularFormula(formula: string): { element: string; count: number }[] {
  const regex = /([A-Z][a-z]?)(\d*)/g;
  const result: { element: string; count: number }[] = [];
  let match;

  while ((match = regex.exec(formula)) !== null) {
    if (match[1]) {
      result.push({
        element: match[1],
        count: match[2] ? parseInt(match[2]) : 1,
      });
    }
  }

  return result;
}

function calculateMolarMass(formula: string): { mass: number; breakdown: string[] } | null {
  const elements = parseMolecularFormula(formula);
  let totalMass = 0;
  const breakdown: string[] = [];

  for (const { element, count } of elements) {
    const elementData = periodicTable[element];
    if (!elementData) {
      return null;
    }
    const contribution = elementData.mass * count;
    totalMass += contribution;
    breakdown.push(`${element}${count > 1 ? count : ""}: ${count} × ${elementData.mass} = ${contribution.toFixed(3)}`);
  }

  return { mass: totalMass, breakdown };
}

export function ChemistryCalculator() {
  const [mode, setMode] = useState<CalcMode>("molar");

  // Molar mass
  const [formula, setFormula] = useState("H2O");

  // Molarity
  const [moles, setMoles] = useState("");
  const [volume, setVolume] = useState("");

  // pH
  const [concentration, setConcentration] = useState("");
  const [isAcid, setIsAcid] = useState(true);

  // Dilution
  const [c1, setC1] = useState("");
  const [v1, setV1] = useState("");
  const [c2, setC2] = useState("");
  const [v2, setV2] = useState("");
  const [solveFor, setSolveFor] = useState<"v2" | "c2">("v2");

  const molarMassResult = useMemo(() => {
    if (!formula) return null;
    return calculateMolarMass(formula);
  }, [formula]);

  const molarityResult = useMemo(() => {
    const n = parseFloat(moles);
    const v = parseFloat(volume);
    if (isNaN(n) || isNaN(v) || v === 0) return null;
    return n / v;
  }, [moles, volume]);

  const phResult = useMemo(() => {
    const c = parseFloat(concentration);
    if (isNaN(c) || c <= 0) return null;

    const ph = isAcid ? -Math.log10(c) : 14 + Math.log10(c);
    const poh = 14 - ph;
    const hConc = Math.pow(10, -ph);
    const ohConc = Math.pow(10, -poh);

    return { ph, poh, hConc, ohConc };
  }, [concentration, isAcid]);

  const dilutionResult = useMemo(() => {
    const c1Val = parseFloat(c1);
    const v1Val = parseFloat(v1);
    const c2Val = parseFloat(c2);
    const v2Val = parseFloat(v2);

    if (solveFor === "v2") {
      if (isNaN(c1Val) || isNaN(v1Val) || isNaN(c2Val) || c2Val === 0) return null;
      return { v2: (c1Val * v1Val) / c2Val };
    } else {
      if (isNaN(c1Val) || isNaN(v1Val) || isNaN(v2Val) || v2Val === 0) return null;
      return { c2: (c1Val * v1Val) / v2Val };
    }
  }, [c1, v1, c2, v2, solveFor]);

  const modes = [
    { id: "molar", icon: Scale, label: "Molar Mass" },
    { id: "molarity", icon: FlaskConical, label: "Molarity" },
    { id: "ph", icon: Droplets, label: "pH" },
    { id: "dilution", icon: Atom, label: "Dilution" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="glass p-2 rounded-xl flex gap-2 overflow-x-auto">
        {modes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              mode === id
                ? "bg-primary/30 border border-primary"
                : "hover:bg-white/10"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Molar Mass Calculator */}
        {mode === "molar" && (
          <motion.div
            key="molar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl space-y-6"
          >
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Molecular Formula
              </label>
              <input
                type="text"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="H2O, NaCl, C6H12O6..."
                className="w-full px-4 py-3 glass rounded-xl bg-transparent font-mono text-lg"
              />
            </div>

            {molarMassResult && (
              <div className="glass-heavy p-6 rounded-xl space-y-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Molar Mass</div>
                  <div className="text-4xl font-bold font-mono text-primary">
                    {molarMassResult.mass.toFixed(3)} g/mol
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <div className="text-muted-foreground mb-2">Breakdown:</div>
                  {molarMassResult.breakdown.map((line, i) => (
                    <div key={i} className="font-mono text-xs glass-light p-2 rounded">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Elements Reference */}
            <details className="glass-light rounded-xl">
              <summary className="p-3 cursor-pointer text-sm">
                Common Elements Reference
              </summary>
              <div className="p-3 pt-0 grid grid-cols-4 gap-2 text-xs">
                {Object.entries(periodicTable).slice(0, 20).map(([symbol, data]) => (
                  <div key={symbol} className="flex justify-between p-1">
                    <span className="font-mono font-bold">{symbol}</span>
                    <span className="text-muted-foreground">{data.mass}</span>
                  </div>
                ))}
              </div>
            </details>
          </motion.div>
        )}

        {/* Molarity Calculator */}
        {mode === "molarity" && (
          <motion.div
            key="molarity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl space-y-6"
          >
            <div className="text-center text-lg font-mono text-muted-foreground mb-4">
              M = n / V
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Amount of Substance (mol)
              </label>
              <input
                type="number"
                value={moles}
                onChange={(e) => setMoles(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 glass rounded-xl bg-transparent font-mono"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Volume (L)
              </label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 glass rounded-xl bg-transparent font-mono"
              />
            </div>

            {molarityResult !== null && (
              <div className="glass-heavy p-6 rounded-xl text-center">
                <div className="text-sm text-muted-foreground">Molarity</div>
                <div className="text-4xl font-bold font-mono text-primary">
                  {molarityResult.toFixed(4)} M
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* pH Calculator */}
        {mode === "ph" && (
          <motion.div
            key="ph"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl space-y-6"
          >
            <div className="flex gap-2">
              <button
                onClick={() => setIsAcid(true)}
                className={cn(
                  "flex-1 py-2 rounded-lg transition-all",
                  isAcid ? "bg-red-500/30 border border-red-500" : "glass-light"
                )}
              >
                Acid [H⁺]
              </button>
              <button
                onClick={() => setIsAcid(false)}
                className={cn(
                  "flex-1 py-2 rounded-lg transition-all",
                  !isAcid ? "bg-blue-500/30 border border-blue-500" : "glass-light"
                )}
              >
                Base [OH⁻]
              </button>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Concentration (M)
              </label>
              <input
                type="number"
                value={concentration}
                onChange={(e) => setConcentration(e.target.value)}
                placeholder="0.001"
                step="0.001"
                className="w-full px-4 py-3 glass rounded-xl bg-transparent font-mono"
              />
            </div>

            {phResult && (
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-heavy p-4 rounded-xl text-center">
                  <div className="text-sm text-muted-foreground">pH</div>
                  <div className={cn(
                    "text-3xl font-bold font-mono",
                    phResult.ph < 7 ? "text-red-400" : phResult.ph > 7 ? "text-blue-400" : "text-green-400"
                  )}>
                    {phResult.ph.toFixed(2)}
                  </div>
                </div>
                <div className="glass-light p-4 rounded-xl text-center">
                  <div className="text-sm text-muted-foreground">pOH</div>
                  <div className="text-2xl font-bold font-mono">
                    {phResult.poh.toFixed(2)}
                  </div>
                </div>
                <div className="glass-light p-4 rounded-xl text-center">
                  <div className="text-sm text-muted-foreground">[H⁺]</div>
                  <div className="text-lg font-mono">
                    {phResult.hConc.toExponential(2)} M
                  </div>
                </div>
                <div className="glass-light p-4 rounded-xl text-center">
                  <div className="text-sm text-muted-foreground">[OH⁻]</div>
                  <div className="text-lg font-mono">
                    {phResult.ohConc.toExponential(2)} M
                  </div>
                </div>
              </div>
            )}

            {/* pH Scale */}
            <div className="glass-light p-4 rounded-xl">
              <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 (Acidic)</span>
                <span>7 (Neutral)</span>
                <span>14 (Basic)</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dilution Calculator */}
        {mode === "dilution" && (
          <motion.div
            key="dilution"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl space-y-6"
          >
            <div className="text-center text-lg font-mono text-muted-foreground mb-4">
              C₁V₁ = C₂V₂
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSolveFor("v2")}
                className={cn(
                  "flex-1 py-2 rounded-lg transition-all text-sm",
                  solveFor === "v2" ? "bg-primary/30 border border-primary" : "glass-light"
                )}
              >
                Solve for V₂
              </button>
              <button
                onClick={() => setSolveFor("c2")}
                className={cn(
                  "flex-1 py-2 rounded-lg transition-all text-sm",
                  solveFor === "c2" ? "bg-primary/30 border border-primary" : "glass-light"
                )}
              >
                Solve for C₂
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  C₁ (Initial Concentration, M)
                </label>
                <input
                  type="number"
                  value={c1}
                  onChange={(e) => setC1(e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl bg-transparent font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  V₁ (Initial Volume, L)
                </label>
                <input
                  type="number"
                  value={v1}
                  onChange={(e) => setV1(e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl bg-transparent font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  C₂ (Final Concentration, M)
                </label>
                <input
                  type="number"
                  value={c2}
                  onChange={(e) => setC2(e.target.value)}
                  disabled={solveFor === "c2"}
                  className={cn(
                    "w-full px-4 py-3 glass rounded-xl bg-transparent font-mono",
                    solveFor === "c2" && "opacity-50"
                  )}
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  V₂ (Final Volume, L)
                </label>
                <input
                  type="number"
                  value={v2}
                  onChange={(e) => setV2(e.target.value)}
                  disabled={solveFor === "v2"}
                  className={cn(
                    "w-full px-4 py-3 glass rounded-xl bg-transparent font-mono",
                    solveFor === "v2" && "opacity-50"
                  )}
                />
              </div>
            </div>

            {dilutionResult && (
              <div className="glass-heavy p-6 rounded-xl text-center">
                <div className="text-sm text-muted-foreground">
                  {solveFor === "v2" ? "Final Volume (V₂)" : "Final Concentration (C₂)"}
                </div>
                <div className="text-4xl font-bold font-mono text-primary">
                  {solveFor === "v2"
                    ? `${dilutionResult.v2?.toFixed(4)} L`
                    : `${dilutionResult.c2?.toFixed(4)} M`}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
