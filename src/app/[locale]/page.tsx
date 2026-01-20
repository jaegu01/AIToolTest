"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
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
} from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { SettingsButton } from "@/components/ui/SettingsButton";

const calculators = [
  { id: "engineering", icon: Calculator, color: "from-blue-500 to-cyan-500" },
  { id: "financial", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  { id: "graph", icon: LineChart, color: "from-purple-500 to-pink-500" },
  { id: "unit", icon: ArrowLeftRight, color: "from-orange-500 to-amber-500" },
  { id: "programmer", icon: Binary, color: "from-slate-500 to-zinc-500" },
  { id: "statistics", icon: BarChart3, color: "from-indigo-500 to-violet-500" },
  { id: "datetime", icon: Calendar, color: "from-rose-500 to-pink-500" },
  { id: "matrix", icon: Grid3X3, color: "from-teal-500 to-cyan-500" },
  { id: "physics", icon: Atom, color: "from-yellow-500 to-orange-500" },
  { id: "chemistry", icon: FlaskConical, color: "from-lime-500 to-green-500" },
  { id: "health", icon: Heart, color: "from-red-500 to-rose-500" },
  { id: "color", icon: Palette, color: "from-fuchsia-500 to-purple-500" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-gradient">
            {t("common.appName")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("home.subtitle")}
          </p>
          <p className="text-sm text-muted-foreground/60 mt-2">
            {t("home.commandPalette")}
          </p>
        </motion.header>

        {/* Settings Button */}
        <div className="absolute top-4 right-4">
          <SettingsButton />
        </div>

        {/* Calculator Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <motion.div key={calc.id} variants={itemVariants}>
                <Link href={`/${calc.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass p-6 cursor-pointer group h-full"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${calc.color}
                                  flex items-center justify-center mb-4
                                  group-hover:shadow-lg group-hover:shadow-primary/20
                                  transition-shadow duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold mb-1">
                      {t(`calculators.${calc.id}.name`)}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t(`calculators.${calc.id}.description`)}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-muted-foreground/50"
        >
          <p>Built with Next.js 15 • Glassmorphism UI • Claude Code</p>
        </motion.footer>
      </div>
    </div>
  );
}
