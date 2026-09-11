import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  List,
  Activity,
  LineChart,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  Sparkles,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeftRight,
} from "lucide-react";
import { toast } from "sonner";
import { PriceChart } from "@/components/price-chart";
import { QuoteHeader } from "@/components/quote-header";
import { QuoteStats } from "@/components/quote-stats";
import { SearchBox } from "@/components/search-box";
import { WatchlistPanel } from "@/components/watchlist-panel";
import { PortfolioPanel } from "@/components/portfolio-panel";
import { GoogleFinanceHub } from "@/components/google-finance-hub";
import { EarningsCalendar } from "@/components/earnings-calendar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("chart");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarSide, setSidebarSide] = useState<"left" | "right">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("grok_monitor_sidebar_side");
      if (saved === "left" || saved === "right") return saved;
    }
    return "left";
  });

  const handleToggleSidebarSide = () => {
    setSidebarSide((prev) => {
      const next = prev === "left" ? "right" : "left";
      if (typeof window !== "undefined") {
        localStorage.setItem("grok_monitor_sidebar_side", next);
      }
      return next;
    });
  };

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

  const selectedQuote = useMemo(() => {
    return quotes.find((q) => q.symbol === selected) ?? null;
  }, [quotes, selected]);

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

  function handleSelectTicker(symbol: string) {
    select(symbol);
    setActiveTab("chart");
    setSheetOpen(false);
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
      {/* Top Header */}
      <div className="shrink-0 border-b border-border bg-surface">
        <div className="flex items-center gap-3 px-3 py-2.5 md:px-5">
          <div className="flex items-center gap-2 pr-1">
            <span className="flex size-8 items-center justify-center rounded-md bg-up text-surface">
              <Activity className="size-4" strokeWidth={2.4} />
            </span>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold tracking-tight text-fg">
                Google Market Monitor
              </span>
              <span className="text-[10px] text-muted flex items-center gap-1 font-medium">
                <span className="size-1.5 rounded-full bg-up animate-pulse" />
                Google Workspace Ready
              </span>
            </div>
          </div>

          <SearchBox onPick={handleAdd} className="min-w-0 flex-1" />

          {/* Quick Google Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted border border-border rounded-lg px-2.5 py-1.5 bg-bg/40">
            <FileSpreadsheet className="size-3.5 text-[#0F9D58]" />
            <span>Google Sheets Sync</span>
          </div>

          {/* Desktop Toggle Sidebar Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="hidden lg:flex items-center gap-1.5 text-xs font-medium h-9 border-border bg-bg/50 hover:bg-bg cursor-pointer"
            title={sidebarOpen ? "Свернуть список бумаг" : "Развернуть список бумаг"}
          >
            {sidebarOpen ? (
              <>
                {sidebarSide === "right" ? (
                  <PanelRightClose className="size-4 text-accent" />
                ) : (
                  <PanelLeftClose className="size-4 text-accent" />
                )}
                <span>Свернуть список</span>
              </>
            ) : (
              <>
                {sidebarSide === "right" ? (
                  <PanelRightOpen className="size-4 text-accent" />
                ) : (
                  <PanelLeftOpen className="size-4 text-accent" />
                )}
                <span>Развернуть список</span>
              </>
            )}
          </Button>

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

      {/* Mobile Watchlist Horizontal Scroller */}
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

      {/* Main Workspace */}
      <div
        className={cn(
          "mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden transition-all duration-300",
          sidebarSide === "right" ? "flex-row-reverse" : "flex-row",
        )}
      >
        {/* Watchlist Sidebar (Collapsible, Left or Right) */}
        <aside
          className={cn(
            "hidden h-full shrink-0 overflow-hidden bg-sidebar transition-all duration-300 ease-in-out lg:flex lg:flex-col",
            sidebarSide === "right" ? "border-l border-border" : "border-r border-border",
            sidebarOpen ? "w-80 opacity-100" : "w-0 border-none opacity-0 pointer-events-none",
          )}
        >
          {/* Header controls for sidebar */}
          <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs font-semibold text-muted bg-surface/40">
            <span>Список наблюдения</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleSidebarSide}
                className="rounded p-1 text-muted hover:text-fg hover:bg-bg transition-colors cursor-pointer"
                title={sidebarSide === "right" ? "Переместить панель влево" : "Переместить панель вправо"}
              >
                <ArrowLeftRight className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded p-1 text-muted hover:text-fg hover:bg-bg transition-colors cursor-pointer"
                title="Свернуть список"
              >
                {sidebarSide === "right" ? (
                  <PanelRightClose className="size-3.5" />
                ) : (
                  <PanelLeftClose className="size-3.5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            {panel}
          </div>
        </aside>

        {/* Content Area with Navigation Tabs */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-3 py-5 md:px-8 md:py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Top Navigation Tabs */}
            <div className="mb-6 flex overflow-x-auto pb-1">
              <TabsList className="bg-surface border border-border shadow-sm p-1 rounded-xl">
                <TabsTrigger value="chart" className="gap-1.5 text-xs sm:text-sm font-medium">
                  <LineChart className="size-4 text-accent" />
                  Котировки & График
                </TabsTrigger>

                <TabsTrigger value="portfolio" className="gap-1.5 text-xs sm:text-sm font-medium">
                  <FileSpreadsheet className="size-4 text-[#0F9D58]" />
                  Google Портфель
                </TabsTrigger>

                <TabsTrigger value="google-finance" className="gap-1.5 text-xs sm:text-sm font-medium">
                  <Sparkles className="size-4 text-accent" />
                  Google Finance Hub
                </TabsTrigger>

                <TabsTrigger value="calendar" className="gap-1.5 text-xs sm:text-sm font-medium">
                  <CalendarIcon className="size-4 text-[#4285F4]" />
                  Календарь событий
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: CHART & QUOTE */}
            <TabsContent value="chart" className="space-y-6 mt-0">
              {!selected && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="text-lg font-medium">Список пуст</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">
                    Найдите акцию, фонд или криптовалюту в поиске сверху, чтобы начать следить за графиком.
                  </p>
                </div>
              )}

              {selected && chartQuery.isError && !chart && (
                <div className="rounded-xl bg-down-soft px-4 py-3 text-sm text-down">
                  Не удалось загрузить график. Попробуйте другую бумагу или обновите страницу.
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
            </TabsContent>

            {/* TAB 2: GOOGLE SHEETS PORTFOLIO */}
            <TabsContent value="portfolio" className="mt-0">
              <PortfolioPanel
                quotes={quotes}
                onSelectTicker={handleSelectTicker}
              />
            </TabsContent>

            {/* TAB 3: GOOGLE FINANCE HUB */}
            <TabsContent value="google-finance" className="mt-0">
              <GoogleFinanceHub
                selectedQuote={selectedQuote}
                selectedSymbol={selected}
                onSelectTicker={handleSelectTicker}
              />
            </TabsContent>

            {/* TAB 4: CALENDAR */}
            <TabsContent value="calendar" className="mt-0">
              <EarningsCalendar
                onSelectTicker={handleSelectTicker}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Mobile Watchlist Sheet */}
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
