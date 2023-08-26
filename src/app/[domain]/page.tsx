import Link from "next/link";
import { fetchBootstrap } from "../apis/apis";

export default async function DomainPage({
  params,
}: {
  params: { domain: string };
}) {
  const data = await fetchBootstrap(params.domain);
  console.log("domain render", params.domain);
  return (
    <div>
      DomainPage: {params.domain}
      <div className="p-4">
        <Link href={`gift-card`}>Gift Cards</Link>
      </div>
      <div className="mt-5">{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}
