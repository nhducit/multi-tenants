import Link from "next/link";
import { fetchBootstrap } from "@/apis/apis";

type BootstrapData = { [key: string]: any };

type Awaitable<T> = T | Promise<T>;

type NavItem = {
	label: string;
	href: string;
};

type CarouselItem = {
	title: string;
	description: string;
	image: string;
	href: string;
};

type LanguageOption = {
	code: string;
	label: string;
};

type DomainPageProps = {
	params: Awaitable<{ domain: string; language: string }>;
};

export default async function DomainPage({ params }: DomainPageProps) {
	const resolvedParams = await params;
	const domain = decodeURIComponent(resolvedParams.domain);
	const domainParam = resolvedParams.domain;
	const data = (await fetchBootstrap(domain)) as BootstrapData;

	const brandName = safeText(
		data?.brand?.name ?? data?.brandName ?? data?.companyName,
		domain
	);
	const brandTagline = safeText(
		data?.brand?.tagline ?? data?.tagline,
		"Rewarding journeys start here"
	);

	const navItems = normalizeNavItems(data);
	const banner = normalizeBanner(data, brandName, brandTagline);
	const carouselItems = normalizeCarouselItems(data);
	const languages = normalizeLanguages(data, resolvedParams.language);

	return (
		<div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
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

			<main className="flex-1">
				<section className="relative isolate overflow-hidden bg-slate-900">
					<div className="absolute inset-0">
						<img
							src={banner.image}
							alt={banner.alt}
							className="h-full w-full object-cover"
							loading="lazy"
						/>
						<div className="absolute inset-0 bg-slate-950/70" />
					</div>
					<div className="relative mx-auto grid max-w-5xl gap-8 px-6 py-24 text-center md:py-32">
						<div className="space-y-4">
							<p className="text-sm uppercase tracking-[0.3em] text-slate-300">
								{banner.tagline}
							</p>
							<h2 className="text-4xl font-semibold text-white md:text-5xl">
								{banner.headline}
							</h2>
							<p className="text-lg text-slate-200 md:text-xl">
								{banner.subheading}
							</p>
						</div>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<Link
								href={banner.primaryAction.href}
								className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
							>
								{banner.primaryAction.label}
							</Link>
							<Link
								href={banner.secondaryAction.href}
								className="rounded-full border border-slate-400 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-200 hover:text-white"
							>
								{banner.secondaryAction.label}
							</Link>
						</div>
					</div>
				</section>

				<section
					className="border-y border-slate-800 bg-slate-900"
					aria-label="Language switcher"
				>
					<div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-6 py-8">
						<div>
							<h3 className="text-lg font-semibold text-white">
								Choose your language
							</h3>
							<p className="text-sm text-slate-300">
								Stay in your comfort zone while exploring rewards.
							</p>
						</div>
						<div className="flex flex-wrap gap-2 text-sm font-medium">
							{languages.map((languageOption) => {
								const isActive = languageOption.code === resolvedParams.language;
								return (
									<Link
										key={languageOption.code}
										href={`/${domainParam}/${languageOption.code}`}
										className={`rounded-full border px-4 py-2 transition ${
											isActive
												? "border-sky-400 bg-sky-500/20 text-sky-200"
												: "border-slate-700 text-slate-200 hover:border-sky-400 hover:text-sky-200"
										}`}
										prefetch={false}
									>
										{languageOption.label}
									</Link>
								);
							})}
						</div>
					</div>
				</section>

				<section className="bg-slate-950" aria-label="Featured highlights">
					<div className="mx-auto max-w-6xl px-6 py-16">
						<div className="mb-10 flex flex-wrap items-end justify-between gap-4">
							<div>
								<h3 className="text-2xl font-semibold text-white md:text-3xl">
									Highlights curated for you
								</h3>
								<p className="text-sm text-slate-400">
									Discover destinations and experiences powered by our partners.
								</p>
							</div>
							<Link
								href="#all-highlights"
								className="text-sm font-semibold text-sky-400 transition hover:text-sky-300"
							>
								View all
							</Link>
						</div>

						<div className="relative">
							<div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6">
								{carouselItems.map((item) => (
									<article
										key={`${item.title}-${item.image}`}
										className="group min-w-[260px] max-w-sm snap-center overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-lg transition hover:border-sky-400/60 hover:shadow-sky-800/30"
									>
										<div className="relative h-48 overflow-hidden">
											<img
												src={item.image}
												alt={item.title}
												className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
												loading="lazy"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
										</div>
										<div className="space-y-3 p-6">
											<h4 className="text-lg font-semibold text-white">
												{item.title}
											</h4>
											<p className="text-sm text-slate-300">
												{item.description}
											</p>
											<Link
												href={item.href}
												className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
											>
												Explore
												<span aria-hidden>→</span>
											</Link>
										</div>
									</article>
								))}
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-t border-slate-800 bg-slate-950">
				<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-slate-400">
					<p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
					<div className="flex flex-wrap items-center gap-4">
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
	);
}

