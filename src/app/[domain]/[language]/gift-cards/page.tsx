import { fetchGiftCards } from "@/apis/apis";
import {
	Button,
	buttonVariants,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Awaitable, safeText } from "@/app/utils/utils";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";

type GiftCardPageProps = {
	params: Awaitable<{ domain: string; language: string }>;
};

type GiftCardSummary = {
	id: string | null;
	name: string;
	image: string;
	priceRange: string;
	badge?: string;
	categories: string[];
};

const DEFAULT_HEADER_TITLE = "Gift Cards from AP";
const DEFAULT_HEADER_SUBTITLE =
	"Browse our curated collection of gift cards and discover new ways to reward your members.";
const DEFAULT_GIFT_CARD_IMAGE =
	"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_CATEGORIES = [
	"Travel",
	"Dining",
	"Entertainment",
	"Shopping",
	"Wellness",
];
const SORT_OPTIONS = [
	"Recommended",
	"Newest arrivals",
	"Price: low to high",
	"Price: high to low",
];
const ITEMS_PER_PAGE_OPTIONS = [24, 60, 120];
const DEFAULT_ITEMS_PER_PAGE = 24;

export default async function GiftCardPage({ params }: GiftCardPageProps) {
	const resolvedParams = await params;
	const domain = decodeURIComponent(resolvedParams.domain);
	const domainSegment = encodeURIComponent(domain);
	const languageSegment = encodeURIComponent(resolvedParams.language);

	let giftCardPayload: unknown;
	try {
		giftCardPayload = await fetchGiftCards({ domain });
	} catch (error) {
		console.error("Error loading gift cards", error);
		giftCardPayload = null;
	}

	const giftCards = normalizeGiftCards(giftCardPayload);
	const headerTitle = safeText(
		(getNested(giftCardPayload, ["title"]) as string) ??
		(getNested(giftCardPayload, ["heading"]) as string),
		DEFAULT_HEADER_TITLE,
	);
	const headerSubtitle = safeText(
		(getNested(giftCardPayload, ["description"]) as string) ??
		(getNested(giftCardPayload, ["meta", "subtitle"]) as string),
		DEFAULT_HEADER_SUBTITLE,
	);

	const categories = ["All", ...deriveCategories(giftCards)];

	return (
		<div className="flex flex-col bg-slate-950 text-slate-100">
			<section className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900">
				<div className="mx-auto max-w-6xl px-6 py-10">
					<p className="text-xs uppercase tracking-[0.35em] text-violet-200">
						Rewards marketplace
					</p>
					<h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
						{headerTitle}
					</h1>
					<p className="mt-4 max-w-3xl text-sm text-violet-100 md:text-base">
						{headerSubtitle}
					</p>
				</div>
			</section>

			<section className="border-b border-slate-800 bg-slate-900/70">
				<div className="mx-auto max-w-6xl px-6 py-8">
					<div className="grid gap-6 md:grid-cols-12">
						<FilterField label="Brand" className="md:col-span-5">
							<div className="relative">
								<Input
									placeholder="Search by brand"
									className="h-11 rounded-xl border-slate-700 bg-slate-950/80 pl-11 text-slate-100 placeholder:text-slate-400"
									disabled
								/>
								<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							</div>
						</FilterField>

						<FilterField label="Category" className="md:col-span-3">
							<SelectField options={categories} defaultValue="All" />
						</FilterField>

						<FilterField label="Sort" className="md:col-span-4">
							<SelectField options={SORT_OPTIONS} defaultValue={SORT_OPTIONS[0]} />
						</FilterField>
					</div>
				</div>
			</section>

			<section className="flex-1 bg-slate-950">
				<div className="mx-auto max-w-6xl px-6 py-12">
					{giftCards.length === 0 ? (
						<EmptyState />
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{giftCards.map((giftCard, index) => {
								const href =
									giftCard.id !== null
										? `/${domainSegment}/${languageSegment}/gift-cards/${encodeURIComponent(
											giftCard.id,
										)}`
										: "#";

								return (
									<Link
										key={`${giftCard.id ?? "gift-card"}-${index}`}
										href={href}
										className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
									>
										<Card className="overflow-hidden border-slate-800 bg-slate-900/70 transition duration-300 hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-xl">
											<div className="relative h-44 w-full overflow-hidden bg-slate-800">
												<img
													src={giftCard.image}
													alt={giftCard.name}
													className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
													loading="lazy"
												/>
												{giftCard.badge ? (
													<span className="absolute left-3 top-3 rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
														{giftCard.badge}
													</span>
												) : null}
											</div>
											<div className="space-y-2 px-5 py-4">
												<h2 className="text-base font-semibold text-white">
													{giftCard.name}
												</h2>
												<p className="text-sm text-slate-300">
													{giftCard.priceRange}
												</p>
											</div>
										</Card>
									</Link>
								);
							})}
						</div>
					)}
				</div>
			</section>

			<section className="border-t border-slate-800 bg-slate-950/80">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
							Items per page
						</p>
						<div className="mt-3 flex items-center gap-3">
							{ITEMS_PER_PAGE_OPTIONS.map((option) => (
								<Button
									key={option}
									type="button"
									variant="outline"
									className={cn(
										"rounded-full border-slate-700 bg-slate-900 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white",
										option === DEFAULT_ITEMS_PER_PAGE &&
										"border-sky-500 bg-sky-500/20 text-sky-100 hover:bg-sky-500/30",
									)}
									disabled
								>
									{option}
								</Button>
							))}
						</div>
					</div>

					<Pagination className="mx-0 justify-start md:ml-auto md:justify-end">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious href="#" className={inactivePagination()} />
							</PaginationItem>
							{[1, 2, 3, 4].map((page) => (
								<PaginationItem key={page}>
									<PaginationLink
										href="#"
										isActive={page === 2}
										className={cn(
											buttonVariants({
												variant: "ghost",
												size: "icon",
											}),
											"rounded-full border border-transparent text-slate-300 hover:border-sky-500 hover:text-white",
											page === 2 &&
											"border-sky-500 bg-sky-500/20 text-sky-100 hover:bg-sky-500/30",
										)}
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationEllipsis className="text-slate-500" />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink
									href="#"
									className={cn(
										buttonVariants({
											variant: "ghost",
											size: "icon",
										}),
										"rounded-full border border-transparent text-slate-300 hover:border-sky-500 hover:text-white",
									)}
								>
									6
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext href="#" className={inactivePagination()} />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</section>
		</div>
	);
}

function FilterField({
	label,
	children,
	className,
}: {
	label: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={className}>
			<p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
				{label}
			</p>
			{children}
		</div>
	);
}

function SelectField({
	options,
	defaultValue,
}: {
	options: string[];
	defaultValue: string;
}) {
	return (
		<div className="relative">
			<select
				defaultValue={defaultValue}
				className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/80 px-4 pr-12 text-sm font-medium text-slate-100 transition focus:border-sky-500 focus:outline-none"
				disabled
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
			<span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
				▾
			</span>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center shadow-inner">
			<p className="text-lg font-semibold text-white">No gift cards found</p>
			<p className="mt-2 text-sm text-slate-400">
				We could not find any gift cards for this programme yet. Please check back
				later or adjust your filters.
			</p>
		</div>
	);
}

function normalizeGiftCards(payload: unknown): GiftCardSummary[] {
	const rawList = getNested(payload, ["data"]);
	if (!Array.isArray(rawList)) {
		return [];
	}

	return rawList.map((item, index) => {
		const id = extractId(item, index);
		return {
			id,
			name: safeText(
				(item?.name as string) ??
				(item?.title as string) ??
				(item?.brand?.name as string),
				"Gift Card",
			),
			image: resolveGiftCardImage(item),
			priceRange: resolvePriceRange(item),
			badge: optionalText(
				(item?.badge as string) ??
				(item?.promotion?.label as string) ??
				(item?.highlight as string),
			),
			categories: resolveCategories(item),
		};
	});
}

function extractId(item: any, _index: number): string | null {
	const idCandidate =
		item?.id ??
		item?.slug ??
		item?.code ??
		item?.external_id ??
		item?.gift_card_id;

	if (typeof idCandidate === "string" && idCandidate.trim().length > 0) {
		return idCandidate;
	}

	if (typeof idCandidate === "number") {
		return String(idCandidate);
	}

	return null;
}

function resolveGiftCardImage(item: any): string {
	const candidates: unknown[] = [
		item?.image,
		item?.image_url,
		item?.imageUrl,
		item?.card_image,
		item?.cardImage,
		item?.logo,
		item?.logo_url,
		item?.hero_image,
		item?.heroImage,
		item?.thumbnail,
		item?.thumbnail_url,
		item?.media?.[0]?.url,
		item?.media?.[0]?.src,
		item?.assets?.card?.url,
		item?.assets?.main?.url,
		item?.assets?.default?.url,
	];

	for (const candidate of candidates) {
		if (typeof candidate === "string" && candidate.trim().length > 0) {
			return candidate;
		}
	}

	return DEFAULT_GIFT_CARD_IMAGE;
}

function resolvePriceRange(item: any): string {
	const currency = resolveCurrency(item);
	const minValues = collectNumericValues([
		item?.min_value,
		item?.minValue,
		item?.price_min,
		item?.priceMin,
		item?.minimum,
		item?.pricing?.min,
		item?.denomination?.min,
		item?.denomination_min,
		item?.denominations?.min,
	]);

	const maxValues = collectNumericValues([
		item?.max_value,
		item?.maxValue,
		item?.price_max,
		item?.priceMax,
		item?.maximum,
		item?.pricing?.max,
		item?.denomination?.max,
		item?.denomination_max,
		item?.denominations?.max,
	]);

	if (Array.isArray(item?.denominations)) {
		const denominationValues = collectNumericValues(item.denominations);
		if (denominationValues.length > 0) {
			minValues.push(Math.min(...denominationValues));
			maxValues.push(Math.max(...denominationValues));
		}
	}

	const minValue = minValues.length > 0 ? Math.min(...minValues) : undefined;
	const maxValue = maxValues.length > 0 ? Math.max(...maxValues) : undefined;

	if (typeof minValue === "number" && typeof maxValue === "number") {
		if (minValue === maxValue) {
			return formatCurrency(minValue, currency);
		}
		return `${formatCurrency(minValue, currency)} – ${formatCurrency(
			maxValue,
			currency,
		)}`;
	}

	if (typeof minValue === "number") {
		return `From ${formatCurrency(minValue, currency)}`;
	}

	if (typeof maxValue === "number") {
		return `Up to ${formatCurrency(maxValue, currency)}`;
	}

	const fallbackText =
		(item?.price_range as string) ??
		(item?.pricing?.label as string) ??
		(item?.denomination_range as string);

	return safeText(fallbackText, "Pricing available on request");
}

function resolveCurrency(item: any): string {
	const candidates: unknown[] = [
		item?.currency,
		item?.denomination_currency,
		item?.denominations?.currency,
		item?.pricing?.currency,
		item?.meta?.currency,
	];

	for (const candidate of candidates) {
		if (typeof candidate === "string" && candidate.trim().length > 0) {
			return candidate;
		}
	}

	return "USD";
}

function collectNumericValues(values: unknown[]): number[] {
	const result: number[] = [];
	values.forEach((value) => {
		if (Array.isArray(value)) {
			result.push(...collectNumericValues(value));
			return;
		}
		if (typeof value === "number" && Number.isFinite(value)) {
			result.push(value);
		} else if (typeof value === "string") {
			const parsed = Number(value);
			if (Number.isFinite(parsed)) {
				result.push(parsed);
			}
		}
	});
	return result;
}

function resolveCategories(item: any): string[] {
	const categories = new Set<string>();
	const candidates = [
		item?.categories,
		item?.category,
		item?.labels,
		item?.tags,
		item?.brand?.categories,
	];

	candidates.forEach((candidate) => {
		if (!candidate) return;

		if (typeof candidate === "string") {
			candidate
				.split(/[;,]/)
				.map((entry) => entry.trim())
				.filter(Boolean)
				.forEach((entry) => categories.add(capitalize(entry)));
			return;
		}

		if (Array.isArray(candidate)) {
			candidate
				.map((entry) =>
					typeof entry === "string"
						? entry
						: entry?.name ?? entry?.label ?? entry?.title,
				)
				.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
				.forEach((entry) => categories.add(capitalize(entry)));
		}
	});

	if (categories.size === 0) {
		return DEFAULT_CATEGORIES;
	}

	return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

function deriveCategories(cards: GiftCardSummary[]): string[] {
	const categories = new Set<string>();
	cards.forEach((card) => {
		card.categories.forEach((category) => {
			if (category && category !== "All") {
				categories.add(category);
			}
		});
	});

	if (categories.size === 0) {
		return DEFAULT_CATEGORIES;
	}

	return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

function formatCurrency(value: number, currency: string): string {
	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
	} catch {
		return `$${Math.round(value).toLocaleString()}`;
	}
}

function optionalText(value: unknown): string | undefined {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}
	return undefined;
}

function capitalize(value: string): string {
	if (value.length === 0) return value;
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function getNested(source: unknown, path: (string | number)[]): any {
	return path.reduce((acc, key) => {
		if (acc && typeof acc === "object" && key in acc) {
			return (acc as Record<string, unknown>)[key as string];
		}
		return undefined;
	}, source as any);
}

function inactivePagination() {
	return cn(
		buttonVariants({ variant: "ghost", size: "default" }),
		"rounded-full border border-transparent text-slate-400 hover:border-sky-500 hover:text-white disabled:opacity-50",
	);
}
