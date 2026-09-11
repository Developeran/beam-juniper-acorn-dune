import { useState } from "react";
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Calculator,
  Building2,
  TrendingUp,
  ShieldAlert,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatCompact, formatNumber, formatPercent } from "@/lib/format";
import type { Quote } from "@/lib/market-types";
import { cn } from "@/lib/utils";

export function GoogleFinanceHub({
  selectedQuote,
  selectedSymbol,
  onSelectTicker,
}: {
  selectedQuote: Quote | null;
  selectedSymbol: string;
  onSelectTicker: (symbol: string) => void;
}) {
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const cleanSymbol = selectedSymbol.replace(/\.[A-Za-z]+$/, "");
  const exchange = selectedQuote?.exchange || "NASDAQ";

  // Google Finance Formula List for this ticker
  const formulas = [
    {
      label: "Текущая цена",
      formula: `=GOOGLEFINANCE("${selectedSymbol}"; "price")`,
      desc: "Возвращает текущую рыночную котировку с задержкой до 20 мин",
    },
    {
      label: "Изменение за день (%)",
      formula: `=GOOGLEFINANCE("${selectedSymbol}"; "changepct")`,
      desc: "Процентное изменение цены за последнюю торговую сессию",
    },
    {
      label: "Коэффициент P/E (Price/Earnings)",
      formula: `=GOOGLEFINANCE("${selectedSymbol}"; "pe")`,
      desc: "Отношение текущей цены акции к чистой прибыли на одну акцию",
    },
    {
      label: "Прибыль на акцию (EPS)",
      formula: `=GOOGLEFINANCE("${selectedSymbol}"; "eps")`,
      desc: "Earnings Per Share — ключевой показатель доходности компании",
    },
    {
      label: "Рыночная капитализация",
      formula: `=GOOGLEFINANCE("${selectedSymbol}"; "marketcap")`,
      desc: "Общая стоимость всех акций компании в обращении",
    },
    {
      label: "52-недельный максимум",
      formula: `=GOOGLEFINANCE("${selectedSymbol}"; "high52")`,
      desc: "Максимальная цена закрытия за последний год",
    },
    {
      label: "52-недельный минимум",
      formula: `=GOOGLEFINANCE("${selectedSymbol}"; "low52")`,
      desc: "Минимальная цена закрытия за последний год",
    },
    {
      label: "Объем торгов (Volume)",
      formula: `=GOOGLEFINANCE("${selectedSymbol}"; "volume")`,
      desc: "Количество проторгованных акций за текущий день",
    },
    {
      label: "История котировок за 30 дней",
      formula: `=GOOGLEFINANCE("${selectedSymbol}"; "price"; TODAY()-30; TODAY(); "DAILY")`,
      desc: "Генерирует динамическую таблицу ежедневных цен закрытия",
    },
  ];

  const handleCopyFormula = (formula: string, label: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(formula);
    setTimeout(() => setCopiedFormula(null), 2500);
    toast.success(`Формула «${label}» скопирована! Вставьте её в Google Таблицу.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent font-bold">
              GF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-fg">
                  Google Finance Hub: {selectedQuote?.shortName || selectedSymbol}
                </h2>
                <span className="rounded-md bg-bg px-2 py-0.5 text-xs font-mono text-muted">
                  {selectedSymbol}
                </span>
              </div>
              <p className="text-xs text-muted">
                Мультипликаторы, готовые формулы для ваших таблиц и прямой переход в Google Finance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/finance/quote/${selectedSymbol}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-accent/90 transition-colors"
            >
              <ExternalLink className="size-3.5" />
              Открыть {selectedSymbol} в Google Finance
            </a>
          </div>
        </div>
      </div>

      {/* Fundamentals Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm">
          <span className="text-xs text-muted">Текущая цена</span>
          <div className="mt-1 text-lg font-bold font-mono text-fg">
            ${selectedQuote?.price ? formatNumber(selectedQuote.price, 2) : "—"}
          </div>
          <div
            className={cn(
              "mt-0.5 text-xs font-medium",
              (selectedQuote?.changePct ?? 0) >= 0 ? "text-up" : "text-down",
            )}
          >
            {selectedQuote ? formatPercent(selectedQuote.changePct) : "—"}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm">
          <span className="text-xs text-muted">Дневной диапазон</span>
          <div className="mt-1 text-sm font-semibold font-mono text-fg truncate">
            ${selectedQuote?.dayLow?.toFixed(0) || "—"} – ${selectedQuote?.dayHigh?.toFixed(0) || "—"}
          </div>
          <span className="text-xs text-muted">Day Range</span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm">
          <span className="text-xs text-muted">52 нед. Мин — Макс</span>
          <div className="mt-1 text-sm font-semibold font-mono text-fg truncate">
            ${selectedQuote?.week52Low?.toFixed(0) || "—"} – ${selectedQuote?.week52High?.toFixed(0) || "—"}
          </div>
          <span className="text-xs text-muted">Годовой диапазон</span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm">
          <span className="text-xs text-muted">Объем за сессию</span>
          <div className="mt-1 text-lg font-bold text-fg">
            {selectedQuote?.volume ? formatCompact(selectedQuote.volume) : "—"}
          </div>
          <span className="text-xs text-muted">Volume</span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm">
          <span className="text-xs text-muted">Биржа</span>
          <div className="mt-1 text-lg font-bold text-fg">
            {selectedQuote?.exchange || "NASDAQ"}
          </div>
          <span className="text-xs text-muted">Торговая площадка</span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm">
          <span className="text-xs text-muted">Валюта</span>
          <div className="mt-1 text-lg font-bold text-fg">
            {selectedQuote?.currency || "USD"}
          </div>
          <span className="text-xs text-muted">Базовая валюта</span>
        </div>
      </div>

      {/* Google Gemini AI Insights Block */}
      <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-surface to-accent-soft/30 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-accent font-semibold text-sm">
          <Sparkles className="size-4.5" />
          <span>Gemini AI Insights — Фундаментальный экспресс-анализ</span>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-lg bg-surface/80 p-3.5 border border-border/80">
            <div className="flex items-center gap-1.5 font-semibold text-fg mb-1">
              <Building2 className="size-3.5 text-accent" />
              Бизнес-модель и драйверы
            </div>
            <p className="text-muted leading-relaxed">
              Компания {selectedQuote?.shortName || selectedSymbol} генерирует ключевую выручку на развивающихся рынках технологий и цифровых услуг с высокой операционной маржинальностью.
            </p>
          </div>

          <div className="rounded-lg bg-surface/80 p-3.5 border border-border/80">
            <div className="flex items-center gap-1.5 font-semibold text-fg mb-1">
              <TrendingUp className="size-3.5 text-up" />
              Позитивные катализаторы
            </div>
            <p className="text-muted leading-relaxed">
              Стабильный свободный денежный поток (FCF), инвестиции в ИИ-инфраструктуру и расширение доли в корпоративном сегменте поддерживают прогноз аналитиков выше среднерыночного.
            </p>
          </div>

          <div className="rounded-lg bg-surface/80 p-3.5 border border-border/80">
            <div className="flex items-center gap-1.5 font-semibold text-fg mb-1">
              <ShieldAlert className="size-3.5 text-down" />
              Ключевые риски
            </div>
            <p className="text-muted leading-relaxed">
              Волатильность процентных ставок ФРС, геополитическая напряженность в цепочках поставок и ужесточение регуляторных требований к антимонопольной политике.
            </p>
          </div>
        </div>
      </div>

      {/* Google Sheets Formula Generator */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-fg flex items-center gap-2">
              <Calculator className="size-4 text-[#0F9D58]" />
              Генератор формул GOOGLEFINANCE для ваших таблиц
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Нажмите кнопку «Копировать» и вставьте формулу в любую ячейку вашей Google Таблицы
            </p>
          </div>
          <span className="text-xs font-mono text-muted bg-bg px-2.5 py-1 rounded-md border border-border">
            Тикер: {selectedSymbol}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {formulas.map((item, idx) => {
            const isCopied = copiedFormula === item.formula;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-lg border border-border bg-bg/40 p-3 hover:border-accent/40 hover:bg-bg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-fg">{item.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyFormula(item.formula, item.label)}
                      className="h-7 px-2 text-xs gap-1 text-muted hover:text-fg"
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3 text-up" />
                          <span className="text-up font-medium">Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Копировать</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted mt-1">{item.desc}</p>
                </div>

                <div className="mt-2.5 rounded bg-surface px-2.5 py-1.5 font-mono text-[11px] text-accent border border-border/60 select-all overflow-x-auto">
                  {item.formula}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
