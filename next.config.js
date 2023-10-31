/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    incrementalCacheHandlerPath: require.resolve("./cache-handler.js"),
  },
};

module.exports = nextConfig;
