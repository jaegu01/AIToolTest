"use client";

import { useTranslations } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
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
  Sparkles,
  Zap,
} from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { SettingsButton } from "@/components/ui/SettingsButton";

// Bento Grid Layout Configuration
// lg = 2x2, wide = 2x1, tall = 1x2, normal = 1x1
interface CalculatorConfig {
  id: string;
  icon: typeof Calculator;
  color: string;
  size: "lg" | "wide" | "tall" | "normal";
  featured?: boolean;
}

const calculators: CalculatorConfig[] = [
  { id: "engineering", icon: Calculator, color: "from-violet-500 via-purple-500 to-fuchsia-500", size: "lg", featured: true },
  { id: "financial", icon: TrendingUp, color: "from-emerald-400 via-green-500 to-teal-500", size: "normal" },
  { id: "graph", icon: LineChart, color: "from-pink-500 via-rose-500 to-red-500", size: "tall" },
  { id: "unit", icon: ArrowLeftRight, color: "from-amber-400 via-orange-500 to-red-500", size: "normal" },
  { id: "programmer", icon: Binary, color: "from-slate-400 via-zinc-500 to-gray-600", size: "wide" },
  { id: "statistics", icon: BarChart3, color: "from-indigo-400 via-violet-500 to-purple-600", size: "normal" },
  { id: "datetime", icon: Calendar, color: "from-rose-400 via-pink-500 to-fuchsia-500", size: "normal" },
  { id: "matrix", icon: Grid3X3, color: "from-cyan-400 via-teal-500 to-emerald-500", size: "wide" },
  { id: "physics", icon: Atom, color: "from-yellow-400 via-amber-500 to-orange-500", size: "normal" },
  { id: "chemistry", icon: FlaskConical, color: "from-lime-400 via-green-500 to-emerald-500", size: "normal" },
  { id: "health", icon: Heart, color: "from-red-400 via-rose-500 to-pink-500", size: "normal" },
  { id: "color", icon: Palette, color: "from-fuchsia-400 via-purple-500 to-violet-600", size: "normal" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

// 3D Tilt Card Component
function TiltCard({
  children,
  className = "",
  size = "normal"
}: {
  children: React.ReactNode;
  className?: string;
  size?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sizeClasses = {
    lg: "bento-item-lg",
    wide: "bento-item-wide",
    tall: "bento-item-tall",
    normal: "",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`bento-item ${sizeClasses[size as keyof typeof sizeClasses]} ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Aurora Text Effect */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-16 pt-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              12가지 전문 계산기
            </span>
            <Zap className="w-4 h-4 text-accent" />
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient-aurora tracking-tight">
            {t("common.appName")}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("home.subtitle")}
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground/50 mt-4 flex items-center justify-center gap-2"
          >
            <kbd className="px-2 py-1 rounded glass-light text-xs font-mono">⌘K</kbd>
            <span>{t("home.commandPalette")}</span>
          </motion.p>
        </motion.header>

        {/* Settings Button */}
        <div className="fixed top-6 right-6 z-50">
          <SettingsButton />
        </div>

        {/* Bento Grid Calculator Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bento-grid"
        >
          {calculators.map((calc, index) => {
            const Icon = calc.icon;
            const isFeatured = calc.featured;

            return (
              <motion.div key={calc.id} variants={itemVariants}>
                <Link href={`/${calc.id}`} className="block h-full">
                  <TiltCard size={calc.size}>
                    {/* Gradient Orb Background for Featured */}
                    {isFeatured && (
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <div
                          className={`absolute -top-1/2 -right-1/2 w-full h-full
                                      bg-gradient-to-br ${calc.color} opacity-20 blur-3xl
                                      animate-pulse`}
                          style={{ animationDuration: '3s' }}
                        />
                      </div>
                    )}

                    <div className="relative z-10 h-full flex flex-col">
                      {/* Icon Container with Glow */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${calc.color}
                                    flex items-center justify-center mb-4 relative
                                    shadow-lg`}
                        style={{
                          boxShadow: `0 10px 40px -10px rgba(0,0,0,0.5),
                                      0 0 30px -5px var(--tw-gradient-from)`
                        }}
                      >
                        <Icon className={`${isFeatured ? 'w-8 h-8' : 'w-7 h-7'} text-white drop-shadow-lg`} />

                        {/* Shine Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-50" />
                      </motion.div>

                      {/* Title */}
                      <h2 className={`${isFeatured ? 'text-2xl' : 'text-lg'} font-bold mb-2
                                      group-hover:text-gradient transition-all duration-300`}>
                        {t(`calculators.${calc.id}.name`)}
                      </h2>

                      {/* Description */}
                      <p className={`${isFeatured ? 'text-base' : 'text-sm'} text-muted-foreground
                                    leading-relaxed flex-grow`}>
                        {t(`calculators.${calc.id}.description`)}
                      </p>

                      {/* Featured Badge */}
                      {isFeatured && (
                        <div className="mt-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold
                                          bg-gradient-to-r from-primary/20 to-accent/20
                                          border border-primary/30">
                            Most Popular
                          </span>
                        </div>
                      )}

                      {/* Hover Arrow Indicator */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="absolute bottom-6 right-6 text-muted-foreground"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="text-center mt-16 pb-8"
        >
          <div className="glass-light inline-flex items-center gap-4 px-6 py-3 rounded-full">
            <span className="text-sm text-muted-foreground/70">
              Built with
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-md bg-black/20 text-xs font-mono">Next.js 15</span>
              <span className="px-2 py-1 rounded-md bg-black/20 text-xs font-mono">Framer Motion</span>
              <span className="px-2 py-1 rounded-md bg-black/20 text-xs font-mono">Claude Code</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
