import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type PortfolioHolding = {
  id: string;
  symbol: string;
  rawSymbol?: string;
  stockName?: string;
  shares: number;
  costPrice: number; // Cost Price 16.06
  costValue: number; // Value USD 16.06
  rateToUsd?: number;
  sheetPrice: number; // Price 10.09
  sheetValue: number; // Value USD 10.09
  sheetPnlUsd: number; // P/L USD
  sheetPnlPct: number; // P/L %
  portfolioGroup: string;
  formationDate?: string; // "16.06"
  notes?: string;

  // Real-time market fields
  currentPrice?: number;
  totalValue?: number;
  pnl?: number;
  pnlPct?: number;
  change24h?: number;
  changePct24h?: number;
};

export type BenchmarkIndicative = {
  symbol: string;
  rawSymbol: string;
  name: string;
  shares: number;
  costPrice: number;
  costValue: number;
  sheetPrice: number;
  sheetValue: number;
  pnlUsd: number;
  pnlPct: number;
};

export const DEFAULT_BENCHMARK_INDICATIVE: BenchmarkIndicative = {
  symbol: "ACWI",
  rawSymbol: "NASDAQ:ACWI",
  name: "iShares MSCI ACWI ETF",
  shares: 127113,
  costPrice: 157.34,
  costValue: 19999959,
  sheetPrice: 159,
  sheetValue: 20184273,
  pnlUsd: 184314,
  pnlPct: 0.92,
};

export type SheetWatchlistPoint = {
  date: string;
  timestamp: number;
  mainPortfolio: number;
  modelPortfolio: number;
  benchmark: number;
};

export const DEFAULT_SHEET_WATCHLIST_POINTS: SheetWatchlistPoint[] = [
  { date: "6/16/2026", timestamp: new Date("2026-06-16T12:00:00Z").getTime(), mainPortfolio: 100.0, modelPortfolio: 100.0, benchmark: 100.0 },
  { date: "6/17/2026", timestamp: new Date("2026-06-17T12:00:00Z").getTime(), mainPortfolio: 101.29, modelPortfolio: 103.99, benchmark: 99.03 },
  { date: "6/18/2026", timestamp: new Date("2026-06-18T12:00:00Z").getTime(), mainPortfolio: 105.09, modelPortfolio: 108.31, benchmark: 100.25 },
  { date: "6/19/2026", timestamp: new Date("2026-06-19T12:00:00Z").getTime(), mainPortfolio: 106.34, modelPortfolio: 105.62, benchmark: 100.16 },
  { date: "6/23/2026", timestamp: new Date("2026-06-23T12:00:00Z").getTime(), mainPortfolio: 99.51, modelPortfolio: 105.76, benchmark: 98.16 },
  { date: "6/24/2026", timestamp: new Date("2026-06-24T12:00:00Z").getTime(), mainPortfolio: 99.6, modelPortfolio: 103.38, benchmark: 98.02 },
  { date: "6/25/2026", timestamp: new Date("2026-06-25T12:00:00Z").getTime(), mainPortfolio: 102.05, modelPortfolio: 103.24, benchmark: 98.32 },
  { date: "6/26/2026", timestamp: new Date("2026-06-26T12:00:00Z").getTime(), mainPortfolio: 98.66, modelPortfolio: 103.23, benchmark: 98.06 },
  { date: "6/29/2026", timestamp: new Date("2026-06-29T12:00:00Z").getTime(), mainPortfolio: 102.02, modelPortfolio: 102.25, benchmark: 99.03 },
  { date: "6/30/2026", timestamp: new Date("2026-06-30T12:00:00Z").getTime(), mainPortfolio: 105.43, modelPortfolio: 106.55, benchmark: 99.76 },
  { date: "7/1/2026", timestamp: new Date("2026-07-01T12:00:00Z").getTime(), mainPortfolio: 99.95, modelPortfolio: 105.42, benchmark: 99.22 },
  { date: "7/2/2026", timestamp: new Date("2026-07-02T12:00:00Z").getTime(), mainPortfolio: 96.07, modelPortfolio: 102.95, benchmark: 99.24 },
  { date: "7/3/2026", timestamp: new Date("2026-07-03T12:00:00Z").getTime(), mainPortfolio: 99.19, modelPortfolio: 106.85, benchmark: 100.4 },
  { date: "7/7/2026", timestamp: new Date("2026-07-07T12:00:00Z").getTime(), mainPortfolio: 95.01, modelPortfolio: 103.43, benchmark: 99.44 },
  { date: "7/8/2026", timestamp: new Date("2026-07-08T12:00:00Z").getTime(), mainPortfolio: 95.55, modelPortfolio: 101.69, benchmark: 99.08 },
  { date: "7/9/2026", timestamp: new Date("2026-07-09T12:00:00Z").getTime(), mainPortfolio: 97.93, modelPortfolio: 104.61, benchmark: 99.8 },
  { date: "7/10/2026", timestamp: new Date("2026-07-10T12:00:00Z").getTime(), mainPortfolio: 96.99, modelPortfolio: 103.86, benchmark: 100.22 },
  { date: "7/13/2026", timestamp: new Date("2026-07-13T12:00:00Z").getTime(), mainPortfolio: 93.69, modelPortfolio: 100.46, benchmark: 99.11 },
  { date: "7/14/2026", timestamp: new Date("2026-07-14T12:00:00Z").getTime(), mainPortfolio: 97.3, modelPortfolio: 99.09, benchmark: 99.75 },
  { date: "7/15/2026", timestamp: new Date("2026-07-15T12:00:00Z").getTime(), mainPortfolio: 96.6, modelPortfolio: 98.79, benchmark: 100.11 },
  { date: "7/16/2026", timestamp: new Date("2026-07-16T12:00:00Z").getTime(), mainPortfolio: 93.21, modelPortfolio: 95.71, benchmark: 99.38 },
];

