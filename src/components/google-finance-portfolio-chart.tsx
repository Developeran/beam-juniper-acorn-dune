import { useMemo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Layers,
  GitCompare,
  Loader2,
} from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/format";
import {
  getPortfolioHistoricalChart,
  type PortfolioChartPoint,
} from "@/lib/market";
import type { RangeId } from "@/lib/market-types";
import type { PortfolioHolding } from "@/lib/google-sheets";
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

export function GoogleFinancePortfolioChart({
  portfolioName,
  totalValue,
  totalCost,
  formationDate,
  benchmarkReturnPct = 0.92,
  holdings = [],
}: {
  portfolioName: string;
  totalValue: number;
  totalCost: number;
  formationDate?: string;
  benchmarkReturnPct?: number;
  holdings?: PortfolioHolding[];
}) {
  const [selectedRange, setSelectedRange] = useState<RangeId>("1y");
  const [compareBenchmark, setCompareBenchmark] = useState(false);
  const [chartType, setChartType] = useState<"area" | "line">("area");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const isAllAssets = portfolioName.toLowerCase().includes("все активы");

  // Prepare input maps for real query with stable symbolsKey
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
  const { data: chartData, isLoading, isFetching } = useQuery({
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
    enabled: queryPayload.symbols.length > 0,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  // Effective points from real API
  const points: PortfolioChartPoint[] = useMemo(() => {
    if (chartData?.points && chartData.points.length >= 2) {
      return chartData.points;
    }
    return [];
  }, [chartData]);

  // Chart coordinate math
  const VB = { w: 900, h: 320 };
  const PAD = { l: 20, r: 25, t: 25, b: 35 };

  const values = points.map((p) => p.value);
  if (compareBenchmark) {
    points.forEach((p) => {
      if (p.benchmarkValue) values.push(p.benchmarkValue);
    });
  }

  const minVal = Math.min(...values) * 0.98;
  const maxVal = Math.max(...values) * 1.02;
  const valSpan = maxVal - minVal || 1;

  const innerW = VB.w - PAD.l - PAD.r;
  const innerH = VB.h - PAD.t - PAD.b;

  const xOf = (idx: number) => PAD.l + (idx / (points.length - 1 || 1)) * innerW;
  const yOf = (val: number) => PAD.t + ((maxVal - val) / valSpan) * innerH;

  // Main line path
  const linePath = useMemo(() => {
    if (points.length < 2) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(i).toFixed(1)} ${yOf(p.value).toFixed(1)}`)
      .join(" ");
  }, [points, minVal, maxVal]);

  // Area fill path
  const areaPath = useMemo(() => {
    if (!linePath || points.length < 2) return "";
    const lastX = xOf(points.length - 1).toFixed(1);
    const firstX = xOf(0).toFixed(1);
    const bottomY = (PAD.t + innerH).toFixed(1);
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePath, points]);

  // Benchmark comparison line
  const benchmarkLinePath = useMemo(() => {
    if (!compareBenchmark || points.length < 2) return "";
    return points
      .map((p, i) => {
        const val = p.benchmarkValue ?? p.value;
        return `${i === 0 ? "M" : "L"} ${xOf(i).toFixed(1)} ${yOf(val).toFixed(1)}`;
      })
      .join(" ");
  }, [points, compareBenchmark, minVal, maxVal]);

  // Active hover tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * (points.length - 1));
    setHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const activeValue = activePoint ? activePoint.value : totalValue;

  // Dynamic returns for the selected range
  const rangeStartVal = chartData?.startValue || points[0]?.value || totalCost;
  const rangeChange = activeValue - rangeStartVal;
  const rangeChangePct = rangeStartVal > 0 ? (rangeChange / rangeStartVal) * 100 : 0;
  const isUp = rangeChange >= 0;

  const formattedActiveDate = useMemo(() => {
    if (!activePoint?.t) return "11 сент., 18:00 UTC";
    return formatTooltipDate(activePoint.t, selectedRange);
  }, [activePoint, selectedRange]);

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-7 shadow-sm transition-all"
    >
      {/* 1. Header matching Google Finance screenshot */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-1.5 font-medium">
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
            {isFetching ? (
              <span className="flex items-center gap-1 text-[11px] text-accent">
                <Loader2 className="size-3 animate-spin" />
                Обновление котировок...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] text-muted">
                <span className="size-2 rounded-full bg-up animate-pulse" />
                Google Finance Live
              </span>
            )}
          </div>
        </div>

        {/* Portfolio Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
          {portfolioName}
        </h2>

        {/* Big Bold Portfolio Valuation + Colored Range Return Badge */}
        <div className="flex flex-wrap items-baseline gap-3 pt-1">
          <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-fg">
            ${formatNumber(activeValue, 2)}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm sm:text-base font-bold font-mono px-2.5 py-0.5 rounded-md transition-colors",
              isUp ? "bg-up-soft text-up" : "bg-down-soft text-down",
            )}
          >
            {isUp ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            {isUp ? "+" : "−"}{Math.abs(rangeChangePct).toFixed(2)}% (
            {isUp ? "+" : "−"}${formatNumber(Math.abs(rangeChange), 0)}) {selectedRange.toUpperCase()}
          </span>
        </div>

        <div className="text-xs text-muted">
          {formattedActiveDate} · USD ·{" "}
          <span className="text-fg font-medium">Вложено: ${formatNumber(totalCost, 0)}</span>
        </div>
      </div>

      {/* 2. Controls Toolbar (Area chart, Compare with ACWI) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-y border-border/60 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart type toggle */}
          <button
            type="button"
            onClick={() => setChartType(chartType === "area" ? "line" : "area")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-bg/60 px-3 py-1.5 text-xs font-medium text-fg hover:bg-bg transition-colors"
          >
            <Layers className="size-3.5 text-[#1a73e8]" />
            <span>{chartType === "area" ? "Диаграмма с областями" : "Линейный график"}</span>
            <ChevronDown className="size-3 text-muted" />
          </button>

          {/* Compare with Benchmark */}
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
        </div>

        {compareBenchmark && (
          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="flex items-center gap-1">
              <span className="h-0.5 w-3 bg-[#1a73e8]" />
              <span className="font-medium text-fg">{portfolioName}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-0.5 w-3 bg-[#f59e0b] stroke-dasharray" />
              <span>Бенчмарк ACWI (+{benchmarkReturnPct}%)</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. SVG Area Vector Chart */}
      <div className="relative mt-4 h-64 sm:h-72 w-full">
        {points.length < 2 ? (
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

            {/* Area Fill */}
            {chartType === "area" && areaPath && (
              <path d={areaPath} fill="url(#gfAreaGradient)" />
            )}

            {/* Benchmark Line (ACWI) */}
            {compareBenchmark && benchmarkLinePath && (
              <path
                d={benchmarkLinePath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity="0.85"
              />
            )}

            {/* Main Portfolio Curve */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#1a73e8"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Current Rightmost Active Dot */}
            {points.length > 0 && hoverIndex === null && (
              <circle
                cx={xOf(points.length - 1)}
                cy={yOf(points[points.length - 1]!.value)}
                r="4.5"
                fill="#1a73e8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            )}

            {/* Crosshair Cursor on Hover */}
            {hoverIndex !== null && (
              <g>
                <line
                  x1={xOf(hoverIndex)}
                  y1={PAD.t}
                  x2={xOf(hoverIndex)}
                  y2={PAD.t + innerH}
                  stroke="#1a73e8"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={xOf(hoverIndex)}
                  cy={yOf(points[hoverIndex]!.value)}
                  r="5"
                  fill="#1a73e8"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* X Axis Date Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
              const idx = Math.round(f * (points.length - 1));
              const p = points[idx];
              if (!p?.t) return null;
              const label = formatXAxisLabel(p.t, selectedRange);
              return (
                <text
                  key={i}
                  x={xOf(idx)}
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
          </svg>
        )}

        {/* Hover Tooltip Card */}
        {hoverIndex !== null && activePoint && (
          <div
            className="pointer-events-none absolute -top-4 rounded-lg border border-border bg-surface/95 px-3 py-1.5 shadow-md backdrop-blur-sm transition-all"
            style={{
              left: `${Math.max(10, Math.min(85, (hoverIndex / (points.length - 1)) * 100))}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-[11px] text-muted">{formattedActiveDate}</div>
            <div className="font-mono text-xs font-bold text-fg">
              ${formatNumber(activePoint.value, 2)}
            </div>
            {activePoint.benchmarkValue && (
              <div className="text-[10px] text-amber-600 font-mono">
                ACWI: ${formatNumber(activePoint.benchmarkValue, 0)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Google Finance Time Range Pill Bar (Active real timeframe selector) */}
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
    </div>
  );
}
