import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  exchangeLabel,
  rangeById,
  RANGE_IDS,
  type ChartPayload,
  type ChartPoint,
  type Quote,
  type RangeId,
  type SearchHit,
} from "@/lib/market-types";

const YAHOO_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const SYMBOL_RE = /^[A-Za-z0-9.^_=/-]{1,24}$/;

function assertSymbol(raw: string): string {
  const symbol = raw.trim().toUpperCase();
  if (!SYMBOL_RE.test(symbol)) throw new Error("Некорректный тикер");
  return symbol;
}

type CacheEntry<T> = { at: number; data: T };
const cache = new Map<string, CacheEntry<unknown>>();

function fromCache<T>(key: string, ttlMs: number): T | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > ttlMs) {
    cache.delete(key);
    return null;
  }
  return hit.data as T;
}

function toCache<T>(key: string, data: T): T {
  cache.set(key, { at: Date.now(), data });
  return data;
}

async function yahooJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": YAHOO_UA,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) {
    throw new Error(`Не удалось загрузить данные (${res.status})`);
  }
  return (await res.json()) as T;
}

type YahooChart = {
  chart?: {
    result?: Array<{
      meta?: Record<string, unknown>;
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
          open?: Array<number | null>;
          high?: Array<number | null>;
          low?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
    }>;
    error?: { description?: string } | null;
  };
};

type YahooSpark = {
  spark?: {
    result?: Array<{
      symbol?: string;
      response?: YahooChart["chart"] extends infer _ ? YahooChart["chart"] : never;
    }>;
  };
};

type SparkResult = {
  spark?: {
    result?: Array<{
      symbol?: string;
      response?: Array<{
        meta?: Record<string, unknown>;
        timestamp?: number[];
        indicators?: { quote?: Array<{ close?: Array<number | null> }> };
      }>;
    }>;
  };
};

type YahooSearch = {
  quotes?: Array<{
    symbol?: string;
    shortname?: string;
    longname?: string;
    exchDisp?: string;
    quoteType?: string;
    typeDisp?: string;
  }>;
};

function num(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v ? v : fallback;
}

function downsample(points: ChartPoint[], max = 420): ChartPoint[] {
  if (points.length <= max) return points;
  const step = (points.length - 1) / (max - 1);
  const out: ChartPoint[] = [];
  for (let i = 0; i < max; i++) {
    out.push(points[Math.round(i * step)]!);
  }
  return out;
}

function sparkline(closes: Array<number | null> | undefined, max = 28): number[] {
  if (!closes?.length) return [];
  const clean = closes.filter((v): v is number => v != null && Number.isFinite(v));
  if (clean.length < 2) return clean;
  if (clean.length <= max) return clean;
  const step = (clean.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => clean[Math.round(i * step)]!);
}

function quoteFromMeta(
  meta: Record<string, unknown>,
  spark: number[],
  fallbackSymbol: string,
): Quote {
  const symbol = str(meta.symbol, fallbackSymbol);
  const exchange = str(meta.exchangeName);
  return {
    symbol,
    shortName: str(meta.shortName, symbol),
    longName: str(meta.longName, str(meta.shortName, symbol)),
    exchange,
    exchangeLabel: exchangeLabel(exchange),
    currency: str(meta.currency, "USD"),
    price: num(meta.regularMarketPrice),
    changePct: num(meta.regularMarketChangePercent),
    previousClose: num(meta.previousClose) || num(meta.chartPreviousClose),
    dayHigh: num(meta.regularMarketDayHigh),
    dayLow: num(meta.regularMarketDayLow),
    week52High: num(meta.fiftyTwoWeekHigh),
    week52Low: num(meta.fiftyTwoWeekLow),
    volume: num(meta.regularMarketVolume),
    priceHint: num(meta.priceHint) || 2,
    marketTime: num(meta.regularMarketTime) * 1000,
    spark,
  };
}

export const getQuotes = createServerFn({ method: "POST" })
  .validator(z.object({ symbols: z.array(z.string()).min(1).max(40) }))
  .handler(async ({ data }): Promise<Quote[]> => {
    const symbols = [...new Set(data.symbols.map(assertSymbol))];
    const key = `q:${symbols.join(",")}`;
    const cached = fromCache<Quote[]>(key, 15_000);
    if (cached) return cached;

    const url =
      "https://query1.finance.yahoo.com/v7/finance/spark?" +
      new URLSearchParams({
        symbols: symbols.join(","),
        range: "3mo",
        interval: "1d",
      }).toString();

    const json = await yahooJson<SparkResult>(url);
    const rows = json.spark?.result ?? [];
    const bySymbol = new Map<string, Quote>();
    for (const row of rows) {
      const symbol = str(row.symbol);
      const resp = row.response?.[0];
      if (!resp?.meta || !symbol) continue;
      const closes = resp.indicators?.quote?.[0]?.close;
      bySymbol.set(symbol, quoteFromMeta(resp.meta, sparkline(closes), symbol));
    }
    const ordered = symbols
      .map((s) => bySymbol.get(s))
      .filter((q): q is Quote => Boolean(q));
    return toCache(key, ordered);
  });

