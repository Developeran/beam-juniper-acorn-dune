import { useState } from "react";
import { Search, LoaderCircle } from "lucide-react";
import { explainMove } from "@/lib/market";
import { formatPercent } from "@/lib/format";
import { displayTicker, type ChartPayload, type RangeSpec } from "@/lib/market-types";
import { cn } from "@/lib/utils";

export function WhyMoved({
  chart,
  range,
}: {
  chart: ChartPayload;
  range: RangeSpec;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const up = chart.rangeChangePct >= 0;
  const verb = up ? "выросли" : "упали";
  const ticker = displayTicker(chart.symbol);
  const label = `Почему акции ${ticker} ${verb} на ${formatPercent(Math.abs(chart.rangeChangePct)).replace("+", "").replace("−", "")}?`;

  async function run() {
    if (text) {
      setOpen((v) => !v);
      return;
    }
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const res = await explainMove({
        data: {
          symbol: chart.symbol,
          name: chart.longName || chart.name,
          rangeLabel: range.periodLabel,
          currency: chart.currency,
          start: chart.rangeStart,
          price: chart.price,
          changePct: chart.rangeChangePct,
          changeAbs: chart.rangeChange,
        },
      });
      if (res.ok) setText(res.text);
      else setError(res.error);
    } catch {
      setError("Не удалось получить объяснение");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={run}
        className={cn(
          "inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-left text-sm text-fg transition-colors duration-150 hover:bg-bg",
        )}
      >
        {loading ? (
          <LoaderCircle className="size-3.5 shrink-0 animate-spin text-muted" />
        ) : (
          <Search className="size-3.5 shrink-0 text-muted" />
        )}
        <span className="truncate">{label}</span>
      </button>
      {open && (text || error || loading) && (
        <div className="mt-3 rounded-xl bg-surface p-4 shadow-border">
          {loading && (
            <p className="text-sm text-muted">Собираем контекст по движению…</p>
          )}
          {error && <p className="text-sm text-down">{error}</p>}
          {text && (
            <p className="text-sm leading-relaxed text-fg">{text}</p>
          )}
        </div>
      )}
    </div>
  );
}
