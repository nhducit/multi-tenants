/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// incrementalCacheHandlerPath: require.resolve("./cache-handler.js"),
	},
	// Next.js 16 configuration
	cacheComponents: true, // Set to true if you want to enable cache components
};

module.exports = nextConfig;
