import { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  RefreshCw,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Download,
  Check,
  LineChart,
  Layers,
  Sparkles,
  BarChart3,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatNumber, formatPercent } from "@/lib/format";
import {
  DEFAULT_BENCHMARK_INDICATIVE,
  DEFAULT_DEMO_HOLDINGS,
  DEFAULT_GOOGLE_SHEET_URL,
  cleanGroupName,
  fetchSheetData,
  generateGoogleFinanceTemplateCsv,
  type BenchmarkIndicative,
  type PortfolioHolding,
} from "@/lib/google-sheets";
import { GoogleFinancePortfolioChart } from "@/components/google-finance-portfolio-chart";
import type { Quote } from "@/lib/market-types";
import { cn } from "@/lib/utils";

const PALETTE = [
  "#1a73e8", // Google Blue
  "#34a853", // Google Green
  "#fbbc04", // Google Yellow
  "#ea4335", // Google Red
  "#8e24aa", // Purple
  "#00897b", // Teal
  "#e65100", // Orange
  "#3949ab", // Indigo
  "#0288d1", // Light blue
  "#c2185b", // Pink
  "#7b1fa2", // Deep purple
  "#512da8", // Deep indigo
];

const STORAGE_KEY = "grok_monitor_portfolio_v5";

function ensureAllHoldings(list: PortfolioHolding[]): PortfolioHolding[] {
  const result = [...list];
  const hasInfaQnt = result.some(
    (h) => h.symbol === "QNT" && cleanGroupName(h.portfolioGroup) === "Infa plus banks",
  );
  if (!hasInfaQnt) {
    const qntInfa = DEFAULT_DEMO_HOLDINGS.find((h) => h.id === "QNT-17");
    if (qntInfa) {
      const kkrIndex = result.findIndex(
        (h) => h.symbol === "KKR" && cleanGroupName(h.portfolioGroup) === "Infa plus banks",
      );
      if (kkrIndex !== -1) {
        result.splice(kkrIndex, 0, qntInfa);
      } else {
        result.push(qntInfa);
      }
    }
  }

  const hasAiQnt = result.some(
    (h) => h.symbol === "QNT" && cleanGroupName(h.portfolioGroup) === "AI plus finance",
  );
  if (!hasAiQnt) {
    const qntAi = DEFAULT_DEMO_HOLDINGS.find((h) => h.id === "QNT-21");
    if (qntAi) {
      const kkrIndex = result.findIndex(
        (h) => h.symbol === "KKR" && cleanGroupName(h.portfolioGroup) === "AI plus finance",
      );
      if (kkrIndex !== -1) {
        result.splice(kkrIndex + 1, 0, qntAi);
      } else {
        result.push(qntAi);
      }
    }
  }

  return result.map((h) => ({
    ...h,
    portfolioGroup: cleanGroupName(h.portfolioGroup),
  }));
}

