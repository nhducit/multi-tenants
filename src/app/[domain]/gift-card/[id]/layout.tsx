import { fetchGiftCards } from "@/app/apis/apis";

export async function generateStaticParams({
  params,
}: {
  params: { domain: string };
}) {
  console.log("generateStaticParams gift card details", params);
  const giftCards = await fetchGiftCards({
    domain: params.domain,
  });
  return giftCards.data.map((giftCard: any) => {
    return {
      params: {
        id: giftCard.id,
      },
    };
  });
}
export const dynamicParams = true;
export const revalidate = 10;
export default function GiftCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
