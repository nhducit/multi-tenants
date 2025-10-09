import type { ReactNode } from "react";

import { fetchGiftCardById } from "@/apis/apis";
import { Awaitable, safeText } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Gift, Hourglass, Minus, Plus } from "lucide-react";

type GiftCardDetailPageProps = {
	params: Awaitable<{ domain: string; language: string; id: string }>;
};

type GiftCardDetail = {
	id: string;
	name: string;
	image: string;
	priceRange: string;
	denominations: string[];
	expiration: string;
	pointsPrice: string;
	quantityLimitLabel: string;
	redemptionLabel: string;
	description: string[];
	terms: string[];
};

const DEFAULT_GIFT_CARD_IMAGE =
	"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_POINTS_PRICE = "2,000 Points";
const DEFAULT_REDEMPTION_LABEL = "Instant Redemption";
const DEFAULT_DESCRIPTION = [
	"This gift card unlocks memorable experiences for your members across travel, dining, leisure, and more. Share it with people who deserve something special.",
];
const DEFAULT_TERMS = [
	"Gift card redemptions are subject to availability and programme terms. Cards are non-refundable once issued and may be subject to regional restrictions.",
];

export default async function GiftCardDetailPage({
	params,
}: GiftCardDetailPageProps) {
	const resolvedParams = await params;
	const domain = decodeURIComponent(resolvedParams.domain);
	const language = encodeURIComponent(resolvedParams.language);
	const giftCardId = decodeURIComponent(resolvedParams.id);

	let payload: unknown;
	try {
		payload = await fetchGiftCardById({
			domain,
			id: giftCardId,
		});
	} catch (error) {
		console.error("Error loading gift card details", error);
		payload = null;
	}

	const giftCard = normalizeGiftCardDetail(payload, giftCardId);
	const listingHref = `/${language}/gift-cards`;

	return (
		<div className="bg-slate-950 text-slate-100">
			<section className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900">
				<div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
					<Breadcrumb>
						<BreadcrumbList className="text-xs text-violet-100">
							<BreadcrumbItem>
								<BreadcrumbLink href={listingHref} className="hover:text-white">
									All gift cards
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-violet-200" />
							<BreadcrumbItem>
								<BreadcrumbPage className="text-violet-50">
									{giftCard.name}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<h1 className="mt-6 text-3xl font-semibold text-white md:text-4xl">
						{giftCard.name}
					</h1>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 pb-12 pt-10 md:pb-14 md:pt-12">
				<div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
					<Card className="overflow-hidden rounded-3xl border-slate-800 bg-slate-900/80 shadow-xl">
						<div className="relative aspect-[4/3] bg-slate-800">
							<img
								src={giftCard.image}
								alt={giftCard.name}
								className="h-full w-full object-cover"
								loading="lazy"
							/>
						</div>
						<div className="space-y-4 px-6 py-6 text-sm text-slate-200">
							<InfoRow
								icon={<Gift className="h-4 w-4 text-sky-400" />}
								label="Gift card range"
								value={giftCard.priceRange}
							/>
							<InfoRow
								icon={<Hourglass className="h-4 w-4 text-sky-400" />}
								label="Validity"
								value={giftCard.expiration}
							/>
						</div>
					</Card>

					<Card className="rounded-3xl border-slate-800 bg-slate-900/80 shadow-xl">
						<div className="border-b border-slate-800 px-6 py-5">
							<h2 className="text-xl font-semibold text-white md:text-2xl">
								{giftCard.redemptionLabel}
							</h2>
							<p className="mt-2 text-sm text-slate-400">
								Choose a denomination and quantity to preview the reward price.
							</p>
						</div>
						<div className="space-y-8 px-6 py-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
									Gift card value
								</p>
								{giftCard.denominations.length > 0 ? (
									<div className="mt-4 flex flex-wrap gap-3">
										{giftCard.denominations.map((value, index) => (
											<Button
												key={`${value}-${index}`}
												type="button"
												variant="outline"
												className={cn(
													"h-11 rounded-xl border-slate-700 bg-slate-900 px-5 text-sm font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white",
													index === 0 &&
													"border-sky-600 bg-sky-500/20 text-sky-100 hover:bg-sky-500/30",
												)}
												disabled
											>
												{value}
											</Button>
										))}
									</div>
								) : (
									<p className="mt-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-400">
										Available denominations vary by partner. Select a value during
										checkout.
									</p>
								)}
							</div>

							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
									Quantity
								</p>
								<div className="mt-4 inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-1 py-1 text-base font-semibold text-white">
									<button
										type="button"
										className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 disabled:text-slate-600"
										disabled
									>
										<Minus className="h-4 w-4" />
										<span className="sr-only">Decrease quantity</span>
									</button>
									<span className="flex h-9 min-w-[3rem] items-center justify-center rounded-full bg-slate-950 px-3">
										1
									</span>
									<button
										type="button"
										className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 disabled:text-slate-600"
										disabled
									>
										<Plus className="h-4 w-4" />
										<span className="sr-only">Increase quantity</span>
									</button>
								</div>
								<p className="mt-2 text-xs text-slate-500">
									{giftCard.quantityLimitLabel}
								</p>
							</div>

							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
									Price
								</p>
								<div className="mt-4 rounded-2xl border border-slate-700 bg-gradient-to-r from-sky-500/20 to-sky-500/10 px-6 py-5 text-lg font-semibold text-sky-100">
									{giftCard.pointsPrice}
								</div>
							</div>

							<Button
								type="button"
								className="h-12 w-full rounded-2xl bg-slate-100 text-slate-900 transition hover:bg-white disabled:opacity-60"
								disabled
							>
								Redeem now
							</Button>
						</div>
					</Card>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 pb-16">
				<div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
					<div className="flex flex-wrap gap-3 border-b border-slate-800 px-6 py-4 text-sm font-semibold">
						<button
							type="button"
							className="rounded-full bg-sky-500/20 px-4 py-2 text-sky-100"
							disabled
						>
							About the brand
						</button>
						<button
							type="button"
							className="rounded-full border border-transparent px-4 py-2 text-slate-400"
							disabled
						>
							Terms and conditions
						</button>
					</div>
					<div className="grid gap-10 px-6 py-8 md:grid-cols-2 md:gap-12">
						<DetailCopy title="About the brand" paragraphs={giftCard.description} />
						<DetailCopy
							title="Terms and conditions"
							paragraphs={giftCard.terms}
						/>
					</div>
				</div>
			</section>
		</div>
	);
}

