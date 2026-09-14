import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, n as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { c as string, o as object } from "../_libs/zod.mjs";
import { a as displayTicker, c as watchlist_default, i as WATCHLIST_CONFIG_VERSION, n as RANGES$1, s as rangeById, t as DEFAULT_SYMBOLS } from "./market-types-gv-rWKG5.mjs";
import { A as ChevronDown, C as FileSpreadsheet, D as DollarSign, E as Download, F as CalendarPlus, I as Calculator, L as Building2, M as ChartColumn, N as ChartLine, O as Copy, P as Calendar, R as ArrowLeftRight, S as GitCompare, T as Ellipsis, _ as PanelLeftOpen, a as TrendingDown, b as List, c as Sparkles, d as Scale, f as RotateCcw, g as PanelRightClose, h as PanelRightOpen, i as TrendingUp, j as Check, k as Clock, l as ShieldAlert, m as Plus, n as Upload, o as Trash2, p as RefreshCw, s as Star, t as X, u as Search, v as PanelLeftClose, w as ExternalLink, x as Layers, y as LoaderCircle, z as Activity } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as getPortfolioHistoricalChart, c as createSsrRpc, i as getChart, n as Route, o as getQuotes, r as explainMove, s as searchSymbols } from "./router-CK63Sae3.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { i as Trigger, n as List$1, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-yKX7bCSs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var LOCALE = "ru-RU";
function formatNumber(value, digits = 2) {
	return new Intl.NumberFormat(LOCALE, {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(value);
}
function formatPrice(value, currency, hint = 2) {
	return `${formatNumber(value, hint)} ${currency}`;
}
function formatSigned(value, digits = 2) {
	const body = formatNumber(Math.abs(value), digits);
	if (value > 0) return `+${body}`;
	if (value < 0) return `−${body}`;
	return body;
}
function formatPercent(value, digits = 2) {
	return `${formatSigned(value, digits)} %`;
}
function formatCompact(value) {
	if (!Number.isFinite(value) || value === 0) return "—";
	return new Intl.NumberFormat(LOCALE, {
		notation: "compact",
		compactDisplay: "short",
		maximumFractionDigits: 2
	}).format(value);
}
function formatVolume(value) {
	if (!Number.isFinite(value) || value <= 0) return "—";
	return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(value);
}
function formatMarketTime(ms, timeZone) {
	if (!ms) return "";
	const d = new Date(ms);
	return `${new Intl.DateTimeFormat(LOCALE, {
		day: "numeric",
		month: "short",
		timeZone
	}).format(d)}, ${new Intl.DateTimeFormat(LOCALE, {
		hour: "numeric",
		minute: "2-digit",
		hour12: false,
		timeZone
	}).format(d)} ${new Intl.DateTimeFormat("en-US", {
		timeZoneName: "shortOffset",
		timeZone
	}).formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? ""}`.replace("GMT", "GMT");
}
function formatChartDate(ms, rangeId) {
	const d = new Date(ms);
	if (rangeId === "1d") return new Intl.DateTimeFormat(LOCALE, {
		hour: "numeric",
		minute: "2-digit",
		hour12: false
	}).format(d);
	if (rangeId === "5d" || rangeId === "1mo") return new Intl.DateTimeFormat(LOCALE, {
		day: "numeric",
		month: "short",
		hour: rangeId === "5d" ? "numeric" : void 0,
		minute: rangeId === "5d" ? "2-digit" : void 0
	}).format(d);
	return new Intl.DateTimeFormat(LOCALE, {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(d);
}
function formatAxisTick(ms, rangeId) {
	const d = new Date(ms);
	if (rangeId === "1d") return new Intl.DateTimeFormat(LOCALE, {
		hour: "numeric",
		minute: "2-digit",
		hour12: false
	}).format(d);
	if (rangeId === "5d" || rangeId === "1mo") return new Intl.DateTimeFormat(LOCALE, {
		day: "numeric",
		month: "short"
	}).format(d);
	if (rangeId === "6mo" || rangeId === "ytd" || rangeId === "1y") return new Intl.DateTimeFormat(LOCALE, {
		month: "short",
		year: "2-digit"
	}).format(d);
	return new Intl.DateTimeFormat(LOCALE, { year: "numeric" }).format(d);
}
function formatStat(value, hint = 2) {
	if (value == null || !Number.isFinite(value)) return "—";
	return formatNumber(value, hint);
}
var VB = {
	w: 1e3,
	h: 400
};
var PAD = {
	l: 8,
	r: 8,
	t: 12,
	b: 8
};
function yTicks(min, max, count = 4) {
	if (!(max > min)) return [min];
	const step = (max - min) / (count - 1);
	return Array.from({ length: count }, (_, i) => min + step * i);
}
function xTicks(points, count = 5) {
	if (points.length === 0) return [];
	if (points.length <= count) return points;
	const step = (points.length - 1) / (count - 1);
	return Array.from({ length: count }, (_, i) => points[Math.round(i * step)]);
}
function PriceChart({ points, range, currency, hint, up }) {
	const wrapRef = (0, import_react.useRef)(null);
	const [hoverIdx, setHoverIdx] = (0, import_react.useState)(null);
	const { min, max } = (0, import_react.useMemo)(() => {
		if (!points.length) return {
			min: 0,
			max: 1
		};
		const vals = points.map((p) => p.c);
		const lo = Math.min(...vals);
		const hi = Math.max(...vals);
		const pad = (hi - lo) * .08 || Math.abs(hi) * .02 || 1;
		return {
			min: lo > 0 ? Math.max(0, lo - pad) : lo - pad,
			max: hi + pad
		};
	}, [points]);
	const t0 = points[0]?.t ?? 0;
	const tSpan = (points.at(-1)?.t ?? 1) - t0 || 1;
	const innerW = VB.w - PAD.l - PAD.r;
	const innerH = VB.h - PAD.t - PAD.b;
	const xOf = (t) => PAD.l + (t - t0) / tSpan * innerW;
	const yOf = (c) => PAD.t + (max - c) / (max - min || 1) * innerH;
	const linePath = (0, import_react.useMemo)(() => {
		if (points.length < 2) return "";
		return points.map((p, i) => `${i === 0 ? "M" : "L"}${xOf(p.t).toFixed(1)} ${yOf(p.c).toFixed(1)}`).join(" ");
	}, [
		points,
		min,
		max,
		t0,
		tSpan
	]);
	const areaPath = linePath ? `${linePath} L${xOf(points.at(-1).t).toFixed(1)} ${(PAD.t + innerH).toFixed(1)} L${xOf(points[0].t).toFixed(1)} ${(PAD.t + innerH).toFixed(1)} Z` : "";
	const yTickVals = yTicks(min, max);
	const xTickVals = xTicks(points);
	const hover = hoverIdx != null ? points[hoverIdx] : null;
	function indexFromClientX(clientX) {
		const el = wrapRef.current;
		if (!el || points.length < 2) return null;
		const rect = el.getBoundingClientRect();
		if (rect.width <= 0) return null;
		const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
		const t = t0 + ratio * tSpan;
		let best = 0;
		let bestDist = Infinity;
		for (let i = 0; i < points.length; i++) {
			const d = Math.abs(points[i].t - t);
			if (d < bestDist) {
				bestDist = d;
				best = i;
			}
		}
		return best;
	}
	if (points.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full items-center justify-center text-sm text-muted",
		children: "Недостаточно точек для графика"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex h-full min-h-48 w-full flex-col", up ? "text-up" : "text-down"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: wrapRef,
			className: "relative min-h-0 flex-1 cursor-crosshair",
			onPointerMove: (e) => {
				const idx = indexFromClientX(e.clientX);
				if (idx != null) setHoverIdx(idx);
			},
			onPointerDown: (e) => {
				const idx = indexFromClientX(e.clientX);
				if (idx != null) setHoverIdx(idx);
			},
			onPointerLeave: () => setHoverIdx(null),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: `0 0 ${VB.w} ${VB.h}`,
					preserveAspectRatio: "none",
					width: "100%",
					height: "100%",
					className: "block h-full w-full",
					role: "img",
					"aria-label": "График цены",
					children: [
						yTickVals.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: PAD.l,
							x2: PAD.l + innerW,
							y1: yOf(v),
							y2: yOf(v),
							className: "stroke-border",
							strokeWidth: 1
						}, v)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: areaPath,
							fill: "currentColor",
							opacity: .22
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: linePath,
							fill: "none",
							stroke: "currentColor",
							strokeWidth: 3,
							strokeLinejoin: "round",
							strokeLinecap: "round"
						}),
						hover && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: xOf(hover.t),
							x2: xOf(hover.t),
							y1: PAD.t,
							y2: PAD.t + innerH,
							className: "stroke-muted",
							strokeDasharray: "4 4",
							strokeWidth: 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: xOf(hover.t),
							cy: yOf(hover.c),
							r: 5,
							className: "fill-surface",
							stroke: "currentColor",
							strokeWidth: 2
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-y-0 -right-14 flex w-14 flex-col justify-between py-1 text-right text-xs tabular-nums text-muted",
					children: [...yTickVals].reverse().map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Intl.NumberFormat("ru-RU", {
						maximumFractionDigits: hint,
						minimumFractionDigits: 0
					}).format(v) }, v))
				}),
				hover && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-surface px-2.5 py-1.5 text-fg shadow-border",
					style: {
						left: `${xOf(hover.t) / VB.w * 100}%`,
						top: `${Math.max(10, yOf(hover.c) / VB.h * 100)}%`
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium tabular-nums",
						children: formatPrice(hover.c, currency, hint)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted",
						children: formatChartDate(hover.t, range)
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-between pt-1 text-xs text-muted",
			children: xTickVals.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatAxisTick(p.t, range) }, p.t))
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:not-disabled:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-fg text-surface hover:bg-fg/90",
			outline: "border border-border-strong bg-surface text-fg hover:bg-bg",
			ghost: "text-fg hover:bg-bg",
			pill: "rounded-full border border-border-strong bg-surface text-fg hover:bg-bg",
			link: "text-accent underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 rounded-md px-4 text-sm",
			sm: "h-8 rounded-md px-3 text-sm",
			lg: "h-11 rounded-lg px-5 text-sm",
			icon: "size-10 rounded-md",
			pill: "h-9 rounded-full px-4 text-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-fg/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-6 text-fg shadow-border outline-none", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-4 right-4 rounded-md p-1 text-muted transition-colors hover:bg-bg hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Закрыть"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-6", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-lg font-medium tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm leading-relaxed text-muted", className),
		...props
	});
}
function WhyMoved({ chart, range }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const verb = chart.rangeChangePct >= 0 ? "выросли" : "упали";
	const label = `Почему акции ${displayTicker(chart.symbol)} ${verb} на ${formatPercent(Math.abs(chart.rangeChangePct)).replace("+", "").replace("−", "")}?`;
	async function run() {
		if (text) {
			setOpen((v) => !v);
			return;
		}
		setOpen(true);
		setLoading(true);
		setError(null);
		try {
			const res = await explainMove({ data: {
				symbol: chart.symbol,
				name: chart.longName || chart.name,
				rangeLabel: range.periodLabel,
				currency: chart.currency,
				start: chart.rangeStart,
				price: chart.price,
				changePct: chart.rangeChangePct,
				changeAbs: chart.rangeChange
			} });
			if (res.ok) setText(res.text);
			else setError(res.error);
		} catch {
			setError("Не удалось получить объяснение");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: run,
			className: cn("inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-left text-sm text-fg transition-colors duration-150 hover:bg-bg"),
			children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 shrink-0 animate-spin text-muted" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5 shrink-0 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: label
			})]
		}), open && (text || error || loading) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 rounded-xl bg-surface p-4 shadow-border",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Собираем контекст по движению…"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-down",
					children: error
				}),
				text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-fg",
					children: text
				})
			]
		})]
	});
}
function QuoteHeader({ chart, range, watching, onToggleWatch }) {
	const up = chart.rangeChangePct >= 0;
	const Trend = up ? TrendingUp : TrendingDown;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate text-2xl font-medium tracking-tight text-fg md:text-3xl",
							children: chart.longName || chart.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-md p-1 text-muted hover:bg-bg hover:text-fg",
								"aria-label": "Ещё",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: chart.longName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							chart.exchangeLabel,
							": ",
							displayTicker(chart.symbol),
							" · тикер Yahoo",
							" ",
							chart.symbol
						] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "Котировки поступают с задержкой и носят справочный характер. Это не инвестиционная рекомендация."
						})] })] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-sm text-muted",
						children: [
							chart.exchangeLabel,
							": ",
							displayTicker(chart.symbol)
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "pill",
					size: "pill",
					onClick: onToggleWatch,
					className: cn(watching && "bg-up-soft text-up border-transparent"),
					children: [watching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : null, watching ? "Вы подписаны" : "Подписаться"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-x-4 gap-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-4xl font-medium tracking-tight tabular-nums text-fg",
						children: formatPrice(chart.price, chart.currency, chart.priceHint)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cn("flex items-center gap-1.5 pb-1 text-lg font-medium tabular-nums", up ? "text-up" : "text-down"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trend, { className: "size-5" }), formatPercent(chart.rangeChangePct)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cn("pb-1 text-lg tabular-nums", up ? "text-up" : "text-down"),
						children: [
							formatSigned(chart.rangeChange, chart.priceHint),
							" ",
							range.periodLabel
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						dateTime: new Date(chart.marketTime).toISOString(),
						children: formatMarketTime(chart.marketTime, chart.timeZone)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-accent underline-offset-4 hover:underline",
							children: "Отказ от обязательств"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Отказ от обязательств" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: "Данные предоставляются «как есть», могут запаздывать и содержать ошибки. Монитор не является брокером и не даёт индивидуальных инвестиционных рекомендаций."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: "Прошлые результаты не гарантируют будущую доходность. Перед сделками сверяйтесь с первоисточником котировок."
						})]
					})] })] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyMoved, {
					chart,
					range
				})]
			})
		]
	});
}
function Cell({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-sm font-medium tabular-nums text-fg",
			children: value
		})]
	});
}
function QuoteStats({ chart }) {
	const hint = chart.priceHint;
	const items = [
		{
			label: "Открытие",
			value: formatStat(chart.open, hint)
		},
		{
			label: "Максимум",
			value: formatStat(chart.dayHigh, hint)
		},
		{
			label: "Минимум",
			value: formatStat(chart.dayLow, hint)
		},
		{
			label: "Пред. закр.",
			value: formatStat(chart.previousClose, hint)
		},
		{
			label: "Объём",
			value: formatVolume(chart.volume)
		},
		{
			label: "52 нед. макс.",
			value: formatStat(chart.week52High, hint)
		},
		{
			label: "52 нед. мин.",
			value: formatStat(chart.week52Low, hint)
		},
		{
			label: "Валюта",
			value: chart.currency
		},
		{
			label: "Биржа",
			value: chart.exchangeLabel || chart.exchange
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
		className: "grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
			label: item.label,
			value: item.value
		}, item.label))
	});
}
function SearchBox({ onPick, className }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const wrapRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setDebounced(q.trim()), 220);
		return () => clearTimeout(t);
	}, [q]);
	(0, import_react.useEffect)(() => {
		function onDoc(e) {
			if (!wrapRef.current?.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
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
		staleTime: 6e4
	});
	const hits = search.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: cn("relative", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				value: q,
				onChange: (e) => {
					setQ(e.target.value);
					setOpen(true);
				},
				onFocus: () => setOpen(true),
				placeholder: "Поиск акций, фондов и других активов",
				className: "h-10 w-full rounded-full border border-border bg-surface pr-4 pl-10 text-sm text-fg outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle focus-visible:border-fg/30 focus-visible:shadow-[0_0_0_3px_rgb(26_95_180/0.12)]",
				"aria-label": "Поиск бумаг"
			}),
			open && debounced.length >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-[calc(100%+6px)] right-0 left-0 z-40 overflow-hidden rounded-xl bg-surface shadow-border",
				children: [
					search.isFetching && hits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-3 text-sm text-muted",
						children: "Ищем…"
					}),
					!search.isFetching && hits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-3 text-sm text-muted",
						children: "Ничего не найдено"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-bg",
						onClick: () => {
							onPick(hit.symbol);
							setQ("");
							setOpen(false);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5 text-muted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-medium",
									children: hit.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs text-muted",
									children: hit.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-subtle",
								children: hit.exch || hit.type
							})
						]
					}) }, hit.symbol)) })
				]
			})
		]
	});
}
function Sparkline({ values, up, className }) {
	if (values.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("inline-block h-7 w-16", className) });
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const w = 64;
	const h = 28;
	const p = 1.5;
	const d = values.map((v, i) => {
		const x = p + i / (values.length - 1) * (w - p * 2);
		const y = 26.5 - (v - min) / span * (h - p * 2);
		return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: cn("h-7 w-16", up ? "text-up" : "text-down", className),
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-border", className),
		...props
	});
}
var useWatchlist = create()(persist((set, get) => ({
	symbols: [...DEFAULT_SYMBOLS],
	selected: "GS",
	range: "5y",
	fileVersion: WATCHLIST_CONFIG_VERSION,
	select: (symbol) => set({ selected: symbol }),
	add: (raw) => {
		const symbol = raw.trim().toUpperCase();
		if (!symbol) return;
		const symbols = get().symbols;
		if (symbols.includes(symbol)) {
			set({ selected: symbol });
			return;
		}
		set({
			symbols: [symbol, ...symbols],
			selected: symbol
		});
	},
	remove: (symbol) => {
		const symbols = get().symbols.filter((s) => s !== symbol);
		set({
			symbols,
			selected: get().selected === symbol ? symbols[0] ?? "" : get().selected
		});
	},
	setRange: (range) => set({ range }),
	setSymbols: (newSymbols) => {
		const clean = Array.from(new Set(newSymbols.map((s) => s.trim().toUpperCase()).filter(Boolean)));
		if (clean.length === 0) return;
		set({
			symbols: clean,
			selected: clean[0] ?? ""
		});
	},
	resetToDefault: () => {
		set({
			symbols: [...DEFAULT_SYMBOLS],
			selected: "GS",
			fileVersion: WATCHLIST_CONFIG_VERSION
		});
	},
	reloadFromFile: () => {
		set({
			symbols: [...watchlist_default.symbols],
			selected: watchlist_default.symbols[0] ?? "GS",
			fileVersion: watchlist_default.version
		});
	}
}), {
	name: "monitor-watchlist-v2",
	version: WATCHLIST_CONFIG_VERSION,
	migrate: (persistedState, version) => {
		const state = persistedState || {};
		if (typeof version !== "number" || version < WATCHLIST_CONFIG_VERSION) {
			const current = Array.isArray(state.symbols) ? state.symbols : [];
			const merged = Array.from(/* @__PURE__ */ new Set([...watchlist_default.symbols, ...current]));
			return {
				...state,
				symbols: merged,
				fileVersion: WATCHLIST_CONFIG_VERSION
			};
		}
		return state;
	}
}));
function PendingRow({ symbol, active, onSelect, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group relative flex w-full items-center gap-2 rounded-lg px-2 py-2 pr-9 text-left md:pr-2", active ? "bg-accent-soft" : ""),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onSelect,
			className: "flex min-w-0 flex-1 items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-sm font-medium",
					children: displayTicker(symbol)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-1 h-3 w-20" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: (e) => {
				e.stopPropagation();
				onRemove();
			},
			className: "absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-down md:hidden md:group-hover:flex cursor-pointer",
			"aria-label": "Убрать из списка",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
		})]
	});
}
function Row({ quote, active, onSelect, onRemove }) {
	const up = quote.changePct >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group relative flex w-full items-center gap-2 rounded-lg px-2 py-2 pr-9 text-left transition-colors duration-150 md:pr-2", active ? "bg-accent-soft" : "hover:bg-bg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onSelect,
			className: "flex min-w-0 flex-1 items-center gap-2 cursor-pointer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
				values: quote.spark,
				up
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm font-medium tracking-tight",
						children: displayTicker(quote.symbol)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-sm font-medium",
						children: formatNumber(quote.price, quote.priceHint)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-xs text-muted",
						children: quote.shortName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("tabular-nums text-xs font-medium", up ? "text-up" : "text-down"),
						children: formatPercent(quote.changePct)
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: (e) => {
				e.stopPropagation();
				onRemove();
			},
			className: "absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-down md:hidden md:group-hover:flex cursor-pointer",
			"aria-label": "Убрать из списка",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
		})]
	});
}
function WatchlistPanel({ symbols = [], quotes = [], selected, loading, error, onSelect, onRemove }) {
	const bySymbol = new Map(quotes.map((q) => [q.symbol, q]));
	const setSymbols = useWatchlist((s) => s.setSymbols);
	const resetToDefault = useWatchlist((s) => s.resetToDefault);
	const reloadFromFile = useWatchlist((s) => s.reloadFromFile);
	const fileVersion = useWatchlist((s) => s.fileVersion);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const [importText, setImportText] = (0, import_react.useState)("");
	const handleCopyList = () => {
		const text = symbols.join(", ");
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
		toast.success(`Скопировано ${symbols.length} тикеров в буфер обмена`);
	};
	const handleDownloadJson = () => {
		const data = {
			version: fileVersion || 1,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			description: "Список тикеров наблюдения (Watchlist) Google Market Monitor",
			symbols
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "watchlist.json");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Файл watchlist.json скачан!");
	};
	const handleReloadFromFile = () => {
		reloadFromFile();
		toast.success("Список тикеров синхронизирован с файлом watchlist.json!");
	};
	const parsedImportSymbols = importText.split(/[\s,;]+/).map((s) => s.trim().toUpperCase()).filter((s) => /^[A-Za-z0-9.^_=/-]{1,20}$/.test(s));
	const handleAppendImport = () => {
		if (parsedImportSymbols.length === 0) {
			toast.error("Не найдено корректных тикеров для добавления");
			return;
		}
		const merged = Array.from(/* @__PURE__ */ new Set([...symbols, ...parsedImportSymbols]));
		setSymbols(merged);
		setImportText("");
		setImportOpen(false);
		toast.success(`Добавлено ${parsedImportSymbols.length} тикеров в список!`);
	};
	const handleReplaceImport = () => {
		if (parsedImportSymbols.length === 0) {
			toast.error("Не найдено корректных тикеров для добавления");
			return;
		}
		const clean = Array.from(new Set(parsedImportSymbols));
		setSymbols(clean);
		setImportText("");
		setImportOpen(false);
		toast.success(`Список обновлен: ${clean.length} тикеров!`);
	};
	const handleReset = () => {
		if (confirm("Сбросить список тикеров к исходному набору по умолчанию?")) {
			resetToDefault();
			toast.info("Список тикеров сброшен к исходному набору");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border/60 px-3 py-2.5 bg-surface/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-[#1a73e8] text-[#1a73e8]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-semibold tracking-wide text-fg uppercase",
							children: "Мой список"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-bg px-1.5 py-0.2 text-[10px] font-mono text-muted border border-border",
							children: symbols.length
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleCopyList,
							className: "rounded p-1 text-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer",
							title: "Скопировать список тикеров (для переноса на другой ПК)",
							children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-up" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleDownloadJson,
							className: "rounded p-1 text-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer",
							title: "Скачать файл watchlist.json",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleReloadFromFile,
							className: "rounded p-1 text-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer",
							title: "Синхронизировать/подтянуть из файла watchlist.json",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: importOpen,
							onOpenChange: setImportOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded p-1 text-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer",
									title: "Импортировать / Вставить список тикеров",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
								className: "sm:max-w-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
									className: "text-base font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-accent" }), "Импорт и перенос тикеров"]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 pt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted leading-relaxed",
											children: [
												"Вставьте список тикеров через запятую, пробел или с новой строки (например:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "rounded bg-bg px-1 py-0.5 font-mono text-[11px] text-fg",
													children: "AAPL, MSFT, NVDA, TSLA, PLTR"
												}),
												"). Изменения сохраняются автоматически в браузере."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: importText,
											onChange: (e) => setImportText(e.target.value),
											placeholder: "Вставьте тикеры: AAPL, GOOGL, NVDA, BTC-USD...",
											className: "w-full h-28 rounded-xl border border-border bg-bg p-3 text-xs font-mono focus:border-accent focus:outline-hidden"
										}),
										parsedImportSymbols.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted font-mono",
											children: [
												"Распознано тикеров:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-fg font-semibold",
													children: parsedImportSymbols.length
												}),
												" ",
												"(",
												parsedImportSymbols.slice(0, 6).join(", "),
												parsedImportSymbols.length > 6 ? "..." : "",
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												onClick: handleAppendImport,
												disabled: parsedImportSymbols.length === 0,
												className: "text-xs",
												children: "Добавить к текущему списку"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												size: "sm",
												onClick: handleReplaceImport,
												disabled: parsedImportSymbols.length === 0,
												className: "text-xs",
												children: "Заменить весь список"
											})]
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleReset,
							className: "rounded p-1 text-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer",
							title: "Сбросить список к исходным из watchlist.json",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 py-1 bg-bg/40 text-[10px] text-muted flex items-center justify-between border-b border-border/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-up animate-pulse" }), "Синхронизировано с watchlist.json"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[9px] opacity-75",
					children: [
						"v",
						fileVersion || 1,
						" · автосохранение"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-1.5 pb-3",
				children: [
					symbols.map((symbol) => {
						const quote = bySymbol.get(symbol);
						if (!quote) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingRow, {
							symbol,
							active: symbol === selected,
							onSelect: () => onSelect(symbol),
							onRemove: () => onRemove(symbol)
						}, symbol);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							quote,
							active: symbol === selected,
							onSelect: () => onSelect(symbol),
							onRemove: () => onRemove(symbol)
						}, symbol);
					}),
					symbols.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-8 text-center text-sm text-muted",
						children: "Список пуст. Найдите бумагу в поиске, чтобы добавить её."
					}),
					error && symbols.length > 0 && quotes.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-2 text-center text-xs text-down",
						children: "Не удалось обновить котировки"
					})
				]
			})
		]
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle", "focus-visible:border-fg/30 focus-visible:shadow-[0_0_0_3px_rgb(26_95_180/0.15)]", "disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
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
function cleanGroupName(raw) {
	if (!raw) return "Основной портфель";
	const trimmed = raw.trim();
	if (/gemini/i.test(trimmed) || /six\s*sectors/i.test(trimmed)) return "Six sectors";
	if (/claude/i.test(trimmed) || /infa\s*plus/i.test(trimmed)) return "Infa plus banks";
	if (/ai\s*plus/i.test(trimmed)) return "AI plus finance";
	if (/основной/i.test(trimmed)) return "Основной портфель";
	return trimmed.replace(/^(GEMINI|CLAUDE|CHATBOT|AI|GPT|BOT)[:\s-]*/i, "").replace(/[:\-]\s*(GEMINI|CLAUDE|CHATBOT|AI|GPT|BOT)/gi, "").trim() || "Основной портфель";
}
var DEFAULT_GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/17jWZKEiegp5fGuPV_Z4Ffsh0jeXISOIfwhtxE4feXeo/edit?usp=sharing";
var DEFAULT_DEMO_HOLDINGS = [
	{
		id: "GS-1",
		symbol: "GS",
		rawSymbol: "NYSE:GS",
		stockName: "Goldman Sachs",
		shares: 3668,
		costPrice: 1090.67,
		costValue: 4000578,
		sheetPrice: 1020,
		sheetValue: 3740516,
		sheetPnlUsd: -260061,
		sheetPnlPct: -6.5,
		portfolioGroup: "Основной портфель",
		formationDate: "16.06",
		notes: "Goldman Sachs • Основной портфель"
	},
	{
		id: "TSM-2",
		symbol: "TSM",
		rawSymbol: "NYSE:TSM",
		stockName: "TSMC (ADR)",
		shares: 9388,
		costPrice: 425.83,
		costValue: 3997692,
		sheetPrice: 428,
		sheetValue: 4018346,
		sheetPnlUsd: 20654,
		sheetPnlPct: .52,
		portfolioGroup: "Основной портфель",
		formationDate: "16.06",
		notes: "TSMC (ADR) • Основной портфель"
	},
	{
		id: "ASML-3",
		symbol: "ASML",
		rawSymbol: "AMS:ASML",
		stockName: "ASML Holding",
		shares: 1644,
		costPrice: 1591.2,
		costValue: 2615933,
		sheetPrice: 1474,
		sheetValue: 2787123,
		sheetPnlUsd: -211547,
		sheetPnlPct: -8.09,
		portfolioGroup: "Основной портфель",
		formationDate: "16.06",
		notes: "ASML Holding • Основной портфель"
	},
	{
		id: "LRCX-4",
		symbol: "LRCX",
		rawSymbol: "NASDAQ:LRCX",
		stockName: "Lam Research",
		shares: 8122,
		costPrice: 369.34,
		costValue: 2999779,
		sheetPrice: 298,
		sheetValue: 2420437,
		sheetPnlUsd: -579342,
		sheetPnlPct: -19.31,
		portfolioGroup: "Основной портфель",
		formationDate: "16.06",
		notes: "Lam Research • Основной портфель"
	},
	{
		id: "DRAM-5",
		symbol: "DRAM",
		rawSymbol: "BATS:DRAM",
		stockName: "Roundhill Memory ETF",
		shares: 44052,
		costPrice: 68.12,
		costValue: 3000822,
		sheetPrice: 59,
		sheetValue: 2579685,
		sheetPnlUsd: -421137,
		sheetPnlPct: -14.03,
		portfolioGroup: "Основной портфель",
		formationDate: "16.06",
		notes: "Roundhill Memory ETF • Основной портфель"
	},
	{
		id: "GOOGL-6",
		symbol: "GOOGL",
		rawSymbol: "NASDAQ:GOOGL",
		stockName: "Alphabet Inc.",
		shares: 8037,
		costPrice: 373.25,
		costValue: 2999810,
		sheetPrice: 333,
		sheetValue: 2673106,
		sheetPnlUsd: -326704,
		sheetPnlPct: -10.89,
		portfolioGroup: "Основной портфель",
		formationDate: "16.06",
		notes: "Alphabet Inc. • Основной портфель"
	},
	{
		id: "GE-7",
		symbol: "GE",
		rawSymbol: "NYSE:GE",
		stockName: "GE Aerospace",
		shares: 11374,
		costPrice: 351.66,
		costValue: 3999781,
		sheetPrice: 324,
		sheetValue: 3686882,
		sheetPnlUsd: -312899,
		sheetPnlPct: -7.82,
		portfolioGroup: "Six sectors",
		formationDate: "16.06",
		notes: "GE Aerospace • Six sectors"
	},
	{
		id: "RY-8",
		symbol: "RY",
		rawSymbol: "NYSE:RY",
		stockName: "Royal Bank of Canada",
		shares: 19891,
		costPrice: 201.09,
		costValue: 3999881,
		sheetPrice: 206,
		sheetValue: 4097148,
		sheetPnlUsd: 97267,
		sheetPnlPct: 2.43,
		portfolioGroup: "Six sectors",
		formationDate: "16.06",
		notes: "Royal Bank of Canada • Six sectors"
	},
	{
		id: "KKR-9",
		symbol: "KKR",
		rawSymbol: "NYSE:KKR",
		stockName: "KKR & Co. Inc.",
		shares: 30306,
		costPrice: 98.99,
		costValue: 2999991,
		sheetPrice: 101,
		sheetValue: 3056966,
		sheetPnlUsd: 56975,
		sheetPnlPct: 1.9,
		portfolioGroup: "Six sectors",
		formationDate: "16.06",
		notes: "KKR & Co. Inc. • Six sectors"
	},
	{
		id: "FWONK-10",
		symbol: "FWONK",
		rawSymbol: "NASDAQ:FWONK",
		stockName: "Formula One Group",
		shares: 33470,
		costPrice: 89.63,
		costValue: 2999916,
		sheetPrice: 95,
		sheetValue: 3194377,
		sheetPnlUsd: 194461,
		sheetPnlPct: 6.48,
		portfolioGroup: "Six sectors",
		formationDate: "16.06",
		notes: "Formula One Group • Six sectors"
	},
	{
		id: "PRLB-11",
		symbol: "PRLB",
		rawSymbol: "NYSE:PRLB",
		stockName: "Proto Labs Inc.",
		shares: 38100,
		costPrice: 78.74,
		costValue: 2999994,
		sheetPrice: 80,
		sheetValue: 3038475,
		sheetPnlUsd: 38481,
		sheetPnlPct: 1.28,
		portfolioGroup: "Six sectors",
		formationDate: "16.06",
		notes: "Proto Labs Inc. • Six sectors"
	},
	{
		id: "XMTR-12",
		symbol: "XMTR",
		rawSymbol: "NASDAQ:XMTR",
		stockName: "Xometry Inc.",
		shares: 34891,
		costPrice: 85.98,
		costValue: 2999928,
		sheetPrice: 85,
		sheetValue: 2960501,
		sheetPnlUsd: -39427,
		sheetPnlPct: -1.31,
		portfolioGroup: "Six sectors",
		formationDate: "16.06",
		notes: "Xometry Inc. • Six sectors"
	},
	{
		id: "RY-13",
		symbol: "RY",
		rawSymbol: "NYSE:RY",
		stockName: "Royal Bank of Canada",
		shares: 19888,
		costPrice: 201.13,
		costValue: 4000073,
		sheetPrice: 206,
		sheetValue: 4096530,
		sheetPnlUsd: 96457,
		sheetPnlPct: 2.41,
		portfolioGroup: "Infa plus banks",
		formationDate: "16.06",
		notes: "Royal Bank of Canada • Infa plus banks"
	},
	{
		id: "BAC-14",
		symbol: "BAC",
		rawSymbol: "NYSE:BAC",
		stockName: "Bank of America",
		shares: 70373,
		costPrice: 56.84,
		costValue: 4000001,
		sheetPrice: 63,
		sheetValue: 4402535,
		sheetPnlUsd: 402534,
		sheetPnlPct: 10.06,
		portfolioGroup: "Infa plus banks",
		formationDate: "16.06",
		notes: "Bank of America • Infa plus banks"
	},
	{
		id: "GE-15",
		symbol: "GE",
		rawSymbol: "NYSE:GE",
		stockName: "GE Aerospace",
		shares: 8584,
		costPrice: 349.5,
		costValue: 3000108,
		sheetPrice: 324,
		sheetValue: 2782504,
		sheetPnlUsd: -217604,
		sheetPnlPct: -7.25,
		portfolioGroup: "Infa plus banks",
		formationDate: "16.06",
		notes: "GE Aerospace • Infa plus banks"
	},
	{
		id: "ARM-16",
		symbol: "ARM",
		rawSymbol: "NASDAQ:ARM",
		stockName: "ARM Holdings",
		shares: 7519,
		costPrice: 399,
		costValue: 3000081,
		sheetPrice: 254,
		sheetValue: 1911179,
		sheetPnlUsd: -1088902,
		sheetPnlPct: -36.3,
		portfolioGroup: "Infa plus banks",
		formationDate: "16.06",
		notes: "ARM Holdings • Infa plus banks"
	},
	{
		id: "QNT-17",
		symbol: "QNT",
		rawSymbol: "NASDAQ:QNT",
		stockName: "Quantinuum",
		shares: 54122,
		costPrice: 55.43,
		costValue: 2999982,
		sheetPrice: 49,
		sheetValue: 2634118,
		sheetPnlUsd: -365865,
		sheetPnlPct: -12.2,
		portfolioGroup: "Infa plus banks",
		formationDate: "16.06",
		notes: "Quantinuum • Infa plus banks"
	},
	{
		id: "KKR-18",
		symbol: "KKR",
		rawSymbol: "NYSE:KKR",
		stockName: "KKR & Co Inc",
		shares: 30457,
		costPrice: 98.5,
		costValue: 3000015,
		sheetPrice: 101,
		sheetValue: 3072198,
		sheetPnlUsd: 72183,
		sheetPnlPct: 2.41,
		portfolioGroup: "Infa plus banks",
		formationDate: "16.06",
		notes: "KKR & Co Inc • Infa plus banks"
	},
	{
		id: "ARM-19",
		symbol: "ARM",
		rawSymbol: "NASDAQ:ARM",
		stockName: "Arm Holdings",
		shares: 10092,
		costPrice: 396.34,
		costValue: 3999863,
		sheetPrice: 254,
		sheetValue: 2565185,
		sheetPnlUsd: -1434679,
		sheetPnlPct: -35.87,
		portfolioGroup: "AI plus finance",
		formationDate: "16.06",
		notes: "Arm Holdings • AI plus finance"
	},
	{
		id: "KKR-20",
		symbol: "KKR",
		rawSymbol: "NYSE:KKR",
		stockName: "KKR & Co.",
		shares: 40416,
		costPrice: 98.97,
		costValue: 3999972,
		sheetPrice: 101,
		sheetValue: 4076762,
		sheetPnlUsd: 76790,
		sheetPnlPct: 1.92,
		portfolioGroup: "AI plus finance",
		formationDate: "16.06",
		notes: "KKR & Co. • AI plus finance"
	},
	{
		id: "QNT-21",
		symbol: "QNT",
		rawSymbol: "NASDAQ:QNT",
		stockName: "Quantinuum Inc.",
		shares: 54122,
		costPrice: 55.43,
		costValue: 2999982,
		sheetPrice: 49,
		sheetValue: 2634118,
		sheetPnlUsd: -365865,
		sheetPnlPct: -12.2,
		portfolioGroup: "AI plus finance",
		formationDate: "16.06",
		notes: "Quantinuum Inc. • AI plus finance"
	},
	{
		id: "VIRT-22",
		symbol: "VIRT",
		rawSymbol: "NYSE:VIRT",
		stockName: "Virtu Financial",
		shares: 51108,
		costPrice: 58.7,
		costValue: 3000040,
		sheetPrice: 62,
		sheetValue: 3146720,
		sheetPnlUsd: 146680,
		sheetPnlPct: 4.89,
		portfolioGroup: "AI plus finance",
		formationDate: "16.06",
		notes: "Virtu Financial • AI plus finance"
	},
	{
		id: "XMTR-23",
		symbol: "XMTR",
		rawSymbol: "NASDAQ:XMTR",
		stockName: "Xometry",
		shares: 34471,
		costPrice: 85.98,
		costValue: 2963817,
		sheetPrice: 85,
		sheetValue: 2924864,
		sheetPnlUsd: -38952,
		sheetPnlPct: -1.31,
		portfolioGroup: "AI plus finance",
		formationDate: "16.06",
		notes: "Xometry • AI plus finance"
	},
	{
		id: "GE-24",
		symbol: "GE",
		rawSymbol: "NYSE:GE",
		stockName: "GE Aerospace",
		shares: 8529,
		costPrice: 351.73,
		costValue: 2999905,
		sheetPrice: 324,
		sheetValue: 2764675,
		sheetPnlUsd: -235230,
		sheetPnlPct: -7.84,
		portfolioGroup: "AI plus finance",
		formationDate: "16.06",
		notes: "GE Aerospace • AI plus finance"
	}
];
function generateGoogleFinanceTemplateCsv() {
	return [
		`"Ticker","Stock","Shares","Cost Price 16.06","Value USD 16.06","Курс к USD (16.06)","Price 10.09","Value USD 10.09","P/L USD","P/L %"`,
		`"NYSE:GS","Goldman Sachs",3668,1090.67,"4,000,578",1,1020,"3,740,516","-260,061",-6.50%`,
		`"NYSE:TSM","TSMC (ADR)",9388,425.83,"3,997,692",1,428,"4,018,346","20,654",0.52%`,
		`"AMS:ASML","ASML Holding",1644,1591.2,"2,615,933",1.14631,1474,"2,787,123","-211,547",-8.09%`,
		`"NASDAQ:LRCX","Lam Research",8122,369.34,"2,999,779",1,298,"2,420,437","-579,342",-19.31%`,
		`"BATS:DRAM","Roundhill Memory ETF",44052,68.12,"3,000,822",1,59,"2,579,685","-421,137",-14.03%`,
		`"NASDAQ:GOOGL","Alphabet Inc.",8037,373.25,"2,999,810",1,333,"2,673,106","-326,704",-10.89%`,
		`"Benchmark:","iShares MSCI ACWI ETF",127113,157.34,"19,999,959",1,159,"20,184,273","184,314",0.92%`
	].join("\r\n");
}
var fetchSheetData = createServerFn({ method: "POST" }).validator((d) => object({ urlOrId: string() }).parse(d)).handler(createSsrRpc("c3bf7882619a523e48b9c5d821a31eccf348c893591eb3fd9843ff2c883403bd"));
var RANGES = [
	{
		id: "1d",
		label: "1Д",
		periodLabel: "за день"
	},
	{
		id: "5d",
		label: "5ДН",
		periodLabel: "за 5 дней"
	},
	{
		id: "1mo",
		label: "1МЕС",
		periodLabel: "за месяц"
	},
	{
		id: "6mo",
		label: "6МЕС",
		periodLabel: "за 6 месяцев"
	},
	{
		id: "ytd",
		label: "С1ЯН",
		periodLabel: "с 1 января"
	},
	{
		id: "1y",
		label: "1ГОД",
		periodLabel: "за 1 год"
	},
	{
		id: "5y",
		label: "5ЛЕТ",
		periodLabel: "за 5 лет"
	},
	{
		id: "max",
		label: "МАКС",
		periodLabel: "за всё время"
	}
];
function formatXAxisLabel(t, range) {
	const d = new Date(t);
	if (range === "1d") return d.toLocaleTimeString("ru-RU", {
		hour: "2-digit",
		minute: "2-digit"
	});
	if (range === "5d") return `${d.toLocaleDateString("ru-RU", { weekday: "short" })} ${d.getDate()}`;
	if (range === "1mo" || range === "6mo" || range === "ytd" || range === "1y") return d.toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short"
	});
	return d.toLocaleDateString("ru-RU", {
		month: "short",
		year: "2-digit"
	});
}
function formatTooltipDate(t, range) {
	const d = new Date(t);
	if (range === "1d" || range === "5d") return d.toLocaleString("ru-RU", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
	return d.toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function formatSheetDateLabel(dateStr) {
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return dateStr;
	return d.toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short"
	});
}
function formatSheetDateFull(dateStr) {
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return dateStr;
	return d.toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
function GoogleFinancePortfolioChart({ portfolioName, totalValue, totalCost, formationDate, benchmarkReturnPct = .92, holdings = [], watchlistHistory = DEFAULT_SHEET_WATCHLIST_POINTS }) {
	const [dataMode, setDataMode] = (0, import_react.useState)("watchlist_sheet");
	const [selectedRange, setSelectedRange] = (0, import_react.useState)("1y");
	const [compareBenchmark, setCompareBenchmark] = (0, import_react.useState)(true);
	const [chartType, setChartType] = (0, import_react.useState)("area");
	const [hoverIndex, setHoverIndex] = (0, import_react.useState)(null);
	const containerRef = (0, import_react.useRef)(null);
	const isAllAssets = portfolioName.toLowerCase().includes("все активы");
	const queryPayload = (0, import_react.useMemo)(() => {
		const symbols = Array.from(new Set(holdings.map((h) => h.symbol).filter(Boolean))).sort();
		const sharesMap = {};
		const costPricesMap = {};
		for (const h of holdings) {
			sharesMap[h.symbol] = (sharesMap[h.symbol] || 0) + h.shares;
			costPricesMap[h.symbol] = h.costPrice;
		}
		return {
			symbols,
			symbolsKey: symbols.join(","),
			sharesMap,
			costPricesMap
		};
	}, [holdings]);
	const { data: chartData, isFetching } = useQuery({
		queryKey: [
			"portfolio-chart",
			queryPayload.symbolsKey,
			selectedRange,
			compareBenchmark
		],
		queryFn: () => getPortfolioHistoricalChart({ data: {
			symbols: queryPayload.symbols,
			sharesMap: queryPayload.sharesMap,
			costPricesMap: queryPayload.costPricesMap,
			range: selectedRange,
			includeBenchmark: compareBenchmark
		} }),
		enabled: queryPayload.symbols.length > 0 && dataMode === "live",
		staleTime: 6e4,
		placeholderData: keepPreviousData
	});
	const livePoints = (0, import_react.useMemo)(() => {
		if (chartData?.points && chartData.points.length >= 2) return chartData.points;
		return [];
	}, [chartData]);
	const sheetPoints = (0, import_react.useMemo)(() => {
		return watchlistHistory && watchlistHistory.length > 0 ? watchlistHistory : DEFAULT_SHEET_WATCHLIST_POINTS;
	}, [watchlistHistory]);
	const VB = {
		w: 900,
		h: 320
	};
	const PAD = {
		l: 20,
		r: 25,
		t: 25,
		b: 35
	};
	const innerW = VB.w - PAD.l - PAD.r;
	const innerH = VB.h - PAD.t - PAD.b;
	const sheetValues = (0, import_react.useMemo)(() => {
		return sheetPoints.flatMap((p) => [
			p.mainPortfolio,
			p.modelPortfolio,
			p.benchmark
		]);
	}, [sheetPoints]);
	const minSheetVal = Math.min(...sheetValues) * .98;
	const maxSheetVal = Math.max(...sheetValues) * 1.02;
	const sheetValSpan = maxSheetVal - minSheetVal || 1;
	const xSheet = (idx) => PAD.l + idx / (sheetPoints.length - 1 || 1) * innerW;
	const ySheet = (val) => PAD.t + (maxSheetVal - val) / sheetValSpan * innerH;
	const sheetMainLine = (0, import_react.useMemo)(() => {
		if (sheetPoints.length < 2) return "";
		return sheetPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${xSheet(i).toFixed(1)} ${ySheet(p.mainPortfolio).toFixed(1)}`).join(" ");
	}, [
		sheetPoints,
		minSheetVal,
		maxSheetVal
	]);
	const sheetModelLine = (0, import_react.useMemo)(() => {
		if (sheetPoints.length < 2) return "";
		return sheetPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${xSheet(i).toFixed(1)} ${ySheet(p.modelPortfolio).toFixed(1)}`).join(" ");
	}, [
		sheetPoints,
		minSheetVal,
		maxSheetVal
	]);
	const sheetBenchLine = (0, import_react.useMemo)(() => {
		if (sheetPoints.length < 2) return "";
		return sheetPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${xSheet(i).toFixed(1)} ${ySheet(p.benchmark).toFixed(1)}`).join(" ");
	}, [
		sheetPoints,
		minSheetVal,
		maxSheetVal
	]);
	const sheetMainArea = (0, import_react.useMemo)(() => {
		if (!sheetMainLine || sheetPoints.length < 2) return "";
		const lastX = xSheet(sheetPoints.length - 1).toFixed(1);
		const firstX = xSheet(0).toFixed(1);
		const bottomY = (PAD.t + innerH).toFixed(1);
		return `${sheetMainLine} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
	}, [sheetMainLine, sheetPoints]);
	const liveValues = (0, import_react.useMemo)(() => {
		const vals = livePoints.map((p) => p.value);
		if (compareBenchmark) livePoints.forEach((p) => {
			if (p.benchmarkValue) vals.push(p.benchmarkValue);
		});
		return vals;
	}, [livePoints, compareBenchmark]);
	const minLiveVal = Math.min(...liveValues.length ? liveValues : [1]) * .98;
	const maxLiveVal = Math.max(...liveValues.length ? liveValues : [1]) * 1.02;
	const liveValSpan = maxLiveVal - minLiveVal || 1;
	const xLive = (idx) => PAD.l + idx / (livePoints.length - 1 || 1) * innerW;
	const yLive = (val) => PAD.t + (maxLiveVal - val) / liveValSpan * innerH;
	const liveMainLine = (0, import_react.useMemo)(() => {
		if (livePoints.length < 2) return "";
		return livePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${xLive(i).toFixed(1)} ${yLive(p.value).toFixed(1)}`).join(" ");
	}, [
		livePoints,
		minLiveVal,
		maxLiveVal
	]);
	const liveAreaPath = (0, import_react.useMemo)(() => {
		if (!liveMainLine || livePoints.length < 2) return "";
		const lastX = xLive(livePoints.length - 1).toFixed(1);
		const firstX = xLive(0).toFixed(1);
		const bottomY = (PAD.t + innerH).toFixed(1);
		return `${liveMainLine} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
	}, [liveMainLine, livePoints]);
	const liveBenchLine = (0, import_react.useMemo)(() => {
		if (!compareBenchmark || livePoints.length < 2) return "";
		return livePoints.map((p, i) => {
			const val = p.benchmarkValue ?? p.value;
			return `${i === 0 ? "M" : "L"} ${xLive(i).toFixed(1)} ${yLive(val).toFixed(1)}`;
		}).join(" ");
	}, [
		livePoints,
		compareBenchmark,
		minLiveVal,
		maxLiveVal
	]);
	const currentCount = dataMode === "watchlist_sheet" ? sheetPoints.length : livePoints.length;
	const handleMouseMove = (e) => {
		if (currentCount < 2) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		const idx = Math.round(ratio * (currentCount - 1));
		setHoverIndex(idx);
	};
	const handleMouseLeave = () => {
		setHoverIndex(null);
	};
	const activeSheetPoint = hoverIndex !== null && hoverIndex < sheetPoints.length ? sheetPoints[hoverIndex] : sheetPoints[sheetPoints.length - 1];
	const activeLivePoint = hoverIndex !== null && hoverIndex < livePoints.length ? livePoints[hoverIndex] : livePoints[livePoints.length - 1];
	const activeLiveValue = activeLivePoint ? activeLivePoint.value : totalValue;
	const rangeStartVal = chartData?.startValue || livePoints[0]?.value || totalCost;
	const liveRangeChange = activeLiveValue - rangeStartVal;
	const liveRangeChangePct = rangeStartVal > 0 ? liveRangeChange / rangeStartVal * 100 : 0;
	const liveIsUp = liveRangeChange >= 0;
	const sheetMainChangePct = activeSheetPoint.mainPortfolio - 100;
	const sheetIsUp = sheetMainChangePct >= 0;
	const sheetAlpha = activeSheetPoint.modelPortfolio - activeSheetPoint.mainPortfolio;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "rounded-2xl border border-border/80 bg-surface p-5 sm:p-7 shadow-sm transition-all",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-medium flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Главная" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg font-semibold",
									children: portfolioName
								}),
								!isAllAssets && formationDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 rounded bg-bg px-2 py-0.5 text-[11px] font-mono text-muted",
									children: ["сформирован от ", formationDate]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: dataMode === "watchlist_sheet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-[11px] font-medium text-[#0F9D58] bg-[#0F9D58]/10 px-2.5 py-1 rounded-full border border-[#0F9D58]/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-3.5" }), "Вкладка «Watchlist» (Google Таблица)"]
							}) : isFetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[11px] text-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }), "Обновление Yahoo котировок..."]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-[11px] text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-up animate-pulse" }), "Google Finance / Yahoo Live"]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl sm:text-2xl font-bold tracking-tight text-fg",
							children: dataMode === "watchlist_sheet" ? "Сравнительная динамика (вкладка «Watchlist»)" : portfolioName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: dataMode === "watchlist_sheet" ? "Период: 16.06.2026 – 16.07.2026 · База = 100.00" : `Вложено: $${formatNumber(totalCost, 0)}`
						})]
					}),
					dataMode === "watchlist_sheet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-3xl sm:text-4xl font-bold font-mono tracking-tight text-fg",
										children: activeSheetPoint.mainPortfolio.toFixed(2)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-muted font-mono",
										children: "(база 100.00 на 16.06)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("inline-flex items-center gap-1 text-sm sm:text-base font-bold font-mono px-2.5 py-0.5 rounded-md transition-colors", sheetIsUp ? "bg-up-soft text-up" : "bg-down-soft text-down"),
										children: [
											sheetIsUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "size-4" }),
											sheetIsUp ? "+" : "−",
											Math.abs(sheetMainChangePct).toFixed(2),
											"% (Основной)"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 pt-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-lg border border-[#1a73e8]/30 bg-[#1a73e8]/10 px-2.5 py-1 text-[#1a73e8] font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[#1a73e8]" }),
											"Основной портфель:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "font-mono",
												children: activeSheetPoint.mainPortfolio.toFixed(2)
											}),
											" (",
											activeSheetPoint.mainPortfolio >= 100 ? "+" : "",
											(activeSheetPoint.mainPortfolio - 100).toFixed(2),
											"%)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-lg border border-[#34a853]/30 bg-[#34a853]/10 px-2.5 py-1 text-[#34a853] font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[#34a853]" }),
											"Модельный портфель:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "font-mono",
												children: activeSheetPoint.modelPortfolio.toFixed(2)
											}),
											" (",
											activeSheetPoint.modelPortfolio >= 100 ? "+" : "",
											(activeSheetPoint.modelPortfolio - 100).toFixed(2),
											"%)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-700 dark:text-amber-300 font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-amber-500" }),
											"Бенчмарк MSCI ACWI:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "font-mono",
												children: activeSheetPoint.benchmark.toFixed(2)
											}),
											" (",
											activeSheetPoint.benchmark >= 100 ? "+" : "",
											(activeSheetPoint.benchmark - 100).toFixed(2),
											"%)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-purple-700 dark:text-purple-300 font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }),
											"Альфа (Модельный vs Основной):",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "font-mono",
												children: [
													sheetAlpha >= 0 ? "+" : "",
													sheetAlpha.toFixed(2),
													"%"
												]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted pt-0.5",
								children: [formatSheetDateFull(activeSheetPoint.date), " · Исторические данные из вашей Google Таблицы"]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-3xl sm:text-4xl font-bold font-mono tracking-tight text-fg",
								children: ["$", formatNumber(activeLiveValue, 2)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("inline-flex items-center gap-1 text-sm sm:text-base font-bold font-mono px-2.5 py-0.5 rounded-md transition-colors", liveIsUp ? "bg-up-soft text-up" : "bg-down-soft text-down"),
								children: [
									liveIsUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "size-4" }),
									liveIsUp ? "+" : "−",
									Math.abs(liveRangeChangePct).toFixed(2),
									"% (",
									liveIsUp ? "+" : "−",
									"$",
									formatNumber(Math.abs(liveRangeChange), 0),
									")",
									" ",
									selectedRange.toUpperCase()
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted",
							children: [activeLivePoint?.t ? formatTooltipDate(activeLivePoint.t, selectedRange) : "Сегодня", " · USD"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center rounded-xl bg-bg/80 p-1 border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setDataMode("watchlist_sheet"),
						className: cn("flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer", dataMode === "watchlist_sheet" ? "bg-surface text-[#0F9D58] shadow-xs border border-border" : "text-muted hover:text-fg"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📊 Watchlist из таблицы (16.06 – 16.07)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-[#0F9D58]/15 px-1.5 py-0.2 text-[10px] font-mono text-[#0F9D58]",
								children: [sheetPoints.length, " дн."]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setDataMode("live"),
						className: cn("flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer", dataMode === "live" ? "bg-surface text-[#1a73e8] shadow-xs border border-border" : "text-muted hover:text-fg"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📈 Live котировки (Yahoo)" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setChartType(chartType === "area" ? "line" : "area"),
						className: "flex items-center gap-1.5 rounded-lg border border-border bg-bg/60 px-3 py-1.5 text-xs font-medium text-fg hover:bg-bg transition-colors cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5 text-[#1a73e8]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: chartType === "area" ? "С областями" : "Линейный" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3 text-muted" })
						]
					}), dataMode === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setCompareBenchmark(!compareBenchmark),
						className: cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer", compareBenchmark ? "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold" : "border-border bg-bg/60 text-muted hover:text-fg hover:bg-bg"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompare, { className: "size-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Сравнить с ACWI" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] opacity-75 font-mono",
								children: [
									"(",
									benchmarkReturnPct > 0 ? "+" : "",
									benchmarkReturnPct,
									"%)"
								]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4 h-64 sm:h-72 w-full",
				children: [
					dataMode === "live" && livePoints.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex size-full flex-col items-center justify-center rounded-xl bg-bg/40 text-muted border border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-[#1a73e8] mb-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-medium text-fg",
								children: [
									"Загрузка истории портфеля ",
									RANGES.find((r) => r.id === selectedRange)?.periodLabel,
									"..."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted mt-0.5",
								children: "Сбор котировок активов и расчет кривой доходности"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: `0 0 ${VB.w} ${VB.h}`,
						className: "size-full overflow-visible select-none",
						preserveAspectRatio: "none",
						onMouseMove: handleMouseMove,
						onMouseLeave: handleMouseLeave,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "gfAreaGradient",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#1a73e8",
										stopOpacity: "0.25"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "70%",
										stopColor: "#1a73e8",
										stopOpacity: "0.04"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#1a73e8",
										stopOpacity: "0.00"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "gfModelGradient",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#34a853",
										stopOpacity: "0.20"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "70%",
										stopColor: "#34a853",
										stopOpacity: "0.03"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#34a853",
										stopOpacity: "0.00"
									})
								]
							})] }),
							[
								.2,
								.4,
								.6,
								.8
							].map((fraction, i) => {
								const x = PAD.l + fraction * innerW;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: x,
									y1: PAD.t,
									x2: x,
									y2: PAD.t + innerH,
									stroke: "#e2e8f0",
									strokeWidth: "1",
									strokeDasharray: "2 2",
									opacity: "0.6"
								}, i);
							}),
							dataMode === "watchlist_sheet" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: PAD.l,
									y1: ySheet(100),
									x2: PAD.l + innerW,
									y2: ySheet(100),
									stroke: "#94a3b8",
									strokeWidth: "1",
									strokeDasharray: "3 3",
									opacity: "0.5"
								}),
								chartType === "area" && sheetMainArea && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: sheetMainArea,
									fill: "url(#gfAreaGradient)"
								}),
								sheetBenchLine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: sheetBenchLine,
									fill: "none",
									stroke: "#f59e0b",
									strokeWidth: "1.8",
									strokeDasharray: "4 3",
									opacity: "0.9"
								}),
								sheetModelLine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: sheetModelLine,
									fill: "none",
									stroke: "#34a853",
									strokeWidth: "2.4",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								}),
								sheetMainLine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: sheetMainLine,
									fill: "none",
									stroke: "#1a73e8",
									strokeWidth: "2.4",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								}),
								hoverIndex === null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: xSheet(sheetPoints.length - 1),
										cy: ySheet(sheetPoints[sheetPoints.length - 1].mainPortfolio),
										r: "4.5",
										fill: "#1a73e8",
										stroke: "#ffffff",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: xSheet(sheetPoints.length - 1),
										cy: ySheet(sheetPoints[sheetPoints.length - 1].modelPortfolio),
										r: "4.5",
										fill: "#34a853",
										stroke: "#ffffff",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: xSheet(sheetPoints.length - 1),
										cy: ySheet(sheetPoints[sheetPoints.length - 1].benchmark),
										r: "4",
										fill: "#f59e0b",
										stroke: "#ffffff",
										strokeWidth: "1.5"
									})
								] }),
								hoverIndex !== null && hoverIndex < sheetPoints.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: xSheet(hoverIndex),
										y1: PAD.t,
										x2: xSheet(hoverIndex),
										y2: PAD.t + innerH,
										stroke: "#1a73e8",
										strokeWidth: "1",
										strokeDasharray: "3 3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: xSheet(hoverIndex),
										cy: ySheet(sheetPoints[hoverIndex].mainPortfolio),
										r: "5",
										fill: "#1a73e8",
										stroke: "#ffffff",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: xSheet(hoverIndex),
										cy: ySheet(sheetPoints[hoverIndex].modelPortfolio),
										r: "5",
										fill: "#34a853",
										stroke: "#ffffff",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: xSheet(hoverIndex),
										cy: ySheet(sheetPoints[hoverIndex].benchmark),
										r: "4.5",
										fill: "#f59e0b",
										stroke: "#ffffff",
										strokeWidth: "2"
									})
								] }),
								[
									0,
									.25,
									.5,
									.75,
									1
								].map((f, i) => {
									const idx = Math.round(f * (sheetPoints.length - 1));
									const p = sheetPoints[idx];
									if (!p?.date) return null;
									const label = formatSheetDateLabel(p.date);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: xSheet(idx),
										y: PAD.t + innerH + 18,
										textAnchor: i === 0 ? "start" : i === 4 ? "end" : "middle",
										fontSize: "11",
										fill: "#8f8e86",
										fontFamily: "sans-serif",
										children: label
									}, i);
								})
							] }),
							dataMode === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								chartType === "area" && liveAreaPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: liveAreaPath,
									fill: "url(#gfAreaGradient)"
								}),
								compareBenchmark && liveBenchLine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: liveBenchLine,
									fill: "none",
									stroke: "#f59e0b",
									strokeWidth: "2",
									strokeDasharray: "4 3",
									opacity: "0.85"
								}),
								liveMainLine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: liveMainLine,
									fill: "none",
									stroke: "#1a73e8",
									strokeWidth: "2.4",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								}),
								livePoints.length > 0 && hoverIndex === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: xLive(livePoints.length - 1),
									cy: yLive(livePoints[livePoints.length - 1].value),
									r: "4.5",
									fill: "#1a73e8",
									stroke: "#ffffff",
									strokeWidth: "1.5"
								}),
								hoverIndex !== null && hoverIndex < livePoints.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: xLive(hoverIndex),
									y1: PAD.t,
									x2: xLive(hoverIndex),
									y2: PAD.t + innerH,
									stroke: "#1a73e8",
									strokeWidth: "1",
									strokeDasharray: "3 3"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: xLive(hoverIndex),
									cy: yLive(livePoints[hoverIndex].value),
									r: "5",
									fill: "#1a73e8",
									stroke: "#ffffff",
									strokeWidth: "2"
								})] }),
								[
									0,
									.25,
									.5,
									.75,
									1
								].map((f, i) => {
									const idx = Math.round(f * (livePoints.length - 1));
									const p = livePoints[idx];
									if (!p?.t) return null;
									const label = formatXAxisLabel(p.t, selectedRange);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: xLive(idx),
										y: PAD.t + innerH + 18,
										textAnchor: i === 0 ? "start" : i === 4 ? "end" : "middle",
										fontSize: "11",
										fill: "#8f8e86",
										fontFamily: "sans-serif",
										children: label
									}, i);
								})
							] })
						]
					}),
					dataMode === "watchlist_sheet" && hoverIndex !== null && activeSheetPoint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute -top-8 rounded-xl border border-border bg-surface/95 p-2.5 shadow-lg backdrop-blur-md transition-all z-20 min-w-[200px]",
						style: {
							left: `${Math.max(12, Math.min(82, hoverIndex / (sheetPoints.length - 1) * 100))}%`,
							transform: "translateX(-50%)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] font-semibold text-fg border-b border-border/60 pb-1 mb-1.5 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3 text-muted" }), formatSheetDateFull(activeSheetPoint.date)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 text-xs font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 text-[#1a73e8]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Основной:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										activeSheetPoint.mainPortfolio.toFixed(2),
										" (",
										activeSheetPoint.mainPortfolio >= 100 ? "+" : "",
										(activeSheetPoint.mainPortfolio - 100).toFixed(2),
										"%)"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 text-[#34a853]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Модельный:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										activeSheetPoint.modelPortfolio.toFixed(2),
										" (",
										activeSheetPoint.modelPortfolio >= 100 ? "+" : "",
										(activeSheetPoint.modelPortfolio - 100).toFixed(2),
										"%)"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 text-amber-600 dark:text-amber-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MSCI ACWI:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										activeSheetPoint.benchmark.toFixed(2),
										" (",
										activeSheetPoint.benchmark >= 100 ? "+" : "",
										(activeSheetPoint.benchmark - 100).toFixed(2),
										"%)"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 text-purple-600 dark:text-purple-300 pt-1 border-t border-border/40 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Альфа Модель/Осн:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										sheetAlpha >= 0 ? "+" : "",
										sheetAlpha.toFixed(2),
										"%"
									] })]
								})
							]
						})]
					}),
					dataMode === "live" && hoverIndex !== null && activeLivePoint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute -top-4 rounded-lg border border-border bg-surface/95 px-3 py-1.5 shadow-md backdrop-blur-sm transition-all",
						style: {
							left: `${Math.max(10, Math.min(85, hoverIndex / (livePoints.length - 1) * 100))}%`,
							transform: "translateX(-50%)"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted",
								children: activeLivePoint.t ? formatTooltipDate(activeLivePoint.t, selectedRange) : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-xs font-bold text-fg",
								children: ["$", formatNumber(activeLivePoint.value, 2)]
							}),
							activeLivePoint.benchmarkValue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-amber-600 font-mono",
								children: ["ACWI: $", formatNumber(activeLivePoint.benchmarkValue, 0)]
							})
						]
					})
				]
			}),
			dataMode === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap items-center justify-start gap-1 sm:gap-2 pt-2 border-t border-border/50",
				children: RANGES.map((r) => {
					const active = selectedRange === r.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelectedRange(r.id),
						className: cn("relative flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer", active ? "bg-[#e8f0fe] text-[#1967d2] font-semibold dark:bg-[#1a73e8]/20 dark:text-[#8ab4f8]" : "text-muted hover:text-fg hover:bg-bg"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.label })
					}, r.id);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/50 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2 rounded-full bg-[#0F9D58]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Показаны реальные котировки из таблицы ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Google Sheets (Watchlist)" })] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[11px] text-muted",
					children: "Итог 16.07: Основной 93.21 · Модельный 95.71 · ACWI 99.38"
				})]
			})
		]
	});
}
var PALETTE = [
	"#1a73e8",
	"#34a853",
	"#fbbc04",
	"#ea4335",
	"#8e24aa",
	"#00897b",
	"#e65100",
	"#3949ab",
	"#0288d1",
	"#c2185b",
	"#7b1fa2",
	"#512da8"
];
var STORAGE_KEY = "grok_monitor_portfolio_v5";
function ensureAllHoldings(list) {
	const result = [...list];
	if (!result.some((h) => h.symbol === "QNT" && cleanGroupName(h.portfolioGroup) === "Infa plus banks")) {
		const qntInfa = DEFAULT_DEMO_HOLDINGS.find((h) => h.id === "QNT-17");
		if (qntInfa) {
			const kkrIndex = result.findIndex((h) => h.symbol === "KKR" && cleanGroupName(h.portfolioGroup) === "Infa plus banks");
			if (kkrIndex !== -1) result.splice(kkrIndex, 0, qntInfa);
			else result.push(qntInfa);
		}
	}
	if (!result.some((h) => h.symbol === "QNT" && cleanGroupName(h.portfolioGroup) === "AI plus finance")) {
		const qntAi = DEFAULT_DEMO_HOLDINGS.find((h) => h.id === "QNT-21");
		if (qntAi) {
			const kkrIndex = result.findIndex((h) => h.symbol === "KKR" && cleanGroupName(h.portfolioGroup) === "AI plus finance");
			if (kkrIndex !== -1) result.splice(kkrIndex + 1, 0, qntAi);
			else result.push(qntAi);
		}
	}
	return result.map((h) => ({
		...h,
		portfolioGroup: cleanGroupName(h.portfolioGroup)
	}));
}
function PortfolioPanel({ quotes, onSelectTicker }) {
	const [holdings, setHoldings] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const savedV5 = localStorage.getItem(STORAGE_KEY);
			if (savedV5) try {
				const parsed = JSON.parse(savedV5);
				if (Array.isArray(parsed) && parsed.length > 0) return ensureAllHoldings(parsed);
			} catch {}
			const savedV4 = localStorage.getItem("grok_monitor_portfolio_v4");
			if (savedV4) try {
				const parsed = JSON.parse(savedV4);
				if (Array.isArray(parsed) && parsed.length > 0) {
					const upgraded = ensureAllHoldings(parsed);
					localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
					return upgraded;
				}
			} catch {}
		}
		const initial = ensureAllHoldings(DEFAULT_DEMO_HOLDINGS);
		if (typeof window !== "undefined") try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
		} catch {}
		return initial;
	});
	const [benchmark, setBenchmark] = (0, import_react.useState)(DEFAULT_BENCHMARK_INDICATIVE);
	const [watchlistHistory, setWatchlistHistory] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("grok_monitor_watchlist_history_v1");
			if (saved) try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed;
			} catch {}
		}
		return DEFAULT_SHEET_WATCHLIST_POINTS;
	});
	const [sheetUrl, setSheetUrl] = (0, import_react.useState)(DEFAULT_GOOGLE_SHEET_URL);
	const [isSyncing, setIsSyncing] = (0, import_react.useState)(false);
	const [isCopiedTemplate, setIsCopiedTemplate] = (0, import_react.useState)(false);
	const [addDialogOpen, setAddDialogOpen] = (0, import_react.useState)(false);
	const [selectedGroup, setSelectedGroup] = (0, import_react.useState)("Основной портфель");
	const [newSymbol, setNewSymbol] = (0, import_react.useState)("");
	const [newShares, setNewShares] = (0, import_react.useState)("1000");
	const [newBuyPrice, setNewBuyPrice] = (0, import_react.useState)("150");
	const [newNotes, setNewNotes] = (0, import_react.useState)("");
	const [newGroup, setNewGroup] = (0, import_react.useState)("Основной портфель");
	const quotesMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const q of quotes) map.set(q.symbol, q);
		return map;
	}, [quotes]);
	const availableGroups = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const h of holdings) {
			const clean = cleanGroupName(h.portfolioGroup);
			if (clean && !/benchmark|бенчмарк/i.test(clean)) set.add(clean);
		}
		return Array.from(set);
	}, [holdings]);
	const enrichedHoldings = (0, import_react.useMemo)(() => {
		return holdings.map((h) => {
			const q = quotesMap.get(h.symbol);
			const currentPrice = q?.price ?? h.sheetPrice ?? h.costPrice;
			const totalCost = h.costValue || h.shares * h.costPrice;
			const totalValue = h.shares * currentPrice;
			const pnl = totalValue - totalCost;
			const pnlPct = totalCost > 0 ? pnl / totalCost * 100 : 0;
			const change24h = q ? q.price - q.previousClose : 0;
			const changePct24h = q?.changePct ?? 0;
			return {
				...h,
				currentPrice,
				totalCost,
				totalValue,
				pnl,
				pnlPct,
				change24h,
				changePct24h
			};
		});
	}, [holdings, quotesMap]);
	const displayedHoldings = (0, import_react.useMemo)(() => {
		if (selectedGroup === "all") return enrichedHoldings.filter((h) => !/benchmark|бенчмарк/i.test(h.portfolioGroup));
		return enrichedHoldings.filter((h) => cleanGroupName(h.portfolioGroup) === selectedGroup);
	}, [enrichedHoldings, selectedGroup]);
	const summary = (0, import_react.useMemo)(() => {
		const totalValue = displayedHoldings.reduce((sum, h) => sum + h.totalValue, 0);
		const totalCost = displayedHoldings.reduce((sum, h) => sum + h.totalCost, 0);
		const totalPnl = totalValue - totalCost;
		return {
			totalValue,
			totalCost,
			totalPnl,
			totalPnlPct: totalCost > 0 ? totalPnl / totalCost * 100 : 0,
			dailyPnl: displayedHoldings.reduce((sum, h) => sum + h.shares * h.change24h, 0)
		};
	}, [displayedHoldings]);
	const benchmarkPnlPct = benchmark.pnlPct;
	const portfolioAlpha = summary.totalPnlPct - benchmarkPnlPct;
	const isOutperforming = portfolioAlpha >= 0;
	const currentPortfolioDisplayName = (0, import_react.useMemo)(() => {
		if (selectedGroup === "all") return "Все активы (Сводный портфель)";
		return selectedGroup;
	}, [selectedGroup]);
	displayedHoldings[0]?.formationDate;
	const saveHoldings = (updated, updatedBenchmark) => {
		const cleaned = updated.map((h) => ({
			...h,
			portfolioGroup: cleanGroupName(h.portfolioGroup)
		}));
		setHoldings(cleaned);
		if (updatedBenchmark) setBenchmark(updatedBenchmark);
		if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
	};
	const handleSyncFromSheet = async () => {
		if (!sheetUrl.trim()) {
			toast.error("Введите ссылку на Google Таблицу");
			return;
		}
		setIsSyncing(true);
		try {
			const res = await fetchSheetData({ data: { urlOrId: sheetUrl } });
			if (!res.success) {
				toast.error(res.error);
				return;
			}
			saveHoldings(res.holdings, res.benchmark);
			if (res.watchlistHistory && res.watchlistHistory.length > 0) {
				setWatchlistHistory(res.watchlistHistory);
				if (typeof window !== "undefined") localStorage.setItem("grok_monitor_watchlist_history_v1", JSON.stringify(res.watchlistHistory));
			}
			toast.success(`Синхронизировано: ${res.holdings.length} активов из «Лист1» + ${res.watchlistHistory?.length || 0} дней динамики из вкладки «Watchlist»!`);
		} catch (err) {
			toast.error(`Ошибка синхронизации: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setIsSyncing(false);
		}
	};
	const handleDownloadTemplate = () => {
		const csvContent = generateGoogleFinanceTemplateCsv();
		const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "google_finance_portfolio_template.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setIsCopiedTemplate(true);
		setTimeout(() => setIsCopiedTemplate(false), 3e3);
		toast.success("Шаблон Google Таблицы с формулами скачан!");
	};
	const handleAddHolding = (e) => {
		e.preventDefault();
		const symbol = newSymbol.trim().toUpperCase();
		const shares = parseFloat(newShares.replace(",", "."));
		const buyPrice = parseFloat(newBuyPrice.replace(",", "."));
		if (!symbol) {
			toast.error("Введите тикер акции");
			return;
		}
		if (isNaN(shares) || shares <= 0) {
			toast.error("Некорректное количество");
			return;
		}
		if (isNaN(buyPrice) || buyPrice < 0) {
			toast.error("Некорректная цена покупки");
			return;
		}
		const newPosition = {
			id: `${symbol}-${Date.now()}`,
			symbol,
			rawSymbol: symbol,
			stockName: newNotes.trim() || symbol,
			shares,
			costPrice: buyPrice,
			costValue: shares * buyPrice,
			sheetPrice: buyPrice,
			sheetValue: shares * buyPrice,
			sheetPnlUsd: 0,
			sheetPnlPct: 0,
			portfolioGroup: newGroup,
			formationDate: "16.06",
			notes: newNotes.trim() || void 0
		};
		saveHoldings([...holdings, newPosition]);
		setAddDialogOpen(false);
		setNewSymbol("");
		setNewNotes("");
		toast.success(`Актив ${symbol} добавлен в ${newGroup}!`);
	};
	const handleRemoveHolding = (id) => {
		const updated = holdings.filter((h) => h.id !== id);
		saveHoldings(updated);
		toast.info("Позиция удалена");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border/80 bg-surface p-3 sm:p-4 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5 text-[#1a73e8]" }), "Выберите портфель / стратегию:"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelectedGroup("all"),
							className: cn("flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs", selectedGroup === "all" ? "border-fg bg-fg text-surface shadow-sm" : "border-border bg-bg/50 text-fg hover:bg-bg hover:border-border-strong"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Все активы" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-full px-2 py-0.5 text-[10px] font-mono", selectedGroup === "all" ? "bg-surface/20 text-surface" : "bg-surface text-muted"),
									children: enrichedHoldings.filter((h) => !/benchmark/i.test(h.portfolioGroup)).length
								})
							]
						}), availableGroups.map((grp) => {
							const count = holdings.filter((h) => cleanGroupName(h.portfolioGroup) === grp).length;
							const isSelected = selectedGroup === grp;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedGroup(grp),
								className: cn("flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer border shadow-2xs", isSelected ? "border-[#1a73e8] bg-[#1a73e8] text-white shadow-sm font-semibold" : "border-border bg-bg/50 text-fg hover:bg-bg hover:border-border-strong"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: grp }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-full px-2 py-0.5 text-[10px] font-mono", isSelected ? "bg-white/20 text-white" : "bg-surface text-muted"),
									children: count
								})]
							}, grp);
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleFinancePortfolioChart, {
				portfolioName: selectedGroup === "all" ? "Все активы" : selectedGroup,
				totalValue: summary.totalValue,
				totalCost: summary.totalCost,
				formationDate: selectedGroup === "all" ? void 0 : "16.06",
				benchmarkReturnPct: benchmark.pnlPct,
				holdings: displayedHoldings,
				watchlistHistory
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/80 bg-surface p-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-9 items-center justify-center rounded-lg bg-[#0F9D58]/10 text-[#0F9D58]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-medium text-xs sm:text-sm text-fg",
							children: ["Синхронизация Google Таблицы", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-up-soft px-2 py-0.5 text-[11px] font-semibold text-up font-mono",
								children: "Online"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted",
							children: "Автоматическое чтение колонок входа (16.06) и цен среза (10.09)"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleDownloadTemplate,
							className: "gap-1.5 text-xs h-8",
							children: [isCopiedTemplate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-up" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), "Шаблон Google Sheets"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: addDialogOpen,
							onOpenChange: setAddDialogOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "gap-1.5 text-xs h-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), "Добавить актив"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
								className: "sm:max-w-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Добавить актив в портфель" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleAddHolding,
									className: "space-y-3.5 pt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-medium text-muted",
											children: "Тикер (например, GS, TSM, ARM, NVDA)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: newSymbol,
											onChange: (e) => setNewSymbol(e.target.value),
											placeholder: "GS",
											className: "mt-1",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-medium text-muted",
											children: "Портфель / Стратегия"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: newGroup,
											onChange: (e) => setNewGroup(e.target.value),
											className: "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg",
											children: availableGroups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: g,
												children: g
											}, g))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-medium text-muted",
												children: "Количество (акций)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "any",
												value: newShares,
												onChange: (e) => setNewShares(e.target.value),
												placeholder: "1000",
												className: "mt-1",
												required: true
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-medium text-muted",
												children: "Цена входа 16.06 ($)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "any",
												value: newBuyPrice,
												onChange: (e) => setNewBuyPrice(e.target.value),
												placeholder: "350.00",
												className: "mt-1",
												required: true
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-medium text-muted",
											children: "Название компании"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: newNotes,
											onChange: (e) => setNewNotes(e.target.value),
											placeholder: "Goldman Sachs",
											className: "mt-1"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-2 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												onClick: () => setAddDialogOpen(false),
												children: "Отмена"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "submit",
												children: "Добавить"
											})]
										})
									]
								})]
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-col gap-2 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: sheetUrl,
						onChange: (e) => setSheetUrl(e.target.value),
						placeholder: "Ссылка на таблицу Google Sheets...",
						className: "flex-1 bg-bg/50 text-xs font-mono"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleSyncFromSheet,
						disabled: isSyncing,
						className: "gap-1.5 shrink-0 h-9",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-3.5", isSyncing && "animate-spin") }), isSyncing ? "Синхронизация..." : "Синхронизировать"]
					})]
				})]
			}),
			summary.totalValue > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-fg",
							children: ["Структура долей: ", currentPortfolioDisplayName]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono",
							children: [displayedHoldings.length, " тикеров"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-3.5 w-full overflow-hidden rounded-full bg-border/40",
						children: displayedHoldings.map((h, i) => {
							const pct = h.totalValue / summary.totalValue * 100;
							if (pct < .5) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: `${pct}%`,
									backgroundColor: PALETTE[i % PALETTE.length]
								},
								title: `${h.symbol}: ${pct.toFixed(1)}% ($${h.totalValue.toFixed(0)})`,
								className: "transition-all hover:opacity-85"
							}, h.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2.5",
						children: displayedHoldings.map((h, i) => {
							const pct = h.totalValue / summary.totalValue * 100;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onSelectTicker(h.symbol),
								className: "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-bg transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-2.5 rounded-full shrink-0",
										style: { backgroundColor: PALETTE[i % PALETTE.length] }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-fg",
										children: h.symbol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted font-mono",
										children: [pct.toFixed(1), "%"]
									})
								]
							}, h.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface shadow-sm overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-bg/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base sm:text-lg font-bold text-fg tracking-tight",
						children: ["Список позиций: ", selectedGroup === "all" ? "Все активы" : `${selectedGroup} (сформирован от 16.06)`]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: selectedGroup === "all" ? "Сводная таблица по всем активам • Сравнение цен входа и текущей рыночной оценки" : "Портфель сформирован от 16.06 • Сравнение цен входа и текущей рыночной оценки"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted bg-surface border border-border px-2.5 py-1 rounded-md self-start sm:self-auto",
						children: "Кликните по тикеру для графика акции"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-bg/60 text-muted uppercase tracking-wider font-semibold border-b border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Тикер Google Finance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-3",
									children: "Компания"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-3",
									children: "Кол-во"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-3",
									children: "Цена входа (16.06)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-3",
									children: "Вложено (16.06)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-3",
									children: "Рыночная цена"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-3",
									children: "Текущая стоимость"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-3",
									children: "P/L ($)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-3",
									children: "P/L (%)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Действия"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: displayedHoldings.map((h) => {
								const isPositive = h.pnl >= 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-bg/40 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4 font-semibold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => onSelectTicker(h.symbol),
												className: "flex items-center gap-1.5 text-[#1a73e8] hover:underline font-mono",
												title: "Открыть график котировки",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.rawSymbol || h.symbol })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-3 font-medium text-fg",
											children: h.stockName || h.symbol
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-3 font-mono",
											children: h.shares.toLocaleString()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3.5 px-3 font-mono",
											children: ["$", formatNumber(h.costPrice, 2)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3.5 px-3 font-mono text-muted",
											children: ["$", formatNumber(h.costValue, 0)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3.5 px-3 font-mono font-medium",
											children: ["$", formatNumber(h.currentPrice, 2)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3.5 px-3 font-mono font-semibold text-fg",
											children: ["$", formatNumber(h.totalValue, 0)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: cn("font-mono font-medium", isPositive ? "text-up" : "text-down"),
												children: [
													isPositive ? "+" : "−",
													"$",
													formatNumber(Math.abs(h.pnl), 0)
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("inline-flex items-center gap-0.5 font-mono font-medium px-2 py-0.5 rounded text-[11px]", isPositive ? "bg-up-soft text-up" : "bg-down-soft text-down"),
												children: formatPercent(h.pnlPct)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: `https://www.google.com/finance/quote/${h.rawSymbol || h.symbol}`,
													target: "_blank",
													rel: "noreferrer",
													className: "p-1.5 rounded text-muted hover:text-fg hover:bg-bg",
													title: "Открыть в Google Finance",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleRemoveHolding(h.id),
													className: "p-1.5 rounded text-muted hover:text-down hover:bg-down-soft",
													title: "Удалить из портфеля",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
												})]
											})
										})
									]
								}, h.id);
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-surface p-5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/60 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-bold text-sm text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4.5 text-[#1a73e8]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Итоговые результаты: ", selectedGroup === "all" ? "Все активы" : selectedGroup] })]
						}), selectedGroup !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted font-mono rounded bg-bg px-2 py-0.5 border border-border/60",
							children: "сформирован от 16.06"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: selectedGroup === "all" ? "Всего вложено:" : "Вложено (16.06):"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-lg font-bold font-mono text-fg",
								children: ["$", formatNumber(summary.totalCost, 2)]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Текущая стоимость:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-lg font-bold font-mono text-fg",
								children: ["$", formatNumber(summary.totalValue, 2)]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2 pt-2 border-t border-border/50 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted font-medium",
									children: "Общий финансовый результат:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("text-xl font-bold font-mono", summary.totalPnl >= 0 ? "text-up" : "text-down"),
										children: [
											summary.totalPnl >= 0 ? "+" : "−",
											"$",
											formatNumber(Math.abs(summary.totalPnl), 2)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("text-xs font-semibold font-mono", summary.totalPnlPct >= 0 ? "text-up" : "text-down"),
										children: [formatPercent(summary.totalPnlPct), " доходности"]
									})]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-surface p-5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/60 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-bold text-sm text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Индикатив: Сравнение с Бенчмарком ACWI" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-amber-50 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
							children: "NASDAQ:ACWI"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [
										"Бенчмарк (",
										benchmark.name,
										"):"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-semibold text-up",
									children: [
										"+",
										benchmark.pnlPct,
										"% (+$",
										formatNumber(benchmark.pnlUsd, 0),
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "Доходность данного портфеля:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("font-mono font-semibold", summary.totalPnlPct >= 0 ? "text-up" : "text-down"),
									children: formatPercent(summary.totalPnlPct)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border/50 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-fg",
									children: "Альфа (Alpha vs ACWI):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted",
									children: "Относительное опережение рынка"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("inline-flex items-center gap-1 font-mono font-bold text-sm px-2.5 py-1 rounded-md", isOutperforming ? "bg-up-soft text-up" : "bg-down-soft text-down"),
										children: [
											isOutperforming ? "+" : "",
											portfolioAlpha.toFixed(2),
											"%"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted mt-0.5",
										children: isOutperforming ? "Опережает мировой индекс 🚀" : "Отстает от мирового индекса"
									})]
								})]
							})
						]
					})]
				})]
			})
		]
	});
}
function GoogleFinanceHub({ selectedQuote, selectedSymbol, onSelectTicker }) {
	const [copiedFormula, setCopiedFormula] = (0, import_react.useState)(null);
	selectedSymbol.replace(/\.[A-Za-z]+$/, "");
	selectedQuote?.exchange;
	const formulas = [
		{
			label: "Текущая цена",
			formula: `=GOOGLEFINANCE("${selectedSymbol}"; "price")`,
			desc: "Возвращает текущую рыночную котировку с задержкой до 20 мин"
		},
		{
			label: "Изменение за день (%)",
			formula: `=GOOGLEFINANCE("${selectedSymbol}"; "changepct")`,
			desc: "Процентное изменение цены за последнюю торговую сессию"
		},
		{
			label: "Коэффициент P/E (Price/Earnings)",
			formula: `=GOOGLEFINANCE("${selectedSymbol}"; "pe")`,
			desc: "Отношение текущей цены акции к чистой прибыли на одну акцию"
		},
		{
			label: "Прибыль на акцию (EPS)",
			formula: `=GOOGLEFINANCE("${selectedSymbol}"; "eps")`,
			desc: "Earnings Per Share — ключевой показатель доходности компании"
		},
		{
			label: "Рыночная капитализация",
			formula: `=GOOGLEFINANCE("${selectedSymbol}"; "marketcap")`,
			desc: "Общая стоимость всех акций компании в обращении"
		},
		{
			label: "52-недельный максимум",
			formula: `=GOOGLEFINANCE("${selectedSymbol}"; "high52")`,
			desc: "Максимальная цена закрытия за последний год"
		},
		{
			label: "52-недельный минимум",
			formula: `=GOOGLEFINANCE("${selectedSymbol}"; "low52")`,
			desc: "Минимальная цена закрытия за последний год"
		},
		{
			label: "Объем торгов (Volume)",
			formula: `=GOOGLEFINANCE("${selectedSymbol}"; "volume")`,
			desc: "Количество проторгованных акций за текущий день"
		},
		{
			label: "История котировок за 30 дней",
			formula: `=GOOGLEFINANCE("${selectedSymbol}"; "price"; TODAY()-30; TODAY(); "DAILY")`,
			desc: "Генерирует динамическую таблицу ежедневных цен закрытия"
		}
	];
	const handleCopyFormula = (formula, label) => {
		navigator.clipboard.writeText(formula);
		setCopiedFormula(formula);
		setTimeout(() => setCopiedFormula(null), 2500);
		toast.success(`Формула «${label}» скопирована! Вставьте её в Google Таблицу.`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-surface p-5 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent font-bold",
							children: "GF"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-lg font-bold text-fg",
								children: ["Google Finance Hub: ", selectedQuote?.shortName || selectedSymbol]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-bg px-2 py-0.5 text-xs font-mono text-muted",
								children: selectedSymbol
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Мультипликаторы, готовые формулы для ваших таблиц и прямой переход в Google Finance"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `https://www.google.com/finance/quote/${selectedSymbol}`,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-accent/90 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }),
								"Открыть ",
								selectedSymbol,
								" в Google Finance"
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3.5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Текущая цена"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-lg font-bold font-mono text-fg",
								children: ["$", selectedQuote?.price ? formatNumber(selectedQuote.price, 2) : "—"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("mt-0.5 text-xs font-medium", (selectedQuote?.changePct ?? 0) >= 0 ? "text-up" : "text-down"),
								children: selectedQuote ? formatPercent(selectedQuote.changePct) : "—"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3.5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Дневной диапазон"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-sm font-semibold font-mono text-fg truncate",
								children: [
									"$",
									selectedQuote?.dayLow?.toFixed(0) || "—",
									" – $",
									selectedQuote?.dayHigh?.toFixed(0) || "—"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Day Range"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3.5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "52 нед. Мин — Макс"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-sm font-semibold font-mono text-fg truncate",
								children: [
									"$",
									selectedQuote?.week52Low?.toFixed(0) || "—",
									" – $",
									selectedQuote?.week52High?.toFixed(0) || "—"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Годовой диапазон"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3.5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Объем за сессию"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-lg font-bold text-fg",
								children: selectedQuote?.volume ? formatCompact(selectedQuote.volume) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Volume"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3.5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Биржа"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-lg font-bold text-fg",
								children: selectedQuote?.exchange || "NASDAQ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Торговая площадка"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3.5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Валюта"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-lg font-bold text-fg",
								children: selectedQuote?.currency || "USD"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Базовая валюта"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-accent/30 bg-gradient-to-br from-surface to-accent-soft/30 p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-accent font-semibold text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gemini AI Insights — Фундаментальный экспресс-анализ" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface/80 p-3.5 border border-border/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 font-semibold text-fg mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5 text-accent" }), "Бизнес-модель и драйверы"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted leading-relaxed",
								children: [
									"Компания ",
									selectedQuote?.shortName || selectedSymbol,
									" генерирует ключевую выручку на развивающихся рынках технологий и цифровых услуг с высокой операционной маржинальностью."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface/80 p-3.5 border border-border/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 font-semibold text-fg mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3.5 text-up" }), "Позитивные катализаторы"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted leading-relaxed",
								children: "Стабильный свободный денежный поток (FCF), инвестиции в ИИ-инфраструктуру и расширение доли в корпоративном сегменте поддерживают прогноз аналитиков выше среднерыночного."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface/80 p-3.5 border border-border/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 font-semibold text-fg mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3.5 text-down" }), "Ключевые риски"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted leading-relaxed",
								children: "Волатильность процентных ставок ФРС, геополитическая напряженность в цепочках поставок и ужесточение регуляторных требований к антимонопольной политике."
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-sm font-bold text-fg flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "size-4 text-[#0F9D58]" }), "Генератор формул GOOGLEFINANCE для ваших таблиц"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted mt-0.5",
						children: "Нажмите кнопку «Копировать» и вставьте формулу в любую ячейку вашей Google Таблицы"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono text-muted bg-bg px-2.5 py-1 rounded-md border border-border",
						children: ["Тикер: ", selectedSymbol]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-3",
					children: formulas.map((item, idx) => {
						const isCopied = copiedFormula === item.formula;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative flex flex-col justify-between rounded-lg border border-border bg-bg/40 p-3 hover:border-accent/40 hover:bg-bg transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-xs text-fg",
									children: item.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => handleCopyFormula(item.formula, item.label),
									className: "h-7 px-2 text-xs gap-1 text-muted hover:text-fg",
									children: isCopied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-up" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-up font-medium",
										children: "Скопировано"
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Копировать" })] })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted mt-1",
								children: item.desc
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2.5 rounded bg-surface px-2.5 py-1.5 font-mono text-[11px] text-accent border border-border/60 select-all overflow-x-auto",
								children: item.formula
							})]
						}, idx);
					})
				})]
			})
		]
	});
}
function createGoogleCalendarUrl({ title, description, date, startTime = "16:30", durationMinutes = 60 }) {
	const dateClean = date.split("T")[0].replace(/-/g, "");
	const [hours, minutes] = (startTime || "16:30").split(":").map(Number);
	const startTimestamp = `${dateClean}T${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}00`;
	const endTotalMinutes = hours * 60 + minutes + durationMinutes;
	const endHours = Math.floor(endTotalMinutes / 60) % 24;
	const endMinutes = endTotalMinutes % 60;
	const endTimestamp = `${dateClean}T${String(endHours).padStart(2, "0")}${String(endMinutes).padStart(2, "0")}00`;
	return `https://calendar.google.com/calendar/render?${new URLSearchParams({
		action: "TEMPLATE",
		text: title,
		dates: `${startTimestamp}/${endTimestamp}`,
		details: description,
		location: "Online / Investor Relations"
	}).toString()}`;
}
var UPCOMING_FINANCIAL_EVENTS = [
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
		description: "Публикация квартального отчета за 4 квартал и конференц-звонок с Тимом Куком (Apple IR).\n\nСсылка на монитор: http://localhost:8082\nТикер: AAPL"
	},
	{
		id: "ev-nvda-1",
		symbol: "NVDA",
		companyName: "NVIDIA Corp.",
		eventType: "earnings",
		title: "⚡ NVIDIA (NVDA) — Финансовые результаты за квартал",
		date: "2026-11-19",
		time: "23:00",
		expectedEps: .75,
		expectedRevenue: "$32.8B",
		description: "Конференц-звонок по доходам NVIDIA: спрос на чипы Blackwell, выручка дата-центров и прогнозы по ИИ инфраструктуре.\n\nСсылка: http://localhost:8082"
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
		description: "Отчет Microsoft: показатели роста Azure, Copilot и корпоративного подразделения.\n\nСсылка: http://localhost:8082"
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
		description: "Отчет Google: доходы от рекламы YouTube, Google Cloud и развитие моделей Gemini AI.\n\nСсылка: http://localhost:8082"
	},
	{
		id: "ev-tsla-1",
		symbol: "TSLA",
		companyName: "Tesla Inc.",
		eventType: "earnings",
		title: "🚗 Tesla (TSLA) — Квартальный отчет и конференция",
		date: "2026-10-21",
		time: "23:30",
		expectedEps: .62,
		expectedRevenue: "$25.4B",
		description: "Отчет Tesla: поставки электрокаров, рентабельность, развитие автономного вождения FSD и системы хранения энергии.\n\nСсылка: http://localhost:8082"
	},
	{
		id: "ev-aapl-div",
		symbol: "AAPL",
		companyName: "Apple Inc.",
		eventType: "dividend",
		title: "💰 Apple (AAPL) — Экс-дивидендная дата (Ex-Dividend)",
		date: "2026-11-06",
		time: "16:00",
		dividendAmount: .25,
		description: "Последний день для покупки акций Apple под получение квартального дивиденда ($0.25 на акцию).\n\nСсылка: http://localhost:8082"
	},
	{
		id: "ev-msft-div",
		symbol: "MSFT",
		companyName: "Microsoft Corporation",
		eventType: "dividend",
		title: "💰 Microsoft (MSFT) — Экс-дивидендная дата (Ex-Dividend)",
		date: "2026-11-14",
		time: "16:00",
		dividendAmount: .83,
		description: "Экс-дивидендная дата Microsoft ($0.83 на акцию).\n\nСсылка: http://localhost:8082"
	}
];
function EarningsCalendar({ onSelectTicker }) {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [addedIds, setAddedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const filteredEvents = UPCOMING_FINANCIAL_EVENTS.filter((ev) => {
		if (filter === "all") return true;
		return ev.eventType === filter;
	});
	const handleAddToCalendar = (event) => {
		const url = createGoogleCalendarUrl({
			title: event.title,
			description: event.description,
			date: event.date,
			startTime: event.time || "16:30"
		});
		window.open(url, "_blank", "noopener,noreferrer");
		setAddedIds((prev) => new Set(prev).add(event.id));
		toast.success(`Открыт Google Календарь для добавления: ${event.symbol}`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-surface p-5 shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-11 items-center justify-center rounded-xl bg-[#4285F4]/10 text-[#4285F4]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold text-fg",
							children: "Календарь корпоративных событий и отчетов"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent",
							children: "Google Calendar"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Отслеживайте даты квартальных отчетов и дивидендных отсечек с синхронизацией в Google Календарь"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 rounded-lg border border-border bg-bg/60 p-1 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: filter === "all" ? "default" : "ghost",
							size: "sm",
							onClick: () => setFilter("all"),
							className: "h-7 px-3 text-xs",
							children: [
								"Все (",
								UPCOMING_FINANCIAL_EVENTS.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: filter === "earnings" ? "default" : "ghost",
							size: "sm",
							onClick: () => setFilter("earnings"),
							className: "h-7 px-3 text-xs",
							children: "Отчеты (Earnings)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: filter === "dividend" ? "default" : "ghost",
							size: "sm",
							onClick: () => setFilter("dividend"),
							className: "h-7 px-3 text-xs",
							children: "Дивиденды"
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-4",
			children: filteredEvents.map((ev) => {
				const isAdded = addedIds.has(ev.id);
				const isEarnings = ev.eventType === "earnings";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-between rounded-xl border border-border bg-surface p-4 shadow-sm hover:border-accent/40 transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onSelectTicker(ev.symbol),
								className: "flex size-10 items-center justify-center rounded-lg bg-bg font-bold font-mono text-sm text-accent hover:bg-accent hover:text-white transition-colors border border-border",
								title: "Посмотреть котировку на графике",
								children: ev.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm text-fg",
								children: ev.companyName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium text-[11px]", isEarnings ? "bg-accent-soft text-accent" : "bg-up-soft text-up"),
									children: [isEarnings ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "size-3" }), isEarnings ? "Квартальный отчет" : "Дивидендная отсечка"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 text-muted" }),
										ev.time,
										" МСК"
									]
								})]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-fg",
								children: new Date(ev.date).toLocaleDateString("ru-RU", {
									day: "numeric",
									month: "short",
									year: "numeric"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted",
								children: "Дата события"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-lg bg-bg/50 p-3 text-xs border border-border/60",
						children: [isEarnings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Ожидаемый EPS: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-fg font-mono",
								children: ["$", ev.expectedEps]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Прогноз выручки: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg font-mono",
								children: ev.expectedRevenue
							})] })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Дивиденд на акцию:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-up font-mono font-semibold",
								children: ["$", ev.dividendAmount]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11px] text-muted line-clamp-2",
							children: ev.description
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between pt-2 border-t border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelectTicker(ev.symbol),
							className: "text-xs text-accent hover:underline flex items-center gap-1",
							children: [
								"Анализ акции ",
								ev.symbol,
								" →"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: isAdded ? "outline" : "default",
							onClick: () => handleAddToCalendar(ev),
							className: cn("h-8 gap-1.5 text-xs", !isAdded && "bg-[#4285F4] hover:bg-[#3367D6]"),
							children: isAdded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-up" }), "Добавлено"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-3.5" }), "В Google Календарь"] })
						})]
					})]
				}, ev.id);
			})
		})]
	});
}
var Sheet = Dialog$1;
function SheetContent({ className, children, side = "left", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, { className: "fixed inset-0 z-50 bg-fg/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed z-50 flex flex-col bg-surface text-fg shadow-border outline-none", side === "left" && "inset-y-0 left-0 h-full w-[min(22rem,100%)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left", side === "bottom" && "inset-x-0 bottom-0 max-h-[80vh] rounded-t-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-md p-1 text-muted hover:bg-bg hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Закрыть"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("border-b border-border px-4 py-3", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-sm font-medium", className),
		...props
	});
}
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List$1, {
	ref,
	className: cn("inline-flex h-11 items-center justify-start rounded-xl bg-border/40 p-1 text-muted gap-1 border border-border/60", className),
	...props
}));
TabsList.displayName = List$1.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-sm cursor-pointer text-muted hover:text-fg hover:bg-surface/50", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-4 focus-visible:outline-none", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function sameSymbols(a, b) {
	return a.length === b.length && a.every((s, i) => s === b[i]);
}
function MonitorApp({ initialQuotes, initialChart }) {
	const symbols = useWatchlist((s) => s.symbols);
	const selected = useWatchlist((s) => s.selected);
	const range = useWatchlist((s) => s.range);
	const select = useWatchlist((s) => s.select);
	const add = useWatchlist((s) => s.add);
	const remove = useWatchlist((s) => s.remove);
	const setRange = useWatchlist((s) => s.setRange);
	const [sheetOpen, setSheetOpen] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("chart");
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(true);
	const [sidebarSide, setSidebarSide] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("grok_monitor_sidebar_side");
			if (saved === "left" || saved === "right") return saved;
		}
		return "left";
	});
	const handleToggleSidebarSide = () => {
		setSidebarSide((prev) => {
			const next = prev === "left" ? "right" : "left";
			if (typeof window !== "undefined") localStorage.setItem("grok_monitor_sidebar_side", next);
			return next;
		});
	};
	const quotesQuery = useQuery({
		queryKey: ["quotes", symbols],
		queryFn: () => getQuotes({ data: { symbols } }),
		enabled: symbols.length > 0,
		refetchInterval: 3e4,
		staleTime: 15e3,
		initialData: sameSymbols(symbols, DEFAULT_SYMBOLS) && initialQuotes.length > 0 ? initialQuotes : void 0
	});
	const chartQuery = useQuery({
		queryKey: [
			"chart",
			selected,
			range
		],
		queryFn: () => getChart({ data: {
			symbol: selected,
			range
		} }),
		enabled: Boolean(selected),
		staleTime: 2e4,
		placeholderData: keepPreviousData,
		initialData: selected === "GS" && range === "5y" && initialChart ? initialChart : void 0
	});
	const quotes = quotesQuery.data ?? [];
	const chart = chartQuery.data;
	const spec = rangeById(range);
	const watching = symbols.includes(selected);
	const up = (chart?.rangeChangePct ?? 0) >= 0;
	const selectedQuote = (0, import_react.useMemo)(() => {
		return quotes.find((q) => q.symbol === selected) ?? null;
	}, [quotes, selected]);
	const listQuotes = (0, import_react.useMemo)(() => {
		const map = new Map(quotes.map((q) => [q.symbol, q]));
		return symbols.map((s) => map.get(s)).filter((q) => Boolean(q));
	}, [quotes, symbols]);
	function handleAdd(symbol) {
		add(symbol);
		toast.success(`${symbol} добавлен в список`);
		setSheetOpen(false);
	}
	function handleRemove(symbol) {
		remove(symbol);
		toast(`${symbol} убран из списка`);
	}
	function handleToggleWatch() {
		if (!selected) return;
		if (watching) handleRemove(selected);
		else handleAdd(selected);
	}
	function handleSelectTicker(symbol) {
		select(symbol);
		setActiveTab("chart");
		setSheetOpen(false);
	}
	const panel = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchlistPanel, {
		symbols,
		quotes: listQuotes,
		selected,
		loading: quotesQuery.isLoading,
		error: quotesQuery.isError,
		onSelect: (s) => {
			select(s);
			setSheetOpen(false);
		},
		onRemove: handleRemove
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 border-b border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-3 py-2.5 md:px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pr-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-8 items-center justify-center rounded-md bg-up text-surface",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
									className: "size-4",
									strokeWidth: 2.4
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden sm:flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold tracking-tight text-fg",
									children: "Google Market Monitor"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted flex items-center gap-1 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-up animate-pulse" }), "Google Workspace Ready"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
							onPick: handleAdd,
							className: "min-w-0 flex-1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:flex items-center gap-1.5 text-xs text-muted border border-border rounded-lg px-2.5 py-1.5 bg-bg/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-3.5 text-[#0F9D58]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Google Sheets Sync" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setSidebarOpen((prev) => !prev),
							className: "hidden lg:flex items-center gap-1.5 text-xs font-medium h-9 border-border bg-bg/50 hover:bg-bg cursor-pointer",
							title: sidebarOpen ? "Свернуть список бумаг" : "Развернуть список бумаг",
							children: sidebarOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [sidebarSide === "right" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightClose, { className: "size-4 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Свернуть список" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [sidebarSide === "right" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightOpen, { className: "size-4 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Развернуть список" })] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "shrink-0 lg:hidden",
							onClick: () => setSheetOpen(true),
							"aria-label": "Открыть список",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5 overflow-x-auto border-b border-border bg-surface px-3 py-2 lg:hidden",
				children: listQuotes.map((q) => {
					const rowUp = q.changePct >= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => select(q.symbol),
						className: cn("flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-3 text-sm transition-colors duration-150", q.symbol === selected ? "border-fg bg-bg" : "border-border bg-surface"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: displayTicker(q.symbol)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("tabular-nums", rowUp ? "text-up" : "text-down"),
							children: formatPercent(q.changePct)
						})]
					}, q.symbol);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden transition-all duration-300", sidebarSide === "right" ? "flex-row-reverse" : "flex-row"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: cn("hidden h-full shrink-0 overflow-hidden bg-sidebar transition-all duration-300 ease-in-out lg:flex lg:flex-col", sidebarSide === "right" ? "border-l border-border" : "border-r border-border", sidebarOpen ? "w-80 opacity-100" : "w-0 border-none opacity-0 pointer-events-none"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border px-3 py-2 text-xs font-semibold text-muted bg-surface/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Список наблюдения" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleToggleSidebarSide,
								className: "rounded p-1 text-muted hover:text-fg hover:bg-bg transition-colors cursor-pointer",
								title: sidebarSide === "right" ? "Переместить панель влево" : "Переместить панель вправо",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSidebarOpen(false),
								className: "rounded p-1 text-muted hover:text-fg hover:bg-bg transition-colors cursor-pointer",
								title: "Свернуть список",
								children: sidebarSide === "right" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightClose, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "size-3.5" })
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 min-h-0 overflow-hidden",
						children: panel
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-h-0 min-w-0 flex-1 overflow-y-auto px-3 py-5 md:px-8 md:py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: activeTab,
						onValueChange: setActiveTab,
						className: "w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-6 flex overflow-x-auto pb-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "bg-surface border border-border shadow-sm p-1 rounded-xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "chart",
											className: "gap-1.5 text-xs sm:text-sm font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "size-4 text-accent" }), "Котировки & График"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "portfolio",
											className: "gap-1.5 text-xs sm:text-sm font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4 text-[#0F9D58]" }), "Google Портфель"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "google-finance",
											className: "gap-1.5 text-xs sm:text-sm font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-accent" }), "Google Finance Hub"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "calendar",
											className: "gap-1.5 text-xs sm:text-sm font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-[#4285F4]" }), "Календарь событий"]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "chart",
								className: "space-y-6 mt-0",
								children: [
									!selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center justify-center py-24 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-medium",
											children: "Список пуст"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 max-w-sm text-sm text-muted",
											children: "Найдите акцию, фонд или криптовалюту в поиске сверху, чтобы начать следить за графиком."
										})]
									}),
									selected && chartQuery.isError && !chart && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-xl bg-down-soft px-4 py-3 text-sm text-down",
										children: "Не удалось загрузить график. Попробуйте другую бумагу или обновите страницу."
									}),
									selected && chartQuery.isLoading && !chart && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-64" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-80" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 w-full rounded-xl" })
										]
									}),
									chart && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteHeader, {
												chart,
												range: spec,
												watching,
												onToggleWatch: handleToggleWatch
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												role: "tablist",
												"aria-label": "Период",
												className: "-mx-1 flex gap-0 overflow-x-auto px-1",
												children: RANGES$1.map((r) => {
													const active = r.id === range;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														role: "tab",
														"aria-selected": active,
														onClick: () => setRange(r.id),
														className: cn("relative min-h-11 shrink-0 px-3 text-sm font-medium transition-colors duration-150", active ? "text-accent" : "text-muted hover:text-fg"),
														children: [r.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute inset-x-2 bottom-1 h-0.5 rounded-full", active ? "bg-accent" : "bg-transparent") })]
													}, r.id);
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-64 pr-14 sm:h-80 md:h-96",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
													points: chart.points,
													range,
													currency: chart.currency,
													hint: chart.priceHint,
													up
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteStats, { chart })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "portfolio",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortfolioPanel, {
									quotes,
									onSelectTicker: handleSelectTicker
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "google-finance",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleFinanceHub, {
									selectedQuote,
									selectedSymbol: selected,
									onSelectTicker: handleSelectTicker
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "calendar",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EarningsCalendar, { onSelectTicker: handleSelectTicker })
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: sheetOpen,
				onOpenChange: setSheetOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "bottom",
					className: "h-[75vh]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Мой список" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-hidden",
						children: panel
					})]
				})
			})
		]
	});
}
function Home() {
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorApp, {
		initialQuotes: data.quotes,
		initialChart: data.chart
	});
}
//#endregion
export { Home as component };
