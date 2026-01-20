"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { ThreeBackground } from "@/components/3d/ThreeBackground";
import { useThemeStore } from "@/stores/themeStore";

interface CalculatorShellProps {
  children: ReactNode;
  title: string;
  description?: string;
  showHistory?: boolean;
  historyPanel?: ReactNode;
  use3D?: boolean;
}

export function CalculatorShell({
  children,
  title,
  description,
  showHistory = false,
  historyPanel,
  use3D = true,
}: CalculatorShellProps) {
  const t = useTranslations();
  const { reducedMotion } = useThemeStore();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {use3D && !reducedMotion ? <ThreeBackground /> : <ParticleBackground />}

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="glass p-3 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </motion.header>

        {/* Main Content */}
        <div className={`flex gap-6 ${showHistory ? "flex-col lg:flex-row" : ""}`}>
          <motion.main
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`flex-1 ${showHistory ? "lg:max-w-2xl" : ""}`}
          >
            {children}
          </motion.main>

          {/* History Panel */}
          {showHistory && historyPanel && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-80"
            >
              <div className="glass p-4 rounded-xl h-full max-h-[600px] overflow-y-auto custom-scrollbar">
                <h2 className="text-lg font-semibold mb-4">
                  {t("calculator.history")}
                </h2>
                {historyPanel}
              </div>
            </motion.aside>
          )}
        </div>
      </div>
    </div>
  );
}
