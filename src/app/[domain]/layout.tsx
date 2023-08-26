export async function generateStaticParams() {
  return [
    {
      params: {
        domain: "abcrewards.us.kaligo-staging.xyz",
      },
    },
    {
      params: {
        domain: "dbsrewards.us.kaligo-staging.xyz",
      },
    },
  ];
}
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams

export const dynamicParams = true;
export const revalidate = 10;
export default function DomainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { domain: string };
}) {
  return (
    <div>
      <div className="bg-yellow-500">domain layout: {params.domain}</div>
      {children}
    </div>
  );
}
