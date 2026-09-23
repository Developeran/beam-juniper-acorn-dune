"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Crosshair,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Plus,
  Check,
  ExternalLink,
  ArrowDownUp,
  Download,
  Copy,
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Sparkline } from "@/components/sparkline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCompact, formatNumber, formatPercent, formatPrice, formatSigned } from "@/lib/format";
import { getQuotes } from "@/lib/market";
import type { Quote } from "@/lib/market-types";
import {
  ALL_SHKRELI_POSITIONS,
  SHKRELI_LONGS,
  SHKRELI_SHORTS,
  SHKRELI_LONG_SYMBOLS,
  SHKRELI_SHORT_SYMBOLS,
  type ShkreliPosition,
} from "@/lib/shkreli-data";
import { useWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

type SortMode = "pnl_desc" | "pnl_asc" | "pct_desc" | "pct_asc" | "symbol_asc" | "price_desc";

export function ShkreliRadar({
  onSelectTicker,
}: {
  onSelectTicker: (symbol: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [filterSide, setFilterSide] = useState<"all" | "long" | "short">("all");
  const [sortMode, setSortMode] = useState<SortMode>("pnl_desc");
  const [viewMode, setViewMode] = useState<"columns" | "table">("columns");
  const [isCopied, setIsCopied] = useState(false);

  const watchlistSymbols = useWatchlist((s) => s.symbols);
  const addWatchlist = useWatchlist((s) => s.add);

  // Parallel fetch for Longs and Shorts
  const quotesQuery = useQuery({
    queryKey: ["shkreli-quotes"],
    queryFn: async (): Promise<Quote[]> => {
      const [longQuotes, shortQuotes] = await Promise.all([
        getQuotes({ data: { symbols: SHKRELI_LONG_SYMBOLS } }),
        getQuotes({ data: { symbols: SHKRELI_SHORT_SYMBOLS } }),
      ]);
      return [...longQuotes, ...shortQuotes];
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const quotes = quotesQuery.data ?? [];
  const quotesMap = useMemo(() => {
    const map = new Map<string, Quote>();
    for (const q of quotes) {
      map.set(q.symbol, q);
    }
    return map;
  }, [quotes]);

  // Combine metadata with live market quotes
  const enrichedPositions = useMemo(() => {
    return ALL_SHKRELI_POSITIONS.map((pos) => {
      const q = quotesMap.get(pos.symbol);
      const price = q?.price ?? 0;
      const changePct = q?.changePct ?? 0;
      const previousClose = q?.previousClose ?? 0;
      const changeUsd = previousClose > 0 ? price - previousClose : 0;

      // For Short positions: falling price is PROFIT, rising price is LOSS
      const effectivePnlPct = pos.side === "short" ? -changePct : changePct;
      const effectivePnlUsd = pos.side === "short" ? -changeUsd : changeUsd;

      return {
        ...pos,
        quote: q,
        price,
        changePct,
        changeUsd,
        effectivePnlPct,
        effectivePnlUsd,
        previousClose,
        dayHigh: q?.dayHigh ?? price,
        dayLow: q?.dayLow ?? price,
        spark: q?.spark ?? [],
        volume: q?.volume ?? 0,
      };
    });
  }, [quotesMap]);

  // Calculate Basket Analytics
  const basketStats = useMemo(() => {
    const longs = enrichedPositions.filter((p) => p.side === "long" && p.price > 0);
    const shorts = enrichedPositions.filter((p) => p.side === "short" && p.price > 0);

    const longAvgPct =
      longs.length > 0 ? longs.reduce((acc, p) => acc + p.changePct, 0) / longs.length : 0;
    const shortStockAvgPct =
      shorts.length > 0 ? shorts.reduce((acc, p) => acc + p.changePct, 0) / shorts.length : 0;

    // Short position P&L is inverse of stock price change
    const shortEffectivePnlPct = -shortStockAvgPct;

    // Net synthetic Long/Short performance: average of Long return and Short effective return
    const netLsSpread = (longAvgPct + shortEffectivePnlPct) / 2;

    const longGainers = longs.filter((p) => p.changePct > 0).length;
    const longLosers = longs.filter((p) => p.changePct < 0).length;

    const shortWinners = shorts.filter((p) => p.effectivePnlPct > 0).length;
    const shortLosers = shorts.filter((p) => p.effectivePnlPct < 0).length;

    const topLong = longs.length > 0 ? [...longs].sort((a, b) => b.changePct - a.changePct)[0] : null;
    const topShort =
      shorts.length > 0 ? [...shorts].sort((a, b) => b.effectivePnlPct - a.effectivePnlPct)[0] : null;

    return {
      longAvgPct,
      shortStockAvgPct,
      shortEffectivePnlPct,
      netLsSpread,
      longGainers,
      longLosers,
      shortWinners,
      shortLosers,
      topLong,
      topShort,
      loadedCount: enrichedPositions.filter((p) => p.price > 0).length,
    };
  }, [enrichedPositions]);

  // Filter and Sort positions
  const filteredPositions = useMemo(() => {
    let result = enrichedPositions;

    if (filterSide !== "all") {
      result = result.filter((p) => p.side === filterSide);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.symbol.toLowerCase().includes(q) ||
          p.companyName.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)),
      );
    }

    return [...result].sort((a, b) => {
      switch (sortMode) {
        case "pnl_desc":
          return b.effectivePnlPct - a.effectivePnlPct;
        case "pnl_asc":
          return a.effectivePnlPct - b.effectivePnlPct;
        case "pct_desc":
          return b.changePct - a.changePct;
        case "pct_asc":
          return a.changePct - b.changePct;
        case "symbol_asc":
          return a.symbol.localeCompare(b.symbol);
        case "price_desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [enrichedPositions, filterSide, search, sortMode]);

  const longsFiltered = useMemo(() => {
    return filteredPositions.filter((p) => p.side === "long");
  }, [filteredPositions]);

  const shortsFiltered = useMemo(() => {
    return filteredPositions.filter((p) => p.side === "short");
  }, [filteredPositions]);

  const handleCopyTickers = () => {
    const text = `SHKRELI LONGS:\n${SHKRELI_LONG_SYMBOLS.join(", ")}\n\nSHKRELI SHORTS:\n${SHKRELI_SHORT_SYMBOLS.join(", ")}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Тикеры скопированы в буфер обмена");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const header = "Тикер,Сторона,Компания,Сектор,Цена (USD),Изм за день %,P&L позиции %\n";
    const rows = enrichedPositions
      .map(
        (p) =>
          `"${p.symbol}","${p.side.toUpperCase()}","${p.companyName}","${p.category || ""}","${p.price.toFixed(2)}","${p.changePct.toFixed(2)}%","${p.effectivePnlPct.toFixed(2)}%"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `shkreli_positions_radar_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV файл успешно выгружен");
  };

  const handleAddAllToWatchlist = (side: "long" | "short") => {
    const symbols = side === "long" ? SHKRELI_LONG_SYMBOLS : SHKRELI_SHORT_SYMBOLS;
    let added = 0;
    for (const sym of symbols) {
      if (!watchlistSymbols.includes(sym)) {
        addWatchlist(sym);
        added++;
      }
    }
    toast.success(`Добавлено ${added} тикеров ${side.toUpperCase()} в ваш список наблюдения`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface via-surface to-bg p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E37400]/10 px-2.5 py-1 text-xs font-semibold text-[#E37400]">
                <Crosshair className="size-3.5" />
                Shkreli Market Positions
              </span>
              <span className="rounded-md border border-border bg-bg/50 px-2 py-0.5 text-[11px] font-medium text-muted">
                35 активов: 17 Longs · 18 Shorts
              </span>
              {quotesQuery.isFetching && (
                <span className="flex items-center gap-1 text-[11px] text-[#4285F4]">
                  <RefreshCw className="size-3 animate-spin" />
                  обновление...
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
              Радар позиций Мартина Шкрели (Long / Short)
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-muted">
              Интерактивный мониторинг позиций биотех- и квантового портфеля с анализом цен, спарклайнов и эффективной доходности шорт- и лонг-корзин.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => quotesQuery.refetch()}
              disabled={quotesQuery.isFetching}
              className="gap-1.5 text-xs bg-surface"
              title="Обновить котировки"
            >
              <RefreshCw className={cn("size-3.5", quotesQuery.isFetching && "animate-spin")} />
              <span>Обновить</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyTickers}
              className="gap-1.5 text-xs bg-surface"
              title="Скопировать тикеры"
            >
              {isCopied ? <Check className="size-3.5 text-up" /> : <Copy className="size-3.5" />}
              <span>{isCopied ? "Скопировано" : "Тикеры"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="gap-1.5 text-xs bg-surface"
              title="Выгрузить в CSV"
            >
              <Download className="size-3.5" />
              <span>CSV</span>
            </Button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Long Basket */}
          <div className="rounded-xl border border-up/20 bg-up-soft/40 p-3.5 sm:p-4 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-up flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-up" />
                LONG КОРЗИНА (17)
              </span>
              <span className="text-[11px] text-muted">
                {basketStats.longGainers} 🟢 / {basketStats.longLosers} 🔴
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums tracking-tight",
                  basketStats.longAvgPct >= 0 ? "text-up" : "text-down",
                )}
              >
                {formatPercent(basketStats.longAvgPct, 2)}
              </span>
              <span className="text-[11px] text-muted font-medium">среднее за день</span>
            </div>
            {basketStats.topLong && (
              <div className="mt-2 flex items-center justify-between text-[11px] border-t border-up/10 pt-2">
                <span className="text-muted">Топ лонг:</span>
                <span className="font-semibold text-up">
                  {basketStats.topLong.symbol} ({formatPercent(basketStats.topLong.changePct, 1)})
                </span>
              </div>
            )}
          </div>

          {/* Card 2: Short Basket */}
          <div className="rounded-xl border border-down/20 bg-down-soft/40 p-3.5 sm:p-4 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-down flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-down" />
                SHORT КОРЗИНА (18)
              </span>
              <span className="text-[11px] text-muted">
                {basketStats.shortWinners} 🟢 / {basketStats.shortLosers} 🔴
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums tracking-tight",
                  basketStats.shortEffectivePnlPct >= 0 ? "text-up" : "text-down",
                )}
              >
                {formatPercent(basketStats.shortEffectivePnlPct, 2)}
              </span>
              <span className="text-[11px] text-muted font-medium">P&L шорта</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] border-t border-down/10 pt-2">
              <span className="text-muted">Цена акций:</span>
              <span className="font-medium text-muted">
                {formatPercent(basketStats.shortStockAvgPct, 2)} (спад = плюс)
              </span>
            </div>
          </div>

          {/* Card 3: L/S Spread */}
          <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-accent flex items-center gap-1.5">
                <Scale className="size-3.5" />
                L/S СПРЕД (ALPHA)
              </span>
              <span className="text-[10px] uppercase font-bold text-muted bg-bg px-1.5 py-0.5 rounded">
                Синтетика
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums tracking-tight",
                  basketStats.netLsSpread >= 0 ? "text-up" : "text-down",
                )}
              >
                {formatPercent(basketStats.netLsSpread, 2)}
              </span>
              <span className="text-[11px] text-muted font-medium">чистый спред дня</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] border-t border-border pt-2 text-muted">
              <span>Статус:</span>
              <span className="font-semibold text-fg">
                {basketStats.netLsSpread >= 0 ? "Лонги опережают шорт" : "Шорты опережают лонг"}
              </span>
            </div>
          </div>

          {/* Card 4: Quick Import & Status */}
          <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-muted">
                <span>Импорт в Вочлист</span>
                <span className="text-[11px] font-mono text-fg">{basketStats.loadedCount}/35 онлайн</span>
              </div>
              <p className="mt-1 text-[11px] text-muted leading-tight">
                Добавить тикеры корзин в левую панель наблюдения:
              </p>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddAllToWatchlist("long")}
                className="flex-1 text-[11px] h-7 border-up/30 text-up hover:bg-up-soft"
              >
                + Все Longs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddAllToWatchlist("short")}
                className="flex-1 text-[11px] h-7 border-down/30 text-down hover:bg-down-soft"
              >
                + Все Shorts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Sort, View Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-surface border border-border p-3 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <Input
            placeholder="Поиск по тикеру, компании или сектору..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs sm:text-sm h-9 bg-bg/50 border-border"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Side Filter */}
          <div className="flex rounded-lg border border-border bg-bg p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterSide("all")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors",
                filterSide === "all" ? "bg-surface font-semibold text-fg shadow-sm" : "text-muted hover:text-fg",
              )}
            >
              Все (35)
            </button>
            <button
              type="button"
              onClick={() => setFilterSide("long")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors flex items-center gap-1",
                filterSide === "long" ? "bg-surface font-semibold text-up shadow-sm" : "text-muted hover:text-fg",
              )}
            >
              <span className="size-1.5 rounded-full bg-up" />
              Longs (17)
            </button>
            <button
              type="button"
              onClick={() => setFilterSide("short")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors flex items-center gap-1",
                filterSide === "short" ? "bg-surface font-semibold text-down shadow-sm" : "text-muted hover:text-fg",
              )}
            >
              <span className="size-1.5 rounded-full bg-down" />
              Shorts (18)
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="h-9 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-fg focus:outline-none cursor-pointer"
          >
            <option value="pnl_desc">По P&L позиции (сначала плюс)</option>
            <option value="pnl_asc">По P&L позиции (сначала минус)</option>
            <option value="pct_desc">По росту цены акции (%)</option>
            <option value="pct_asc">По спаду цены акции (%)</option>
            <option value="symbol_asc">По тикеру (A → Z)</option>
            <option value="price_desc">По цене ($)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-border bg-bg p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode("columns")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors",
                viewMode === "columns" ? "bg-surface font-semibold text-fg shadow-sm" : "text-muted hover:text-fg",
              )}
              title="Две колонки Long / Short"
            >
              Колонки
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors",
                viewMode === "table" ? "bg-surface font-semibold text-fg shadow-sm" : "text-muted hover:text-fg",
              )}
              title="Табличный вид"
            >
              Таблица
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "columns" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN: LONGS */}
          {(filterSide === "all" || filterSide === "long") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-up text-white text-xs font-bold">
                    L
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-fg">LONGS (Длинные позиции)</h2>
                    <span className="text-[11px] text-muted">17 биотех/технологических лидеров</span>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full border",
                    basketStats.longAvgPct >= 0
                      ? "bg-up-soft text-up border-up/30"
                      : "bg-down-soft text-down border-down/30",
                  )}
                >
                  Корзина: {formatPercent(basketStats.longAvgPct, 2)}
                </span>
              </div>

              {longsFiltered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted bg-surface rounded-xl border border-dashed border-border">
                  Позиции Long не найдены по запросу "{search}"
                </div>
              ) : (
                <div className="space-y-2">
                  {longsFiltered.map((item) => (
                    <PositionCard
                      key={item.symbol}
                      item={item}
                      isInWatchlist={watchlistSymbols.includes(item.symbol)}
                      onAddWatchlist={() => addWatchlist(item.symbol)}
                      onSelectTicker={onSelectTicker}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RIGHT COLUMN: SHORTS */}
          {(filterSide === "all" || filterSide === "short") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-down text-white text-xs font-bold">
                    S
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-fg">SHORTS (Короткие позиции)</h2>
                    <span className="text-[11px] text-muted">18 переоцененных / спекулятивных бумаг</span>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full border",
                    basketStats.shortEffectivePnlPct >= 0
                      ? "bg-up-soft text-up border-up/30"
                      : "bg-down-soft text-down border-down/30",
                  )}
                >
                  P&L шорта: {formatPercent(basketStats.shortEffectivePnlPct, 2)}
                </span>
              </div>

              {shortsFiltered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted bg-surface rounded-xl border border-dashed border-border">
                  Позиции Short не найдены по запросу "{search}"
                </div>
              ) : (
                <div className="space-y-2">
                  {shortsFiltered.map((item) => (
                    <PositionCard
                      key={item.symbol}
                      item={item}
                      isInWatchlist={watchlistSymbols.includes(item.symbol)}
                      onAddWatchlist={() => addWatchlist(item.symbol)}
                      onSelectTicker={onSelectTicker}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-bg/60 text-muted font-medium">
                <tr>
                  <th className="py-2.5 px-3">Тикер</th>
                  <th className="py-2.5 px-3">Сторона</th>
                  <th className="py-2.5 px-3">Компания / Сектор</th>
                  <th className="py-2.5 px-3 text-right">Цена</th>
                  <th className="py-2.5 px-3 text-right">Изм. цены (1Д)</th>
                  <th className="py-2.5 px-3 text-right">P&L позиции</th>
                  <th className="py-2.5 px-3 text-center">Тренд (3M)</th>
                  <th className="py-2.5 px-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPositions.map((item) => {
                  const isLong = item.side === "long";
                  const pnlUp = item.effectivePnlPct >= 0;
                  return (
                    <tr
                      key={item.symbol}
                      className="hover:bg-bg/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectTicker(item.symbol)}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-fg flex items-center gap-2">
                        <span>{item.symbol}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            isLong ? "bg-up-soft text-up" : "bg-down-soft text-down",
                          )}
                        >
                          {item.side}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-fg truncate max-w-[200px]">{item.companyName}</div>
                        <div className="text-[10px] text-muted">{item.category}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-fg">
                        {item.price > 0 ? formatPrice(item.price, "$") : "—"}
                      </td>
                      <td
                        className={cn(
                          "py-2.5 px-3 text-right font-mono font-medium",
                          item.changePct >= 0 ? "text-up" : "text-down",
                        )}
                      >
                        {item.price > 0 ? formatPercent(item.changePct, 2) : "—"}
                      </td>
                      <td
                        className={cn(
                          "py-2.5 px-3 text-right font-mono font-bold",
                          pnlUp ? "text-up" : "text-down",
                        )}
                      >
                        {item.price > 0 ? formatPercent(item.effectivePnlPct, 2) : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-block">
                          <Sparkline values={item.spark} up={item.changePct >= 0} className="h-5 w-16" />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => onSelectTicker(item.symbol)}
                            title="Открыть график"
                          >
                            <ExternalLink className="size-3.5 text-muted hover:text-fg" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => addWatchlist(item.symbol)}
                            title="В список наблюдения"
                          >
                            {watchlistSymbols.includes(item.symbol) ? (
                              <Check className="size-3.5 text-up" />
                            ) : (
                              <Plus className="size-3.5 text-muted hover:text-fg" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual Position Card Component
function PositionCard({
  item,
  isInWatchlist,
  onAddWatchlist,
  onSelectTicker,
}: {
  item: ShkreliPosition & {
    price: number;
    changePct: number;
    changeUsd: number;
    effectivePnlPct: number;
    previousClose: number;
    dayHigh: number;
    dayLow: number;
    spark: number[];
    volume: number;
  };
  isInWatchlist: boolean;
  onAddWatchlist: () => void;
  onSelectTicker: (symbol: string) => void;
}) {
  const isLong = item.side === "long";
  const pnlUp = item.effectivePnlPct >= 0;
  const priceUp = item.changePct >= 0;

  // Day range progress %
  const rangeSpan = item.dayHigh - item.dayLow;
  const dayProgressPct =
    rangeSpan > 0 ? Math.min(100, Math.max(0, ((item.price - item.dayLow) / rangeSpan) * 100)) : 50;

  return (
    <div
      onClick={() => onSelectTicker(item.symbol)}
      className="group relative flex flex-col gap-2 rounded-xl border border-border bg-surface p-3.5 transition-all duration-150 hover:border-border-strong hover:shadow-sm cursor-pointer"
    >
      {/* Top line: Symbol, badges, price */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
              isLong ? "bg-up-soft text-up border border-up/20" : "bg-down-soft text-down border border-down/20",
            )}
          >
            {item.side}
          </span>
          <div>
            <span className="font-mono text-base font-bold text-fg group-hover:text-accent transition-colors">
              {item.symbol}
            </span>
            <div className="text-[11px] text-muted line-clamp-1 max-w-[190px]">
              {item.companyName}
            </div>
          </div>
        </div>

        {/* Price & PnL badges */}
        <div className="text-right">
          <div className="font-mono text-base font-bold text-fg">
            {item.price > 0 ? formatPrice(item.price, "$") : "—"}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <span
              className={cn(
                "inline-flex items-center text-xs font-semibold tabular-nums",
                priceUp ? "text-up" : "text-down",
              )}
            >
              {priceUp ? (
                <TrendingUp className="mr-0.5 size-3 inline" />
              ) : (
                <TrendingDown className="mr-0.5 size-3 inline" />
              )}
              {item.price > 0 ? formatPercent(item.changePct, 2) : "—"}
            </span>

            {/* If Short: highlight position profit */}
            {!isLong && item.price > 0 && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded font-bold tabular-nums",
                  pnlUp ? "bg-up-soft text-up" : "bg-down-soft text-down",
                )}
                title="Эффективный результат короткой позиции (падение акции = прибыль)"
              >
                P&L {formatPercent(item.effectivePnlPct, 1)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle row: Category, Day Range & Sparkline */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/50 text-[11px] text-muted">
        <span className="truncate max-w-[140px] text-muted/80">{item.category || "Stock"}</span>

        <div className="flex items-center gap-2">
          {/* Mini Sparkline */}
          <Sparkline values={item.spark} up={priceUp} className="h-5 w-14" />

          {/* Quick Add to Watchlist */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddWatchlist();
            }}
            className={cn(
              "rounded p-1 text-muted hover:text-fg hover:bg-bg transition-colors",
              isInWatchlist && "text-up hover:text-up",
            )}
            title={isInWatchlist ? "Уже в вашем списке" : "Добавить в список наблюдения"}
          >
            {isInWatchlist ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Day range bar */}
      {item.price > 0 && item.dayHigh > item.dayLow && (
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted/80 pt-0.5">
          <span>{item.dayLow.toFixed(2)}</span>
          <div className="relative flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div
              className={cn("absolute top-0 bottom-0 rounded-full", priceUp ? "bg-up" : "bg-down")}
              style={{ width: `${dayProgressPct}%` }}
            />
          </div>
          <span>{item.dayHigh.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
