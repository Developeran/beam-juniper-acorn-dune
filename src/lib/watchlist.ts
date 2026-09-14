import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SELECTED, DEFAULT_SYMBOLS } from "@/lib/market-types";

type WatchlistState = {
  symbols: string[];
  selected: string;
  range: "1d" | "5d" | "1mo" | "6mo" | "ytd" | "1y" | "5y" | "max";
  select: (symbol: string) => void;
  add: (symbol: string) => void;
  remove: (symbol: string) => void;
  setRange: (range: WatchlistState["range"]) => void;
  setSymbols: (symbols: string[]) => void;
  resetToDefault: () => void;
};

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      symbols: [...DEFAULT_SYMBOLS],
      selected: DEFAULT_SELECTED,
      range: "5y",
      select: (symbol) => set({ selected: symbol }),
      add: (raw) => {
        const symbol = raw.trim().toUpperCase();
        if (!symbol) return;
        const symbols = get().symbols;
        if (symbols.includes(symbol)) {
          set({ selected: symbol });
          return;
        }
        set({ symbols: [symbol, ...symbols], selected: symbol });
      },
      remove: (symbol) => {
        const symbols = get().symbols.filter((s) => s !== symbol);
        const selected =
          get().selected === symbol ? (symbols[0] ?? "") : get().selected;
        set({ symbols, selected });
      },
      setRange: (range) => set({ range }),
      setSymbols: (newSymbols) => {
        const clean = Array.from(
          new Set(newSymbols.map((s) => s.trim().toUpperCase()).filter(Boolean)),
        );
        if (clean.length === 0) return;
        set({ symbols: clean, selected: clean[0] ?? "" });
      },
      resetToDefault: () => {
        set({ symbols: [...DEFAULT_SYMBOLS], selected: DEFAULT_SELECTED });
      },
    }),
    { name: "monitor-watchlist-v1" },
  ),
);
