"use client";

import { useCallback, useEffect, useRef } from "react";
import { Howl } from "howler";
import { useThemeStore, type SoundType } from "@/stores/themeStore";

interface SoundSet {
  keyNumber: Howl | null;
  keyOperator: Howl | null;
  keyFunction: Howl | null;
  keyEquals: Howl | null;
  error: Howl | null;
  success: Howl | null;
}

const soundUrls: Record<SoundType, Record<string, string>> = {
  mechanical: {
    keyNumber: "/sounds/mechanical/key.mp3",
    keyOperator: "/sounds/mechanical/key.mp3",
    keyFunction: "/sounds/mechanical/key.mp3",
    keyEquals: "/sounds/mechanical/enter.mp3",
    error: "/sounds/mechanical/error.mp3",
    success: "/sounds/mechanical/success.mp3",
  },
  "8bit": {
    keyNumber: "/sounds/8bit/beep.mp3",
    keyOperator: "/sounds/8bit/beep-high.mp3",
    keyFunction: "/sounds/8bit/beep-low.mp3",
    keyEquals: "/sounds/8bit/success.mp3",
    error: "/sounds/8bit/error.mp3",
    success: "/sounds/8bit/fanfare.mp3",
  },
  minimal: {
    keyNumber: "/sounds/minimal/click.mp3",
    keyOperator: "/sounds/minimal/click.mp3",
    keyFunction: "/sounds/minimal/click.mp3",
    keyEquals: "/sounds/minimal/done.mp3",
    error: "/sounds/minimal/error.mp3",
    success: "/sounds/minimal/done.mp3",
  },
  nature: {
    keyNumber: "/sounds/nature/drop.mp3",
    keyOperator: "/sounds/nature/drop.mp3",
    keyFunction: "/sounds/nature/chime.mp3",
    keyEquals: "/sounds/nature/bell.mp3",
    error: "/sounds/nature/error.mp3",
    success: "/sounds/nature/success.mp3",
  },
  none: {
    keyNumber: "",
    keyOperator: "",
    keyFunction: "",
    keyEquals: "",
    error: "",
    success: "",
  },
};

export function useSound() {
  const { soundEnabled, soundTheme } = useThemeStore();
  const soundsRef = useRef<SoundSet | null>(null);
  const loadedThemeRef = useRef<SoundType | null>(null);

  useEffect(() => {
    if (!soundEnabled || soundTheme === "none") {
      soundsRef.current = null;
      loadedThemeRef.current = null;
      return;
    }

    if (loadedThemeRef.current === soundTheme) {
      return;
    }

    // Clean up old sounds
    if (soundsRef.current) {
      Object.values(soundsRef.current).forEach((sound) => {
        if (sound) sound.unload();
      });
    }

    const urls = soundUrls[soundTheme];
    soundsRef.current = {
      keyNumber: urls.keyNumber ? new Howl({ src: [urls.keyNumber], volume: 0.3 }) : null,
      keyOperator: urls.keyOperator ? new Howl({ src: [urls.keyOperator], volume: 0.3 }) : null,
      keyFunction: urls.keyFunction ? new Howl({ src: [urls.keyFunction], volume: 0.3 }) : null,
      keyEquals: urls.keyEquals ? new Howl({ src: [urls.keyEquals], volume: 0.4 }) : null,
      error: urls.error ? new Howl({ src: [urls.error], volume: 0.4 }) : null,
      success: urls.success ? new Howl({ src: [urls.success], volume: 0.4 }) : null,
    };
    loadedThemeRef.current = soundTheme;

    return () => {
      if (soundsRef.current) {
        Object.values(soundsRef.current).forEach((sound) => {
          if (sound) sound.unload();
        });
      }
    };
  }, [soundEnabled, soundTheme]);

  const playKeySound = useCallback(
    (type: "number" | "operator" | "function" | "action" | "equals") => {
      if (!soundEnabled || !soundsRef.current) return;

      const soundMap: Record<string, keyof SoundSet> = {
        number: "keyNumber",
        operator: "keyOperator",
        function: "keyFunction",
        action: "keyNumber",
        equals: "keyEquals",
      };

      const sound = soundsRef.current[soundMap[type]];
      if (sound) {
        sound.play();
      }
    },
    [soundEnabled]
  );

  const playFeedbackSound = useCallback(
    (type: "error" | "success") => {
      if (!soundEnabled || !soundsRef.current) return;

      const sound = soundsRef.current[type];
      if (sound) {
        sound.play();
      }
    },
    [soundEnabled]
  );

  return { playKeySound, playFeedbackSound };
}