export function normalizeGoogleTicker(rawTicker: string): string {
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

export function cleanGroupName(raw: string): string {
  if (!raw) return "Основной портфель";
  const trimmed = raw.trim();
  if (/gemini/i.test(trimmed) || /six\s*sectors/i.test(trimmed)) return "Six sectors";
  if (/claude/i.test(trimmed) || /infa\s*plus/i.test(trimmed)) return "Infa plus banks";
  if (/ai\s*plus/i.test(trimmed)) return "AI plus finance";
  if (/основной/i.test(trimmed)) return "Основной портфель";
  return trimmed
    .replace(/^(GEMINI|CLAUDE|CHATBOT|AI|GPT|BOT)[:\s-]*/i, "")
    .replace(/[:\-]\s*(GEMINI|CLAUDE|CHATBOT|AI|GPT|BOT)/gi, "")
    .trim() || "Основной портфель";
}

export function extractSheetIdAndGid(urlOrId: string): { sheetId: string; gid: string } | null {
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{20,60}$/.test(trimmed)) {
    return { sheetId: trimmed, gid: "0" };
  }

  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;

  const sheetId = match[1];
  const gidMatch = trimmed.match(/[?&#]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : "0";

  return { sheetId, gid };
}

export function parseCsvRows(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const result: string[][] = [];

  for (const line of lines) {
    const row: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    result.push(row);
  }

  return result;
}

function parseNum(val: string | undefined, fallback = 0): number {
  if (!val) return fallback;
  const clean = val.replace(/["'%$+\s]/g, "").replace(",", ".");
  const num = parseFloat(clean);
  return isNaN(num) ? fallback : num;
}

export function parseSheetWatchlistCsv(csvText: string): SheetWatchlistPoint[] {
  const rows = parseCsvRows(csvText);
  const points: SheetWatchlistPoint[] = [];

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
      benchmark,
    });
  }

  return points.sort((a, b) => a.timestamp - b.timestamp);
}

export function parsePortfolioDataFromRows(rows: string[][]): {
  holdings: PortfolioHolding[];
  benchmark: BenchmarkIndicative;
} {
  let currentGroup = "Основной портфель";
  const holdings: PortfolioHolding[] = [];
  let benchmark: BenchmarkIndicative = { ...DEFAULT_BENCHMARK_INDICATIVE };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const firstCell = row[0]?.trim() || "";
    const secondCell = row[1]?.trim() || "";

    // 1. Detect section headers (strip chatbot names, keep idea names)
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
    if (/BENCHMARK/i.test(firstCell) || /BENCHMARK/i.test(secondCell)) {
      continue;
    }

    // 2. Check if this is the Benchmark row (ACWI)
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
        pnlPct: parseNum(row[9], 0.92),
      };
      continue;
    }

    // 3. Skip table header rows and empty/balance rows
    if (/^(ticker|тикер)$/i.test(firstCell)) {
      if (i > 35 && currentGroup !== "AI plus finance") {
        currentGroup = "AI plus finance";
      }
      continue;
    }
    if (firstCell === "" || /balance|баланс/i.test(secondCell)) {
      continue;
    }

    // 4. Parse stock row
    const isTicker = /^[A-Za-z0-9.:_-]{1,16}$/.test(firstCell);
    if (isTicker) {
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
      const sheetPnlPct = parseNum(row[9], costValue > 0 ? (sheetPnlUsd / costValue) * 100 : 0);

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
        notes: `${stockName} • ${currentGroup}`,
      });
    }
  }

  return { holdings, benchmark };
}

