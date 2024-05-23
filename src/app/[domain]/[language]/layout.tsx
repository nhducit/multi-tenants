import { Inter } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// bootstrap data
async function getSupportedLanguages(domain: string) {
	return domain === "abcrewards.us.kaligo-staging.xyz"
		? ["en-US", "de"]
		: ["en-US"];
}
export async function generateStaticParams(options: {
	params: { domain: string };
}) {
	return (await getSupportedLanguages(options.params.domain)).map(
		(language) => {
			return { language };
		},
	);
}

// This is the app root layout
export default async function LanguageLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: {
		domain: string;
		language: string;
	};
}) {
	const supportedLanguages = await getSupportedLanguages(params.domain);
	if (!supportedLanguages.includes(params.language)) {
		redirect("/");
	}
	return (
		<html lang={params.language}>
			<body className={inter.className}>
				<div className="h-[60px] bg-gray-800 flex items-center">
					<div className="flex items-center ml-8">
						<Link
							href={`/${params.language}`}
							className="h-12 w-12 text-blue-500 flex justify-center items-center bg-red-300"
						>
							Logo
						</Link>
						<div className="ml-4 text-blue-500">
							{params.domain} - {params.language}
						</div>
					</div>
					<div className="p-4 flex gap-3">
						{supportedLanguages.map((locale) => {
							return (
								<Link key={locale} href={`/${locale}`}>
									{locale}
								</Link>
							);
						})}
					</div>
					<div className="p-4">
						<Link href={`/${params.language}/gift-card`}>Gift Cards</Link>
					</div>
				</div>
				<div className="m-4">{children}</div>
			</body>
		</html>
	);
}
