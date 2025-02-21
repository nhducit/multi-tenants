import { fetchGiftCardById } from "@/apis/apis";

export default async function GiftCardDetailPage(
    props: {
        params: Promise<{ domain: string; id: string }>;
    }
) {
    const params = await props.params;
    const data = await fetchGiftCardById({
		domain: params.domain,
		id: params.id,
	});

    return (
		<div>
			GiftCardDetailPage
			<div>{JSON.stringify(data, null, 2)}</div>
		</div>
	);
}
