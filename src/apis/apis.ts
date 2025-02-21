export function fetchBootstrap(hostname: string) {
	const url = `https://${hostname}/api/bootstrap`;
	console.log("fetchBootstrap", url);

	return fetch(url, { next: { revalidate: 30 } })
		.then((res) => res.json())
		.catch((error) => {
			console.error("Error fetching bootstrap data", error);
			throw error;
		});
}

export function fetchGiftCards({ domain }: { domain: string }) {
	const url = `https://${domain}/api/gift_cards`;
	console.log("fetchGiftCards", url);
	return fetch(url, { next: { revalidate: 30 } })
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
