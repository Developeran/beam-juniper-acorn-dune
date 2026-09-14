//#region node_modules/.nitro/vite/services/ssr/assets/market-types-gv-rWKG5.js
var watchlist_default = {
	version: 1,
	updatedAt: "2026-09-14",
	description: "Централизованный список тикеров наблюдения (Watchlist) Google Market Monitor. Все устройства подтягивают тикеры из этого файла.",
	symbols: [
		"GS",
		"TSM",
		"ASML",
		"LRCX",
		"DRAM",
		"GOOGL",
		"ACWI",
		"GE",
		"RY",
		"KKR",
		"FWONK",
		"PRLB",
		"XMTR",
		"BAC",
		"ARM",
		"QNT",
		"VIRT",
		"AAPL",
		"NVDA",
		"MSFT",
		"TSLA",
		"BTC-USD"
	]
};
var RANGE_IDS = [
	"1d",
	"5d",
	"1mo",
	"6mo",
	"ytd",
	"1y",
	"5y",
	"max"
];
var RANGES = [
	{
		id: "1d",
		label: "1Д",
		periodLabel: "за день",
		yahoo: "1d",
		interval: "5m"
	},
	{
		id: "5d",
		label: "5ДН",
		periodLabel: "за 5 дней",
		yahoo: "5d",
		interval: "15m"
	},
	{
		id: "1mo",
		label: "1МЕС",
		periodLabel: "за месяц",
		yahoo: "1mo",
		interval: "1d"
	},
	{
		id: "6mo",
		label: "6МЕС",
		periodLabel: "за 6 месяцев",
		yahoo: "6mo",
		interval: "1d"
	},
	{
		id: "ytd",
		label: "С1ЯН",
		periodLabel: "с начала года",
		yahoo: "ytd",
		interval: "1d"
	},
	{
		id: "1y",
		label: "1ГОД",
		periodLabel: "за год",
		yahoo: "1y",
		interval: "1d"
	},
	{
		id: "5y",
		label: "5ЛЕТ",
		periodLabel: "за 5 лет",
		yahoo: "5y",
		interval: "1wk"
	},
	{
		id: "max",
		label: "МАКС.",
		periodLabel: "за всё время",
		yahoo: "max",
		interval: "1mo"
	}
];
var DEFAULT_SYMBOLS = watchlist_default.symbols;
var WATCHLIST_CONFIG_VERSION = watchlist_default.version;
var EXCHANGE_LABEL = {
	PAR: "EPA",
	NMS: "NASDAQ",
	NGM: "NASDAQ",
	NCM: "NASDAQ",
	NAS: "NASDAQ",
	NYQ: "NYSE",
	PCX: "NYSEARCA",
	ASE: "AMEX",
	GER: "ETR",
	FRA: "FRA",
	AMS: "AMS",
	LON: "LON",
	LSE: "LON",
	HKG: "HKG",
	TYO: "TYO",
	CCC: "CCC",
	CCY: "CCC"
};
function exchangeLabel(exchangeName) {
	return EXCHANGE_LABEL[exchangeName] ?? exchangeName;
}
function displayTicker(symbol) {
	return (symbol.split(".")[0] ?? symbol).replace("-USD", "").replace("=X", "");
}
function rangeById(id) {
	return RANGES.find((r) => r.id === id) ?? RANGES[6];
}
//#endregion
export { displayTicker as a, watchlist_default as c, WATCHLIST_CONFIG_VERSION as i, RANGES as n, exchangeLabel as o, RANGE_IDS as r, rangeById as s, DEFAULT_SYMBOLS as t };
