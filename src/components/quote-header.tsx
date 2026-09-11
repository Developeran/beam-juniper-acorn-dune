import { Check, MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatMarketTime, formatPercent, formatPrice, formatSigned } from "@/lib/format";
import { displayTicker, type ChartPayload, type RangeSpec } from "@/lib/market-types";
import { cn } from "@/lib/utils";
import { WhyMoved } from "@/components/why-moved";

type Props = {
  chart: ChartPayload;
  range: RangeSpec;
  watching: boolean;
  onToggleWatch: () => void;
};

export function QuoteHeader({ chart, range, watching, onToggleWatch }: Props) {
  const up = chart.rangeChangePct >= 0;
  const Trend = up ? TrendingUp : TrendingDown;

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-2xl font-medium tracking-tight text-fg md:text-3xl">
              {chart.longName || chart.name}
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="rounded-md p-1 text-muted hover:bg-bg hover:text-fg"
                  aria-label="Ещё"
                >
                  <MoreHorizontal className="size-5" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{chart.longName}</DialogTitle>
                  <DialogDescription>
                    {chart.exchangeLabel}: {displayTicker(chart.symbol)} · тикер Yahoo{" "}
                    {chart.symbol}
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm leading-relaxed text-muted">
                  Котировки поступают с задержкой и носят справочный характер. Это не
                  инвестиционная рекомендация.
                </p>
              </DialogContent>
            </Dialog>
          </div>
          <p className="mt-0.5 text-sm text-muted">
            {chart.exchangeLabel}: {displayTicker(chart.symbol)}
          </p>
        </div>
        <Button
          variant="pill"
          size="pill"
          onClick={onToggleWatch}
          className={cn(watching && "bg-up-soft text-up border-transparent")}
        >
          {watching ? <Check className="size-4" /> : null}
          {watching ? "Вы подписаны" : "Подписаться"}
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className="text-4xl font-medium tracking-tight tabular-nums text-fg">
          {formatPrice(chart.price, chart.currency, chart.priceHint)}
        </p>
        <p
          className={cn(
            "flex items-center gap-1.5 pb-1 text-lg font-medium tabular-nums",
            up ? "text-up" : "text-down",
          )}
        >
          <Trend className="size-5" />
          {formatPercent(chart.rangeChangePct)}
        </p>
        <p
          className={cn(
            "pb-1 text-lg tabular-nums",
            up ? "text-up" : "text-down",
          )}
        >
          {formatSigned(chart.rangeChange, chart.priceHint)} {range.periodLabel}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <time dateTime={new Date(chart.marketTime).toISOString()}>
            {formatMarketTime(chart.marketTime, chart.timeZone)}
          </time>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-accent underline-offset-4 hover:underline"
              >
                Отказ от обязательств
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Отказ от обязательств</DialogTitle>
              </DialogHeader>
              <DialogDescription className="space-y-2">
                <span className="block">
                  Данные предоставляются «как есть», могут запаздывать и содержать
                  ошибки. Монитор не является брокером и не даёт индивидуальных
                  инвестиционных рекомендаций.
                </span>
                <span className="block">
                  Прошлые результаты не гарантируют будущую доходность. Перед
                  сделками сверяйтесь с первоисточником котировок.
                </span>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
        <WhyMoved chart={chart} range={range} />
      </div>
    </header>
  );
}