async function fetchChartRaw(symbol: string, range: string, interval: string) {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/" +
    encodeURIComponent(symbol) +
    "?" +
    new URLSearchParams({
      range,
      interval,
      includePrePost: "false",
      events: "div|split",
    }).toString();
  return yahooJson<YahooChart>(url);
}

function parsePoints(json: YahooChart): {
  meta: Record<string, unknown>;
  points: ChartPoint[];
  open: number | null;
} {
  const result = json.chart?.result?.[0];
  if (!result?.meta) {
    throw new Error(json.chart?.error?.description ?? "Нет данных по бумаге");
  }
  const ts = result.timestamp ?? [];
  const quote = result.indicators?.quote?.[0];
  const closes = quote?.close ?? [];
  const opens = quote?.open ?? [];
  const points: ChartPoint[] = [];
  let open: number | null = null;
  for (let i = 0; i < ts.length; i++) {
    const c = closes[i];
    if (c == null || !Number.isFinite(c)) continue;
    if (open == null && opens[i] != null && Number.isFinite(opens[i])) {
      open = opens[i] as number;
    }
    points.push({ t: ts[i]! * 1000, c });
  }
  return { meta: result.meta, points, open };
}

export const getChart = createServerFn({ method: "POST" })
  .validator(
    z.object({
      symbol: z.string(),
      range: z.enum(RANGE_IDS),
    }),
  )
  .handler(async ({ data }): Promise<ChartPayload> => {
    const symbol = assertSymbol(data.symbol);
    const range = data.range as RangeId;
    const spec = rangeById(range);
    const key = `c:${symbol}:${range}`;
    const cached = fromCache<ChartPayload>(key, 30_000);
    if (cached) return cached;

    const histJson = await fetchChartRaw(symbol, spec.yahoo, spec.interval);
    const hist = parsePoints(histJson);
    const meta = hist.meta;
    const points = downsample(hist.points);

    let open = hist.open;
    let previousClose =
      num(meta.previousClose) || num(meta.chartPreviousClose);
    if (range !== "1d") {
      try {
        const dayJson = await fetchChartRaw(symbol, "1d", "1d");
        const day = parsePoints(dayJson);
        open = day.open;
        previousClose =
          num(day.meta.previousClose) ||
          num(day.meta.chartPreviousClose) ||
          previousClose;
      } catch {
        /* keep range-level fallbacks */
      }
    }

    const price = num(meta.regularMarketPrice) || (points.at(-1)?.c ?? 0);
    let rangeStart: number | null = null;
    let rangeChange = 0;
    let rangeChangePct = 0;

    if (range === "1d") {
      rangeStart = previousClose || points[0]?.c || null;
      if (rangeStart) {
        rangeChange = price - rangeStart;
        rangeChangePct = num(meta.regularMarketChangePercent) || (rangeChange / rangeStart) * 100;
      }
    } else {
      rangeStart = points[0]?.c ?? null;
      if (rangeStart) {
        rangeChange = price - rangeStart;
        rangeChangePct = (rangeChange / rangeStart) * 100;
      }
    }

    const exchange = str(meta.exchangeName);
    const payload: ChartPayload = {
      symbol: str(meta.symbol, symbol),
      currency: str(meta.currency, "USD"),
      priceHint: num(meta.priceHint) || 2,
      price,
      name: str(meta.shortName, symbol),
      longName: str(meta.longName, str(meta.shortName, symbol)),
      exchange,
      exchangeLabel: exchangeLabel(exchange),
      points,
      open,
      dayHigh: num(meta.regularMarketDayHigh),
      dayLow: num(meta.regularMarketDayLow),
      previousClose,
      week52High: num(meta.fiftyTwoWeekHigh),
      week52Low: num(meta.fiftyTwoWeekLow),
      volume: num(meta.regularMarketVolume),
      marketTime: num(meta.regularMarketTime) * 1000,
      timeZone: str(meta.exchangeTimezoneName) || undefined,
      rangeStart,
      rangeChange,
      rangeChangePct,
    };
    return toCache(key, payload);
  });

