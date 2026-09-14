import { useMemo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Layers,
  GitCompare,
  Loader2,
  FileSpreadsheet,
  Activity,
  Calendar,
  Sparkles,
} from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/format";
import {
  getPortfolioHistoricalChart,
  type PortfolioChartPoint,
} from "@/lib/market";
import type { RangeId } from "@/lib/market-types";
import {
  DEFAULT_SHEET_WATCHLIST_POINTS,
  type PortfolioHolding,
  type SheetWatchlistPoint,
} from "@/lib/google-sheets";
import { cn } from "@/lib/utils";

const RANGES: { id: RangeId; label: string; periodLabel: string }[] = [
  { id: "1d", label: "1Д", periodLabel: "за день" },
  { id: "5d", label: "5ДН", periodLabel: "за 5 дней" },
  { id: "1mo", label: "1МЕС", periodLabel: "за месяц" },
  { id: "6mo", label: "6МЕС", periodLabel: "за 6 месяцев" },
  { id: "ytd", label: "С1ЯН", periodLabel: "с 1 января" },
  { id: "1y", label: "1ГОД", periodLabel: "за 1 год" },
  { id: "5y", label: "5ЛЕТ", periodLabel: "за 5 лет" },
  { id: "max", label: "МАКС", periodLabel: "за всё время" },
];

function formatXAxisLabel(t: number, range: RangeId): string {
  const d = new Date(t);
  if (range === "1d") {
    return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  }
  if (range === "5d") {
    const weekday = d.toLocaleDateString("ru-RU", { weekday: "short" });
    const day = d.getDate();
    return `${weekday} ${day}`;
  }
  if (range === "1mo" || range === "6mo" || range === "ytd" || range === "1y") {
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  }
  return d.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" });
}

