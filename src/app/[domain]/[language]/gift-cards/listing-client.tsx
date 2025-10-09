"use client";

import { ReactNode, useMemo } from "react";

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
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Link from "next/link";

import {
	DEFAULT_CATEGORIES,
	DEFAULT_ITEMS_PER_PAGE,
	DEFAULT_GIFT_CARD_IMAGE,
	GIFT_CARD_LIST_HEADER_SUBTITLE,
	GIFT_CARD_LIST_HEADER_TITLE,
	ITEMS_PER_PAGE_OPTIONS,
	SORT_OPTIONS,
	deriveCategories,
	extractListingCopy,
	giftCardsQueryOptions,
	normalizeGiftCards,
} from "./listing-utils";

type GiftCardsListingClientProps = {
	domain: string;
	language: string;
};

export function GiftCardsListingClient({
	domain,
	language,
}: GiftCardsListingClientProps) {
	const query = useQuery({
		...giftCardsQueryOptions(domain),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		refetchOnMount: false,
	});


	const {
		headerTitle = GIFT_CARD_LIST_HEADER_TITLE,
		headerSubtitle = GIFT_CARD_LIST_HEADER_SUBTITLE,
	} = useMemo(
		() => extractListingCopy(query.data),
		[query.data],
	);

	const giftCards = useMemo(
		() => normalizeGiftCards(query.data),
		[query.data],
	);


	const categories = useMemo(
		() => ["All", ...deriveCategories(giftCards)],
		[giftCards],
	);

	const domainSegment = encodeURIComponent(domain);
	const languageSegment = encodeURIComponent(language);

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
					<p className="mt-6 text-sm text-violet-200">
						Displaying{" "}
						<span className="font-semibold text-white">
							{giftCards.length}
						</span>{" "}
						gift cards
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
					{renderListingContent({
						queryStatus: query.status,
						isError: query.isError,
						giftCards,
						error: query.error instanceof Error ? query.error : undefined,
						domainSegment,
						languageSegment,
					})}
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

type ListingContentProps = {
	queryStatus: "pending" | "error" | "success";
	isError: boolean;
	giftCards: ReturnType<typeof normalizeGiftCards>;
	error?: Error;
	domainSegment: string;
	languageSegment: string;
};

function renderListingContent({
	queryStatus,
	isError,
	giftCards,
	error,
	domainSegment,
	languageSegment,
}: ListingContentProps) {
	if (queryStatus === "pending") {
		return <LoadingState />;
	}

	if (isError) {
		return <ErrorState message={error?.message} />;
	}

	if (giftCards.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{giftCards.map((giftCard, index) => {
				const href =
					giftCard.id !== null
						? `/${languageSegment}/gift-cards/${encodeURIComponent(
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
									src={giftCard.image || DEFAULT_GIFT_CARD_IMAGE}
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
								<p className="text-sm text-slate-300 line-clamp-2">
									{giftCard.description}
								</p>
							</div>
						</Card>
					</Link>
				);
			})}
		</div>
	);
}

function FilterField({
	label,
	children,
	className,
}: {
	label: string;
	children: ReactNode;
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
	const optionsToRender = options.length > 0 ? options : DEFAULT_CATEGORIES;
	return (
		<div className="relative">
			<select
				defaultValue={defaultValue}
				className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/80 px-4 pr-12 text-sm font-medium text-slate-100 transition focus:border-sky-500 focus:outline-none"
				disabled
			>
				{optionsToRender.map((option) => (
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

function LoadingState() {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: 8 }).map((_, index) => (
				<div
					key={`skeleton-${index}`}
					className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60 p-5"
				>
					<div className="mb-4 h-40 rounded-2xl bg-slate-800/70" />
					<div className="space-y-2">
						<div className="h-4 rounded-full bg-slate-800/70" />
						<div className="h-3 w-1/2 rounded-full bg-slate-800/60" />
					</div>
				</div>
			))}
		</div>
	);
}

function ErrorState({ message }: { message?: string }) {
	return (
		<div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-12 text-center text-sm text-red-200">
			<p className="text-lg font-semibold text-red-100">
				Something went wrong while loading gift cards.
			</p>
			<p className="mt-2 opacity-80">
				{message ?? "Please try again in a moment or contact support if the issue persists."}
			</p>
		</div>
	);
}

function inactivePagination() {
	return cn(
		buttonVariants({ variant: "ghost", size: "default" }),
		"rounded-full border border-transparent text-slate-400 hover:border-sky-500 hover:text-white disabled:opacity-50",
	);
}