export const searchSymbols = createServerFn({ method: "POST" })
  .validator(z.object({ q: z.string().min(1).max(80) }))
  .handler(async ({ data }): Promise<SearchHit[]> => {
    const q = data.q.trim();
    if (!q) return [];
    const key = `s:${q.toLowerCase()}`;
    const cached = fromCache<SearchHit[]>(key, 60_000);
    if (cached) return cached;

    const url =
      "https://query1.finance.yahoo.com/v1/finance/search?" +
      new URLSearchParams({
        q,
        quotesCount: "10",
        newsCount: "0",
        listsCount: "0",
      }).toString();
    const json = await yahooJson<YahooSearch>(url);
    const allowed = new Set([
      "EQUITY",
      "ETF",
      "INDEX",
      "CRYPTOCURRENCY",
      "MUTUALFUND",
      "ECNQUOTE",
    ]);
    const hits: SearchHit[] = [];
    for (const row of json.quotes ?? []) {
      const symbol = str(row.symbol);
      if (!symbol || !SYMBOL_RE.test(symbol)) continue;
      const type = str(row.quoteType, "EQUITY");
      if (!allowed.has(type) && type !== "") continue;
      hits.push({
        symbol,
        name: str(row.shortname) || str(row.longname) || symbol,
        exch: str(row.exchDisp),
        type: str(row.typeDisp, type),
      });
      if (hits.length >= 8) break;
    }
    return toCache(key, hits);
  });

export const explainMove = createServerFn({ method: "POST" })
  .validator(
    z.object({
      symbol: z.string(),
      name: z.string(),
      rangeLabel: z.string(),
      currency: z.string(),
      start: z.number().nullable(),
      price: z.number(),
      changePct: z.number(),
      changeAbs: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI недоступен в этой среде" };
    }
    const start =
      data.start != null
        ? `${data.start.toFixed(2)} ${data.currency}`
        : "н/д";
    const prompt = [
      `Ты финансовый аналитик. Кратко, на русском, 4–6 предложений объясни, почему бумага могла так измениться за указанный период.`,
      `Бумага: ${data.name} (${data.symbol})`,
      `Период: ${data.rangeLabel}`,
      `Цена на начало периода: ${start}`,
      `Текущая цена: ${data.price.toFixed(2)} ${data.currency}`,
      `Изменение: ${data.changeAbs >= 0 ? "+" : ""}${data.changeAbs.toFixed(2)} ${data.currency} (${data.changePct.toFixed(2)}%)`,
      `Опирайся на известные публичные события (клинические данные, отчётность, макро, сделки, регуляторика). Если не уверен — скажи об этом. Не давай инвестиционных рекомендаций. Без маркированных списков, сплошной текст.`,
    ].join("\n");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 450,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      return { ok: false as const, error: `Ошибка модели (${res.status})` };
    }
    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Пустой ответ" };
    return { ok: true as const, text };
  });

export type PortfolioChartPoint = {
  t: number;
  value: number;
  benchmarkValue?: number;
};

export type PortfolioChartResponse = {
  points: PortfolioChartPoint[];
  startValue: number;
  currentValue: number;
  change: number;
  changePct: number;
  benchmarkChangePct?: number;
  range: RangeId;
};

