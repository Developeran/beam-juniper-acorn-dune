import { useState } from "react";
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  DollarSign,
  TrendingUp,
  Clock,
  Filter,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  createGoogleCalendarUrl,
  UPCOMING_FINANCIAL_EVENTS,
  type FinancialEvent,
} from "@/lib/google-calendar";
import { cn } from "@/lib/utils";

export function EarningsCalendar({
  onSelectTicker,
}: {
  onSelectTicker: (symbol: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "earnings" | "dividend">("all");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const filteredEvents = UPCOMING_FINANCIAL_EVENTS.filter((ev) => {
    if (filter === "all") return true;
    return ev.eventType === filter;
  });

  const handleAddToCalendar = (event: FinancialEvent) => {
    const url = createGoogleCalendarUrl({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.time || "16:30",
    });

    window.open(url, "_blank", "noopener,noreferrer");
    setAddedIds((prev) => new Set(prev).add(event.id));
    toast.success(`Открыт Google Календарь для добавления: ${event.symbol}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#4285F4]/10 text-[#4285F4]">
              <CalendarIcon className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-fg">
                  Календарь корпоративных событий и отчетов
                </h2>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                  Google Calendar
                </span>
              </div>
              <p className="text-xs text-muted">
                Отслеживайте даты квартальных отчетов и дивидендных отсечек с синхронизацией в Google Календарь
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-bg/60 p-1 text-xs">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className="h-7 px-3 text-xs"
            >
              Все ({UPCOMING_FINANCIAL_EVENTS.length})
            </Button>
            <Button
              variant={filter === "earnings" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("earnings")}
              className="h-7 px-3 text-xs"
            >
              Отчеты (Earnings)
            </Button>
            <Button
              variant={filter === "dividend" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("dividend")}
              className="h-7 px-3 text-xs"
            >
              Дивиденды
            </Button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((ev) => {
          const isAdded = addedIds.has(ev.id);
          const isEarnings = ev.eventType === "earnings";

          return (
            <div
              key={ev.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-surface p-4 shadow-sm hover:border-accent/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onSelectTicker(ev.symbol)}
                      className="flex size-10 items-center justify-center rounded-lg bg-bg font-bold font-mono text-sm text-accent hover:bg-accent hover:text-white transition-colors border border-border"
                      title="Посмотреть котировку на графике"
                    >
                      {ev.symbol}
                    </button>
                    <div>
                      <div className="font-semibold text-sm text-fg">{ev.companyName}</div>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium text-[11px]",
                            isEarnings
                              ? "bg-accent-soft text-accent"
                              : "bg-up-soft text-up",
                          )}
                        >
                          {isEarnings ? <TrendingUp className="size-3" /> : <DollarSign className="size-3" />}
                          {isEarnings ? "Квартальный отчет" : "Дивидендная отсечка"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-muted" />
                          {ev.time} МСК
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-fg">
                      {new Date(ev.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-[11px] text-muted">Дата события</div>
                  </div>
                </div>

                {/* Event Details Card */}
                <div className="mt-3 rounded-lg bg-bg/50 p-3 text-xs border border-border/60">
                  {isEarnings ? (
                    <div className="flex items-center justify-between text-muted">
                      <span>Ожидаемый EPS: <strong className="text-fg font-mono">${ev.expectedEps}</strong></span>
                      <span>Прогноз выручки: <strong className="text-fg font-mono">{ev.expectedRevenue}</strong></span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-muted">
                      <span>Дивиденд на акцию:</span>
                      <strong className="text-up font-mono font-semibold">${ev.dividendAmount}</strong>
                    </div>
                  )}
                  <p className="mt-2 text-[11px] text-muted line-clamp-2">{ev.description}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => onSelectTicker(ev.symbol)}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  Анализ акции {ev.symbol} →
                </button>

                <Button
                  size="sm"
                  variant={isAdded ? "outline" : "default"}
                  onClick={() => handleAddToCalendar(ev)}
                  className={cn("h-8 gap-1.5 text-xs", !isAdded && "bg-[#4285F4] hover:bg-[#3367D6]")}
                >
                  {isAdded ? (
                    <>
                      <Check className="size-3.5 text-up" />
                      Добавлено
                    </>
                  ) : (
                    <>
                      <CalendarPlus className="size-3.5" />
                      В Google Календарь
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