function InfoRow({
	icon,
	label,
	value,
}: {
	icon: ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4 shadow-sm">
			<div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80">
				{icon}
			</div>
			<div className="space-y-1">
				<p className="text-xs uppercase tracking-[0.35em] text-slate-500">
					{label}
				</p>
				<p className="text-sm font-semibold text-white">{value}</p>
			</div>
		</div>
	);
}

function DetailCopy({
	title,
	paragraphs,
}: {
	title: string;
	paragraphs: string[];
}) {
	return (
		<div className="space-y-4 text-sm leading-6 text-slate-300">
			<h3 className="text-base font-semibold text-white">{title}</h3>
			{paragraphs.map((paragraph, index) => (
				<p key={`${title}-${index}`}>{paragraph}</p>
			))}
		</div>
	);
}

function normalizeGiftCardDetail(
	payload: unknown,
	giftCardId: string,
): GiftCardDetail {
	const source = extractGiftCardObject(payload);

	const id =
		typeof source?.id === "string"
			? source.id
			: typeof source?.id === "number"
				? String(source.id)
				: giftCardId;

	const name = safeText(
		source?.name ??
		source?.title ??
		source?.brand?.name ??
		source?.product_name,
		"Gift Card",
	);

	const image = resolveGiftCardImage(source);
	const priceRange = resolvePriceRange(source);
	const denominations = resolveDenominations(source, priceRange);
	const expiration = resolveExpiration(source);
	const pointsPrice = resolvePointsPrice(source);
	const quantityLimitLabel = resolveQuantityLimit(source);
	const redemptionLabel = safeText(
		source?.redemption_type ??
		source?.redemption?.label ??
		source?.delivery_type,
		DEFAULT_REDEMPTION_LABEL,
	);

	const description = resolveParagraphs([
		source?.brand?.description,
		source?.description,
		source?.details,
		source?.product_description,
	]);

	const terms = resolveParagraphs([
		source?.terms_and_conditions,
		source?.terms,
		source?.policies,
		source?.brand?.terms,
	]);

	return {
		id,
		name,
		image,
		priceRange,
		denominations,
		expiration,
		pointsPrice,
		quantityLimitLabel,
		redemptionLabel,
		description: description.length > 0 ? description : DEFAULT_DESCRIPTION,
		terms: terms.length > 0 ? terms : DEFAULT_TERMS,
	};
}

