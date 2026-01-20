"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useThemeStore, type ThemeType, type SoundType } from "@/stores/themeStore";

const themes: ThemeType[] = [
  "aurora",
  "sunset",
  "ocean",
  "forest",
  "midnight",
  "cherry",
];

const soundThemes: SoundType[] = ["mechanical", "8bit", "minimal", "nature", "none"];

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const {
    theme,
    soundTheme,
    soundEnabled,
    hapticEnabled,
    setTheme,
    setSoundTheme,
    toggleSound,
    toggleHaptic,
  } = useThemeStore();

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="glass p-3 rounded-full hover:bg-white/20 transition-colors"
        aria-label={t("common.settings")}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-0 top-0 h-full w-80 glass-heavy z-50 p-6 overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">{t("common.settings")}</h2>

              {/* Theme Selection */}
              <section className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {t("common.theme")}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      className={`p-3 rounded-lg text-sm transition-all ${
                        theme === themeOption
                          ? "bg-primary/30 border border-primary"
                          : "glass hover:bg-white/15"
                      }`}
                    >
                      {t(`themes.${themeOption}`)}
                    </button>
                  ))}
                </div>
              </section>

              {/* Sound Selection */}
              <section className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t("common.sound")}
                  </h3>
                  <button
                    onClick={toggleSound}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      soundEnabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        soundEnabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                {soundEnabled && (
                  <div className="grid grid-cols-2 gap-2">
                    {soundThemes.filter((s) => s !== "none").map((sound) => (
                      <button
                        key={sound}
                        onClick={() => setSoundTheme(sound)}
                        className={`p-2 rounded-lg text-sm transition-all ${
                          soundTheme === sound
                            ? "bg-primary/30 border border-primary"
                            : "glass hover:bg-white/15"
                        }`}
                      >
                        {t(`sound.${sound}`)}
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* Haptic Toggle */}
              <section className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t("common.haptic")}
                  </h3>
                  <button
                    onClick={toggleHaptic}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      hapticEnabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        hapticEnabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </section>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 glass hover:bg-white/20 rounded-lg transition-colors mt-4"
              >
                {t("common.close")}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
