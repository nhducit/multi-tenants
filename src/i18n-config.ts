export const i18n = {
	defaultLocale: "en-US",
	// all supported locales in our application
	locales: ["en-US", "de", "cs"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
