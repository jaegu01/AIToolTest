"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Star, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCalculatorStore, type HistoryEntry } from "@/stores/calculatorStore";
import { copyToClipboard, cn } from "@/lib/utils";
import { useState } from "react";

interface HistoryPanelProps {
  calculatorType: string;
}

export function HistoryPanel({ calculatorType }: HistoryPanelProps) {
  const t = useTranslations();
  const { history, clearHistory, setExpression } = useCalculatorStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter(
    (entry) => entry.calculatorType === calculatorType
  );

  const handleCopy = async (entry: HistoryEntry) => {
    await copyToClipboard(entry.result);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleUseExpression = (entry: HistoryEntry) => {
    setExpression(entry.expression);
  };

  if (filteredHistory.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p className="text-sm">No history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => clearHistory()}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          {t("calculator.clearHistory")}
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredHistory.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            layout
            className="glass-light p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors group"
            onClick={() => handleUseExpression(entry)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {entry.expression}
                </p>
                <p className="text-lg font-mono font-medium truncate">
                  = {entry.result}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(entry);
                  }}
                  className="p-1.5 rounded hover:bg-white/20"
                  aria-label={t("common.copy")}
                >
                  <Copy className={cn(
                    "w-3.5 h-3.5",
                    copiedId === entry.id && "text-green-400"
                  )} />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/50 mt-1">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
