import { createFileRoute } from "@tanstack/react-router";
import { MonitorApp } from "@/components/monitor-app";
import { getChart, getQuotes } from "@/lib/market";
import { DEFAULT_SELECTED, DEFAULT_SYMBOLS, type ChartPayload, type Quote } from "@/lib/market-types";

export const Route = createFileRoute("/")({
  loader: async (): Promise<{ quotes: Quote[]; chart: ChartPayload | null }> => {
    try {
      const [quotes, chart] = await Promise.all([
        getQuotes({ data: { symbols: [...DEFAULT_SYMBOLS] } }),
        getChart({ data: { symbol: DEFAULT_SELECTED, range: "5y" } }),
      ]);
      return { quotes, chart };
    } catch {
      return { quotes: [], chart: null };
    }
  },
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  return <MonitorApp initialQuotes={data.quotes} initialChart={data.chart} />;
}
