import { fetchGiftCards } from "@/apis/apis";

export async function generateStaticParams(hehe: {
	params: { domain: string };
}) {
	// console.log("gift card details generateStaticParams xxx", hehe, hehe.params);
	// const giftCards = await fetchGiftCards({
	// 	domain: hehe.params.domain,
	// });
	// return giftCards.data.map((giftCard: any) => {
	// 	return {
	// 		id: giftCard.id,
	// 	};
	// });
	return []
}
export const dynamicParams = true;
export const revalidate = 30;
export default function GiftCardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
