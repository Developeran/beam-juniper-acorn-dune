import { formatStat, formatVolume } from "@/lib/format";
import type { ChartPayload } from "@/lib/market-types";

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium tabular-nums text-fg">{value}</dd>
    </div>
  );
}

export function QuoteStats({ chart }: { chart: ChartPayload }) {
  const hint = chart.priceHint;
  const items = [
    { label: "Открытие", value: formatStat(chart.open, hint) },
    { label: "Максимум", value: formatStat(chart.dayHigh, hint) },
    { label: "Минимум", value: formatStat(chart.dayLow, hint) },
    { label: "Пред. закр.", value: formatStat(chart.previousClose, hint) },
    { label: "Объём", value: formatVolume(chart.volume) },
    { label: "52 нед. макс.", value: formatStat(chart.week52High, hint) },
    { label: "52 нед. мин.", value: formatStat(chart.week52Low, hint) },
    { label: "Валюта", value: chart.currency },
    { label: "Биржа", value: chart.exchangeLabel || chart.exchange },
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Cell key={item.label} label={item.label} value={item.value} />
      ))}
    </dl>
  );
}
