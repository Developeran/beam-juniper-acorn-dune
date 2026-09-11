import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, l as Slot, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as displayTicker, n as DEFAULT_SYMBOLS, r as RANGES, s as rangeById, t as DEFAULT_SELECTED } from "./market-types-D92BrRyS.mjs";
import { a as Trash2, c as Plus, d as Ellipsis, f as Check, i as TrendingDown, l as LoaderCircle, o as Star, p as Activity, r as TrendingUp, s as Search, t as X, u as List } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as getQuotes, i as getChart, n as Route, o as searchSymbols, r as explainMove } from "./router--Lf_bbNk.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-xj-NCjHy.js
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
			className: "absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-down md:hidden md:group-hover:flex",
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
			className: "flex min-w-0 flex-1 items-center gap-2",
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
			className: "absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-down md:hidden md:group-hover:flex",
			"aria-label": "Убрать из списка",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
		})]
	});
}
function WatchlistPanel({ symbols = [], quotes = [], selected, loading, error, onSelect, onRemove }) {
	const bySymbol = new Map(quotes.map((q) => [q.symbol, q]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 px-3 pt-3 pb-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-fg text-fg" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "Мой список"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs tabular-nums text-subtle",
					children: symbols.length
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
var useWatchlist = create()(persist((set, get) => ({
	symbols: [...DEFAULT_SYMBOLS],
	selected: DEFAULT_SELECTED,
	range: "5y",
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
	setRange: (range) => set({ range })
}), { name: "monitor-watchlist-v1" }));
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
		initialData: selected === "ABVX.PA" && range === "5y" && initialChart ? initialChart : void 0
	});
	const quotes = quotesQuery.data ?? [];
	const chart = chartQuery.data;
	const spec = rangeById(range);
	const watching = symbols.includes(selected);
	const up = (chart?.rangeChangePct ?? 0) >= 0;
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-base font-medium tracking-tight sm:inline",
								children: "Монитор"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
							onPick: handleAdd,
							className: "min-w-0 flex-1"
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
				className: "mx-auto flex min-h-0 w-full max-w-7xl flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden h-full w-80 shrink-0 overflow-hidden border-r border-border bg-sidebar lg:flex lg:flex-col",
					children: panel
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "min-h-0 min-w-0 flex-1 overflow-y-auto px-3 py-5 md:px-8 md:py-7",
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
									children: RANGES.map((r) => {
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
