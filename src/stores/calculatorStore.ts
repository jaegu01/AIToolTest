import { create } from "zustand";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  calculatorType: string;
}

interface CalculatorState {
  expression: string;
  result: string;
  history: HistoryEntry[];
  memory: number;
  angleUnit: "deg" | "rad";
  isError: boolean;
  setExpression: (expression: string) => void;
  appendToExpression: (value: string) => void;
  setResult: (result: string) => void;
  setError: (isError: boolean) => void;
  addToHistory: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  clearHistory: () => void;
  setMemory: (memory: number) => void;
  clearMemory: () => void;
  addToMemory: (value: number) => void;
  subtractFromMemory: (value: number) => void;
  toggleAngleUnit: () => void;
  clear: () => void;
  allClear: () => void;
  backspace: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  expression: "",
  result: "0",
  history: [],
  memory: 0,
  angleUnit: "deg",
  isError: false,

  setExpression: (expression) => set({ expression, isError: false }),

  appendToExpression: (value) =>
    set((state) => ({
      expression: state.expression + value,
      isError: false,
    })),

  setResult: (result) => set({ result }),

  setError: (isError) => set({ isError }),

  addToHistory: (entry) =>
    set((state) => ({
      history: [
        {
          ...entry,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
        },
        ...state.history,
      ].slice(0, 100),
    })),

  clearHistory: () => set({ history: [] }),

  setMemory: (memory) => set({ memory }),

  clearMemory: () => set({ memory: 0 }),

  addToMemory: (value) =>
    set((state) => ({ memory: state.memory + value })),

  subtractFromMemory: (value) =>
    set((state) => ({ memory: state.memory - value })),

  toggleAngleUnit: () =>
    set((state) => ({
      angleUnit: state.angleUnit === "deg" ? "rad" : "deg",
    })),

  clear: () => set({ expression: "", isError: false }),

  allClear: () => set({ expression: "", result: "0", isError: false }),

  backspace: () =>
    set((state) => ({
      expression: state.expression.slice(0, -1),
      isError: false,
    })),
}));
