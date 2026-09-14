import { useState } from "react";
import {
  Star,
  Trash2,
  Copy,
  Check,
  Upload,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Sparkline } from "@/components/sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatNumber, formatPercent } from "@/lib/format";
import { displayTicker, type Quote } from "@/lib/market-types";
import { useWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

type Props = {
  symbols: string[];
  quotes: Quote[];
  selected: string;
  loading: boolean;
  error?: boolean;
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
};

function PendingRow({
  symbol,
  active,
  onSelect,
  onRemove,
}: {
  symbol: string;
  active: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex w-full items-center gap-2 rounded-lg px-2 py-2 pr-9 text-left md:pr-2",
        active ? "bg-accent-soft" : "",
      )}
    >
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2">
        <Skeleton className="h-7 w-16" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{displayTicker(symbol)}</span>
          <Skeleton className="mt-1 h-3 w-20" />
        </span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-down md:hidden md:group-hover:flex cursor-pointer"
        aria-label="Убрать из списка"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

function Row({
  quote,
  active,
  onSelect,
  onRemove,
}: {
  quote: Quote;
  active: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const up = quote.changePct >= 0;
  return (
    <div
      className={cn(
        "group relative flex w-full items-center gap-2 rounded-lg px-2 py-2 pr-9 text-left transition-colors duration-150 md:pr-2",
        active ? "bg-accent-soft" : "hover:bg-bg",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-2 cursor-pointer"
      >
        <Sparkline values={quote.spark} up={up} />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-medium tracking-tight">
              {displayTicker(quote.symbol)}
            </span>
            <span className="tabular-nums text-sm font-medium">
              {formatNumber(quote.price, quote.priceHint)}
            </span>
          </span>
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate text-xs text-muted">{quote.shortName}</span>
            <span
              className={cn(
                "tabular-nums text-xs font-medium",
                up ? "text-up" : "text-down",
              )}
            >
              {formatPercent(quote.changePct)}
            </span>
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-down md:hidden md:group-hover:flex cursor-pointer"
        aria-label="Убрать из списка"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

export function WatchlistPanel({
  symbols = [],
  quotes = [],
  selected,
  loading,
  error,
  onSelect,
  onRemove,
}: Props) {
  const bySymbol = new Map(quotes.map((q) => [q.symbol, q]));
  const setSymbols = useWatchlist((s) => s.setSymbols);
  const resetToDefault = useWatchlist((s) => s.resetToDefault);

  const [copied, setCopied] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  const handleCopyList = () => {
    const text = symbols.join(", ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(`Скопировано ${symbols.length} тикеров в буфер обмена`);
  };

  const parsedImportSymbols = importText
    .split(/[\s,;]+/)
    .map((s) => s.trim().toUpperCase())
    .filter((s) => /^[A-Za-z0-9.^_=/-]{1,20}$/.test(s));

  const handleAppendImport = () => {
    if (parsedImportSymbols.length === 0) {
      toast.error("Не найдено корректных тикеров для добавления");
      return;
    }
    const merged = Array.from(new Set([...symbols, ...parsedImportSymbols]));
    setSymbols(merged);
    setImportText("");
    setImportOpen(false);
    toast.success(`Добавлено ${parsedImportSymbols.length} тикеров в список!`);
  };

  const handleReplaceImport = () => {
    if (parsedImportSymbols.length === 0) {
      toast.error("Не найдено корректных тикеров для добавления");
      return;
    }
    const clean = Array.from(new Set(parsedImportSymbols));
    setSymbols(clean);
    setImportText("");
    setImportOpen(false);
    toast.success(`Список обновлен: ${clean.length} тикеров!`);
  };

  const handleReset = () => {
    if (confirm("Сбросить список тикеров к исходному набору по умолчанию?")) {
      resetToDefault();
      toast.info("Список тикеров сброшен к исходному набору");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header with Title and Quick Export/Import Tools */}
      <div className="flex items-center justify-between border-b border-border/60 px-3 py-2.5 bg-surface/30">
        <div className="flex items-center gap-1.5">
          <Star className="size-3.5 fill-[#1a73e8] text-[#1a73e8]" />
          <h2 className="text-xs font-semibold tracking-wide text-fg uppercase">
            Мой список
          </h2>
          <span className="rounded-full bg-bg px-1.5 py-0.2 text-[10px] font-mono text-muted border border-border">
            {symbols.length}
          </span>
        </div>

        {/* Quick Tools: Copy All, Import, Reset */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopyList}
            className="rounded p-1 text-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer"
            title="Скопировать список тикеров (для переноса на другой ПК)"
          >
            {copied ? <Check className="size-3.5 text-up" /> : <Copy className="size-3.5" />}
          </button>

          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="rounded p-1 text-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer"
                title="Импортировать / Вставить список тикеров"
              >
                <Upload className="size-3.5" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  Импорт и перенос тикеров
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <p className="text-xs text-muted leading-relaxed">
                  Вставьте список тикеров через запятую, пробел или с новой строки (например:{" "}
                  <code className="rounded bg-bg px-1 py-0.5 font-mono text-[11px] text-fg">
                    AAPL, MSFT, NVDA, TSLA, PLTR
                  </code>
                  ). Изменения сохраняются автоматически в браузере.
                </p>

                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Вставьте тикеры: AAPL, GOOGL, NVDA, BTC-USD..."
                  className="w-full h-28 rounded-xl border border-border bg-bg p-3 text-xs font-mono focus:border-accent focus:outline-hidden"
                />

                {parsedImportSymbols.length > 0 && (
                  <div className="text-xs text-muted font-mono">
                    Распознано тикеров:{" "}
                    <strong className="text-fg font-semibold">
                      {parsedImportSymbols.length}
                    </strong>{" "}
                    ({parsedImportSymbols.slice(0, 6).join(", ")}
                    {parsedImportSymbols.length > 6 ? "..." : ""})
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAppendImport}
                    disabled={parsedImportSymbols.length === 0}
                    className="text-xs"
                  >
                    Добавить к текущему списку
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleReplaceImport}
                    disabled={parsedImportSymbols.length === 0}
                    className="text-xs"
                  >
                    Заменить весь список
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <button
            type="button"
            onClick={handleReset}
            className="rounded p-1 text-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer"
            title="Сбросить список к исходным"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Persistence indicator notice */}
      <div className="px-3 py-1 bg-bg/40 text-[10px] text-muted flex items-center justify-between border-b border-border/40">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-up animate-pulse" />
          Автосохранение в браузере
        </span>
        <span className="font-mono text-[9px] opacity-75">localStorage</span>
      </div>

      {/* List items */}
      <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-3">
        {symbols.map((symbol) => {
          const quote = bySymbol.get(symbol);
          if (!quote) {
            return (
              <PendingRow
                key={symbol}
                symbol={symbol}
                active={symbol === selected}
                onSelect={() => onSelect(symbol)}
                onRemove={() => onRemove(symbol)}
              />
            );
          }
          return (
            <Row
              key={symbol}
              quote={quote}
              active={symbol === selected}
              onSelect={() => onSelect(symbol)}
              onRemove={() => onRemove(symbol)}
            />
          );
        })}
        {symbols.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-muted">
            Список пуст. Найдите бумагу в поиске, чтобы добавить её.
          </p>
        )}
        {error && symbols.length > 0 && quotes.length === 0 && !loading && (
          <p className="px-3 py-2 text-center text-xs text-down">
            Не удалось обновить котировки
          </p>
        )}
      </div>
    </div>
  );
}