function extractGiftCardObject(payload: unknown): any {
	if (!payload || typeof payload !== "object") {
		return {};
	}
	if ("data" in payload && typeof payload.data === "object" && payload.data) {
		return payload.data;
	}
	return payload;
}

function resolveGiftCardImage(source: any): string {
	const candidates: unknown[] = [
		source?.image,
		source?.hero_image,
		source?.heroImage,
		source?.image_url,
		source?.imageUrl,
		source?.card_image,
		source?.cardImage,
		source?.logo,
		source?.logo_url,
		source?.media?.[0]?.url,
		source?.media?.[0]?.src,
		source?.assets?.card?.url,
		source?.assets?.default?.url,
	];

	for (const candidate of candidates) {
		if (typeof candidate === "string" && candidate.trim().length > 0) {
			return candidate;
		}
	}

	return DEFAULT_GIFT_CARD_IMAGE;
}

function resolvePriceRange(source: any): string {
	const currency = resolveCurrency(source);
	const min = findNumericValue([
		source?.min_value,
		source?.minValue,
		source?.minimum,
		source?.price?.min,
		source?.pricing?.min,
		source?.denomination?.min,
		source?.denominations?.min,
	]);
	const max = findNumericValue([
		source?.max_value,
		source?.maxValue,
		source?.maximum,
		source?.price?.max,
		source?.pricing?.max,
		source?.denomination?.max,
		source?.denominations?.max,
	]);

	if (Array.isArray(source?.denominations)) {
		const denominationValues = collectNumericValues(source.denominations);
		if (denominationValues.length > 0) {
			const minDenomination = Math.min(...denominationValues);
			const maxDenomination = Math.max(...denominationValues);
			return minDenomination === maxDenomination
				? formatCurrency(minDenomination, currency)
				: `${formatCurrency(minDenomination, currency)} – ${formatCurrency(
					maxDenomination,
					currency,
				)}`;
		}
	}

	if (typeof min === "number" && typeof max === "number") {
		if (min === max) {
			return formatCurrency(min, currency);
		}
		return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
	}

	if (typeof min === "number") {
		return `From ${formatCurrency(min, currency)}`;
	}

	if (typeof max === "number") {
		return `Up to ${formatCurrency(max, currency)}`;
	}

	const fallback =
		source?.price_range ??
		source?.pricing?.label ??
		source?.denomination_range ??
		source?.range;

	return safeText(fallback, "Pricing varies by denomination");
}

function resolveDenominations(source: any, fallbackRange: string): string[] {
	const currency = resolveCurrency(source);
	const denominations = collectNumericValues([
		source?.denominations,
		source?.denomination_values,
		source?.pricing?.options,
		source?.price_points,
	]);

	const unique = Array.from(new Set(denominations)).filter((value) =>
		Number.isFinite(value),
	);

	if (unique.length === 0) {
		const single = findNumericValue([
			source?.min_value,
			source?.minValue,
			source?.price,
			source?.pricing?.value,
		]);
		if (typeof single === "number") {
			return [formatCurrency(single, currency)];
		}
		return [fallbackRange];
	}

	return unique
		.sort((a, b) => a - b)
		.map((value) => formatCurrency(value, currency));
}

