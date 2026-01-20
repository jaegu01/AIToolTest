import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, locale: string = "ko"): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 10,
  }).format(value);
}

export function formatScientific(value: number, precision: number = 6): string {
  if (Math.abs(value) < 1e-10) return "0";
  if (Math.abs(value) >= 1e10 || Math.abs(value) < 1e-6) {
    return value.toExponential(precision);
  }
  return value.toPrecision(precision).replace(/\.?0+$/, "");
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error("Clipboard API not supported"));
}

export function triggerHaptic(
  pattern: "light" | "medium" | "heavy" = "light"
): void {
  if ("vibrate" in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30],
    };
    navigator.vibrate(patterns[pattern]);
  }
}