export const DEFAULT_GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/17jWZKEiegp5fGuPV_Z4Ffsh0jeXISOIfwhtxE4feXeo/edit?usp=sharing";

export const DEFAULT_DEMO_HOLDINGS: PortfolioHolding[] = [
  // 1. Основной портфель (сформирован от 16.06)
  {
    id: "GS-1",
    symbol: "GS",
    rawSymbol: "NYSE:GS",
    stockName: "Goldman Sachs",
    shares: 3668,
    costPrice: 1090.67,
    costValue: 4000578,
    sheetPrice: 1020.0,
    sheetValue: 3740516,
    sheetPnlUsd: -260061,
    sheetPnlPct: -6.5,
    portfolioGroup: "Основной портфель",
    formationDate: "16.06",
    notes: "Goldman Sachs • Основной портфель",
  },
  {
    id: "TSM-2",
    symbol: "TSM",
    rawSymbol: "NYSE:TSM",
    stockName: "TSMC (ADR)",
    shares: 9388,
    costPrice: 425.83,
    costValue: 3997692,
    sheetPrice: 428.0,
    sheetValue: 4018346,
    sheetPnlUsd: 20654,
    sheetPnlPct: 0.52,
    portfolioGroup: "Основной портфель",
    formationDate: "16.06",
    notes: "TSMC (ADR) • Основной портфель",
  },
  {
    id: "ASML-3",
    symbol: "ASML",
    rawSymbol: "AMS:ASML",
    stockName: "ASML Holding",
    shares: 1644,
    costPrice: 1591.2,
    costValue: 2615933,
    sheetPrice: 1474.0,
    sheetValue: 2787123,
    sheetPnlUsd: -211547,
    sheetPnlPct: -8.09,
    portfolioGroup: "Основной портфель",
    formationDate: "16.06",
    notes: "ASML Holding • Основной портфель",
  },
  {
    id: "LRCX-4",
    symbol: "LRCX",
    rawSymbol: "NASDAQ:LRCX",
    stockName: "Lam Research",
    shares: 8122,
    costPrice: 369.34,
    costValue: 2999779,
    sheetPrice: 298.0,
    sheetValue: 2420437,
    sheetPnlUsd: -579342,
    sheetPnlPct: -19.31,
    portfolioGroup: "Основной портфель",
    formationDate: "16.06",
    notes: "Lam Research • Основной портфель",
  },
  {
    id: "DRAM-5",
    symbol: "DRAM",
    rawSymbol: "BATS:DRAM",
    stockName: "Roundhill Memory ETF",
    shares: 44052,
    costPrice: 68.12,
    costValue: 3000822,
    sheetPrice: 59.0,
    sheetValue: 2579685,
    sheetPnlUsd: -421137,
    sheetPnlPct: -14.03,
    portfolioGroup: "Основной портфель",
    formationDate: "16.06",
    notes: "Roundhill Memory ETF • Основной портфель",
  },
  {
    id: "GOOGL-6",
    symbol: "GOOGL",
    rawSymbol: "NASDAQ:GOOGL",
    stockName: "Alphabet Inc.",
    shares: 8037,
    costPrice: 373.25,
    costValue: 2999810,
    sheetPrice: 333.0,
    sheetValue: 2673106,
    sheetPnlUsd: -326704,
    sheetPnlPct: -10.89,
    portfolioGroup: "Основной портфель",
    formationDate: "16.06",
    notes: "Alphabet Inc. • Основной портфель",
  },

  // 2. Six sectors (сформирован от 16.06)
  {
    id: "GE-7",
    symbol: "GE",
    rawSymbol: "NYSE:GE",
    stockName: "GE Aerospace",
    shares: 11374,
    costPrice: 351.66,
    costValue: 3999781,
    sheetPrice: 324.0,
    sheetValue: 3686882,
    sheetPnlUsd: -312899,
    sheetPnlPct: -7.82,
    portfolioGroup: "Six sectors",
    formationDate: "16.06",
    notes: "GE Aerospace • Six sectors",
  },
  {
    id: "RY-8",
    symbol: "RY",
    rawSymbol: "NYSE:RY",
    stockName: "Royal Bank of Canada",
    shares: 19891,
    costPrice: 201.09,
    costValue: 3999881,
    sheetPrice: 206.0,
    sheetValue: 4097148,
    sheetPnlUsd: 97267,
    sheetPnlPct: 2.43,
    portfolioGroup: "Six sectors",
    formationDate: "16.06",
    notes: "Royal Bank of Canada • Six sectors",
  },
  {
    id: "KKR-9",
    symbol: "KKR",
    rawSymbol: "NYSE:KKR",
    stockName: "KKR & Co. Inc.",
    shares: 30306,
    costPrice: 98.99,
    costValue: 2999991,
    sheetPrice: 101.0,
    sheetValue: 3056966,
    sheetPnlUsd: 56975,
    sheetPnlPct: 1.9,
    portfolioGroup: "Six sectors",
    formationDate: "16.06",
    notes: "KKR & Co. Inc. • Six sectors",
  },
  {
    id: "FWONK-10",
    symbol: "FWONK",
    rawSymbol: "NASDAQ:FWONK",
    stockName: "Formula One Group",
    shares: 33470,
    costPrice: 89.63,
    costValue: 2999916,
    sheetPrice: 95.0,
    sheetValue: 3194377,
    sheetPnlUsd: 194461,
    sheetPnlPct: 6.48,
    portfolioGroup: "Six sectors",
    formationDate: "16.06",
    notes: "Formula One Group • Six sectors",
  },
  {
    id: "PRLB-11",
    symbol: "PRLB",
    rawSymbol: "NYSE:PRLB",
    stockName: "Proto Labs Inc.",
    shares: 38100,
    costPrice: 78.74,
    costValue: 2999994,
    sheetPrice: 80.0,
    sheetValue: 3038475,
    sheetPnlUsd: 38481,
    sheetPnlPct: 1.28,
    portfolioGroup: "Six sectors",
    formationDate: "16.06",
    notes: "Proto Labs Inc. • Six sectors",
  },
  {
    id: "XMTR-12",
    symbol: "XMTR",
    rawSymbol: "NASDAQ:XMTR",
    stockName: "Xometry Inc.",
    shares: 34891,
    costPrice: 85.98,
    costValue: 2999928,
    sheetPrice: 85.0,
    sheetValue: 2960501,
    sheetPnlUsd: -39427,
    sheetPnlPct: -1.31,
    portfolioGroup: "Six sectors",
    formationDate: "16.06",
    notes: "Xometry Inc. • Six sectors",
  },

  // 3. Infa plus banks (сформирован от 16.06)
  {
    id: "RY-13",
    symbol: "RY",
    rawSymbol: "NYSE:RY",
    stockName: "Royal Bank of Canada",
    shares: 19888,
    costPrice: 201.13,
    costValue: 4000073,
    sheetPrice: 206.0,
    sheetValue: 4096530,
    sheetPnlUsd: 96457,
    sheetPnlPct: 2.41,
    portfolioGroup: "Infa plus banks",
    formationDate: "16.06",
    notes: "Royal Bank of Canada • Infa plus banks",
  },
  {
    id: "BAC-14",
    symbol: "BAC",
    rawSymbol: "NYSE:BAC",
    stockName: "Bank of America",
    shares: 70373,
    costPrice: 56.84,
    costValue: 4000001,
    sheetPrice: 63.0,
    sheetValue: 4402535,
    sheetPnlUsd: 402534,
    sheetPnlPct: 10.06,
    portfolioGroup: "Infa plus banks",
    formationDate: "16.06",
    notes: "Bank of America • Infa plus banks",
  },
  {
    id: "GE-15",
    symbol: "GE",
    rawSymbol: "NYSE:GE",
    stockName: "GE Aerospace",
    shares: 8584,
    costPrice: 349.5,
    costValue: 3000108,
    sheetPrice: 324.0,
    sheetValue: 2782504,
    sheetPnlUsd: -217604,
    sheetPnlPct: -7.25,
    portfolioGroup: "Infa plus banks",
    formationDate: "16.06",
    notes: "GE Aerospace • Infa plus banks",
  },
  {
    id: "ARM-16",
    symbol: "ARM",
    rawSymbol: "NASDAQ:ARM",
    stockName: "ARM Holdings",
    shares: 7519,
    costPrice: 399.0,
    costValue: 3000081,
    sheetPrice: 254.0,
    sheetValue: 1911179,
    sheetPnlUsd: -1088902,
    sheetPnlPct: -36.3,
    portfolioGroup: "Infa plus banks",
    formationDate: "16.06",
    notes: "ARM Holdings • Infa plus banks",
  },
  {
    id: "QNT-17",
    symbol: "QNT",
    rawSymbol: "NASDAQ:QNT",
    stockName: "Quantinuum",
    shares: 54122,
    costPrice: 55.43,
    costValue: 2999982,
    sheetPrice: 49.0,
    sheetValue: 2634118,
    sheetPnlUsd: -365865,
    sheetPnlPct: -12.2,
    portfolioGroup: "Infa plus banks",
    formationDate: "16.06",
    notes: "Quantinuum • Infa plus banks",
  },
  {
    id: "KKR-18",
    symbol: "KKR",
    rawSymbol: "NYSE:KKR",
    stockName: "KKR & Co Inc",
    shares: 30457,
    costPrice: 98.5,
    costValue: 3000015,
    sheetPrice: 101.0,
    sheetValue: 3072198,
    sheetPnlUsd: 72183,
    sheetPnlPct: 2.41,
    portfolioGroup: "Infa plus banks",
    formationDate: "16.06",
    notes: "KKR & Co Inc • Infa plus banks",
  },

  // 4. AI plus finance (сформирован от 16.06)
  {
    id: "ARM-19",
    symbol: "ARM",
    rawSymbol: "NASDAQ:ARM",
    stockName: "Arm Holdings",
    shares: 10092,
    costPrice: 396.34,
    costValue: 3999863,
    sheetPrice: 254.0,
    sheetValue: 2565185,
    sheetPnlUsd: -1434679,
    sheetPnlPct: -35.87,
    portfolioGroup: "AI plus finance",
    formationDate: "16.06",
    notes: "Arm Holdings • AI plus finance",
  },
  {
    id: "KKR-20",
    symbol: "KKR",
    rawSymbol: "NYSE:KKR",
    stockName: "KKR & Co.",
    shares: 40416,
    costPrice: 98.97,
    costValue: 3999972,
    sheetPrice: 101.0,
    sheetValue: 4076762,
    sheetPnlUsd: 76790,
    sheetPnlPct: 1.92,
    portfolioGroup: "AI plus finance",
    formationDate: "16.06",
    notes: "KKR & Co. • AI plus finance",
  },
  {
    id: "QNT-21",
    symbol: "QNT",
    rawSymbol: "NASDAQ:QNT",
    stockName: "Quantinuum Inc.",
    shares: 54122,
    costPrice: 55.43,
    costValue: 2999982,
    sheetPrice: 49.0,
    sheetValue: 2634118,
    sheetPnlUsd: -365865,
    sheetPnlPct: -12.2,
    portfolioGroup: "AI plus finance",
    formationDate: "16.06",
    notes: "Quantinuum Inc. • AI plus finance",
  },
  {
    id: "VIRT-22",
    symbol: "VIRT",
    rawSymbol: "NYSE:VIRT",
    stockName: "Virtu Financial",
    shares: 51108,
    costPrice: 58.7,
    costValue: 3000040,
    sheetPrice: 62.0,
    sheetValue: 3146720,
    sheetPnlUsd: 146680,
    sheetPnlPct: 4.89,
    portfolioGroup: "AI plus finance",
    formationDate: "16.06",
    notes: "Virtu Financial • AI plus finance",
  },
  {
    id: "XMTR-23",
    symbol: "XMTR",
    rawSymbol: "NASDAQ:XMTR",
    stockName: "Xometry",
    shares: 34471,
    costPrice: 85.98,
    costValue: 2963817,
    sheetPrice: 85.0,
    sheetValue: 2924864,
    sheetPnlUsd: -38952,
    sheetPnlPct: -1.31,
    portfolioGroup: "AI plus finance",
    formationDate: "16.06",
    notes: "Xometry • AI plus finance",
  },
  {
    id: "GE-24",
    symbol: "GE",
    rawSymbol: "NYSE:GE",
    stockName: "GE Aerospace",
    shares: 8529,
    costPrice: 351.73,
    costValue: 2999905,
    sheetPrice: 324.0,
    sheetValue: 2764675,
    sheetPnlUsd: -235230,
    sheetPnlPct: -7.84,
    portfolioGroup: "AI plus finance",
    formationDate: "16.06",
    notes: "GE Aerospace • AI plus finance",
  },
];

