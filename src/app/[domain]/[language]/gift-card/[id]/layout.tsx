import { fetchGiftCards } from "@/apis/apis";

export async function generateStaticParams({
  params,
}: {
  params: { domain: string };
}) {
  console.log("gift card details generateStaticParams", params);
  const giftCards = await fetchGiftCards({
    domain: params.domain,
  });
  return giftCards.data.map((giftCard: any) => {
    return {
      id: giftCard.id,
    };
  });
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
