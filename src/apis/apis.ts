export function fetchBootstrap(hostname: string) {
	const url = `https://${hostname}/api/bootstrap`;

	return fetch(url, { next: { revalidate: 30 } })
		.then((res) => res.json())
		.catch((error) => {
			console.error("Error fetching bootstrap data", error);
			throw error;
		});
}

export function fetchGiftCards({ domain }: { domain: string }) {
	debugger
	const url = `https://${domain}/api/gift_cards`;
	const requestInit: RequestInit & { next?: { revalidate: number } } = {
		headers: { 'x-response-format': 'custom' }
	};
	if (typeof window === "undefined") {
		requestInit.next = { revalidate: 30 };
	} else {
		requestInit.cache = "no-store";
	}

	return fetch(url, requestInit)
		.then((res) => res.json())
		.catch((error) => {
			console.error("Error fetching gift_cards xxx data", url, error);
			throw error;
		});
}

export function fetchGiftCardById({
	domain,
	id,
}: {
	domain: string;
	id: string;
}) {
	const url = `https://${domain}/api/gift_cards/${id}`;
	console.log("fetchGiftCardById", url);

	return fetch(url, { next: { revalidate: 30 } })
		.then((res) => res.json())
		.catch((error) => {
			console.error("Error fetching gift_card details data", url, error);
			throw error;
		});
}
