
export type BootstrapData = { [key: string]: any };

export type Awaitable<T> = T | Promise<T>;

export type NavItem = {
    label: string;
    href: string;
};

export type CarouselItem = {
    title: string;
    description: string;
    image: string;
    href: string;
};


export function normalizeNavItems(bootstrap: BootstrapData): NavItem[] {
    const fallback: NavItem[] = [
        { label: "Home", href: "/" },
        { label: "Gift Cards", href: "/gift-cards" },
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


export function normalizeBanner(
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


export function normalizeCarouselItems(bootstrap: BootstrapData): CarouselItem[] {
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


export function deriveImage(source: {
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



export function safeText(value: unknown, fallback: string): string {
    return typeof value === "string" && value.trim().length > 0
        ? value
        : fallback;
}

export function normalizeLanguageOptions(
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

export function labelFromCode(code: string): string {
    if (code.length <= 3 || code.includes("-")) {
        return code.toUpperCase();
    }
    return code;
}

export const DEFAULT_LANGUAGE_OPTIONS = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
];