export function PortfolioPanel({
  quotes,
  onSelectTicker,
}: {
  quotes: Quote[];
  onSelectTicker: (symbol: string) => void;
}) {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    if (typeof window !== "undefined") {
      const savedV5 = localStorage.getItem(STORAGE_KEY);
      if (savedV5) {
        try {
          const parsed = JSON.parse(savedV5);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return ensureAllHoldings(parsed);
          }
        } catch {
          // ignore
        }
      }

      const savedV4 = localStorage.getItem("grok_monitor_portfolio_v4");
      if (savedV4) {
        try {
          const parsed = JSON.parse(savedV4);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const upgraded = ensureAllHoldings(parsed);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
            return upgraded;
          }
        } catch {
          // ignore
        }
      }
    }

    const initial = ensureAllHoldings(DEFAULT_DEMO_HOLDINGS);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      } catch {
        // ignore
      }
    }
    return initial;
  });

  const [benchmark, setBenchmark] = useState<BenchmarkIndicative>(DEFAULT_BENCHMARK_INDICATIVE);
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_GOOGLE_SHEET_URL);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCopiedTemplate, setIsCopiedTemplate] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("Основной портфель");

  // New position form state
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("1000");
  const [newBuyPrice, setNewBuyPrice] = useState("150");
  const [newNotes, setNewNotes] = useState("");
  const [newGroup, setNewGroup] = useState("Основной портфель");

  const quotesMap = useMemo(() => {
    const map = new Map<string, Quote>();
    for (const q of quotes) {
      map.set(q.symbol, q);
    }
    return map;
  }, [quotes]);

  // Available groups (clean names, excluding benchmark as required)
  const availableGroups = useMemo(() => {
    const set = new Set<string>();
    for (const h of holdings) {
      const clean = cleanGroupName(h.portfolioGroup);
      if (clean && !/benchmark|бенчмарк/i.test(clean)) {
        set.add(clean);
      }
    }
    return Array.from(set);
  }, [holdings]);

  // Enrich holdings with real-time market data or Google Sheets prices
  const enrichedHoldings = useMemo(() => {
    return holdings.map((h) => {
      const q = quotesMap.get(h.symbol);
      const currentPrice = q?.price ?? h.sheetPrice ?? h.costPrice;
      const totalCost = h.costValue || h.shares * h.costPrice;
      const totalValue = h.shares * currentPrice;
      const pnl = totalValue - totalCost;
      const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
      const change24h = q ? q.price - q.previousClose : 0;
      const changePct24h = q?.changePct ?? 0;

      return {
        ...h,
        currentPrice,
        totalCost,
        totalValue,
        pnl,
        pnlPct,
        change24h,
        changePct24h,
      };
    });
  }, [holdings, quotesMap]);

  // Filtered by selected group (excluding benchmark)
  const displayedHoldings = useMemo(() => {
    if (selectedGroup === "all") {
      return enrichedHoldings.filter((h) => !/benchmark|бенчмарк/i.test(h.portfolioGroup));
    }
    return enrichedHoldings.filter((h) => cleanGroupName(h.portfolioGroup) === selectedGroup);
  }, [enrichedHoldings, selectedGroup]);

  // Summary calculation for currently selected group
  const summary = useMemo(() => {
    const totalValue = displayedHoldings.reduce((sum, h) => sum + h.totalValue, 0);
    const totalCost = displayedHoldings.reduce((sum, h) => sum + h.totalCost, 0);
    const totalPnl = totalValue - totalCost;
    const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
    const dailyPnl = displayedHoldings.reduce((sum, h) => sum + h.shares * h.change24h, 0);

    return {
      totalValue,
      totalCost,
      totalPnl,
      totalPnlPct,
      dailyPnl,
    };
  }, [displayedHoldings]);

  // Alpha vs Benchmark calculation
  const benchmarkPnlPct = benchmark.pnlPct;
  const portfolioAlpha = summary.totalPnlPct - benchmarkPnlPct;
  const isOutperforming = portfolioAlpha >= 0;

  const currentPortfolioDisplayName = useMemo(() => {
    if (selectedGroup === "all") return "Все активы (Сводный портфель)";
    return selectedGroup;
  }, [selectedGroup]);

  const formationDate = displayedHoldings[0]?.formationDate || "16.06";

  const saveHoldings = (updated: PortfolioHolding[], updatedBenchmark?: BenchmarkIndicative) => {
    const cleaned = updated.map((h) => ({
      ...h,
      portfolioGroup: cleanGroupName(h.portfolioGroup),
    }));
    setHoldings(cleaned);
    if (updatedBenchmark) setBenchmark(updatedBenchmark);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
  };

  const handleSyncFromSheet = async () => {
    if (!sheetUrl.trim()) {
      toast.error("Введите ссылку на Google Таблицу");
      return;
    }

    setIsSyncing(true);
    try {
      const res = await fetchSheetData({ data: { urlOrId: sheetUrl } });
      if (!res.success) {
        toast.error(res.error);
        return;
      }

      saveHoldings(res.holdings, res.benchmark);
      toast.success(`Успешно загружено ${res.holdings.length} позиций из Google Таблицы!`);
    } catch (err) {
      toast.error(`Ошибка синхронизации: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = generateGoogleFinanceTemplateCsv();
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "google_finance_portfolio_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsCopiedTemplate(true);
    setTimeout(() => setIsCopiedTemplate(false), 3000);
    toast.success("Шаблон Google Таблицы с формулами скачан!");
  };

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = newSymbol.trim().toUpperCase();
    const shares = parseFloat(newShares.replace(",", "."));
    const buyPrice = parseFloat(newBuyPrice.replace(",", "."));

    if (!symbol) {
      toast.error("Введите тикер акции");
      return;
    }
    if (isNaN(shares) || shares <= 0) {
      toast.error("Некорректное количество");
      return;
    }
    if (isNaN(buyPrice) || buyPrice < 0) {
      toast.error("Некорректная цена покупки");
      return;
    }

    const newPosition: PortfolioHolding = {
      id: `${symbol}-${Date.now()}`,
      symbol,
      rawSymbol: symbol,
      stockName: newNotes.trim() || symbol,
      shares,
      costPrice: buyPrice,
      costValue: shares * buyPrice,
      sheetPrice: buyPrice,
      sheetValue: shares * buyPrice,
      sheetPnlUsd: 0,
      sheetPnlPct: 0,
      portfolioGroup: newGroup,
      formationDate: "16.06",
      notes: newNotes.trim() || undefined,
    };

    saveHoldings([...holdings, newPosition]);
    setAddDialogOpen(false);
    setNewSymbol("");
    setNewNotes("");
    toast.success(`Актив ${symbol} добавлен в ${newGroup}!`);
  };

  const handleRemoveHolding = (id: string) => {
    const updated = holdings.filter((h) => h.id !== id);
    saveHoldings(updated);
    toast.info("Позиция удалена");
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP PORTFOLIO SELECTOR BUTTONS (Immediately under header) */}
      <div className="rounded-2xl border border-border/80 bg-surface p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Layers className="size-3.5 text-[#1a73e8]" />
              Выберите портфель / стратегию:
            </span>
          </div>

          {/* User-Friendly Google Material 3 Style Segmented Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedGroup("all")}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs",
                selectedGroup === "all"
                  ? "border-fg bg-fg text-surface shadow-sm"
                  : "border-border bg-bg/50 text-fg hover:bg-bg hover:border-border-strong",
              )}
            >
              <Layers className="size-4" />
              <span>Все активы</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-mono",
                  selectedGroup === "all" ? "bg-surface/20 text-surface" : "bg-surface text-muted",
                )}
              >
                {enrichedHoldings.filter((h) => !/benchmark/i.test(h.portfolioGroup)).length}
              </span>
            </button>

            {availableGroups.map((grp) => {
              const count = holdings.filter((h) => cleanGroupName(h.portfolioGroup) === grp).length;
              const isSelected = selectedGroup === grp;

              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setSelectedGroup(grp)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs",
                    isSelected
                      ? "border-[#1a73e8] bg-[#1a73e8] text-white shadow-sm font-semibold"
                      : "border-border bg-bg/50 text-fg hover:bg-bg hover:border-border-strong",
                  )}
                >
                  <span>{grp}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-mono",
                      isSelected ? "bg-white/20 text-white" : "bg-surface text-muted",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. GOOGLE FINANCE STYLE DYNAMIC PORTFOLIO CHART (Exact match to user screenshot) */}
      <GoogleFinancePortfolioChart
        portfolioName={selectedGroup === "all" ? "Все активы" : selectedGroup}
        totalValue={summary.totalValue}
        totalCost={summary.totalCost}
        formationDate={selectedGroup === "all" ? undefined : "16.06"}
        benchmarkReturnPct={benchmark.pnlPct}
        holdings={displayedHoldings}
      />

      {/* 3. SYNC TOOLBAR & ADD POSITION (Collapsible / Compact) */}
      <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#0F9D58]/10 text-[#0F9D58]">
              <FileSpreadsheet className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-medium text-xs sm:text-sm text-fg">
                Синхронизация Google Таблицы
                <span className="rounded-full bg-up-soft px-2 py-0.5 text-[11px] font-semibold text-up font-mono">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-muted">
                Автоматическое чтение колонок входа (16.06) и цен среза (10.09)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="gap-1.5 text-xs h-8"
            >
              {isCopiedTemplate ? <Check className="size-3 text-up" /> : <Download className="size-3" />}
              Шаблон Google Sheets
            </Button>

            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 text-xs h-8">
                  <Plus className="size-3" />
                  Добавить актив
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Добавить актив в портфель</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddHolding} className="space-y-3.5 pt-2">
                  <div>
                    <label className="text-xs font-medium text-muted">Тикер (например, GS, TSM, ARM, NVDA)</label>
                    <Input
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value)}
                      placeholder="GS"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">Портфель / Стратегия</label>
                    <select
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
                    >
                      {availableGroups.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted">Количество (акций)</label>
                      <Input
                        type="number"
                        step="any"
                        value={newShares}
                        onChange={(e) => setNewShares(e.target.value)}
                        placeholder="1000"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted">Цена входа 16.06 ($)</label>
                      <Input
                        type="number"
                        step="any"
                        value={newBuyPrice}
                        onChange={(e) => setNewBuyPrice(e.target.value)}
                        placeholder="350.00"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">Название компании</label>
                    <Input
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Goldman Sachs"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button type="submit">Добавить</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* URL Sync Input */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="Ссылка на таблицу Google Sheets..."
            className="flex-1 bg-bg/50 text-xs font-mono"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncFromSheet}
            disabled={isSyncing}
            className="gap-1.5 shrink-0 h-9"
          >
            <RefreshCw className={cn("size-3.5", isSyncing && "animate-spin")} />
            {isSyncing ? "Синхронизация..." : "Синхронизировать"}
          </Button>
        </div>
      </div>

      {/* 4. ASSET ALLOCATION BAR FOR CURRENT PORTFOLIO */}
      {summary.totalValue > 0 && (
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="font-semibold text-fg">
              Структура долей: {currentPortfolioDisplayName}
            </span>
            <span className="font-mono">{displayedHoldings.length} тикеров</span>
          </div>

          <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-border/40">
            {displayedHoldings.map((h, i) => {
              const pct = (h.totalValue / summary.totalValue) * 100;
              if (pct < 0.5) return null;
              return (
                <div
                  key={h.id}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: PALETTE[i % PALETTE.length],
                  }}
                  title={`${h.symbol}: ${pct.toFixed(1)}% ($${h.totalValue.toFixed(0)})`}
                  className="transition-all hover:opacity-85"
                />
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {displayedHoldings.map((h, i) => {
              const pct = (h.totalValue / summary.totalValue) * 100;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => onSelectTicker(h.symbol)}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-bg transition-colors"
                >
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="font-semibold text-fg">{h.symbol}</span>
                  <span className="text-muted font-mono">{pct.toFixed(1)}%</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. HOLDINGS TABLE (With formation date 16.06 in header) */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        {/* Table Header as required in Task 4 */}
        <div className="border-b border-border px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-bg/30">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-fg tracking-tight">
              Список позиций: {selectedGroup === "all" ? "Все активы" : `${selectedGroup} (сформирован от 16.06)`}
            </h3>
            <p className="text-xs text-muted">
              {selectedGroup === "all"
                ? "Сводная таблица по всем активам • Сравнение цен входа и текущей рыночной оценки"
                : "Портфель сформирован от 16.06 • Сравнение цен входа и текущей рыночной оценки"}
            </p>
          </div>
          <span className="text-xs text-muted bg-surface border border-border px-2.5 py-1 rounded-md self-start sm:self-auto">
            Кликните по тикеру для графика акции
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg/60 text-muted uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Тикер Google Finance</th>
                <th className="py-3 px-3">Компания</th>
                <th className="py-3 px-3">Кол-во</th>
                <th className="py-3 px-3">Цена входа (16.06)</th>
                <th className="py-3 px-3">Вложено (16.06)</th>
                <th className="py-3 px-3">Рыночная цена</th>
                <th className="py-3 px-3">Текущая стоимость</th>
                <th className="py-3 px-3">P/L ($)</th>
                <th className="py-3 px-3">P/L (%)</th>
                <th className="py-3 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayedHoldings.map((h) => {
                const isPositive = h.pnl >= 0;
                return (
                  <tr key={h.id} className="hover:bg-bg/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold">
                      <button
                        type="button"
                        onClick={() => onSelectTicker(h.symbol)}
                        className="flex items-center gap-1.5 text-[#1a73e8] hover:underline font-mono"
                        title="Открыть график котировки"
                      >
                        <LineChart className="size-3.5 shrink-0" />
                        <span>{h.rawSymbol || h.symbol}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-fg">{h.stockName || h.symbol}</td>
                    <td className="py-3.5 px-3 font-mono">{h.shares.toLocaleString()}</td>
                    <td className="py-3.5 px-3 font-mono">${formatNumber(h.costPrice, 2)}</td>
                    <td className="py-3.5 px-3 font-mono text-muted">${formatNumber(h.costValue, 0)}</td>
                    <td className="py-3.5 px-3 font-mono font-medium">${formatNumber(h.currentPrice, 2)}</td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-fg">
                      ${formatNumber(h.totalValue, 0)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={cn(
                          "font-mono font-medium",
                          isPositive ? "text-up" : "text-down",
                        )}
                      >
                        {isPositive ? "+" : "−"}${formatNumber(Math.abs(h.pnl), 0)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 font-mono font-medium px-2 py-0.5 rounded text-[11px]",
                          isPositive ? "bg-up-soft text-up" : "bg-down-soft text-down",
                        )}
                      >
                        {formatPercent(h.pnlPct)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://www.google.com/finance/quote/${h.rawSymbol || h.symbol}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded text-muted hover:text-fg hover:bg-bg"
                          title="Открыть в Google Finance"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveHolding(h.id)}
                          className="p-1.5 rounded text-muted hover:text-down hover:bg-down-soft"
                          title="Удалить из портфеля"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. BOTTOM RESULTS CARD & INDICATIVE BENCHMARK (Task 5 & Task 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Results Summary Block */}
        <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-fg">
              <BarChart3 className="size-4.5 text-[#1a73e8]" />
              <span>
                Итоговые результаты: {selectedGroup === "all" ? "Все активы" : selectedGroup}
              </span>
            </div>
            {selectedGroup !== "all" && (
              <span className="text-xs text-muted font-mono rounded bg-bg px-2 py-0.5 border border-border/60">
                сформирован от 16.06
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted">
                {selectedGroup === "all" ? "Всего вложено:" : "Вложено (16.06):"}
              </span>
              <div className="mt-1 text-lg font-bold font-mono text-fg">
                ${formatNumber(summary.totalCost, 2)}
              </div>
            </div>

            <div>
              <span className="text-muted">Текущая стоимость:</span>
              <div className="mt-1 text-lg font-bold font-mono text-fg">
                ${formatNumber(summary.totalValue, 2)}
              </div>
            </div>

            <div className="col-span-2 pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="text-muted font-medium">Общий финансовый результат:</span>
              <div className="text-right">
                <span
                  className={cn(
                    "text-xl font-bold font-mono",
                    summary.totalPnl >= 0 ? "text-up" : "text-down",
                  )}
                >
                  {summary.totalPnl >= 0 ? "+" : "−"}${formatNumber(Math.abs(summary.totalPnl), 2)}
                </span>
                <div
                  className={cn(
                    "text-xs font-semibold font-mono",
                    summary.totalPnlPct >= 0 ? "text-up" : "text-down",
                  )}
                >
                  {formatPercent(summary.totalPnlPct)} доходности
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicative Benchmark Comparison (ACWI) */}
        <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-fg">
              <Scale className="size-4.5 text-amber-500" />
              <span>Индикатив: Сравнение с Бенчмарком ACWI</span>
            </div>
            <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              NASDAQ:ACWI
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted">Бенчмарк ({benchmark.name}):</span>
              <span className="font-mono font-semibold text-up">
                +{benchmark.pnlPct}% (+${formatNumber(benchmark.pnlUsd, 0)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted">Доходность данного портфеля:</span>
              <span
                className={cn(
                  "font-mono font-semibold",
                  summary.totalPnlPct >= 0 ? "text-up" : "text-down",
                )}
              >
                {formatPercent(summary.totalPnlPct)}
              </span>
            </div>

            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
              <div>
                <span className="font-semibold text-fg">Альфа (Alpha vs ACWI):</span>
                <p className="text-[11px] text-muted">Относительное опережение рынка</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-mono font-bold text-sm px-2.5 py-1 rounded-md",
                    isOutperforming
                      ? "bg-up-soft text-up"
                      : "bg-down-soft text-down",
                  )}
                >
                  {isOutperforming ? "+" : ""}{portfolioAlpha.toFixed(2)}%
                </span>
                <div className="text-[10px] text-muted mt-0.5">
                  {isOutperforming ? "Опережает мировой индекс 🚀" : "Отстает от мирового индекса"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
