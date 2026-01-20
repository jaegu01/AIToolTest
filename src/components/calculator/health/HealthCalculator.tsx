"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Scale, Flame, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type CalcMode = "bmi" | "bmr" | "heartrate" | "calories";

export function HealthCalculator() {
  const [mode, setMode] = useState<CalcMode>("bmi");

  // Common inputs
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState(""); // kg
  const [height, setHeight] = useState(""); // cm

  // Heart rate inputs
  const [restingHR, setRestingHR] = useState("");

  // Calorie inputs
  const [activityLevel, setActivityLevel] = useState<number>(1.2);

  const bmiResult = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to m
    if (isNaN(w) || isNaN(h) || h === 0) return null;

    const bmi = w / (h * h);
    let category: string;
    let color: string;

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-400";
    } else if (bmi < 25) {
      category = "Normal";
      color = "text-green-400";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-yellow-400";
    } else {
      category = "Obese";
      color = "text-red-400";
    }

    return { bmi, category, color };
  }, [weight, height]);

  const bmrResult = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (isNaN(w) || isNaN(h) || isNaN(a)) return null;

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    return {
      bmr,
      sedentary: bmr * 1.2,
      light: bmr * 1.375,
      moderate: bmr * 1.55,
      active: bmr * 1.725,
      veryActive: bmr * 1.9,
    };
  }, [weight, height, age, gender]);

  const heartRateResult = useMemo(() => {
    const a = parseFloat(age);
    const rhr = parseFloat(restingHR) || 70;
    if (isNaN(a)) return null;

    const maxHR = 220 - a;
    const hrReserve = maxHR - rhr;

    const zones = [
      { name: "Zone 1 (Recovery)", min: rhr + hrReserve * 0.5, max: rhr + hrReserve * 0.6, color: "bg-blue-500" },
      { name: "Zone 2 (Endurance)", min: rhr + hrReserve * 0.6, max: rhr + hrReserve * 0.7, color: "bg-green-500" },
      { name: "Zone 3 (Aerobic)", min: rhr + hrReserve * 0.7, max: rhr + hrReserve * 0.8, color: "bg-yellow-500" },
      { name: "Zone 4 (Threshold)", min: rhr + hrReserve * 0.8, max: rhr + hrReserve * 0.9, color: "bg-orange-500" },
      { name: "Zone 5 (Maximum)", min: rhr + hrReserve * 0.9, max: maxHR, color: "bg-red-500" },
    ];

    return { maxHR, hrReserve, zones };
  }, [age, restingHR]);

  const calorieResult = useMemo(() => {
    if (!bmrResult) return null;
    const tdee = bmrResult.bmr * activityLevel;

    return {
      tdee,
      lose05: tdee - 250,
      lose1: tdee - 500,
      gain05: tdee + 250,
      gain1: tdee + 500,
    };
  }, [bmrResult, activityLevel]);

  const modes = [
    { id: "bmi", icon: Scale, label: "BMI" },
    { id: "bmr", icon: Flame, label: "BMR" },
    { id: "heartrate", icon: Heart, label: "Heart Rate" },
    { id: "calories", icon: Activity, label: "Calories" },
  ] as const;

  const activityLevels = [
    { value: 1.2, label: "Sedentary", desc: "Little or no exercise" },
    { value: 1.375, label: "Light", desc: "1-3 days/week" },
    { value: 1.55, label: "Moderate", desc: "3-5 days/week" },
    { value: 1.725, label: "Active", desc: "6-7 days/week" },
    { value: 1.9, label: "Very Active", desc: "Intense daily" },
  ];

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

      {/* Common Inputs */}
      <div className="glass p-4 rounded-2xl space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setGender("male")}
            className={cn(
              "flex-1 py-2 rounded-lg transition-all",
              gender === "male" ? "bg-blue-500/30 border border-blue-500" : "glass-light"
            )}
          >
            Male
          </button>
          <button
            onClick={() => setGender("female")}
            className={cn(
              "flex-1 py-2 rounded-lg transition-all",
              gender === "female" ? "bg-pink-500/30 border border-pink-500" : "glass-light"
            )}
          >
            Female
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              className="w-full px-3 py-2 glass rounded-lg bg-transparent font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full px-3 py-2 glass rounded-lg bg-transparent font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              className="w-full px-3 py-2 glass rounded-lg bg-transparent font-mono text-sm"
            />
          </div>
        </div>

        {mode === "heartrate" && (
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Resting Heart Rate (bpm)
            </label>
            <input
              type="number"
              value={restingHR}
              onChange={(e) => setRestingHR(e.target.value)}
              placeholder="70"
              className="w-full px-3 py-2 glass rounded-lg bg-transparent font-mono text-sm"
            />
          </div>
        )}

        {mode === "calories" && (
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Activity Level</label>
            <div className="space-y-2">
              {activityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setActivityLevel(level.value)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-all text-sm",
                    activityLevel === level.value
                      ? "bg-primary/30 border border-primary"
                      : "glass-light hover:bg-white/10"
                  )}
                >
                  <span className="font-medium">{level.label}</span>
                  <span className="text-muted-foreground ml-2 text-xs">({level.desc})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {mode === "bmi" && bmiResult && (
          <motion.div
            key="bmi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-heavy p-6 rounded-2xl text-center"
          >
            <div className="text-sm text-muted-foreground">Your BMI</div>
            <div className={cn("text-5xl font-bold font-mono", bmiResult.color)}>
              {bmiResult.bmi.toFixed(1)}
            </div>
            <div className={cn("text-lg mt-2", bmiResult.color)}>
              {bmiResult.category}
            </div>

            {/* BMI Scale */}
            <div className="mt-6">
              <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>16</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>
          </motion.div>
        )}

        {mode === "bmr" && bmrResult && (
          <motion.div
            key="bmr"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-heavy p-6 rounded-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-sm text-muted-foreground">Basal Metabolic Rate</div>
              <div className="text-4xl font-bold font-mono text-primary">
                {Math.round(bmrResult.bmr)} kcal/day
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-3">Daily Calories by Activity</div>
            <div className="space-y-2">
              {[
                { label: "Sedentary", value: bmrResult.sedentary },
                { label: "Light Activity", value: bmrResult.light },
                { label: "Moderate", value: bmrResult.moderate },
                { label: "Active", value: bmrResult.active },
                { label: "Very Active", value: bmrResult.veryActive },
              ].map((item) => (
                <div key={item.label} className="flex justify-between glass-light p-2 rounded">
                  <span className="text-sm">{item.label}</span>
                  <span className="font-mono">{Math.round(item.value)} kcal</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {mode === "heartrate" && heartRateResult && (
          <motion.div
            key="heartrate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-heavy p-6 rounded-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-sm text-muted-foreground">Maximum Heart Rate</div>
              <div className="text-4xl font-bold font-mono text-primary">
                {Math.round(heartRateResult.maxHR)} bpm
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-3">Training Zones</div>
            <div className="space-y-2">
              {heartRateResult.zones.map((zone) => (
                <div key={zone.name} className="glass-light p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-3 h-3 rounded-full", zone.color)} />
                    <span className="text-sm font-medium">{zone.name}</span>
                  </div>
                  <div className="font-mono text-lg">
                    {Math.round(zone.min)} - {Math.round(zone.max)} bpm
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {mode === "calories" && calorieResult && (
          <motion.div
            key="calories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-heavy p-6 rounded-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-sm text-muted-foreground">
                Total Daily Energy Expenditure (TDEE)
              </div>
              <div className="text-4xl font-bold font-mono text-primary">
                {Math.round(calorieResult.tdee)} kcal/day
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-light p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">Lose 0.5kg/week</div>
                <div className="font-mono text-lg text-red-400">
                  {Math.round(calorieResult.lose05)}
                </div>
              </div>
              <div className="glass-light p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">Lose 1kg/week</div>
                <div className="font-mono text-lg text-red-500">
                  {Math.round(calorieResult.lose1)}
                </div>
              </div>
              <div className="glass-light p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">Gain 0.5kg/week</div>
                <div className="font-mono text-lg text-green-400">
                  {Math.round(calorieResult.gain05)}
                </div>
              </div>
              <div className="glass-light p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">Gain 1kg/week</div>
                <div className="font-mono text-lg text-green-500">
                  {Math.round(calorieResult.gain1)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
