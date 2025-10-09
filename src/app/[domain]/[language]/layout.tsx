import { fetchBootstrap } from "@/apis/apis";
import { normalizeLanguageOptions, normalizeNavItems, safeText } from "@/app/utils/utils";
import { LanguageSwitcherSelect } from "@/components/language-switcher-select";
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

type BootstrapData = { [key: string]: any };

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
	const { domain: rawDomain, language } = await params;
	const domain = decodeURIComponent(rawDomain);

	const supportedLanguageCodes = await getSupportedLanguages(domain);
	const supportedLanguagesLabel = supportedLanguageCodes.join(", ");
	if (!supportedLanguageCodes.includes(language)) {
		redirect("/");
	}

	const bootstrapData = (await fetchBootstrap(domain)) as BootstrapData;
	const brandName = safeText(
		bootstrapData?.brand?.name ??
		bootstrapData?.brandName ??
		bootstrapData?.companyName,
		domain,
	);

	const languageOptions = normalizeLanguageOptions(
		bootstrapData,
		supportedLanguageCodes,
		language,
	);
	const brandTagline = safeText(
		bootstrapData?.brand?.tagline ?? bootstrapData?.tagline,
		"Rewarding journeys start here"
	);
	const navItems = normalizeNavItems(bootstrapData);

	return (
		<html lang={language}>
			<body className={`${inter.className} bg-slate-950 text-slate-100`}>
				<div className="flex min-h-screen flex-col">
					<header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
						<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-6">
							<div>
								<p className="text-xs uppercase tracking-[0.3em] text-slate-400">
									{brandTagline}
								</p>
								<h1 className="text-3xl font-semibold text-white md:text-4xl">
									{brandName}
								</h1>
							</div>
							<nav aria-label="Main navigation">
								<ul className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-200 md:text-base">
									{navItems.map((item) => (
										<li key={`${item.href}-${item.label}`}>
											<Link
												href={item.href}
												className="transition hover:text-white hover:underline"
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>
							</nav>
						</div>
					</header>
					<main className="flex-1">{children}</main>
					<footer className="border-t border-slate-800 bg-slate-950">
						<div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-400">
							<div className="flex flex-wrap items-center justify-between gap-6">
								<p>
									© {new Date().getFullYear()} {brandName}. All rights reserved.
								</p>
								<LanguageSwitcherSelect
									options={languageOptions}
									activeCode={language}
									domain={domain}
									className="w-full max-w-xs text-left md:text-right"
								/>
							</div>
							<div className="mt-6 flex flex-wrap items-center gap-4">
								<Link href="#privacy" className="hover:text-slate-200">
									Privacy
								</Link>
								<Link href="#terms" className="hover:text-slate-200">
									Terms
								</Link>
								<Link href="#support" className="hover:text-slate-200">
									Support
								</Link>
							</div>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}