export function generateGoogleFinanceTemplateCsv(): string {
  return [
    `"Ticker","Stock","Shares","Cost Price 16.06","Value USD 16.06","Курс к USD (16.06)","Price 10.09","Value USD 10.09","P/L USD","P/L %"`,
    `"NYSE:GS","Goldman Sachs",3668,1090.67,"4,000,578",1,1020,"3,740,516","-260,061",-6.50%`,
    `"NYSE:TSM","TSMC (ADR)",9388,425.83,"3,997,692",1,428,"4,018,346","20,654",0.52%`,
    `"AMS:ASML","ASML Holding",1644,1591.2,"2,615,933",1.14631,1474,"2,787,123","-211,547",-8.09%`,
    `"NASDAQ:LRCX","Lam Research",8122,369.34,"2,999,779",1,298,"2,420,437","-579,342",-19.31%`,
    `"BATS:DRAM","Roundhill Memory ETF",44052,68.12,"3,000,822",1,59,"2,579,685","-421,137",-14.03%`,
    `"NASDAQ:GOOGL","Alphabet Inc.",8037,373.25,"2,999,810",1,333,"2,673,106","-326,704",-10.89%`,
    `"Benchmark:","iShares MSCI ACWI ETF",127113,157.34,"19,999,959",1,159,"20,184,273","184,314",0.92%`,
  ].join("\r\n");
}

