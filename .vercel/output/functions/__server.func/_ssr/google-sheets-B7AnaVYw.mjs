import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { c as string, o as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/google-sheets-B7AnaVYw.js
var DEFAULT_BENCHMARK_INDICATIVE = {
	symbol: "ACWI",
	rawSymbol: "NASDAQ:ACWI",
	name: "iShares MSCI ACWI ETF",
	shares: 127113,
	costPrice: 157.34,
	costValue: 19999959,
	sheetPrice: 159,
	sheetValue: 20184273,
	pnlUsd: 184314,
	pnlPct: .92
};
var DEFAULT_SHEET_WATCHLIST_POINTS = [
	{
		date: "6/16/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-16T12:00:00Z")).getTime(),
		mainPortfolio: 100,
		modelPortfolio: 100,
		benchmark: 100
	},
	{
		date: "6/17/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-17T12:00:00Z")).getTime(),
		mainPortfolio: 101.29,
		modelPortfolio: 103.99,
		benchmark: 99.03
	},
	{
		date: "6/18/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-18T12:00:00Z")).getTime(),
		mainPortfolio: 105.09,
		modelPortfolio: 108.31,
		benchmark: 100.25
	},
	{
		date: "6/19/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-19T12:00:00Z")).getTime(),
		mainPortfolio: 106.34,
		modelPortfolio: 105.62,
		benchmark: 100.16
	},
	{
		date: "6/23/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-23T12:00:00Z")).getTime(),
		mainPortfolio: 99.51,
		modelPortfolio: 105.76,
		benchmark: 98.16
	},
	{
		date: "6/24/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-24T12:00:00Z")).getTime(),
		mainPortfolio: 99.6,
		modelPortfolio: 103.38,
		benchmark: 98.02
	},
	{
		date: "6/25/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-25T12:00:00Z")).getTime(),
		mainPortfolio: 102.05,
		modelPortfolio: 103.24,
		benchmark: 98.32
	},
	{
		date: "6/26/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-26T12:00:00Z")).getTime(),
		mainPortfolio: 98.66,
		modelPortfolio: 103.23,
		benchmark: 98.06
	},
	{
		date: "6/29/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-29T12:00:00Z")).getTime(),
		mainPortfolio: 102.02,
		modelPortfolio: 102.25,
		benchmark: 99.03
	},
	{
		date: "6/30/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-06-30T12:00:00Z")).getTime(),
		mainPortfolio: 105.43,
		modelPortfolio: 106.55,
		benchmark: 99.76
	},
	{
		date: "7/1/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-01T12:00:00Z")).getTime(),
		mainPortfolio: 99.95,
		modelPortfolio: 105.42,
		benchmark: 99.22
	},
	{
		date: "7/2/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-02T12:00:00Z")).getTime(),
		mainPortfolio: 96.07,
		modelPortfolio: 102.95,
		benchmark: 99.24
	},
	{
		date: "7/3/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-03T12:00:00Z")).getTime(),
		mainPortfolio: 99.19,
		modelPortfolio: 106.85,
		benchmark: 100.4
	},
	{
		date: "7/7/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-07T12:00:00Z")).getTime(),
		mainPortfolio: 95.01,
		modelPortfolio: 103.43,
		benchmark: 99.44
	},
	{
		date: "7/8/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-08T12:00:00Z")).getTime(),
		mainPortfolio: 95.55,
		modelPortfolio: 101.69,
		benchmark: 99.08
	},
	{
		date: "7/9/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-09T12:00:00Z")).getTime(),
		mainPortfolio: 97.93,
		modelPortfolio: 104.61,
		benchmark: 99.8
	},
	{
		date: "7/10/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-10T12:00:00Z")).getTime(),
		mainPortfolio: 96.99,
		modelPortfolio: 103.86,
		benchmark: 100.22
	},
	{
		date: "7/13/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-13T12:00:00Z")).getTime(),
		mainPortfolio: 93.69,
		modelPortfolio: 100.46,
		benchmark: 99.11
	},
	{
		date: "7/14/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-14T12:00:00Z")).getTime(),
		mainPortfolio: 97.3,
		modelPortfolio: 99.09,
		benchmark: 99.75
	},
	{
		date: "7/15/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-15T12:00:00Z")).getTime(),
		mainPortfolio: 96.6,
		modelPortfolio: 98.79,
		benchmark: 100.11
	},
	{
		date: "7/16/2026",
		timestamp: (/* @__PURE__ */ new Date("2026-07-16T12:00:00Z")).getTime(),
		mainPortfolio: 93.21,
		modelPortfolio: 95.71,
		benchmark: 99.38
	}
];
function normalizeGoogleTicker(rawTicker) {
	let clean = rawTicker.trim();
	if (clean.includes(":")) {
		const parts = clean.split(":");
		const exchange = parts[0].toUpperCase();
		const sym = parts[1].trim().toUpperCase();
		if (exchange === "AMS") return "ASML";
		if (exchange === "EPA" || exchange === "PAR") return `${sym}.PA`;
		if (exchange === "LON" || exchange === "LSE") return `${sym}.L`;
		return sym;
	}
	return clean.toUpperCase();
}
function extractSheetIdAndGid(urlOrId) {
	const trimmed = urlOrId.trim();
	if (!trimmed) return null;
	if (/^[a-zA-Z0-9_-]{20,60}$/.test(trimmed)) return {
		sheetId: trimmed,
		gid: "0"
	};
	const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
	if (!match) return null;
	const sheetId = match[1];
	const gidMatch = trimmed.match(/[?&#]gid=([0-9]+)/);
	return {
		sheetId,
		gid: gidMatch ? gidMatch[1] : "0"
	};
}
function parseCsvRows(csvText) {
	const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
	const result = [];
	for (const line of lines) {
		const row = [];
		let current = "";
		let inQuotes = false;
		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			if (char === "\"") {
				if (inQuotes && line[i + 1] === "\"") {
					current += "\"";
					i++;
				} else inQuotes = !inQuotes;
			} else if (char === "," && !inQuotes) {
				row.push(current.trim());
				current = "";
			} else current += char;
		}
		row.push(current.trim());
		result.push(row);
	}
	return result;
}
function parseNum(val, fallback = 0) {
	if (!val) return fallback;
	const clean = val.replace(/["'%$+\s]/g, "").replace(",", ".");
	const num = parseFloat(clean);
	return isNaN(num) ? fallback : num;
}
function parseSheetWatchlistCsv(csvText) {
	const rows = parseCsvRows(csvText);
	const points = [];
	for (const row of rows) {
		if (!row || row.length < 4) continue;
		const dateStr = row[0]?.trim() || "";
		if (!dateStr || /date|дата/i.test(dateStr)) continue;
		const parsedDate = new Date(dateStr);
		const timestamp = isNaN(parsedDate.getTime()) ? Date.now() : parsedDate.getTime();
		const mainPortfolio = parseNum(row[1], 100);
		const modelPortfolio = parseNum(row[2], 100);
		const benchmark = parseNum(row[3], 100);
		points.push({
			date: dateStr,
			timestamp,
			mainPortfolio,
			modelPortfolio,
			benchmark
		});
	}
	return points.sort((a, b) => a.timestamp - b.timestamp);
}
function parsePortfolioDataFromRows(rows) {
	let currentGroup = "Основной портфель";
	const holdings = [];
	let benchmark = { ...DEFAULT_BENCHMARK_INDICATIVE };
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		if (!row || row.length === 0) continue;
		const firstCell = row[0]?.trim() || "";
		const secondCell = row[1]?.trim() || "";
		if (/GEMINI/i.test(firstCell) || /GEMINI/i.test(secondCell)) {
			currentGroup = "Six sectors";
			continue;
		}
		if (/CLAUDE/i.test(firstCell) || /CLAUDE/i.test(secondCell)) {
			currentGroup = "Infa plus banks";
			continue;
		}
		if (/AI plus finance/i.test(secondCell) || /AI plus finance/i.test(firstCell)) {
			currentGroup = "AI plus finance";
			continue;
		}
		if (/BENCHMARK/i.test(firstCell) || /BENCHMARK/i.test(secondCell)) continue;
		if (/ACWI/i.test(firstCell) || /ACWI/i.test(secondCell)) {
			benchmark = {
				symbol: "ACWI",
				rawSymbol: firstCell || "NASDAQ:ACWI",
				name: secondCell || "iShares MSCI ACWI ETF",
				shares: parseNum(row[2], 127113),
				costPrice: parseNum(row[3], 157.34),
				costValue: parseNum(row[4], 19999959),
				sheetPrice: parseNum(row[6], 159),
				sheetValue: parseNum(row[7], 20184273),
				pnlUsd: parseNum(row[8], 184314),
				pnlPct: parseNum(row[9], .92)
			};
			continue;
		}
		if (/^(ticker|тикер)$/i.test(firstCell)) {
			if (i > 35 && currentGroup !== "AI plus finance") currentGroup = "AI plus finance";
			continue;
		}
		if (firstCell === "" || /balance|баланс/i.test(secondCell)) continue;
		if (/^[A-Za-z0-9.:_-]{1,16}$/.test(firstCell)) {
			const rawSymbol = firstCell;
			const symbol = normalizeGoogleTicker(firstCell);
			const stockName = secondCell || symbol;
			const shares = parseNum(row[2], 1);
			const costPrice = parseNum(row[3], 0);
			const costValue = parseNum(row[4], shares * costPrice);
			const rateToUsd = parseNum(row[5], 1);
			const sheetPrice = parseNum(row[6], costPrice);
			const sheetValue = parseNum(row[7], shares * sheetPrice);
			const sheetPnlUsd = parseNum(row[8], sheetValue - costValue);
			const sheetPnlPct = parseNum(row[9], costValue > 0 ? sheetPnlUsd / costValue * 100 : 0);
			holdings.push({
				id: `${symbol}-${currentGroup}-${i}`,
				symbol,
				rawSymbol,
				stockName,
				portfolioGroup: currentGroup,
				formationDate: "16.06",
				shares,
				costPrice,
				costValue,
				rateToUsd,
				sheetPrice,
				sheetValue,
				sheetPnlUsd,
				sheetPnlPct,
				notes: `${stockName} • ${currentGroup}`
			});
		}
	}
	return {
		holdings,
		benchmark
	};
}
var fetchSheetData_createServerFn_handler = createServerRpc({
	id: "c3bf7882619a523e48b9c5d821a31eccf348c893591eb3fd9843ff2c883403bd",
	name: "fetchSheetData",
	filename: "src/lib/google-sheets.ts"
}, (opts) => fetchSheetData.__executeServer(opts));
var fetchSheetData = createServerFn({ method: "POST" }).validator((d) => object({ urlOrId: string() }).parse(d)).handler(fetchSheetData_createServerFn_handler, async ({ data }) => {
	const parsed = extractSheetIdAndGid(data.urlOrId);
	if (!parsed) return {
		success: false,
		error: "Неверный формат ссылки. Укажите ссылку на Google Таблицу вида https://docs.google.com/spreadsheets/d/..."
	};
	const exportUrl = `https://docs.google.com/spreadsheets/d/${parsed.sheetId}/export?format=csv&gid=${parsed.gid}`;
	try {
		const res = await fetch(exportUrl, {
			headers: {
				Accept: "text/csv, text/plain",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
			},
			signal: AbortSignal.timeout(1e4)
		});
		if (res.status === 401 || res.status === 403) return {
			success: false,
			error: "Таблица закрыта настройками приватности (401/403). Пожалуйста, откройте доступ по ссылке: в таблице нажмите «Поделиться» → «Все, у кого есть ссылка: Читатель».",
			isPrivate: true,
			sheetId: parsed.sheetId
		};
		if (!res.ok) return {
			success: false,
			error: `Ошибка сервера Google при скачивании таблицы (HTTP ${res.status}).`
		};
		const rows = parseCsvRows(await res.text());
		const parsedData = parsePortfolioDataFromRows(rows);
		if (parsedData.holdings.length === 0) return {
			success: false,
			error: "Не удалось обнаружить тикеры в таблице. Проверьте формат строк."
		};
		let watchlistHistory = DEFAULT_SHEET_WATCHLIST_POINTS;
		try {
			const wlExportUrl = `https://docs.google.com/spreadsheets/d/${parsed.sheetId}/export?format=csv&gid=513266484`;
			const wlRes = await fetch(wlExportUrl, {
				headers: {
					Accept: "text/csv, text/plain",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
				},
				signal: AbortSignal.timeout(6e3)
			});
			if (wlRes.ok) {
				const parsedPoints = parseSheetWatchlistCsv(await wlRes.text());
				if (parsedPoints.length > 0) watchlistHistory = parsedPoints;
			}
		} catch {}
		return {
			success: true,
			holdings: parsedData.holdings,
			benchmark: parsedData.benchmark,
			watchlistHistory,
			sheetId: parsed.sheetId,
			rowCount: rows.length
		};
	} catch (err) {
		return {
			success: false,
			error: `Не удалось связаться с Google Таблицами: ${err instanceof Error ? err.message : String(err)}`
		};
	}
});
//#endregion
export { fetchSheetData_createServerFn_handler };
