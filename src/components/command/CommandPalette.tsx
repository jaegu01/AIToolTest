"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  LineChart,
  ArrowLeftRight,
  Binary,
  BarChart3,
  Calendar,
  Grid3X3,
  Atom,
  FlaskConical,
  Heart,
  Palette,
  Settings,
  Search,
} from "lucide-react";

const calculatorItems = [
  { id: "engineering", icon: Calculator },
  { id: "financial", icon: TrendingUp },
  { id: "graph", icon: LineChart },
  { id: "unit", icon: ArrowLeftRight },
  { id: "programmer", icon: Binary },
  { id: "statistics", icon: BarChart3 },
  { id: "datetime", icon: Calendar },
  { id: "matrix", icon: Grid3X3 },
  { id: "physics", icon: Atom },
  { id: "chemistry", icon: FlaskConical },
  { id: "health", icon: Heart },
  { id: "color", icon: Palette },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (id: string) => {
    setOpen(false);
    if (id === "settings") {
      // Open settings modal - to be implemented
    } else {
      router.push(`/${id}`);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <Command className="glass-heavy rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center border-b border-white/10 px-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Command.Input
                  placeholder={t("home.searchPlaceholder")}
                  className="flex-1 py-4 px-3 bg-transparent border-none outline-none
                           text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
                <Command.Empty className="py-6 text-center text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group
                  heading="Calculators"
                  className="text-xs text-muted-foreground px-2 py-1.5"
                >
                  {calculatorItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Command.Item
                        key={item.id}
                        value={`${item.id} ${t(`calculators.${item.id}.name`)}`}
                        onSelect={() => handleSelect(item.id)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                                 cursor-pointer transition-colors
                                 aria-selected:bg-white/10 hover:bg-white/5"
                      >
                        <Icon className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">
                            {t(`calculators.${item.id}.name`)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t(`calculators.${item.id}.description`)}
                          </div>
                        </div>
                      </Command.Item>
                    );
                  })}
                </Command.Group>

                <Command.Group
                  heading="Actions"
                  className="text-xs text-muted-foreground px-2 py-1.5 mt-2"
                >
                  <Command.Item
                    value="settings"
                    onSelect={() => handleSelect("settings")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                             cursor-pointer transition-colors
                             aria-selected:bg-white/10 hover:bg-white/5"
                  >
                    <Settings className="w-5 h-5 text-primary" />
                    <span>{t("common.settings")}</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
