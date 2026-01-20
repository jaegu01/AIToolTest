import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeType =
  | "aurora"
  | "sunset"
  | "ocean"
  | "forest"
  | "midnight"
  | "cherry";

export type SoundType = "mechanical" | "8bit" | "minimal" | "nature" | "none";

interface ThemeState {
  theme: ThemeType;
  soundTheme: SoundType;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  reducedMotion: boolean;
  setTheme: (theme: ThemeType) => void;
  setSoundTheme: (soundTheme: SoundType) => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  toggleReducedMotion: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "aurora",
      soundTheme: "mechanical",
      soundEnabled: true,
      hapticEnabled: true,
      reducedMotion: false,
      setTheme: (theme) => set({ theme }),
      setSoundTheme: (soundTheme) => set({ soundTheme }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleHaptic: () =>
        set((state) => ({ hapticEnabled: !state.hapticEnabled })),
      toggleReducedMotion: () =>
        set((state) => ({ reducedMotion: !state.reducedMotion })),
    }),
    {
      name: "glasscalc-theme",
    }
  )
);
