import "../globals.css";

export async function generateStaticParams() {
	// return [
	// 	{
	// 		domain: "abcrewards.us.kaligo-staging.xyz",
	// 	},
	// 	{
	// 		domain: "dbsrewards.us.kaligo-staging.xyz",
	// 	},
	// ];
	return []
}
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams

export const dynamicParams = true;
export const revalidate = 10;
// do nothing except render children here
// and set up generateStaticParams for domain params
export default function DomainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
