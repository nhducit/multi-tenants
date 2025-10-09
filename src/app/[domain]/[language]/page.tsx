import { fetchBootstrap } from "@/apis/apis";
import { Awaitable, BootstrapData, normalizeBanner, normalizeCarouselItems, normalizeNavItems, safeText } from "@/app/utils/utils";
import Link from "next/link";



type DomainPageProps = {
	params: Awaitable<{ domain: string; language: string }>;
};

export default async function DomainPage({ params }: DomainPageProps) {
	const resolvedParams = await params;
	const domain = decodeURIComponent(resolvedParams.domain);
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

	return (
		<div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
			<main className="flex-1">
				<section className="relative isolate overflow-hidden bg-slate-900">
					<div className="absolute inset-0">
						<img
							src={
								// TODO: use the image from the bootstrap data
								'https://rc-assets.kaligo-staging.xyz/images-proxy/hyundai/stg/images/partner_config/Hyundai/homepage/20250424/59d00f8f-1cfa-4979-86f0-5fb3cf2bbb8d.png'}
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

		</div>
	);
}