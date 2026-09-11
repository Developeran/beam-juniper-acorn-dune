import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as number, c as string, n as array, o as object, r as boolean, s as record, t as _enum } from "../_libs/zod.mjs";
import { a as exchangeLabel, o as rangeById, r as RANGE_IDS } from "./market-types-DxI6-M7C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market--cMm4usW.js
var YAHOO_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
var SYMBOL_RE = /^[A-Za-z0-9.^_=/-]{1,24}$/;
function assertSymbol(raw) {
	const symbol = raw.trim().toUpperCase();
	if (!SYMBOL_RE.test(symbol)) throw new Error("Некорректный тикер");
	return symbol;
}
var cache = /* @__PURE__ */ new Map();
function fromCache(key, ttlMs) {
	const hit = cache.get(key);
	if (!hit) return null;
	if (Date.now() - hit.at > ttlMs) {
		cache.delete(key);
		return null;
	}
	return hit.data;
}
function toCache(key, data) {
	cache.set(key, {
		at: Date.now(),
		data
	});
	return data;
}
async function yahooJson(url) {
	const res = await fetch(url, {
		headers: {
			"User-Agent": YAHOO_UA,
			Accept: "application/json"
		},
		signal: AbortSignal.timeout(12e3)
	});
	if (!res.ok) throw new Error(`Не удалось загрузить данные (${res.status})`);
	return await res.json();
}
function num(v) {
	return typeof v === "number" && Number.isFinite(v) ? v : 0;
}
function str(v, fallback = "") {
	return typeof v === "string" && v ? v : fallback;
}
function downsample(points, max = 420) {
	if (points.length <= max) return points;
	const step = (points.length - 1) / (max - 1);
	const out = [];
	for (let i = 0; i < max; i++) out.push(points[Math.round(i * step)]);
	return out;
}
function sparkline(closes, max = 28) {
	if (!closes?.length) return [];
	const clean = closes.filter((v) => v != null && Number.isFinite(v));
	if (clean.length < 2) return clean;
	if (clean.length <= max) return clean;
	const step = (clean.length - 1) / (max - 1);
	return Array.from({ length: max }, (_, i) => clean[Math.round(i * step)]);
}
function quoteFromMeta(meta, spark, fallbackSymbol) {
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
		marketTime: num(meta.regularMarketTime) * 1e3,
		spark
	};
}
var getQuotes_createServerFn_handler = createServerRpc({
	id: "fbac33f52a0daa5a2a65572f2d89ee0bcd8d773e8633a0c2922c53cb0bdbdd74",
	name: "getQuotes",
	filename: "src/lib/market.ts"
}, (opts) => getQuotes.__executeServer(opts));
var getQuotes = createServerFn({ method: "POST" }).validator(object({ symbols: array(string()).min(1).max(40) })).handler(getQuotes_createServerFn_handler, async ({ data }) => {
	const symbols = [...new Set(data.symbols.map(assertSymbol))];
	const key = `q:${symbols.join(",")}`;
	const cached = fromCache(key, 15e3);
	if (cached) return cached;
	const rows = (await yahooJson("https://query1.finance.yahoo.com/v7/finance/spark?" + new URLSearchParams({
		symbols: symbols.join(","),
		range: "3mo",
		interval: "1d"
	}).toString())).spark?.result ?? [];
	const bySymbol = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const symbol = str(row.symbol);
		const resp = row.response?.[0];
		if (!resp?.meta || !symbol) continue;
		const closes = resp.indicators?.quote?.[0]?.close;
		bySymbol.set(symbol, quoteFromMeta(resp.meta, sparkline(closes), symbol));
	}
	return toCache(key, symbols.map((s) => bySymbol.get(s)).filter((q) => Boolean(q)));
});
async function fetchChartRaw(symbol, range, interval) {
	return yahooJson("https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(symbol) + "?" + new URLSearchParams({
		range,
		interval,
		includePrePost: "false",
		events: "div|split"
	}).toString());
}
function parsePoints(json) {
	const result = json.chart?.result?.[0];
	if (!result?.meta) throw new Error(json.chart?.error?.description ?? "Нет данных по бумаге");
	const ts = result.timestamp ?? [];
	const quote = result.indicators?.quote?.[0];
	const closes = quote?.close ?? [];
	const opens = quote?.open ?? [];
	const points = [];
	let open = null;
	for (let i = 0; i < ts.length; i++) {
		const c = closes[i];
		if (c == null || !Number.isFinite(c)) continue;
		if (open == null && opens[i] != null && Number.isFinite(opens[i])) open = opens[i];
		points.push({
			t: ts[i] * 1e3,
			c
		});
	}
	return {
		meta: result.meta,
		points,
		open
	};
}
var getChart_createServerFn_handler = createServerRpc({
	id: "e7ba96f3582fa61a1e6a4c12c9949c309908c4cad462d84783ed245a07a0ceac",
	name: "getChart",
	filename: "src/lib/market.ts"
}, (opts) => getChart.__executeServer(opts));
var getChart = createServerFn({ method: "POST" }).validator(object({
	symbol: string(),
	range: _enum(RANGE_IDS)
})).handler(getChart_createServerFn_handler, async ({ data }) => {
	const symbol = assertSymbol(data.symbol);
	const range = data.range;
	const spec = rangeById(range);
	const key = `c:${symbol}:${range}`;
	const cached = fromCache(key, 3e4);
	if (cached) return cached;
	const hist = parsePoints(await fetchChartRaw(symbol, spec.yahoo, spec.interval));
	const meta = hist.meta;
	const points = downsample(hist.points);
	let open = hist.open;
	let previousClose = num(meta.previousClose) || num(meta.chartPreviousClose);
	if (range !== "1d") try {
		const day = parsePoints(await fetchChartRaw(symbol, "1d", "1d"));
		open = day.open;
		previousClose = num(day.meta.previousClose) || num(day.meta.chartPreviousClose) || previousClose;
	} catch {}
	const price = num(meta.regularMarketPrice) || (points.at(-1)?.c ?? 0);
	let rangeStart = null;
	let rangeChange = 0;
	let rangeChangePct = 0;
	if (range === "1d") {
		rangeStart = previousClose || points[0]?.c || null;
		if (rangeStart) {
			rangeChange = price - rangeStart;
			rangeChangePct = num(meta.regularMarketChangePercent) || rangeChange / rangeStart * 100;
		}
	} else {
		rangeStart = points[0]?.c ?? null;
		if (rangeStart) {
			rangeChange = price - rangeStart;
			rangeChangePct = rangeChange / rangeStart * 100;
		}
	}
	const exchange = str(meta.exchangeName);
	return toCache(key, {
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
		marketTime: num(meta.regularMarketTime) * 1e3,
		timeZone: str(meta.exchangeTimezoneName) || void 0,
		rangeStart,
		rangeChange,
		rangeChangePct
	});
});
var searchSymbols_createServerFn_handler = createServerRpc({
	id: "6526d28b5af5f698b2c7b1aadfdfd5ec325fff6f69da3f7dc653990e6804737e",
	name: "searchSymbols",
	filename: "src/lib/market.ts"
}, (opts) => searchSymbols.__executeServer(opts));
var searchSymbols = createServerFn({ method: "POST" }).validator(object({ q: string().min(1).max(80) })).handler(searchSymbols_createServerFn_handler, async ({ data }) => {
	const q = data.q.trim();
	if (!q) return [];
	const key = `s:${q.toLowerCase()}`;
	const cached = fromCache(key, 6e4);
	if (cached) return cached;
	const json = await yahooJson("https://query1.finance.yahoo.com/v1/finance/search?" + new URLSearchParams({
		q,
		quotesCount: "10",
		newsCount: "0",
		listsCount: "0"
	}).toString());
	const allowed = /* @__PURE__ */ new Set([
		"EQUITY",
		"ETF",
		"INDEX",
		"CRYPTOCURRENCY",
		"MUTUALFUND",
		"ECNQUOTE"
	]);
	const hits = [];
	for (const row of json.quotes ?? []) {
		const symbol = str(row.symbol);
		if (!symbol || !SYMBOL_RE.test(symbol)) continue;
		const type = str(row.quoteType, "EQUITY");
		if (!allowed.has(type) && type !== "") continue;
		hits.push({
			symbol,
			name: str(row.shortname) || str(row.longname) || symbol,
			exch: str(row.exchDisp),
			type: str(row.typeDisp, type)
		});
		if (hits.length >= 8) break;
	}
	return toCache(key, hits);
});
var explainMove_createServerFn_handler = createServerRpc({
	id: "2bf7888de22fd263c77d5c3316d45b5cad8bcc3eff7578ee88d98d3bb30b31d4",
	name: "explainMove",
	filename: "src/lib/market.ts"
}, (opts) => explainMove.__executeServer(opts));
var explainMove = createServerFn({ method: "POST" }).validator(object({
	symbol: string(),
	name: string(),
	rangeLabel: string(),
	currency: string(),
	start: number().nullable(),
	price: number(),
	changePct: number(),
	changeAbs: number()
})).handler(explainMove_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI недоступен в этой среде"
	};
	const start = data.start != null ? `${data.start.toFixed(2)} ${data.currency}` : "н/д";
	const prompt = [
		`Ты финансовый аналитик. Кратко, на русском, 4–6 предложений объясни, почему бумага могла так измениться за указанный период.`,
		`Бумага: ${data.name} (${data.symbol})`,
		`Период: ${data.rangeLabel}`,
		`Цена на начало периода: ${start}`,
		`Текущая цена: ${data.price.toFixed(2)} ${data.currency}`,
		`Изменение: ${data.changeAbs >= 0 ? "+" : ""}${data.changeAbs.toFixed(2)} ${data.currency} (${data.changePct.toFixed(2)}%)`,
		`Опирайся на известные публичные события (клинические данные, отчётность, макро, сделки, регуляторика). Если не уверен — скажи об этом. Не давай инвестиционных рекомендаций. Без маркированных списков, сплошной текст.`
	].join("\n");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages: [{
				role: "user",
				content: prompt
			}],
			max_tokens: 450,
			temperature: .4
		}),
		signal: AbortSignal.timeout(3e4)
	});
	if (!res.ok) return {
		ok: false,
		error: `Ошибка модели (${res.status})`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Пустой ответ"
	};
	return {
		ok: true,
		text
	};
});
var getPortfolioHistoricalChart_createServerFn_handler = createServerRpc({
	id: "127a987169ec391ad6880045217735076b2629930e2591dfee634e748e576177",
	name: "getPortfolioHistoricalChart",
	filename: "src/lib/market.ts"
}, (opts) => getPortfolioHistoricalChart.__executeServer(opts));
var getPortfolioHistoricalChart = createServerFn({ method: "POST" }).validator(object({
	symbols: array(string()),
	sharesMap: record(string(), number()),
	costPricesMap: record(string(), number()),
	range: _enum(RANGE_IDS),
	includeBenchmark: boolean().optional()
})).handler(getPortfolioHistoricalChart_createServerFn_handler, async ({ data }) => {
	const range = data.range;
	const spec = rangeById(range);
	const symbols = data.symbols;
	const sharesMap = data.sharesMap;
	const costPricesMap = data.costPricesMap;
	const cacheKey = `pfchart:${symbols.slice().sort().join(",")}:${range}:${data.includeBenchmark ? "1" : "0"}`;
	const cached = fromCache(cacheKey, 2e4);
	if (cached) return cached;
	const fetches = symbols.map(async (sym) => {
		const symCacheKey = `symchart:${sym}:${spec.yahoo}:${spec.interval}`;
		const cachedSym = fromCache(symCacheKey, 45e3);
		if (cachedSym) return {
			symbol: sym,
			...cachedSym
		};
		try {
			const parsed = parsePoints(await fetchChartRaw(sym, spec.yahoo, spec.interval));
			const price = num(parsed.meta.regularMarketPrice) || (parsed.points[parsed.points.length - 1]?.c ?? 0);
			const entry = {
				points: parsed.points,
				price
			};
			toCache(symCacheKey, entry);
			return {
				symbol: sym,
				...entry
			};
		} catch {
			return {
				symbol: sym,
				points: [],
				price: costPricesMap[sym] || 100
			};
		}
	});
	let benchmarkPoints = [];
	if (data.includeBenchmark) {
		const benchCacheKey = `symchart:ACWI:${spec.yahoo}:${spec.interval}`;
		const cachedBench = fromCache(benchCacheKey, 45e3);
		if (cachedBench) benchmarkPoints = cachedBench;
		else try {
			benchmarkPoints = parsePoints(await fetchChartRaw("ACWI", spec.yahoo, spec.interval)).points;
			toCache(benchCacheKey, benchmarkPoints);
		} catch {}
	}
	const results = await Promise.all(fetches);
	const allTimestampsSet = /* @__PURE__ */ new Set();
	for (const r of results) for (const p of r.points) allTimestampsSet.add(p.t);
	if (data.includeBenchmark && benchmarkPoints.length > 0) for (const p of benchmarkPoints) allTimestampsSet.add(p.t);
	const allTimestamps = Array.from(allTimestampsSet).sort((a, b) => a - b);
	if (allTimestamps.length === 0) return {
		points: [],
		startValue: 0,
		currentValue: 0,
		change: 0,
		changePct: 0,
		range
	};
	const symbolPointMaps = /* @__PURE__ */ new Map();
	results.forEach((r) => {
		symbolPointMaps.set(r.symbol, r.points);
	});
	const stockPointers = /* @__PURE__ */ new Map();
	const stockPrices = /* @__PURE__ */ new Map();
	for (const sym of symbols) {
		stockPointers.set(sym, 0);
		const firstValidPrice = (symbolPointMaps.get(sym) || [])[0]?.c ?? costPricesMap[sym] ?? 100;
		stockPrices.set(sym, firstValidPrice);
	}
	let benchPtr = 0;
	let benchPrice = benchmarkPoints[0]?.c;
	const benchStartPrice = benchPrice;
	const rawPortfolioPoints = [];
	for (const t of allTimestamps) {
		let totalPortfolioVal = 0;
		for (const sym of symbols) {
			const pts = symbolPointMaps.get(sym) || [];
			let ptr = stockPointers.get(sym) ?? 0;
			while (ptr + 1 < pts.length && pts[ptr + 1].t <= t) {
				ptr++;
				stockPrices.set(sym, pts[ptr].c);
			}
			stockPointers.set(sym, ptr);
			const price = stockPrices.get(sym) ?? costPricesMap[sym] ?? 100;
			const shares = sharesMap[sym] || 1;
			totalPortfolioVal += price * shares;
		}
		let benchRatio = void 0;
		if (data.includeBenchmark && benchmarkPoints.length > 0 && benchStartPrice) {
			while (benchPtr + 1 < benchmarkPoints.length && benchmarkPoints[benchPtr + 1].t <= t) {
				benchPtr++;
				benchPrice = benchmarkPoints[benchPtr].c;
			}
			if (benchPrice) benchRatio = benchPrice / benchStartPrice;
		}
		rawPortfolioPoints.push({
			t,
			value: totalPortfolioVal,
			benchmarkValue: benchRatio
		});
	}
	const startVal = rawPortfolioPoints[0]?.value || 1;
	const currentVal = rawPortfolioPoints[rawPortfolioPoints.length - 1]?.value || 1;
	const change = currentVal - startVal;
	const changePct = startVal > 0 ? change / startVal * 100 : 0;
	if (benchmarkPoints.length > 0) rawPortfolioPoints.forEach((p) => {
		if (p.benchmarkValue !== void 0) p.benchmarkValue = startVal * p.benchmarkValue;
	});
	const lastBench = rawPortfolioPoints[rawPortfolioPoints.length - 1]?.benchmarkValue;
	const benchmarkChangePct = lastBench && startVal > 0 ? (lastBench - startVal) / startVal * 100 : void 0;
	return toCache(cacheKey, {
		points: rawPortfolioPoints.length > 180 ? downsample(rawPortfolioPoints, 180) : rawPortfolioPoints,
		startValue: startVal,
		currentValue: currentVal,
		change,
		changePct,
		benchmarkChangePct,
		range
	});
});
//#endregion
export { explainMove_createServerFn_handler, getChart_createServerFn_handler, getPortfolioHistoricalChart_createServerFn_handler, getQuotes_createServerFn_handler, searchSymbols_createServerFn_handler };
