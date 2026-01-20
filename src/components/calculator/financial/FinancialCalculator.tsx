"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { DollarSign, Percent, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type CalculationType = "loan" | "compound" | "investment" | "mortgage";

interface CalculationResult {
  monthlyPayment?: number;
  totalPayment?: number;
  totalInterest?: number;
  futureValue?: number;
  roi?: number;
}

export function FinancialCalculator() {
  const t = useTranslations();
  const [calcType, setCalcType] = useState<CalculationType>("loan");
  const [principal, setPrincipal] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calcTypes = [
    { id: "loan", icon: DollarSign, label: "Loan" },
    { id: "compound", icon: TrendingUp, label: "Compound" },
    { id: "investment", icon: Percent, label: "Investment" },
    { id: "mortgage", icon: Calendar, label: "Mortgage" },
  ] as const;

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(term);

    if (isNaN(p) || isNaN(r) || isNaN(n)) {
      return;
    }

    let calcResult: CalculationResult = {};

    switch (calcType) {
      case "loan":
      case "mortgage": {
        const monthlyRate = r / 12;
        const months = n * 12;
        const monthlyPayment =
          (p * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
        calcResult = {
          monthlyPayment,
          totalPayment: monthlyPayment * months,
          totalInterest: monthlyPayment * months - p,
        };
        break;
      }
      case "compound": {
        const futureValue = p * Math.pow(1 + r / 12, n * 12);
        calcResult = {
          futureValue,
          totalInterest: futureValue - p,
        };
        break;
      }
      case "investment": {
        const futureValue = p * Math.pow(1 + r, n);
        calcResult = {
          futureValue,
          roi: ((futureValue - p) / p) * 100,
        };
        break;
      }
    }

    setResult(calcResult);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-6">
      {/* Calculation Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {calcTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                setCalcType(type.id);
                setResult(null);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                calcType === type.id
                  ? "bg-primary/30 border border-primary"
                  : "glass hover:bg-white/15"
              )}
            >
              <Icon className="w-4 h-4" />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Principal Amount (원금)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="1,000,000"
              className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Interest Rate (이자율 %)
          </label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="3.5"
              step="0.1"
              className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Term (기간, 년)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="10"
              className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={calculate}
        className="w-full py-4 calc-btn-primary text-lg font-semibold rounded-xl"
      >
        Calculate
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-heavy p-6 rounded-xl space-y-4"
          >
            <h3 className="text-lg font-semibold text-primary">Results</h3>

            {result.monthlyPayment !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">월 상환액</span>
                <span className="text-xl font-mono font-bold">
                  {formatCurrency(result.monthlyPayment)}
                </span>
              </div>
            )}

            {result.totalPayment !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">총 상환액</span>
                <span className="text-lg font-mono">
                  {formatCurrency(result.totalPayment)}
                </span>
              </div>
            )}

            {result.totalInterest !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">총 이자</span>
                <span className="text-lg font-mono text-accent">
                  {formatCurrency(result.totalInterest)}
                </span>
              </div>
            )}

            {result.futureValue !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">미래 가치</span>
                <span className="text-xl font-mono font-bold">
                  {formatCurrency(result.futureValue)}
                </span>
              </div>
            )}

            {result.roi !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ROI</span>
                <span className="text-lg font-mono text-green-400">
                  +{result.roi.toFixed(2)}%
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
