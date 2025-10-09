import { fetchBootstrap } from "@/apis/apis";
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
	const encodedDomain = encodeURIComponent(domain);

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

	return (
		<html lang={language}>
			<body className={`${inter.className} bg-slate-950 text-slate-100`}>
				<div className="flex min-h-screen flex-col">
					<header className="bg-gray-800">
						<div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-6 px-6">
							<div className="flex items-center gap-4">
								<Link
									href={`/${encodedDomain}/${language}`}
									className="flex h-12 w-12 items-center justify-center bg-red-300 text-blue-500"
								>
									Logo
								</Link>
								<div className="text-blue-500">
									{domain} - {language}
									<div className="text-xs text-blue-300">
										Supported languages: {supportedLanguagesLabel}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-6 text-sm text-blue-100">
								<nav className="flex items-center gap-3">
									{supportedLanguageCodes.map((locale) => (
										<Link
											key={locale}
											href={`/${encodedDomain}/${locale}`}
											className="transition hover:text-white"
										>
											{locale}
										</Link>
									))}
								</nav>
								<Link
									href={`/${encodedDomain}/${language}/gift-card`}
									className="transition hover:text-white"
								>
									Gift Cards
								</Link>
							</div>
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

function safeText(value: unknown, fallback: string): string {
	return typeof value === "string" && value.trim().length > 0
		? value
		: fallback;
}

function normalizeLanguageOptions(
	bootstrap: BootstrapData,
	supportedCodes: string[],
	currentLanguage: string,
): { code: string; label: string }[] {
	const seen = new Set<string>();
	const options: { code: string; label: string }[] = [];

	const candidate =
		bootstrap?.languages ??
		bootstrap?.supportedLanguages ??
		bootstrap?.availableLanguages ??
		bootstrap?.i18n?.languages;

	if (Array.isArray(candidate)) {
		candidate.forEach((entry) => {
			if (typeof entry === "string") {
				pushOption(entry, entry);
			} else if (entry && typeof entry === "object") {
				const langObj = entry as {
					code?: string;
					label?: string;
					name?: string;
				};
				if (langObj.code) {
					pushOption(
						langObj.code,
						langObj.label ?? langObj.name ?? langObj.code,
					);
				}
			}
		});
	} else if (candidate && typeof candidate === "object") {
		Object.entries(candidate as Record<string, unknown>).forEach(
			([code, value]) => {
				const label =
					typeof value === "string"
						? value
						: typeof value === "object" &&
						  value !== null &&
						  "label" in value
						? (value as { label?: string }).label
						: code;
				pushOption(code, label);
			},
		);
	}

	supportedCodes.forEach((code) => {
		pushOption(code, code);
	});

	if (!seen.has(currentLanguage)) {
		pushOption(currentLanguage, currentLanguage);
	}

	if (options.length === 0) {
		return DEFAULT_LANGUAGE_OPTIONS.map((option) => ({
			code: option.code,
			label: option.label,
		}));
	}

	return options;

	function pushOption(code: string | undefined, label?: string) {
		const normalizedCode = safeText(code, "");
		if (!normalizedCode || seen.has(normalizedCode)) {
			return;
		}
		const formattedLabel = safeText(label, labelFromCode(normalizedCode));
		options.push({
			code: normalizedCode,
			label: formattedLabel,
		});
		seen.add(normalizedCode);
	}
}

function labelFromCode(code: string): string {
	if (code.length <= 3 || code.includes("-")) {
		return code.toUpperCase();
	}
	return code;
}

const DEFAULT_LANGUAGE_OPTIONS = [
	{ code: "en", label: "English" },
	{ code: "fr", label: "Français" },
	{ code: "de", label: "Deutsch" },
];
