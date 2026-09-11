import { Star, Trash2 } from "lucide-react";
import { Sparkline } from "@/components/sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatPercent } from "@/lib/format";
import { displayTicker, type Quote } from "@/lib/market-types";
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

function PendingRow({ symbol, active, onSelect, onRemove }: {
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
        className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-down md:hidden md:group-hover:flex"
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
        className="flex min-w-0 flex-1 items-center gap-2"
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
        className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-down md:hidden md:group-hover:flex"
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

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <Star className="size-3.5 fill-fg text-fg" />
        <h2 className="text-xs font-medium tracking-wide text-muted uppercase">
          Мой список
        </h2>
        <span className="text-xs tabular-nums text-subtle">{symbols.length}</span>
      </div>
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
