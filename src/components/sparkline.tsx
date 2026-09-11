import { cn } from "@/lib/utils";

export function Sparkline({
  values,
  up,
  className,
}: {
  values: number[];
  up: boolean;
  className?: string;
}) {
  if (values.length < 2) {
    return <span className={cn("inline-block h-7 w-16", className)} />;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 64;
  const h = 28;
  const p = 1.5;
  const d = values
    .map((v, i) => {
      const x = p + (i / (values.length - 1)) * (w - p * 2);
      const y = h - p - ((v - min) / span) * (h - p * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("h-7 w-16", up ? "text-up" : "text-down", className)}
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