function safeText(value: unknown, fallback: string): string {
	return typeof value === "string" && value.trim().length > 0
		? value
		: fallback;
}

function normalizeNavItems(bootstrap: BootstrapData): NavItem[] {
	const fallback: NavItem[] = [
		{ label: "Home", href: "#home" },
		{ label: "Gift Cards", href: "#gift-cards" },
		{ label: "Rewards", href: "#rewards" },
		{ label: "Support", href: "#support" },
	];

	const candidate =
		bootstrap?.navigation ??
		bootstrap?.navItems ??
		bootstrap?.nav ??
		bootstrap?.menu;

	const list: unknown =
		Array.isArray(candidate) && candidate.length > 0
			? candidate
			: candidate && typeof candidate === "object" && "items" in candidate
				? (candidate as { items?: unknown }).items
				: [];

	const navItems = Array.isArray(list)
		? list
			.map((item) => {
				if (typeof item === "string") {
					const slug = item.toLowerCase().replace(/\s+/g, "-");
					return { label: item, href: `#${slug}` };
				}
				if (item && typeof item === "object") {
					const obj = item as {
						label?: string;
						title?: string;
						name?: string;
						href?: string;
						url?: string;
					};
					const label = safeText(
						obj.label ?? obj.title ?? obj.name,
						"Link"
					);
					const href = safeText(obj.href ?? obj.url, "#");
					return { label, href };
				}
				return null;
			})
			.filter((item): item is NavItem => Boolean(item))
		: [];

	return navItems.length > 0 ? navItems : fallback;
}

function normalizeBanner(
	bootstrap: BootstrapData,
	brandName: string,
	tagline: string
) {
	const hero = bootstrap?.hero ?? bootstrap?.banner ?? {};
	const images: unknown =
		hero?.images ??
		bootstrap?.images ??
		bootstrap?.media ??
		bootstrap?.brand?.images ??
		[];

	const firstImage =
		(Array.isArray(images) && images.length > 0 && images[0]) || hero?.image;

	const bannerImage = typeof firstImage === "string"
		? firstImage
		: typeof firstImage === "object" && firstImage !== null && "url" in firstImage
			? safeText((firstImage as { url?: string }).url, DEFAULT_BANNER_IMAGE)
			: DEFAULT_BANNER_IMAGE;

	return {
		image: bannerImage,
		alt: safeText(hero?.alt ?? `${brandName} hero image`, `${brandName} hero image`),
		tagline: safeText(hero?.tagline ?? tagline, tagline),
		headline: safeText(hero?.headline ?? hero?.title, brandName),
		subheading: safeText(
			hero?.subheading ??
			hero?.description ??
			"Explore a curated collection of rewards, experiences, and more.",
			"Explore a curated collection of rewards, experiences, and more."
		),
		primaryAction: {
			label: safeText(
				hero?.primaryAction?.label ?? "Get started",
				"Get started"
			),
			href: safeText(hero?.primaryAction?.href ?? "#get-started", "#get-started"),
		},
		secondaryAction: {
			label: safeText(
				hero?.secondaryAction?.label ?? "Discover more",
				"Discover more"
			),
			href: safeText(
				hero?.secondaryAction?.href ?? "#discover",
				"#discover"
			),
		},
	};
}

