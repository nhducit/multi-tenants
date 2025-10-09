import { Awaitable } from "@/app/utils/utils";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

import { GiftCardsListingClient } from "./listing-client";
import { giftCardsQueryOptions } from "./listing-utils";

type GiftCardPageProps = {
	params: Awaitable<{ domain: string; language: string }>;
};

export default async function GiftCardPage({ params }: GiftCardPageProps) {
	const resolvedParams = await params;
	const domain = decodeURIComponent(resolvedParams.domain);
	const queryClient = new QueryClient();

	try {
		await queryClient.prefetchQuery(giftCardsQueryOptions(domain));
	} catch (error) {
		console.error("Error prefetching gift cards", error);
	}

	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<GiftCardsListingClient
				domain={domain}
				language={resolvedParams.language}
			/>
		</HydrationBoundary>
	);
}
