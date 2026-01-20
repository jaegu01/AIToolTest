"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Palette, RefreshCw } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(rgb: RGB): string {
  return (
    "#" +
    [rgb.r, rgb.g, rgb.b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function generatePalette(baseColor: HSL, type: string): string[] {
  const colors: string[] = [];

  switch (type) {
    case "complementary":
      colors.push(rgbToHex(hslToRgb(baseColor)));
      colors.push(rgbToHex(hslToRgb({ ...baseColor, h: (baseColor.h + 180) % 360 })));
      break;
    case "triadic":
      colors.push(rgbToHex(hslToRgb(baseColor)));
      colors.push(rgbToHex(hslToRgb({ ...baseColor, h: (baseColor.h + 120) % 360 })));
      colors.push(rgbToHex(hslToRgb({ ...baseColor, h: (baseColor.h + 240) % 360 })));
      break;
    case "analogous":
      colors.push(rgbToHex(hslToRgb({ ...baseColor, h: (baseColor.h - 30 + 360) % 360 })));
      colors.push(rgbToHex(hslToRgb(baseColor)));
      colors.push(rgbToHex(hslToRgb({ ...baseColor, h: (baseColor.h + 30) % 360 })));
      break;
    case "split-complementary":
      colors.push(rgbToHex(hslToRgb(baseColor)));
      colors.push(rgbToHex(hslToRgb({ ...baseColor, h: (baseColor.h + 150) % 360 })));
      colors.push(rgbToHex(hslToRgb({ ...baseColor, h: (baseColor.h + 210) % 360 })));
      break;
    case "shades":
      for (let i = 0; i < 5; i++) {
        colors.push(
          rgbToHex(hslToRgb({ ...baseColor, l: Math.max(10, baseColor.l - i * 15) }))
        );
      }
      break;
    default:
      colors.push(rgbToHex(hslToRgb(baseColor)));
  }

  return colors;
}

export function ColorCalculator() {
  const [hex, setHex] = useState("#6366F1");
  const [rgb, setRgb] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState<HSL>({ h: 239, s: 84, l: 67 });
  const [paletteType, setPaletteType] = useState("complementary");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const rgbVal = hexToRgb(hex);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal));
    }
  }, [hex]);

  const handleRgbChange = (key: keyof RGB, value: number) => {
    const newRgb = { ...rgb, [key]: Math.max(0, Math.min(255, value)) };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
    setHsl(rgbToHsl(newRgb));
  };

  const handleHslChange = (key: keyof HSL, value: number) => {
    const maxVal = key === "h" ? 360 : 100;
    const newHsl = { ...hsl, [key]: Math.max(0, Math.min(maxVal, value)) };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
  };

  const palette = useMemo(() => generatePalette(hsl, paletteType), [hsl, paletteType]);

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  const randomColor = () => {
    const newHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase();
    setHex(newHex);
  };

  const paletteTypes = [
    { id: "complementary", label: "Complementary" },
    { id: "triadic", label: "Triadic" },
    { id: "analogous", label: "Analogous" },
    { id: "split-complementary", label: "Split" },
    { id: "shades", label: "Shades" },
  ];

  return (
    <div className="space-y-4">
      {/* Color Preview */}
      <div className="glass p-4 rounded-2xl">
        <div className="flex gap-4">
          <div
            className="w-32 h-32 rounded-xl shadow-lg"
            style={{ backgroundColor: hex }}
          />
          <div className="flex-1 space-y-3">
            {/* HEX Input */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-10">HEX</label>
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="flex-1 px-3 py-2 glass rounded-lg bg-transparent font-mono text-sm"
              />
              <button
                onClick={() => handleCopy(hex)}
                className="p-2 glass rounded-lg hover:bg-white/20"
              >
                {copied === hex ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Color Picker */}
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              className="w-full h-10 rounded-lg cursor-pointer"
            />

            <button
              onClick={randomColor}
              className="flex items-center gap-2 px-3 py-2 glass rounded-lg hover:bg-white/20 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Random
            </button>
          </div>
        </div>
      </div>

      {/* RGB Controls */}
      <div className="glass p-4 rounded-2xl space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">RGB</h3>
        {(["r", "g", "b"] as const).map((channel) => (
          <div key={channel} className="flex items-center gap-3">
            <span className="w-6 text-xs uppercase text-muted-foreground">
              {channel}
            </span>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb[channel]}
              onChange={(e) => handleRgbChange(channel, parseInt(e.target.value))}
              className="flex-1"
              style={{
                accentColor:
                  channel === "r" ? "#ef4444" : channel === "g" ? "#22c55e" : "#3b82f6",
              }}
            />
            <input
              type="number"
              min="0"
              max="255"
              value={rgb[channel]}
              onChange={(e) => handleRgbChange(channel, parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 glass rounded text-center font-mono text-sm"
            />
          </div>
        ))}
        <div className="flex items-center justify-between glass-light p-2 rounded-lg">
          <span className="font-mono text-sm">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </span>
          <button
            onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
            className="p-1 hover:bg-white/20 rounded"
          >
            {copied === `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* HSL Controls */}
      <div className="glass p-4 rounded-2xl space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">HSL</h3>
        {(["h", "s", "l"] as const).map((prop) => (
          <div key={prop} className="flex items-center gap-3">
            <span className="w-6 text-xs uppercase text-muted-foreground">
              {prop}
            </span>
            <input
              type="range"
              min="0"
              max={prop === "h" ? 360 : 100}
              value={hsl[prop]}
              onChange={(e) => handleHslChange(prop, parseInt(e.target.value))}
              className="flex-1"
              style={{
                background:
                  prop === "h"
                    ? "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)"
                    : undefined,
              }}
            />
            <input
              type="number"
              min="0"
              max={prop === "h" ? 360 : 100}
              value={hsl[prop]}
              onChange={(e) => handleHslChange(prop, parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 glass rounded text-center font-mono text-sm"
            />
          </div>
        ))}
        <div className="flex items-center justify-between glass-light p-2 rounded-lg">
          <span className="font-mono text-sm">
            hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
          </span>
          <button
            onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
            className="p-1 hover:bg-white/20 rounded"
          >
            {copied === `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Color Palette Generator */}
      <div className="glass p-4 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-medium">Color Palette</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {paletteTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setPaletteType(type.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-all",
                paletteType === type.id
                  ? "bg-primary/30 border border-primary"
                  : "glass-light hover:bg-white/10"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {palette.map((color, i) => (
            <motion.button
              key={`${color}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleCopy(color)}
              className="flex-1 h-16 rounded-lg relative group"
              style={{ backgroundColor: color }}
            >
              <span className="absolute inset-x-0 bottom-0 text-center text-xs py-1 bg-black/50 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {color}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
