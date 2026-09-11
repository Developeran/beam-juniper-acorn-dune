import { useEffect, useRef, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchSymbols } from "@/lib/market";
import { cn } from "@/lib/utils";

type Props = {
  onPick: (symbol: string) => void;
  className?: string;
};

export function SearchBox({ onPick, className }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 220);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const search = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchSymbols({ data: { q: debounced } }),
    enabled: debounced.length >= 1,
    staleTime: 60_000,
  });

  const hits = search.data ?? [];

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Поиск акций, фондов и других активов"
        className="h-10 w-full rounded-full border border-border bg-surface pr-4 pl-10 text-sm text-fg outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle focus-visible:border-fg/30 focus-visible:shadow-[0_0_0_3px_rgb(26_95_180/0.12)]"
        aria-label="Поиск бумаг"
      />
      {open && debounced.length >= 1 && (
        <div className="absolute top-[calc(100%+6px)] right-0 left-0 z-40 overflow-hidden rounded-xl bg-surface shadow-border">
          {search.isFetching && hits.length === 0 && (
            <p className="px-3 py-3 text-sm text-muted">Ищем…</p>
          )}
          {!search.isFetching && hits.length === 0 && (
            <p className="px-3 py-3 text-sm text-muted">Ничего не найдено</p>
          )}
          <ul>
            {hits.map((hit) => (
              <li key={hit.symbol}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-bg"
                  onClick={() => {
                    onPick(hit.symbol);
                    setQ("");
                    setOpen(false);
                  }}
                >
                  <Plus className="size-3.5 text-muted" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {hit.symbol}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {hit.name}
                    </span>
                  </span>
                  <span className="text-xs text-subtle">
                    {hit.exch || hit.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