export const fetchSheetData = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        urlOrId: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const parsed = extractSheetIdAndGid(data.urlOrId);
    if (!parsed) {
      return {
        success: false as const,
        error: "Неверный формат ссылки. Укажите ссылку на Google Таблицу вида https://docs.google.com/spreadsheets/d/...",
      };
    }

    const exportUrl = `https://docs.google.com/spreadsheets/d/${parsed.sheetId}/export?format=csv&gid=${parsed.gid}`;

    try {
      const res = await fetch(exportUrl, {
        headers: {
          Accept: "text/csv, text/plain",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(10_000),
      });

      if (res.status === 401 || res.status === 403) {
        return {
          success: false as const,
          error:
            "Таблица закрыта настройками приватности (401/403). Пожалуйста, откройте доступ по ссылке: в таблице нажмите «Поделиться» → «Все, у кого есть ссылка: Читатель».",
          isPrivate: true,
          sheetId: parsed.sheetId,
        };
      }

      if (!res.ok) {
        return {
          success: false as const,
          error: `Ошибка сервера Google при скачивании таблицы (HTTP ${res.status}).`,
        };
      }

      const csvText = await res.text();
      const rows = parseCsvRows(csvText);
      const parsedData = parsePortfolioDataFromRows(rows);

      if (parsedData.holdings.length === 0) {
        return {
          success: false as const,
          error: "Не удалось обнаружить тикеры в таблице. Проверьте формат строк.",
        };
      }

      // Try to fetch the Watchlist tab (gid=513266484)
      let watchlistHistory: SheetWatchlistPoint[] = DEFAULT_SHEET_WATCHLIST_POINTS;
      try {
        const wlExportUrl = `https://docs.google.com/spreadsheets/d/${parsed.sheetId}/export?format=csv&gid=513266484`;
        const wlRes = await fetch(wlExportUrl, {
          headers: {
            Accept: "text/csv, text/plain",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          signal: AbortSignal.timeout(6_000),
        });
        if (wlRes.ok) {
          const wlText = await wlRes.text();
          const parsedPoints = parseSheetWatchlistCsv(wlText);
          if (parsedPoints.length > 0) {
            watchlistHistory = parsedPoints;
          }
        }
      } catch {
        // non-fatal fallback
      }

      return {
        success: true as const,
        holdings: parsedData.holdings,
        benchmark: parsedData.benchmark,
        watchlistHistory,
        sheetId: parsed.sheetId,
        rowCount: rows.length,
      };
    } catch (err) {
      return {
        success: false as const,
        error: `Не удалось связаться с Google Таблицами: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  });