function formatTooltipDate(t: number, range: RangeId): string {
  const d = new Date(t);
  if (range === "1d" || range === "5d") {
    return d.toLocaleString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSheetDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function formatSheetDateFull(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function GoogleFinancePortfolioChart({
  portfolioName,
  totalValue,
  totalCost,
  formationDate,
  benchmarkReturnPct = 0.92,
  holdings = [],
  watchlistHistory = DEFAULT_SHEET_WATCHLIST_POINTS,
}: {
  portfolioName: string;
  totalValue: number;
  totalCost: number;
  formationDate?: string;
  benchmarkReturnPct?: number;
  holdings?: PortfolioHolding[];
  watchlistHistory?: SheetWatchlistPoint[];
}) {
  const [dataMode, setDataMode] = useState<"watchlist_sheet" | "live">("watchlist_sheet");
  const [selectedRange, setSelectedRange] = useState<RangeId>("1y");
  const [compareBenchmark, setCompareBenchmark] = useState(true);
  const [chartType, setChartType] = useState<"area" | "line">("area");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const isAllAssets = portfolioName.toLowerCase().includes("все активы");

  // Prepare input maps for real query with stable symbolsKey (Live Yahoo Finance)
  const queryPayload = useMemo(() => {
    const symbols = Array.from(new Set(holdings.map((h) => h.symbol).filter(Boolean))).sort();
    const sharesMap: Record<string, number> = {};
    const costPricesMap: Record<string, number> = {};

    for (const h of holdings) {
      sharesMap[h.symbol] = (sharesMap[h.symbol] || 0) + h.shares;
      costPricesMap[h.symbol] = h.costPrice;
    }

    return {
      symbols,
      symbolsKey: symbols.join(","),
      sharesMap,
      costPricesMap,
    };
  }, [holdings]);

  // Query real portfolio historical data from Yahoo Finance
  const { data: chartData, isFetching } = useQuery({
    queryKey: ["portfolio-chart", queryPayload.symbolsKey, selectedRange, compareBenchmark],
    queryFn: () =>
      getPortfolioHistoricalChart({
        data: {
          symbols: queryPayload.symbols,
          sharesMap: queryPayload.sharesMap,
          costPricesMap: queryPayload.costPricesMap,
          range: selectedRange,
          includeBenchmark: compareBenchmark,
        },
      }),
    enabled: queryPayload.symbols.length > 0 && dataMode === "live",
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  // Effective points from real API
  const livePoints: PortfolioChartPoint[] = useMemo(() => {
    if (chartData?.points && chartData.points.length >= 2) {
      return chartData.points;
    }
    return [];
  }, [chartData]);

  // Sheet Watchlist points
  const sheetPoints = useMemo(() => {
    return watchlistHistory && watchlistHistory.length > 0
      ? watchlistHistory
      : DEFAULT_SHEET_WATCHLIST_POINTS;
  }, [watchlistHistory]);

  // Chart coordinate math constants
  const VB = { w: 900, h: 320 };
  const PAD = { l: 20, r: 25, t: 25, b: 35 };
  const innerW = VB.w - PAD.l - PAD.r;
  const innerH = VB.h - PAD.t - PAD.b;

  // Coordinate mapping for WATCHLIST SHEET mode
  const sheetValues = useMemo(() => {
    return sheetPoints.flatMap((p) => [p.mainPortfolio, p.modelPortfolio, p.benchmark]);
  }, [sheetPoints]);

  const minSheetVal = Math.min(...sheetValues) * 0.98;
  const maxSheetVal = Math.max(...sheetValues) * 1.02;
  const sheetValSpan = maxSheetVal - minSheetVal || 1;

  const xSheet = (idx: number) => PAD.l + (idx / (sheetPoints.length - 1 || 1)) * innerW;
  const ySheet = (val: number) => PAD.t + ((maxSheetVal - val) / sheetValSpan) * innerH;

  const sheetMainLine = useMemo(() => {
    if (sheetPoints.length < 2) return "";
    return sheetPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xSheet(i).toFixed(1)} ${ySheet(p.mainPortfolio).toFixed(1)}`)
      .join(" ");
  }, [sheetPoints, minSheetVal, maxSheetVal]);

  const sheetModelLine = useMemo(() => {
    if (sheetPoints.length < 2) return "";
    return sheetPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xSheet(i).toFixed(1)} ${ySheet(p.modelPortfolio).toFixed(1)}`)
      .join(" ");
  }, [sheetPoints, minSheetVal, maxSheetVal]);

  const sheetBenchLine = useMemo(() => {
    if (sheetPoints.length < 2) return "";
    return sheetPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xSheet(i).toFixed(1)} ${ySheet(p.benchmark).toFixed(1)}`)
      .join(" ");
  }, [sheetPoints, minSheetVal, maxSheetVal]);

  const sheetMainArea = useMemo(() => {
    if (!sheetMainLine || sheetPoints.length < 2) return "";
    const lastX = xSheet(sheetPoints.length - 1).toFixed(1);
    const firstX = xSheet(0).toFixed(1);
    const bottomY = (PAD.t + innerH).toFixed(1);
    return `${sheetMainLine} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [sheetMainLine, sheetPoints]);

  // Coordinate mapping for LIVE YAHOO mode
  const liveValues = useMemo(() => {
    const vals = livePoints.map((p) => p.value);
    if (compareBenchmark) {
      livePoints.forEach((p) => {
        if (p.benchmarkValue) vals.push(p.benchmarkValue);
      });
    }
    return vals;
  }, [livePoints, compareBenchmark]);

  const minLiveVal = Math.min(...(liveValues.length ? liveValues : [1])) * 0.98;
  const maxLiveVal = Math.max(...(liveValues.length ? liveValues : [1])) * 1.02;
  const liveValSpan = maxLiveVal - minLiveVal || 1;

  const xLive = (idx: number) => PAD.l + (idx / (livePoints.length - 1 || 1)) * innerW;
  const yLive = (val: number) => PAD.t + ((maxLiveVal - val) / liveValSpan) * innerH;

  const liveMainLine = useMemo(() => {
    if (livePoints.length < 2) return "";
    return livePoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xLive(i).toFixed(1)} ${yLive(p.value).toFixed(1)}`)
      .join(" ");
  }, [livePoints, minLiveVal, maxLiveVal]);

  const liveAreaPath = useMemo(() => {
    if (!liveMainLine || livePoints.length < 2) return "";
    const lastX = xLive(livePoints.length - 1).toFixed(1);
    const firstX = xLive(0).toFixed(1);
    const bottomY = (PAD.t + innerH).toFixed(1);
    return `${liveMainLine} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [liveMainLine, livePoints]);

  const liveBenchLine = useMemo(() => {
    if (!compareBenchmark || livePoints.length < 2) return "";
    return livePoints
      .map((p, i) => {
        const val = p.benchmarkValue ?? p.value;
        return `${i === 0 ? "M" : "L"} ${xLive(i).toFixed(1)} ${yLive(val).toFixed(1)}`;
      })
      .join(" ");
  }, [livePoints, compareBenchmark, minLiveVal, maxLiveVal]);

  // Active hover tracking
  const currentCount = dataMode === "watchlist_sheet" ? sheetPoints.length : livePoints.length;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (currentCount < 2) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * (currentCount - 1));
    setHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Active point calculations
  const activeSheetPoint =
    hoverIndex !== null && hoverIndex < sheetPoints.length
      ? sheetPoints[hoverIndex]!
      : sheetPoints[sheetPoints.length - 1]!;

  const activeLivePoint =
    hoverIndex !== null && hoverIndex < livePoints.length
      ? livePoints[hoverIndex]!
      : livePoints[livePoints.length - 1];

  const activeLiveValue = activeLivePoint ? activeLivePoint.value : totalValue;
  const rangeStartVal = chartData?.startValue || livePoints[0]?.value || totalCost;
  const liveRangeChange = activeLiveValue - rangeStartVal;
  const liveRangeChangePct = rangeStartVal > 0 ? (liveRangeChange / rangeStartVal) * 100 : 0;
  const liveIsUp = liveRangeChange >= 0;

  // Sheet calculation
  const sheetMainChange = activeSheetPoint.mainPortfolio - 100;
  const sheetMainChangePct = sheetMainChange;
  const sheetIsUp = sheetMainChangePct >= 0;
  const sheetAlpha = activeSheetPoint.modelPortfolio - activeSheetPoint.mainPortfolio;

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-7 shadow-sm transition-all"
    >
      {/* 1. Header with Breadcrumbs & Data Source Indicator */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-1.5 font-medium flex-wrap">
            <span>Главная</span>
            <span>/</span>
            <span className="text-fg font-semibold">{portfolioName}</span>
            {!isAllAssets && formationDate && (
              <span className="ml-1 rounded bg-bg px-2 py-0.5 text-[11px] font-mono text-muted">
                сформирован от {formationDate}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {dataMode === "watchlist_sheet" ? (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#0F9D58] bg-[#0F9D58]/10 px-2.5 py-1 rounded-full border border-[#0F9D58]/20">
                <FileSpreadsheet className="size-3.5" />
                Вкладка «Watchlist» (Google Таблица)
              </span>
            ) : isFetching ? (
              <span className="flex items-center gap-1 text-[11px] text-accent">
                <Loader2 className="size-3 animate-spin" />
                Обновление Yahoo котировок...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] text-muted">
                <span className="size-2 rounded-full bg-up animate-pulse" />
                Google Finance / Yahoo Live
              </span>
            )}
          </div>
        </div>

        {/* Portfolio Title & Mode Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
            {dataMode === "watchlist_sheet"
              ? "Сравнительная динамика (вкладка «Watchlist»)"
              : portfolioName}
          </h2>
          <span className="text-xs text-muted">
            {dataMode === "watchlist_sheet"
              ? "Период: 16.06.2026 – 16.07.2026 · База = 100.00"
              : `Вложено: $${formatNumber(totalCost, 0)}`}
          </span>
        </div>

        {/* Valuation & Return Metrics */}
        {dataMode === "watchlist_sheet" ? (
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-fg">
                {activeSheetPoint.mainPortfolio.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-muted font-mono">
                (база 100.00 на 16.06)
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-1 text-sm sm:text-base font-bold font-mono px-2.5 py-0.5 rounded-md transition-colors",
                  sheetIsUp ? "bg-up-soft text-up" : "bg-down-soft text-down",
                )}
              >
                {sheetIsUp ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                {sheetIsUp ? "+" : "−"}{Math.abs(sheetMainChangePct).toFixed(2)}% (Основной)
              </span>
            </div>

            {/* Interactive Comparative Pill Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#1a73e8]/30 bg-[#1a73e8]/10 px-2.5 py-1 text-[#1a73e8] font-medium">
                <span className="size-2 rounded-full bg-[#1a73e8]" />
                Основной портфель:{" "}
                <strong className="font-mono">{activeSheetPoint.mainPortfolio.toFixed(2)}</strong> (
                {activeSheetPoint.mainPortfolio >= 100 ? "+" : ""}
                {(activeSheetPoint.mainPortfolio - 100).toFixed(2)}%)
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#34a853]/30 bg-[#34a853]/10 px-2.5 py-1 text-[#34a853] font-medium">
                <span className="size-2 rounded-full bg-[#34a853]" />
                Модельный портфель:{" "}
                <strong className="font-mono">{activeSheetPoint.modelPortfolio.toFixed(2)}</strong> (
                {activeSheetPoint.modelPortfolio >= 100 ? "+" : ""}
                {(activeSheetPoint.modelPortfolio - 100).toFixed(2)}%)
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-700 dark:text-amber-300 font-medium">
                <span className="size-2 rounded-full bg-amber-500" />
                Бенчмарк MSCI ACWI:{" "}
                <strong className="font-mono">{activeSheetPoint.benchmark.toFixed(2)}</strong> (
                {activeSheetPoint.benchmark >= 100 ? "+" : ""}
                {(activeSheetPoint.benchmark - 100).toFixed(2)}%)
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-purple-700 dark:text-purple-300 font-medium">
                <Sparkles className="size-3" />
                Альфа (Модельный vs Основной):{" "}
                <strong className="font-mono">
                  {sheetAlpha >= 0 ? "+" : ""}
                  {sheetAlpha.toFixed(2)}%
                </strong>
              </span>
            </div>

            <div className="text-xs text-muted pt-0.5">
              {formatSheetDateFull(activeSheetPoint.date)} · Исторические данные из вашей Google
              Таблицы
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-fg">
                ${formatNumber(activeLiveValue, 2)}
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-1 text-sm sm:text-base font-bold font-mono px-2.5 py-0.5 rounded-md transition-colors",
                  liveIsUp ? "bg-up-soft text-up" : "bg-down-soft text-down",
                )}
              >
                {liveIsUp ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                {liveIsUp ? "+" : "−"}{Math.abs(liveRangeChangePct).toFixed(2)}% (
                {liveIsUp ? "+" : "−"}${formatNumber(Math.abs(liveRangeChange), 0)}){" "}
                {selectedRange.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-muted">
              {activeLivePoint?.t ? formatTooltipDate(activeLivePoint.t, selectedRange) : "Сегодня"} · USD
            </div>
          </div>
        )}
      </div>

      {/* 2. Controls Toolbar: Switcher (Watchlist Sheet vs Live Yahoo) + Chart Type */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-3">
        {/* DATA SOURCE TOGGLE (Primary Google Sheet Watchlist vs Live Yahoo) */}
        <div className="flex items-center rounded-xl bg-bg/80 p-1 border border-border">
          <button
            type="button"
            onClick={() => setDataMode("watchlist_sheet")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              dataMode === "watchlist_sheet"
                ? "bg-surface text-[#0F9D58] shadow-xs border border-border"
                : "text-muted hover:text-fg",
            )}
          >
            <FileSpreadsheet className="size-3.5" />
            <span>📊 Watchlist из таблицы (16.06 – 16.07)</span>
            <span className="rounded-full bg-[#0F9D58]/15 px-1.5 py-0.2 text-[10px] font-mono text-[#0F9D58]">
              {sheetPoints.length} дн.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setDataMode("live")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              dataMode === "live"
                ? "bg-surface text-[#1a73e8] shadow-xs border border-border"
                : "text-muted hover:text-fg",
            )}
          >
            <Activity className="size-3.5" />
            <span>📈 Live котировки (Yahoo)</span>
          </button>
        </div>

        {/* Secondary options: Area vs Line, Benchmark toggle in Live */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setChartType(chartType === "area" ? "line" : "area")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-bg/60 px-3 py-1.5 text-xs font-medium text-fg hover:bg-bg transition-colors cursor-pointer"
          >
            <Layers className="size-3.5 text-[#1a73e8]" />
            <span>{chartType === "area" ? "С областями" : "Линейный"}</span>
            <ChevronDown className="size-3 text-muted" />
          </button>

          {dataMode === "live" && (
            <button
              type="button"
              onClick={() => setCompareBenchmark(!compareBenchmark)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                compareBenchmark
                  ? "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold"
                  : "border-border bg-bg/60 text-muted hover:text-fg hover:bg-bg",
              )}
            >
              <GitCompare className="size-3.5" />
              <span>Сравнить с ACWI</span>
              <span className="text-[10px] opacity-75 font-mono">
                ({benchmarkReturnPct > 0 ? "+" : ""}{benchmarkReturnPct}%)
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 3. SVG Multi-Series Vector Chart */}
      <div className="relative mt-4 h-64 sm:h-72 w-full">
        {dataMode === "live" && livePoints.length < 2 ? (
          <div className="flex size-full flex-col items-center justify-center rounded-xl bg-bg/40 text-muted border border-border/50">
            <Loader2 className="size-6 animate-spin text-[#1a73e8] mb-2" />
            <span className="text-xs font-medium text-fg">
              Загрузка истории портфеля {RANGES.find((r) => r.id === selectedRange)?.periodLabel}...
            </span>
            <span className="text-[11px] text-muted mt-0.5">
              Сбор котировок активов и расчет кривой доходности
            </span>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            className="size-full overflow-visible select-none"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {/* Google Finance Soft Blue Area Gradient */}
              <linearGradient id="gfAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.25" />
                <stop offset="70%" stopColor="#1a73e8" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#1a73e8" stopOpacity="0.00" />
              </linearGradient>

              {/* Watchlist Green Area Gradient */}
              <linearGradient id="gfModelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34a853" stopOpacity="0.20" />
                <stop offset="70%" stopColor="#34a853" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#34a853" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Vertical Guide Lines */}
            {[0.2, 0.4, 0.6, 0.8].map((fraction, i) => {
              const x = PAD.l + fraction * innerW;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={PAD.t}
                  x2={x}
                  y2={PAD.t + innerH}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
              );
            })}

            {/* --- WATCHLIST SHEET MODE RENDERING --- */}
            {dataMode === "watchlist_sheet" && (
              <>
                {/* 100.0 Baseline Horizon */}
                <line
                  x1={PAD.l}
                  y1={ySheet(100)}
                  x2={PAD.l + innerW}
                  y2={ySheet(100)}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />

                {/* Area Fill for Main Portfolio */}
                {chartType === "area" && sheetMainArea && (
                  <path d={sheetMainArea} fill="url(#gfAreaGradient)" />
                )}

                {/* Benchmark Curve (MSCI ACWI) - Dashed Amber */}
                {sheetBenchLine && (
                  <path
                    d={sheetBenchLine}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                    opacity="0.9"
                  />
                )}

                {/* Model Portfolio Curve - Green */}
                {sheetModelLine && (
                  <path
                    d={sheetModelLine}
                    fill="none"
                    stroke="#34a853"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Main Portfolio Curve - Blue */}
                {sheetMainLine && (
                  <path
                    d={sheetMainLine}
                    fill="none"
                    stroke="#1a73e8"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Static End Dots when not hovering */}
                {hoverIndex === null && (
                  <>
                    <circle
                      cx={xSheet(sheetPoints.length - 1)}
                      cy={ySheet(sheetPoints[sheetPoints.length - 1]!.mainPortfolio)}
                      r="4.5"
                      fill="#1a73e8"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={xSheet(sheetPoints.length - 1)}
                      cy={ySheet(sheetPoints[sheetPoints.length - 1]!.modelPortfolio)}
                      r="4.5"
                      fill="#34a853"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={xSheet(sheetPoints.length - 1)}
                      cy={ySheet(sheetPoints[sheetPoints.length - 1]!.benchmark)}
                      r="4"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </>
                )}

                {/* Crosshair Cursor on Hover */}
                {hoverIndex !== null && hoverIndex < sheetPoints.length && (
                  <g>
                    <line
                      x1={xSheet(hoverIndex)}
                      y1={PAD.t}
                      x2={xSheet(hoverIndex)}
                      y2={PAD.t + innerH}
                      stroke="#1a73e8"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    {/* Dots on all 3 curves */}
                    <circle
                      cx={xSheet(hoverIndex)}
                      cy={ySheet(sheetPoints[hoverIndex]!.mainPortfolio)}
                      r="5"
                      fill="#1a73e8"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle
                      cx={xSheet(hoverIndex)}
                      cy={ySheet(sheetPoints[hoverIndex]!.modelPortfolio)}
                      r="5"
                      fill="#34a853"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle
                      cx={xSheet(hoverIndex)}
                      cy={ySheet(sheetPoints[hoverIndex]!.benchmark)}
                      r="4.5"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* X-Axis Date Labels for Watchlist */}
                {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
                  const idx = Math.round(f * (sheetPoints.length - 1));
                  const p = sheetPoints[idx];
                  if (!p?.date) return null;
                  const label = formatSheetDateLabel(p.date);
                  return (
                    <text
                      key={i}
                      x={xSheet(idx)}
                      y={PAD.t + innerH + 18}
                      textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}
                      fontSize="11"
                      fill="#8f8e86"
                      fontFamily="sans-serif"
                    >
                      {label}
                    </text>
                  );
                })}
              </>
            )}

            {/* --- LIVE YAHOO MODE RENDERING --- */}
            {dataMode === "live" && (
              <>
                {chartType === "area" && liveAreaPath && (
                  <path d={liveAreaPath} fill="url(#gfAreaGradient)" />
                )}

                {compareBenchmark && liveBenchLine && (
                  <path
                    d={liveBenchLine}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    opacity="0.85"
                  />
                )}

                {liveMainLine && (
                  <path
                    d={liveMainLine}
                    fill="none"
                    stroke="#1a73e8"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {livePoints.length > 0 && hoverIndex === null && (
                  <circle
                    cx={xLive(livePoints.length - 1)}
                    cy={yLive(livePoints[livePoints.length - 1]!.value)}
                    r="4.5"
                    fill="#1a73e8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}

                {hoverIndex !== null && hoverIndex < livePoints.length && (
                  <g>
                    <line
                      x1={xLive(hoverIndex)}
                      y1={PAD.t}
                      x2={xLive(hoverIndex)}
                      y2={PAD.t + innerH}
                      stroke="#1a73e8"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={xLive(hoverIndex)}
                      cy={yLive(livePoints[hoverIndex]!.value)}
                      r="5"
                      fill="#1a73e8"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
                  const idx = Math.round(f * (livePoints.length - 1));
                  const p = livePoints[idx];
                  if (!p?.t) return null;
                  const label = formatXAxisLabel(p.t, selectedRange);
                  return (
                    <text
                      key={i}
                      x={xLive(idx)}
                      y={PAD.t + innerH + 18}
                      textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}
                      fontSize="11"
                      fill="#8f8e86"
                      fontFamily="sans-serif"
                    >
                      {label}
                    </text>
                  );
                })}
              </>
            )}
          </svg>
        )}

        {/* Hover Tooltip Card (Watchlist Sheet Mode) */}
        {dataMode === "watchlist_sheet" && hoverIndex !== null && activeSheetPoint && (
          <div
            className="pointer-events-none absolute -top-8 rounded-xl border border-border bg-surface/95 p-2.5 shadow-lg backdrop-blur-md transition-all z-20 min-w-[200px]"
            style={{
              left: `${Math.max(12, Math.min(82, (hoverIndex / (sheetPoints.length - 1)) * 100))}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-[11px] font-semibold text-fg border-b border-border/60 pb-1 mb-1.5 flex items-center gap-1.5">
              <Calendar className="size-3 text-muted" />
              {formatSheetDateFull(activeSheetPoint.date)}
            </div>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between gap-3 text-[#1a73e8]">
                <span>Основной:</span>
                <strong>
                  {activeSheetPoint.mainPortfolio.toFixed(2)} (
                  {activeSheetPoint.mainPortfolio >= 100 ? "+" : ""}
                  {(activeSheetPoint.mainPortfolio - 100).toFixed(2)}%)
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 text-[#34a853]">
                <span>Модельный:</span>
                <strong>
                  {activeSheetPoint.modelPortfolio.toFixed(2)} (
                  {activeSheetPoint.modelPortfolio >= 100 ? "+" : ""}
                  {(activeSheetPoint.modelPortfolio - 100).toFixed(2)}%)
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 text-amber-600 dark:text-amber-400">
                <span>MSCI ACWI:</span>
                <strong>
                  {activeSheetPoint.benchmark.toFixed(2)} (
                  {activeSheetPoint.benchmark >= 100 ? "+" : ""}
                  {(activeSheetPoint.benchmark - 100).toFixed(2)}%)
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 text-purple-600 dark:text-purple-300 pt-1 border-t border-border/40 text-[11px]">
                <span>Альфа Модель/Осн:</span>
                <strong>
                  {sheetAlpha >= 0 ? "+" : ""}
                  {sheetAlpha.toFixed(2)}%
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Hover Tooltip Card (Live Yahoo Mode) */}
        {dataMode === "live" && hoverIndex !== null && activeLivePoint && (
          <div
            className="pointer-events-none absolute -top-4 rounded-lg border border-border bg-surface/95 px-3 py-1.5 shadow-md backdrop-blur-sm transition-all"
            style={{
              left: `${Math.max(10, Math.min(85, (hoverIndex / (livePoints.length - 1)) * 100))}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-[11px] text-muted">
              {activeLivePoint.t ? formatTooltipDate(activeLivePoint.t, selectedRange) : ""}
            </div>
            <div className="font-mono text-xs font-bold text-fg">
              ${formatNumber(activeLivePoint.value, 2)}
            </div>
            {activeLivePoint.benchmarkValue && (
              <div className="text-[10px] text-amber-600 font-mono">
                ACWI: ${formatNumber(activeLivePoint.benchmarkValue, 0)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Bottom Controls */}
      {dataMode === "live" ? (
        <div className="mt-4 flex flex-wrap items-center justify-start gap-1 sm:gap-2 pt-2 border-t border-border/50">
          {RANGES.map((r) => {
            const active = selectedRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRange(r.id)}
                className={cn(
                  "relative flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                  active
                    ? "bg-[#e8f0fe] text-[#1967d2] font-semibold dark:bg-[#1a73e8]/20 dark:text-[#8ab4f8]"
                    : "text-muted hover:text-fg hover:bg-bg",
                )}
              >
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/50 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-[#0F9D58]" />
            <span>
              Показаны реальные котировки из таблицы <strong>Google Sheets (Watchlist)</strong>
            </span>
          </div>
          <div className="font-mono text-[11px] text-muted">
            Итог 16.07: Основной 93.21 · Модельный 95.71 · ACWI 99.38
          </div>
        </div>
      )}
    </div>
  );
}
