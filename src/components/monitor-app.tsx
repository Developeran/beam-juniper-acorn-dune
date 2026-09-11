import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { List, Activity } from "lucide-react";
import { toast } from "sonner";
import { PriceChart } from "@/components/price-chart";
import { QuoteHeader } from "@/components/quote-header";
import { QuoteStats } from "@/components/quote-stats";
import { SearchBox } from "@/components/search-box";
import { WatchlistPanel } from "@/components/watchlist-panel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { getChart, getQuotes } from "@/lib/market";
import { formatPercent } from "@/lib/format";
import {
  DEFAULT_SELECTED,
  DEFAULT_SYMBOLS,
  displayTicker,
  RANGES,
  rangeById,
  type ChartPayload,
  type Quote,
  type RangeId,
} from "@/lib/market-types";
import { useWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

function sameSymbols(a: string[], b: readonly string[]) {
  return a.length === b.length && a.every((s, i) => s === b[i]);
}

export function MonitorApp({
  initialQuotes,
  initialChart,
}: {
  initialQuotes: Quote[];
  initialChart: ChartPayload | null;
}) {
  const symbols = useWatchlist((s) => s.symbols);
  const selected = useWatchlist((s) => s.selected);
  const range = useWatchlist((s) => s.range);
  const select = useWatchlist((s) => s.select);
  const add = useWatchlist((s) => s.add);
  const remove = useWatchlist((s) => s.remove);
  const setRange = useWatchlist((s) => s.setRange);
  const [sheetOpen, setSheetOpen] = useState(false);

  const quotesQuery = useQuery({
    queryKey: ["quotes", symbols],
    queryFn: () => getQuotes({ data: { symbols } }),
    enabled: symbols.length > 0,
    refetchInterval: 30_000,
    staleTime: 15_000,
    initialData:
      sameSymbols(symbols, DEFAULT_SYMBOLS) && initialQuotes.length > 0
        ? initialQuotes
        : undefined,
  });

  const chartQuery = useQuery({
    queryKey: ["chart", selected, range],
    queryFn: () => getChart({ data: { symbol: selected, range } }),
    enabled: Boolean(selected),
    staleTime: 20_000,
    placeholderData: keepPreviousData,
    initialData:
      selected === DEFAULT_SELECTED && range === "5y" && initialChart
        ? initialChart
        : undefined,
  });

  const quotes = quotesQuery.data ?? [];
  const chart = chartQuery.data;
  const spec = rangeById(range);
  const watching = symbols.includes(selected);
  const up = (chart?.rangeChangePct ?? 0) >= 0;

  const listQuotes = useMemo(() => {
    const map = new Map(quotes.map((q) => [q.symbol, q]));
    return symbols
      .map((s) => map.get(s))
      .filter((q): q is NonNullable<typeof q> => Boolean(q));
  }, [quotes, symbols]);

  function handleAdd(symbol: string) {
    add(symbol);
    toast.success(`${symbol} добавлен в список`);
    setSheetOpen(false);
  }

  function handleRemove(symbol: string) {
    remove(symbol);
    toast(`${symbol} убран из списка`);
  }

  function handleToggleWatch() {
    if (!selected) return;
    if (watching) handleRemove(selected);
    else handleAdd(selected);
  }

  const panel = (
    <WatchlistPanel
      symbols={symbols}
      quotes={listQuotes}
      selected={selected}
      loading={quotesQuery.isLoading}
      error={quotesQuery.isError}
      onSelect={(s) => {
        select(s);
        setSheetOpen(false);
      }}
      onRemove={handleRemove}
    />
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <div className="shrink-0 border-b border-border bg-surface">
        <div className="flex items-center gap-3 px-3 py-2.5 md:px-5">
          <div className="flex items-center gap-2 pr-1">
            <span className="flex size-8 items-center justify-center rounded-md bg-up text-surface">
              <Activity className="size-4" strokeWidth={2.4} />
            </span>
            <span className="hidden text-base font-medium tracking-tight sm:inline">
              Монитор
            </span>
          </div>
          <SearchBox onPick={handleAdd} className="min-w-0 flex-1" />
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={() => setSheetOpen(true)}
            aria-label="Открыть список"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto border-b border-border bg-surface px-3 py-2 lg:hidden">
        {listQuotes.map((q) => {
          const rowUp = q.changePct >= 0;
          return (
            <button
              key={q.symbol}
              type="button"
              onClick={() => select(q.symbol)}
              className={cn(
                "flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-3 text-sm transition-colors duration-150",
                q.symbol === selected
                  ? "border-fg bg-bg"
                  : "border-border bg-surface",
              )}
            >
              <span className="font-medium">{displayTicker(q.symbol)}</span>
              <span
                className={cn(
                  "tabular-nums",
                  rowUp ? "text-up" : "text-down",
                )}
              >
                {formatPercent(q.changePct)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1">
        <aside className="hidden h-full w-80 shrink-0 overflow-hidden border-r border-border bg-sidebar lg:flex lg:flex-col">
          {panel}
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-3 py-5 md:px-8 md:py-7">
          {!selected && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium">Список пуст</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Найдите акцию, фонд или криптовалюту в поиске сверху, чтобы начать
                следить за графиком.
              </p>
            </div>
          )}

          {selected && chartQuery.isError && !chart && (
            <div className="rounded-xl bg-down-soft px-4 py-3 text-sm text-down">
              Не удалось загрузить график. Попробуйте другую бумагу или обновите
              страницу.
            </div>
          )}

          {selected && chartQuery.isLoading && !chart && (
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-72 w-full rounded-xl" />
            </div>
          )}

          {chart && (
            <div className="flex flex-col gap-6">
              <QuoteHeader
                chart={chart}
                range={spec}
                watching={watching}
                onToggleWatch={handleToggleWatch}
              />

              <div
                role="tablist"
                aria-label="Период"
                className="-mx-1 flex gap-0 overflow-x-auto px-1"
              >
                {RANGES.map((r) => {
                  const active = r.id === range;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setRange(r.id as RangeId)}
                      className={cn(
                        "relative min-h-11 shrink-0 px-3 text-sm font-medium transition-colors duration-150",
                        active ? "text-accent" : "text-muted hover:text-fg",
                      )}
                    >
                      {r.label}
                      <span
                        className={cn(
                          "absolute inset-x-2 bottom-1 h-0.5 rounded-full",
                          active ? "bg-accent" : "bg-transparent",
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="h-64 pr-14 sm:h-80 md:h-96">
                <PriceChart
                  points={chart.points}
                  range={range}
                  currency={chart.currency}
                  hint={chart.priceHint}
                  up={up}
                />
              </div>

              <QuoteStats chart={chart} />
            </div>
          )}
        </main>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[75vh]">
          <SheetHeader>
            <SheetTitle>Мой список</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-hidden">{panel}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
