import { useMemo, useRef, useState } from "react";
import { formatAxisTick, formatChartDate, formatPrice } from "@/lib/format";
import type { ChartPoint, RangeId } from "@/lib/market-types";
import { cn } from "@/lib/utils";

type Props = {
  points: ChartPoint[];
  range: RangeId;
  currency: string;
  hint: number;
  up: boolean;
};

const VB = { w: 1000, h: 400 };
const PAD = { l: 8, r: 8, t: 12, b: 8 };

function yTicks(min: number, max: number, count = 4): number[] {
  if (!(max > min)) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

function xTicks(points: ChartPoint[], count = 5): ChartPoint[] {
  if (points.length === 0) return [];
  if (points.length <= count) return points;
  const step = (points.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => points[Math.round(i * step)]!);
}

export function PriceChart({ points, range, currency, hint, up }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const { min, max } = useMemo(() => {
    if (!points.length) return { min: 0, max: 1 };
    const vals = points.map((p) => p.c);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = (hi - lo) * 0.08 || Math.abs(hi) * 0.02 || 1;
    const nextMin = lo > 0 ? Math.max(0, lo - pad) : lo - pad;
    return { min: nextMin, max: hi + pad };
  }, [points]);

  const t0 = points[0]?.t ?? 0;
  const t1 = points.at(-1)?.t ?? 1;
  const tSpan = t1 - t0 || 1;
  const innerW = VB.w - PAD.l - PAD.r;
  const innerH = VB.h - PAD.t - PAD.b;

  const xOf = (t: number) => PAD.l + ((t - t0) / tSpan) * innerW;
  const yOf = (c: number) => PAD.t + ((max - c) / (max - min || 1)) * innerH;

  const linePath = useMemo(() => {
    if (points.length < 2) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"}${xOf(p.t).toFixed(1)} ${yOf(p.c).toFixed(1)}`)
      .join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, min, max, t0, tSpan]);

  const areaPath = linePath
    ? `${linePath} L${xOf(points.at(-1)!.t).toFixed(1)} ${(PAD.t + innerH).toFixed(1)} L${xOf(points[0]!.t).toFixed(1)} ${(PAD.t + innerH).toFixed(1)} Z`
    : "";

  const yTickVals = yTicks(min, max);
  const xTickVals = xTicks(points);
  const hover = hoverIdx != null ? points[hoverIdx] : null;

  function indexFromClientX(clientX: number): number | null {
    const el = wrapRef.current;
    if (!el || points.length < 2) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return null;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const t = t0 + ratio * tSpan;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < points.length; i++) {
      const d = Math.abs(points[i]!.t - t);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  }

  if (points.length < 2) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted">
        Недостаточно точек для графика
      </div>
    );
  }

  return (
    <div className={cn("flex h-full min-h-48 w-full flex-col", up ? "text-up" : "text-down")}>
      <div
        ref={wrapRef}
        className="relative min-h-0 flex-1 cursor-crosshair"
        onPointerMove={(e) => {
          const idx = indexFromClientX(e.clientX);
          if (idx != null) setHoverIdx(idx);
        }}
        onPointerDown={(e) => {
          const idx = indexFromClientX(e.clientX);
          if (idx != null) setHoverIdx(idx);
        }}
        onPointerLeave={() => setHoverIdx(null)}
      >
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          className="block h-full w-full"
          role="img"
          aria-label="График цены"
        >
          {yTickVals.map((v) => (
            <line
              key={v}
              x1={PAD.l}
              x2={PAD.l + innerW}
              y1={yOf(v)}
              y2={yOf(v)}
              className="stroke-border"
              strokeWidth={1}
            />
          ))}
          <path d={areaPath} fill="currentColor" opacity={0.22} />
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {hover && (
            <g>
              <line
                x1={xOf(hover.t)}
                x2={xOf(hover.t)}
                y1={PAD.t}
                y2={PAD.t + innerH}
                className="stroke-muted"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <circle
                cx={xOf(hover.t)}
                cy={yOf(hover.c)}
                r={5}
                className="fill-surface"
                stroke="currentColor"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        <div className="pointer-events-none absolute inset-y-0 -right-14 flex w-14 flex-col justify-between py-1 text-right text-xs tabular-nums text-muted">
          {[...yTickVals].reverse().map((v) => (
            <span key={v}>
              {new Intl.NumberFormat("ru-RU", {
                maximumFractionDigits: hint,
                minimumFractionDigits: 0,
              }).format(v)}
            </span>
          ))}
        </div>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-surface px-2.5 py-1.5 text-fg shadow-border"
            style={{
              left: `${(xOf(hover.t) / VB.w) * 100}%`,
              top: `${Math.max(10, (yOf(hover.c) / VB.h) * 100)}%`,
            }}
          >
            <div className="text-sm font-medium tabular-nums">
              {formatPrice(hover.c, currency, hint)}
            </div>
            <div className="text-xs text-muted">{formatChartDate(hover.t, range)}</div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-1 text-xs text-muted">
        {xTickVals.map((p) => (
          <span key={p.t}>{formatAxisTick(p.t, range)}</span>
        ))}
      </div>
    </div>
  );
}
