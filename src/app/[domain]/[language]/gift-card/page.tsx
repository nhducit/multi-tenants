import { fetchGiftCards } from "@/apis/apis";
import Link from "next/link";

export default async function GiftCardPage({
  params,
}: {
  params: { domain: string };
}) {
  const giftCards = await fetchGiftCards({
    domain: params.domain,
  });
  //   console.log("giftCards page", giftCards);
  return (
    <div>
      <div>gift card page: {params.domain}</div>
      {giftCards.data.map((giftCard: any) => {
        return (
          <div key={giftCard.id}>
            <Link href={`gift-card/${giftCard.id}`}>{giftCard.id}</Link>
          </div>
        );
      })}
    </div>
  );
}
