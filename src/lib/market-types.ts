export const RANGE_IDS = [
  "1d",
  "5d",
  "1mo",
  "6mo",
  "ytd",
  "1y",
  "5y",
  "max",
] as const;

export type RangeId = (typeof RANGE_IDS)[number];

export type RangeSpec = {
  id: RangeId;
  label: string;
  periodLabel: string;
  yahoo: string;
  interval: string;
};

export const RANGES: RangeSpec[] = [
  { id: "1d", label: "1Д", periodLabel: "за день", yahoo: "1d", interval: "5m" },
  { id: "5d", label: "5ДН", periodLabel: "за 5 дней", yahoo: "5d", interval: "15m" },
  { id: "1mo", label: "1МЕС", periodLabel: "за месяц", yahoo: "1mo", interval: "1d" },
  { id: "6mo", label: "6МЕС", periodLabel: "за 6 месяцев", yahoo: "6mo", interval: "1d" },
  { id: "ytd", label: "С1ЯН", periodLabel: "с начала года", yahoo: "ytd", interval: "1d" },
  { id: "1y", label: "1ГОД", periodLabel: "за год", yahoo: "1y", interval: "1d" },
  { id: "5y", label: "5ЛЕТ", periodLabel: "за 5 лет", yahoo: "5y", interval: "1wk" },
  { id: "max", label: "МАКС.", periodLabel: "за всё время", yahoo: "max", interval: "1mo" },
];

export const DEFAULT_SYMBOLS = [
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
  "BTC-USD",
] as const;

export const DEFAULT_SELECTED = "GS";

export const EXCHANGE_LABEL: Record<string, string> = {
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
  CCY: "CCC",
};

export type Quote = {
  symbol: string;
  shortName: string;
  longName: string;
  exchange: string;
  exchangeLabel: string;
  currency: string;
  price: number;
  changePct: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  week52High: number;
  week52Low: number;
  volume: number;
  priceHint: number;
  marketTime: number;
  spark: number[];
};

export type ChartPoint = {
  t: number;
  c: number;
};

export type ChartPayload = {
  symbol: string;
  currency: string;
  priceHint: number;
  price: number;
  name: string;
  longName: string;
  exchange: string;
  exchangeLabel: string;
  points: ChartPoint[];
  open: number | null;
  dayHigh: number;
  dayLow: number;
  previousClose: number;
  week52High: number;
  week52Low: number;
  volume: number;
  marketTime: number;
  timeZone?: string;
  rangeStart: number | null;
  rangeChange: number;
  rangeChangePct: number;
};

export type SearchHit = {
  symbol: string;
  name: string;
  exch: string;
  type: string;
};

export function exchangeLabel(exchangeName: string): string {
  return EXCHANGE_LABEL[exchangeName] ?? exchangeName;
}

export function displayTicker(symbol: string): string {
  const base = symbol.split(".")[0] ?? symbol;
  return base.replace("-USD", "").replace("=X", "");
}

export function rangeById(id: RangeId): RangeSpec {
  return RANGES.find((r) => r.id === id) ?? RANGES[6]!;
}
