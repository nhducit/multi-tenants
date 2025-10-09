import { safeText } from "@/app/utils/utils";
import { fetchGiftCards } from "@/apis/apis";

export type GiftCardSummary = {
	id: string | null;
	name: string;
	image: string;
	imageUrls: string[];
	priceRange: string;
	description: string;
	badge?: string;
	categories: string[];
};

export const GIFT_CARD_LIST_HEADER_TITLE = "Gift Cards from AP";
export const GIFT_CARD_LIST_HEADER_SUBTITLE =
	"Browse our curated collection of gift cards and discover new ways to reward your members.";
export const DEFAULT_GIFT_CARD_IMAGE =
	"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80";
export const DEFAULT_CATEGORIES = [
	"Travel",
	"Dining",
	"Entertainment",
	"Shopping",
	"Wellness",
];
export const SORT_OPTIONS = [
	"Recommended",
	"Newest arrivals",
	"Price: low to high",
	"Price: high to low",
];
export const ITEMS_PER_PAGE_OPTIONS = [24, 60, 120];
export const DEFAULT_ITEMS_PER_PAGE = 24;

export function giftCardsQueryKey(domain: string) {
	return ["gift-cards", domain] as const;
}

export function giftCardsQueryOptions(domain: string) {
	return {
		queryKey: giftCardsQueryKey(domain),
		queryFn: () => fetchGiftCards({ domain }),
	};
}

export function normalizeGiftCards(payload: unknown): GiftCardSummary[] {
	const rawList = getNested(payload, ["data"]);
	if (!Array.isArray(rawList)) {
		return [];
	}

	return rawList.map((item, index) => {
		const id = extractId(item, index);
		const imageUrls = resolveGiftCardImages(item);
		return {
			id,
			name: safeText(
				(item?.name as string) ??
					(item?.title as string) ??
					(item?.brand?.name as string),
				"Gift Card",
			),
			image: imageUrls[0] ?? DEFAULT_GIFT_CARD_IMAGE,
			imageUrls,
			priceRange: resolvePriceRange(item),
			description: resolveGiftCardDescription(item),
			badge: optionalText(
				(item?.badge as string) ??
					(item?.promotion?.label as string) ??
				(item?.highlight as string),
			),
			categories: resolveCategories(item),
		};
	});
}

export function extractListingCopy(payload: unknown) {
	return {
		headerTitle: safeText(
			(getNested(payload, ["title"]) as string) ??
			(getNested(payload, ["heading"]) as string),
			GIFT_CARD_LIST_HEADER_TITLE,
		),
		headerSubtitle: safeText(
			(getNested(payload, ["description"]) as string) ??
			(getNested(payload, ["meta", "subtitle"]) as string),
			GIFT_CARD_LIST_HEADER_SUBTITLE,
		),
	};
}

export function deriveCategories(cards: GiftCardSummary[]): string[] {
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

export function getNested(source: unknown, path: (string | number)[]): any {
	return path.reduce((acc, key) => {
		if (acc && typeof acc === "object" && key in acc) {
			return (acc as Record<string, unknown>)[key as string];
		}
		return undefined;
	}, source as any);
}

function extractId(item: any, index: number): string | null {
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

function resolveGiftCardImages(item: any): string[] {
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

	const images: string[] = [];

	candidates.forEach((candidate) => {
		if (typeof candidate === "string") {
			const url = candidate.trim();
			if (url.length > 0) {
				images.push(url);
			}
		} else if (Array.isArray(candidate)) {
			candidate.forEach((value) => {
				if (typeof value === "string" && value.trim().length > 0) {
					images.push(value.trim());
				} else if (value && typeof value === "object") {
					const nested =
						"url" in value
							? (value as { url?: string }).url
							: "src" in value
							? (value as { src?: string }).src
							: undefined;
					if (typeof nested === "string" && nested.trim().length > 0) {
						images.push(nested.trim());
					}
				}
			});
		} else if (candidate && typeof candidate === "object") {
			const nested =
				"url" in candidate
					? (candidate as { url?: string }).url
					: "src" in candidate
					? (candidate as { src?: string }).src
					: undefined;
			if (typeof nested === "string" && nested.trim().length > 0) {
				images.push(nested.trim());
			}
		}
	});

	const unique = Array.from(new Set(images));

	if (unique.length === 0) {
		return [DEFAULT_GIFT_CARD_IMAGE];
	}

	return unique;
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
				.filter(
					(entry): entry is string =>
						typeof entry === "string" && entry.trim().length > 0,
				)
				.forEach((entry) => categories.add(capitalize(entry)));
		}
	});

	if (categories.size === 0) {
		return DEFAULT_CATEGORIES;
	}

	return Array.from(categories).sort((a, b) => a.localeCompare(b));
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
		} else if (value && typeof value === "object") {
			const maybe =
				"value" in value
					? (value as { value?: unknown }).value
					: "amount" in value
						? (value as { amount?: unknown }).amount
						: undefined;
			if (maybe !== undefined) {
				result.push(...collectNumericValues([maybe]));
			}
		}
	});
	return result;
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

function resolveGiftCardDescription(item: any): string {
	return safeText(
		item?.short_description ??
		item?.subtitle ??
		item?.tagline ??
		item?.description ??
		item?.brand?.description ??
		item?.meta?.summary,
		"Discover exclusive rewards handpicked for your members.",
	);
}
