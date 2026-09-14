import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SELECTED, DEFAULT_SYMBOLS, WATCHLIST_CONFIG_VERSION } from "@/lib/market-types";
import watchlistConfig from "@/config/watchlist.json";

type WatchlistState = {
  symbols: string[];
  selected: string;
  range: "1d" | "5d" | "1mo" | "6mo" | "ytd" | "1y" | "5y" | "max";
  fileVersion: number;
  select: (symbol: string) => void;
  add: (symbol: string) => void;
  remove: (symbol: string) => void;
  setRange: (range: WatchlistState["range"]) => void;
  setSymbols: (symbols: string[]) => void;
  resetToDefault: () => void;
  reloadFromFile: () => void;
};

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      symbols: [...DEFAULT_SYMBOLS],
      selected: DEFAULT_SELECTED,
      range: "5y",
      fileVersion: WATCHLIST_CONFIG_VERSION,
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
        set({
          symbols: [...DEFAULT_SYMBOLS],
          selected: DEFAULT_SELECTED,
          fileVersion: WATCHLIST_CONFIG_VERSION,
        });
      },
      reloadFromFile: () => {
        set({
          symbols: [...watchlistConfig.symbols],
          selected: watchlistConfig.symbols[0] ?? DEFAULT_SELECTED,
          fileVersion: watchlistConfig.version,
        });
      },
    }),
    {
      name: "monitor-watchlist-v2",
      version: WATCHLIST_CONFIG_VERSION,
      migrate: (persistedState: unknown, version: number) => {
        const state = (persistedState || {}) as Partial<WatchlistState>;
        if (typeof version !== "number" || version < WATCHLIST_CONFIG_VERSION) {
          const current = Array.isArray(state.symbols) ? state.symbols : [];
          const merged = Array.from(new Set([...watchlistConfig.symbols, ...current]));
          return {
            ...state,
            symbols: merged,
            fileVersion: WATCHLIST_CONFIG_VERSION,
          };
        }
        return state;
      },
    },
  ),
);
