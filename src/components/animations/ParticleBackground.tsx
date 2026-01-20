"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import { useThemeStore } from "@/stores/themeStore";

export function ParticleBackground() {
  const { reducedMotion } = useThemeStore();
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: {
        color: { value: "transparent" },
      },
      fpsLimit: reducedMotion ? 30 : 60,
      particles: {
        color: { value: "#ffffff" },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.1,
          width: 1,
        },
        move: {
          enable: !reducedMotion,
          speed: reducedMotion ? 0.5 : 1,
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: { default: "bounce" as const },
        },
        number: {
          density: { enable: true },
          value: reducedMotion ? 30 : 50,
        },
        opacity: {
          value: { min: 0.1, max: 0.3 },
        },
        shape: { type: "circle" },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [reducedMotion]
  );

  if (!init) {
    return null;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Particles
        id="tsparticles"
        options={options}
        className="h-full w-full"
      />
    </div>
  );
}