function resolveExpiration(source: any): string {
	const days = findNumericValue([
		source?.validity?.days,
		source?.expiry_days,
		source?.expires_in_days,
		source?.expiration_days,
		source?.validityPeriod,
		source?.meta?.expiration_days,
	]);

	if (typeof days === "number" && days > 0) {
		return `${days.toLocaleString()} days`;
	}

	const explicitLabel = source?.validity?.label ?? source?.expiration_label;
	if (typeof explicitLabel === "string" && explicitLabel.trim().length > 0) {
		return explicitLabel;
	}

	const expiryDate =
		source?.valid_until ??
		source?.expiry_date ??
		source?.expiration_date ??
		source?.expires_on;

	if (typeof expiryDate === "string" && expiryDate.trim().length > 0) {
		return `Valid until ${expiryDate}`;
	}

	return "Flexible expiry";
}

function resolvePointsPrice(source: any): string {
	const pointValue = findNumericValue([
		source?.points_required,
		source?.points,
		source?.price_points,
		source?.pricing?.points,
		source?.reward_cost,
		source?.cost_in_points,
	]);

	if (typeof pointValue === "number" && pointValue > 0) {
		return `${formatNumber(pointValue)} Points`;
	}

	const label =
		source?.points_label ??
		source?.pricing?.points_label ??
		source?.reward_cost_label;

	if (typeof label === "string" && label.trim().length > 0) {
		return label;
	}

	return DEFAULT_POINTS_PRICE;
}

function resolveQuantityLimit(source: any): string {
	const limit = findNumericValue([
		source?.redemption_limit,
		source?.max_per_redemption,
		source?.limits?.max_quantity,
		source?.rules?.max_quantity,
		source?.policy?.max_quantity,
		source?.limit,
	]);

	if (typeof limit === "number" && limit > 0) {
		return `Max ${limit} per redemption`;
	}

	return "Max 5 per redemption";
}

function resolveParagraphs(inputs: unknown[]): string[] {
	const paragraphs: string[] = [];

	inputs.forEach((input) => {
		if (!input) return;

		if (typeof input === "string") {
			const segments = input
				.split(/\n+/)
				.map((segment) => segment.trim())
				.filter(Boolean);
			if (segments.length > 0) {
				paragraphs.push(...segments);
			}
		} else if (Array.isArray(input)) {
			input
				.map((item) =>
					typeof item === "string"
						? item
						: item?.text ?? item?.content ?? item?.description,
				)
				.filter((value): value is string => typeof value === "string")
				.forEach((value) => {
					const cleaned = value.trim();
					if (cleaned.length > 0) {
						paragraphs.push(cleaned);
					}
				});
		}
	});

	return paragraphs;
}

function resolveCurrency(source: any): string {
	const candidates: unknown[] = [
		source?.currency,
		source?.denomination_currency,
		source?.pricing?.currency,
		source?.meta?.currency,
		source?.brand?.currency,
	];

	for (const candidate of candidates) {
		if (typeof candidate === "string" && candidate.trim().length > 0) {
			return candidate.toUpperCase();
		}
	}

	return "USD";
}

function findNumericValue(values: unknown[]): number | undefined {
	for (const value of values) {
		if (typeof value === "number" && Number.isFinite(value)) {
			return value;
		}
		if (typeof value === "string") {
			const parsed = Number(value);
			if (Number.isFinite(parsed)) {
				return parsed;
			}
		}
	}
	return undefined;
}

function collectNumericValues(input: unknown): number[] {
	const result: number[] = [];

	if (Array.isArray(input)) {
		input.forEach((value) => {
			result.push(...collectNumericValues(value));
		});
		return result;
	}

	if (typeof input === "number" && Number.isFinite(input)) {
		return [input];
	}

	if (typeof input === "string") {
		const parsed = Number(input);
		if (Number.isFinite(parsed)) {
			return [parsed];
		}
	}

	if (input && typeof input === "object") {
		const maybeValue =
			"amount" in input
				? (input as { amount?: unknown }).amount
				: "value" in input
					? (input as { value?: unknown }).value
					: undefined;

		if (maybeValue !== undefined) {
			return collectNumericValues(maybeValue);
		}
	}

	return result;
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

function formatNumber(value: number): string {
	return new Intl.NumberFormat("en-US").format(Math.round(value));
}
