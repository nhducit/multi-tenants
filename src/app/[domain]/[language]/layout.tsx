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

type Awaitable<T> = T | Promise<T>;

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
type LanguageLayoutProps = {
	children: React.ReactNode;
	params: Awaitable<{
		domain: string;
		language: string;
	}>;
};

export default async function LanguageLayout({
	children,
	params,
}: LanguageLayoutProps) {
	const { domain, language } = await params;

	const supportedLanguages = await getSupportedLanguages(domain);
	if (!supportedLanguages.includes(language)) {
		redirect("/");
	}
	return (
		<html lang={language}>
			<body className={inter.className}>
				<div className="h-[60px] bg-gray-800 flex items-center">
					<div className="flex items-center ml-8">
						<Link
							href={`/${language}`}
							className="h-12 w-12 text-blue-500 flex justify-center items-center bg-red-300"
						>
							Logo
						</Link>
						<div className="ml-4 text-blue-500">
							{domain} - {language}
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
						<Link href={`/${language}/gift-card`}>Gift Cards</Link>
					</div>
				</div>
				<div className="">{children}</div>
			</body>
		</html>
	);
}