function normalizeCarouselItems(bootstrap: BootstrapData): CarouselItem[] {
	const fallback: CarouselItem[] = [
		{
			title: "Unlock unforgettable stays",
			description:
				"Redeem exclusive hotel experiences tailored to your membership tier.",
			image:
				"https://images.unsplash.com/photo-1501117716987-c8e2aeea1e05?auto=format&fit=crop&w=1200&q=80",
			href: "#hotels",
		},
		{
			title: "Dine with double points",
			description:
				"Enjoy partner restaurants and earn double rewards on every booking.",
			image:
				"https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
			href: "#dining",
		},
		{
			title: "Gift cards that delight",
			description:
				"Share the joy with curated gift cards from global lifestyle brands.",
			image:
				"https://images.unsplash.com/photo-1520848315518-b991dd16a6cf?auto=format&fit=crop&w=1200&q=80",
			href: "#gift-cards",
		},
	];

	const candidate =
		bootstrap?.featuredCollections ??
		bootstrap?.collections ??
		bootstrap?.highlights ??
		bootstrap?.carousel ??
		bootstrap?.offers;

	const list: unknown =
		Array.isArray(candidate) && candidate.length > 0
			? candidate
			: candidate && typeof candidate === "object" && "items" in candidate
				? (candidate as { items?: unknown }).items
				: [];

	const items = Array.isArray(list)
		? list
			.map((item) => {
				if (item && typeof item === "object") {
					const obj = item as {
						title?: string;
						name?: string;
						description?: string;
						summary?: string;
						image?: string;
						media?: { url?: string }[] | { url?: string };
						href?: string;
						url?: string;
					};

					const imageSource = deriveImage(obj);

					return {
						title: safeText(obj.title ?? obj.name, "Featured experience"),
						description: safeText(
							obj.description ?? obj.summary,
							"Discover what makes this reward special."
						),
						image: imageSource,
						href: obj.href ?? obj.url ?? "#",
					};
				}
				return null;
			})
			.filter((item): item is CarouselItem => Boolean(item))
		: [];

	return items.length > 0 ? items : fallback;
}

function normalizeLanguages(
	bootstrap: BootstrapData,
	currentLanguage: string
): LanguageOption[] {
	const fallback: LanguageOption[] = [
		{ code: "en", label: "English" },
		{ code: "fr", label: "Français" },
		{ code: "de", label: "Deutsch" },
	];

	const candidate =
		bootstrap?.languages ??
		bootstrap?.supportedLanguages ??
		bootstrap?.availableLanguages ??
		bootstrap?.i18n?.languages;

	const languages: LanguageOption[] = [];

	if (Array.isArray(candidate)) {
		candidate.forEach((lang) => {
			if (typeof lang === "string") {
				languages.push({
					code: lang,
					label: lang.length === 2 ? lang.toUpperCase() : lang,
				});
			} else if (lang && typeof lang === "object") {
				const langObj = lang as { code?: string; label?: string; name?: string };
				if (langObj.code) {
					languages.push({
						code: langObj.code,
						label: safeText(langObj.label ?? langObj.name, langObj.code),
					});
				}
			}
		});
	} else if (candidate && typeof candidate === "object") {
		Object.entries(candidate as Record<string, unknown>).forEach(
			([code, value]) => {
				const label =
					typeof value === "string"
						? value
						: typeof value === "object" && value !== null && "label" in value
							? (value as { label?: string }).label
							: code;
				languages.push({ code, label: safeText(label, code) });
			}
		);
	}

	if (!languages.some((lang) => lang.code === currentLanguage)) {
		languages.unshift({
			code: currentLanguage,
			label:
				currentLanguage.length === 2
					? currentLanguage.toUpperCase()
					: currentLanguage,
		});
	}

	return languages.length > 0 ? languages : fallback;
}

function deriveImage(source: {
	image?: string;
	media?: { url?: string }[] | { url?: string };
}): string {
	if (source?.image && typeof source.image === "string") {
		return source.image;
	}
	if (Array.isArray(source?.media) && source.media.length > 0) {
		const first = source.media[0];
		if (first?.url) {
			return first.url;
		}
	}
	if (source?.media && !Array.isArray(source.media) && source.media?.url) {
		return source.media.url;
	}
	return DEFAULT_CAROUSEL_IMAGE;
}

const DEFAULT_BANNER_IMAGE =
	"https://images.unsplash.com/photo-1521292270410-a8c8783db467?auto=format&fit=crop&w=1600&q=80";

const DEFAULT_CAROUSEL_IMAGE =
	"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";
