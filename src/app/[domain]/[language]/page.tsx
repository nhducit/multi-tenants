import { fetchBootstrap } from "@/apis/apis";

export default async function DomainPage({
  params,
}: {
  params: { domain: string; language: string };
}) {
  const data = await fetchBootstrap(params.domain);
  // console.log("domain render", params.domain);
  return (
    <div className="h-screen">
      <div className="mt-5 text-white w-full">
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  );
}