export const getPortfolioHistoricalChart = createServerFn({ method: "POST" })
  .validator(
    z.object({
      symbols: z.array(z.string()),
      sharesMap: z.record(z.string(), z.number()),
      costPricesMap: z.record(z.string(), z.number()),
      range: z.enum(RANGE_IDS),
      includeBenchmark: z.boolean().optional(),
    }),
  )
  .handler(async ({ data }): Promise<PortfolioChartResponse> => {
    const range = data.range as RangeId;
    const spec = rangeById(range);
    const symbols = data.symbols;
    const sharesMap = data.sharesMap;
    const costPricesMap = data.costPricesMap;

    const cacheKey = `pfchart:${symbols.slice().sort().join(",")}:${range}:${data.includeBenchmark ? "1" : "0"}`;
    const cached = fromCache<PortfolioChartResponse>(cacheKey, 20_000);
    if (cached) return cached;

    // Fetch each constituent using individual cache so multiple portfolios share data
    const fetches = symbols.map(async (sym) => {
      const symCacheKey = `symchart:${sym}:${spec.yahoo}:${spec.interval}`;
      const cachedSym = fromCache<{ points: ChartPoint[]; price: number }>(symCacheKey, 45_000);
      if (cachedSym) return { symbol: sym, ...cachedSym };

      try {
        const raw = await fetchChartRaw(sym, spec.yahoo, spec.interval);
        const parsed = parsePoints(raw);
        const price = num(parsed.meta.regularMarketPrice) || (parsed.points[parsed.points.length - 1]?.c ?? 0);
        const entry = { points: parsed.points, price };
        toCache(symCacheKey, entry);
        return { symbol: sym, ...entry };
      } catch {
        return {
          symbol: sym,
          points: [] as ChartPoint[],
          price: costPricesMap[sym] || 100,
        };
      }
    });

    let benchmarkPoints: ChartPoint[] = [];
    if (data.includeBenchmark) {
      const benchCacheKey = `symchart:ACWI:${spec.yahoo}:${spec.interval}`;
      const cachedBench = fromCache<ChartPoint[]>(benchCacheKey, 45_000);
      if (cachedBench) {
        benchmarkPoints = cachedBench;
      } else {
        try {
          const rawBench = await fetchChartRaw("ACWI", spec.yahoo, spec.interval);
          benchmarkPoints = parsePoints(rawBench).points;
          toCache(benchCacheKey, benchmarkPoints);
        } catch {
          // ignore benchmark error
        }
      }
    }

    const results = await Promise.all(fetches);

    // Collect all chronological timestamps
    const allTimestampsSet = new Set<number>();
    for (const r of results) {
      for (const p of r.points) {
        allTimestampsSet.add(p.t);
      }
    }
    if (data.includeBenchmark && benchmarkPoints.length > 0) {
      for (const p of benchmarkPoints) {
        allTimestampsSet.add(p.t);
      }
    }

    const allTimestamps = Array.from(allTimestampsSet).sort((a, b) => a - b);
    if (allTimestamps.length === 0) {
      return {
        points: [],
        startValue: 0,
        currentValue: 0,
        change: 0,
        changePct: 0,
        range,
      };
    }

    const symbolPointMaps = new Map<string, ChartPoint[]>();
    results.forEach((r) => {
      symbolPointMaps.set(r.symbol, r.points);
    });

    // Chronological sweep with Last Observation Carried Forward (LOCF)
    const stockPointers = new Map<string, number>();
    const stockPrices = new Map<string, number>();

    for (const sym of symbols) {
      stockPointers.set(sym, 0);
      const pts = symbolPointMaps.get(sym) || [];
      const firstValidPrice = pts[0]?.c ?? costPricesMap[sym] ?? 100;
      stockPrices.set(sym, firstValidPrice);
    }

    let benchPtr = 0;
    let benchPrice = benchmarkPoints[0]?.c;
    const benchStartPrice = benchPrice;

    const rawPortfolioPoints: PortfolioChartPoint[] = [];

    for (const t of allTimestamps) {
      let totalPortfolioVal = 0;

      for (const sym of symbols) {
        const pts = symbolPointMaps.get(sym) || [];
        let ptr = stockPointers.get(sym) ?? 0;
        while (ptr + 1 < pts.length && pts[ptr + 1]!.t <= t) {
          ptr++;
          stockPrices.set(sym, pts[ptr]!.c);
        }
        stockPointers.set(sym, ptr);

        const price = stockPrices.get(sym) ?? costPricesMap[sym] ?? 100;
        const shares = sharesMap[sym] || 1;
        totalPortfolioVal += price * shares;
      }

      let benchRatio: number | undefined = undefined;
      if (data.includeBenchmark && benchmarkPoints.length > 0 && benchStartPrice) {
        while (benchPtr + 1 < benchmarkPoints.length && benchmarkPoints[benchPtr + 1]!.t <= t) {
          benchPtr++;
          benchPrice = benchmarkPoints[benchPtr]!.c;
        }
        if (benchPrice) {
          benchRatio = benchPrice / benchStartPrice;
        }
      }

      rawPortfolioPoints.push({
        t,
        value: totalPortfolioVal,
        benchmarkValue: benchRatio,
      });
    }

    const startVal = rawPortfolioPoints[0]?.value || 1;
    const currentVal = rawPortfolioPoints[rawPortfolioPoints.length - 1]?.value || 1;
    const change = currentVal - startVal;
    const changePct = startVal > 0 ? (change / startVal) * 100 : 0;

    // Scale benchmark line to startVal for visual alignment
    if (benchmarkPoints.length > 0) {
      rawPortfolioPoints.forEach((p) => {
        if (p.benchmarkValue !== undefined) {
          p.benchmarkValue = startVal * p.benchmarkValue;
        }
      });
    }

    const lastBench = rawPortfolioPoints[rawPortfolioPoints.length - 1]?.benchmarkValue;
    const benchmarkChangePct =
      lastBench && startVal > 0 ? ((lastBench - startVal) / startVal) * 100 : undefined;

    // Downsample if over 180 points for buttery-smooth SVG rendering
    const finalPoints =
      rawPortfolioPoints.length > 180
        ? (downsample(rawPortfolioPoints as unknown as ChartPoint[], 180) as unknown as PortfolioChartPoint[])
        : rawPortfolioPoints;

    const response: PortfolioChartResponse = {
      points: finalPoints,
      startValue: startVal,
      currentValue: currentVal,
      change,
      changePct,
      benchmarkChangePct,
      range,
    };

    return toCache(cacheKey, response);
  });

