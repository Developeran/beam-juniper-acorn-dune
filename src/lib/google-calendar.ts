export type FinancialEvent = {
  id: string;
  symbol: string;
  companyName: string;
  eventType: "earnings" | "dividend" | "split" | "conference";
  title: string;
  date: string; // YYYY-MM-DD or ISO string
  time?: string;
  expectedEps?: number;
  expectedRevenue?: string;
  dividendAmount?: number;
  description: string;
};

export function createGoogleCalendarUrl({
  title,
  description,
  date,
  startTime = "16:30",
  durationMinutes = 60,
}: {
  title: string;
  description: string;
  date: string;
  startTime?: string;
  durationMinutes?: number;
}): string {
  // Parse date and time into YYYYMMDDTHHMMSSZ format
  const dateClean = date.split("T")[0].replace(/-/g, "");
  const [hours, minutes] = (startTime || "16:30").split(":").map(Number);

  const startHourStr = String(hours).padStart(2, "0");
  const startMinStr = String(minutes).padStart(2, "0");
  const startTimestamp = `${dateClean}T${startHourStr}${startMinStr}00`;

  // Calculate end timestamp
  const endTotalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(endTotalMinutes / 60) % 24;
  const endMinutes = endTotalMinutes % 60;
  const endHourStr = String(endHours).padStart(2, "0");
  const endMinStr = String(endMinutes).padStart(2, "0");
  const endTimestamp = `${dateClean}T${endHourStr}${endMinStr}00`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startTimestamp}/${endTimestamp}`,
    details: description,
    location: "Online / Investor Relations",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export const UPCOMING_FINANCIAL_EVENTS: FinancialEvent[] = [
  {
    id: "ev-aapl-1",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    eventType: "earnings",
    title: "🍎 Apple Inc. (AAPL) — Квартальный финансовый отчет Q4",
    date: "2026-10-29",
    time: "23:30",
    expectedEps: 1.64,
    expectedRevenue: "$94.2B",
    description: "Публикация квартального отчета за 4 квартал и конференц-звонок с Тимом Куком (Apple IR).\n\nСсылка на монитор: http://localhost:8082\nТикер: AAPL",
  },
  {
    id: "ev-nvda-1",
    symbol: "NVDA",
    companyName: "NVIDIA Corp.",
    eventType: "earnings",
    title: "⚡ NVIDIA (NVDA) — Финансовые результаты за квартал",
    date: "2026-11-19",
    time: "23:00",
    expectedEps: 0.75,
    expectedRevenue: "$32.8B",
    description: "Конференц-звонок по доходам NVIDIA: спрос на чипы Blackwell, выручка дата-центров и прогнозы по ИИ инфраструктуре.\n\nСсылка: http://localhost:8082",
  },
  {
    id: "ev-msft-1",
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    eventType: "earnings",
    title: "☁️ Microsoft (MSFT) — Отчет о доходах Q1",
    date: "2026-10-24",
    time: "23:30",
    expectedEps: 3.12,
    expectedRevenue: "$64.5B",
    description: "Отчет Microsoft: показатели роста Azure, Copilot и корпоративного подразделения.\n\nСсылка: http://localhost:8082",
  },
  {
    id: "ev-googl-1",
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    eventType: "earnings",
    title: "🔍 Alphabet (GOOGL) — Квартальный отчет Google & Cloud",
    date: "2026-10-22",
    time: "23:00",
    expectedEps: 1.85,
    expectedRevenue: "$86.1B",
    description: "Отчет Google: доходы от рекламы YouTube, Google Cloud и развитие моделей Gemini AI.\n\nСсылка: http://localhost:8082",
  },
  {
    id: "ev-tsla-1",
    symbol: "TSLA",
    companyName: "Tesla Inc.",
    eventType: "earnings",
    title: "🚗 Tesla (TSLA) — Квартальный отчет и конференция",
    date: "2026-10-21",
    time: "23:30",
    expectedEps: 0.62,
    expectedRevenue: "$25.4B",
    description: "Отчет Tesla: поставки электрокаров, рентабельность, развитие автономного вождения FSD и системы хранения энергии.\n\nСсылка: http://localhost:8082",
  },
  {
    id: "ev-aapl-div",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    eventType: "dividend",
    title: "💰 Apple (AAPL) — Экс-дивидендная дата (Ex-Dividend)",
    date: "2026-11-06",
    time: "16:00",
    dividendAmount: 0.25,
    description: "Последний день для покупки акций Apple под получение квартального дивиденда ($0.25 на акцию).\n\nСсылка: http://localhost:8082",
  },
  {
    id: "ev-msft-div",
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    eventType: "dividend",
    title: "💰 Microsoft (MSFT) — Экс-дивидендная дата (Ex-Dividend)",
    date: "2026-11-14",
    time: "16:00",
    dividendAmount: 0.83,
    description: "Экс-дивидендная дата Microsoft ($0.83 на акцию).\n\nСсылка: http://localhost:8082",
  },
];
