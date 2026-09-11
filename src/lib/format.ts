const LOCALE = "ru-RU";

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPrice(value: number, currency: string, hint = 2): string {
  return `${formatNumber(value, hint)} ${currency}`;
}

export function formatSigned(value: number, digits = 2): string {
  const body = formatNumber(Math.abs(value), digits);
  if (value > 0) return `+${body}`;
  if (value < 0) return `−${body}`;
  return body;
}

export function formatPercent(value: number, digits = 2): string {
  return `${formatSigned(value, digits)} %`;
}

export function formatCompact(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "—";
  return new Intl.NumberFormat(LOCALE, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatVolume(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(value);
}

export function formatMarketTime(ms: number, timeZone?: string): string {
  if (!ms) return "";
  const d = new Date(ms);
  const date = new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    timeZone,
  }).format(d);
  const time = new Intl.DateTimeFormat(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(d);
  const tz =
    new Intl.DateTimeFormat("en-US", {
      timeZoneName: "shortOffset",
      timeZone,
    })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return `${date}, ${time} ${tz}`.replace("GMT", "GMT");
}

export function formatChartDate(ms: number, rangeId: string): string {
  const d = new Date(ms);
  if (rangeId === "1d") {
    return new Intl.DateTimeFormat(LOCALE, {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  }
  if (rangeId === "5d" || rangeId === "1mo") {
    return new Intl.DateTimeFormat(LOCALE, {
      day: "numeric",
      month: "short",
      hour: rangeId === "5d" ? "numeric" : undefined,
      minute: rangeId === "5d" ? "2-digit" : undefined,
    }).format(d);
  }
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatAxisTick(ms: number, rangeId: string): string {
  const d = new Date(ms);
  if (rangeId === "1d") {
    return new Intl.DateTimeFormat(LOCALE, {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  }
  if (rangeId === "5d" || rangeId === "1mo") {
    return new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short" }).format(d);
  }
  if (rangeId === "6mo" || rangeId === "ytd" || rangeId === "1y") {
    return new Intl.DateTimeFormat(LOCALE, { month: "short", year: "2-digit" }).format(d);
  }
  return new Intl.DateTimeFormat(LOCALE, { year: "numeric" }).format(d);
}

export function formatStat(value: number | null | undefined, hint = 2): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return formatNumber(value, hint);
}
