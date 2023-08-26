import { fetchGiftCardById } from "@/app/apis/apis";

export default async function GiftCardDetailPage({
  params,
}: {
  params: { domain: string; id: string };
}) {
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
