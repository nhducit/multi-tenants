import { fetchBootstrap } from "@/apis/apis";

export default async function DomainPage(
	props: {
		params: Promise<{ domain: string; language: string }>;
	}
) {
	const params = await props.params;
	const domain = decodeURIComponent(params.domain);
	const data = await fetchBootstrap(domain);
	// console.log("domain render", params.domain);
	return (
		<div className="h-screen">
			<div className="mt-5 text-white w-full">
				{JSON.stringify(data, null, 2)}
			</div>
		</div>
	);
}
